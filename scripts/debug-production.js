#!/usr/bin/env node

/**
 * Production Debug Script
 * This script helps debug production issues by:
 * 1. Testing the Lambda function directly
 * 2. Checking CloudWatch logs
 * 3. Validating environment variables
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function runCommand(command, description) {
  log(`\n${description}...`, 'blue');
  try {
    const result = execSync(command, { encoding: 'utf8', stdio: 'pipe' });
    log('✅ Success', 'green');
    return result;
  } catch (error) {
    log(`❌ Error: ${error.message}`, 'red');
    return null;
  }
}

async function main() {
  log('🔍 Production Debug Script', 'blue');
  log('========================', 'blue');

  // 1. Check if AWS CLI is configured
  log('\n1. Checking AWS CLI configuration...', 'yellow');
  const awsIdentity = runCommand('aws sts get-caller-identity', 'Getting AWS identity');
  if (!awsIdentity) {
    log('❌ AWS CLI not configured. Please run: aws configure', 'red');
    return;
  }

  // 2. Get Lambda function name
  log('\n2. Finding Lambda function...', 'yellow');
  const functionName = process.argv[2];
  if (!functionName) {
    log('❌ Please provide Lambda function name as argument', 'red');
    log('Usage: node scripts/debug-production.js <function-name>', 'yellow');
    return;
  }

  // 3. Test Lambda function directly
  log('\n3. Testing Lambda function directly...', 'yellow');
  const testEvent = {
    httpMethod: 'GET',
    path: '/users/paginate',
    headers: {
      'Content-Type': 'application/json'
    },
    body: null,
    isBase64Encoded: false,
    requestContext: {
      requestId: 'test-request-id',
      stage: 'dev'
    }
  };

  const testResult = runCommand(
    `aws lambda invoke --function-name ${functionName} --payload '${JSON.stringify(testEvent)}' /tmp/lambda-response.json`,
    'Invoking Lambda function'
  );

  if (testResult) {
    try {
      const response = JSON.parse(fs.readFileSync('/tmp/lambda-response.json', 'utf8'));
      log('Lambda Response:', 'green');
      console.log(JSON.stringify(response, null, 2));
    } catch (error) {
      log('Error parsing Lambda response', 'red');
    }
  }

  // 4. Check CloudWatch logs
  log('\n4. Checking CloudWatch logs...', 'yellow');
  const logGroupName = `/aws/lambda/${functionName}`;
  
  // Get recent log streams
  const logStreams = runCommand(
    `aws logs describe-log-streams --log-group-name "${logGroupName}" --order-by LastEventTime --descending --max-items 5`,
    'Getting recent log streams'
  );

  if (logStreams) {
    try {
      const streams = JSON.parse(logStreams);
      if (streams.logStreams && streams.logStreams.length > 0) {
        const latestStream = streams.logStreams[0].logStreamName;
        log(`Getting logs from stream: ${latestStream}`, 'blue');
        
        const logs = runCommand(
          `aws logs get-log-events --log-group-name "${logGroupName}" --log-stream-name "${latestStream}" --start-time $(( $(date +%s) * 1000 - 3600000 ))`,
          'Getting recent log events'
        );
        
        if (logs) {
          const logEvents = JSON.parse(logs);
          log('Recent CloudWatch Logs:', 'green');
          logEvents.events.forEach(event => {
            console.log(`[${new Date(event.timestamp).toISOString()}] ${event.message}`);
          });
        }
      } else {
        log('No log streams found', 'yellow');
      }
    } catch (error) {
      log('Error parsing CloudWatch logs', 'red');
    }
  }

  // 5. Check Lambda function configuration
  log('\n5. Checking Lambda function configuration...', 'yellow');
  const functionConfig = runCommand(
    `aws lambda get-function --function-name ${functionName}`,
    'Getting function configuration'
  );

  if (functionConfig) {
    try {
      const config = JSON.parse(functionConfig);
      log('Function Configuration:', 'green');
      console.log(`- Runtime: ${config.Configuration.Runtime}`);
      console.log(`- Handler: ${config.Configuration.Handler}`);
      console.log(`- Timeout: ${config.Configuration.Timeout}s`);
      console.log(`- Memory: ${config.Configuration.MemorySize}MB`);
      console.log(`- Last Modified: ${config.Configuration.LastModified}`);
    } catch (error) {
      log('Error parsing function configuration', 'red');
    }
  }

  // 6. Check environment variables
  log('\n6. Checking environment variables...', 'yellow');
  if (functionConfig) {
    try {
      const config = JSON.parse(functionConfig);
      const envVars = config.Configuration.Environment?.Variables || {};
      log('Environment Variables:', 'green');
      Object.keys(envVars).forEach(key => {
        const value = envVars[key];
        // Mask sensitive values
        const maskedValue = key.toLowerCase().includes('password') || key.toLowerCase().includes('secret') 
          ? '***MASKED***' 
          : value;
        console.log(`- ${key}: ${maskedValue}`);
      });
    } catch (error) {
      log('Error parsing environment variables', 'red');
    }
  }

  log('\n✅ Debug script completed!', 'green');
  log('\nNext steps:', 'yellow');
  log('1. Check the Lambda response above for any errors', 'blue');
  log('2. Review CloudWatch logs for detailed error information', 'blue');
  log('3. Verify environment variables are correctly set', 'blue');
  log('4. Check API Gateway logs if the issue persists', 'blue');
}

main().catch(console.error);
