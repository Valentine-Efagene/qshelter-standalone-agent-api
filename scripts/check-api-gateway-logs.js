#!/usr/bin/env node

/**
 * API Gateway Logs Checker
 * This script helps check API Gateway logs for integration errors
 */

const { execSync } = require('child_process');

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
  log('🔍 API Gateway Logs Checker', 'blue');
  log('==========================', 'blue');

  const apiId = process.argv[2];
  if (!apiId) {
    log('❌ Please provide API Gateway ID as argument', 'red');
    log('Usage: node scripts/check-api-gateway-logs.js <api-id>', 'yellow');
    return;
  }

  // 1. Check API Gateway configuration
  log('\n1. Checking API Gateway configuration...', 'yellow');
  const apiConfig = runCommand(
    `aws apigatewayv2 get-api --api-id ${apiId}`,
    'Getting API Gateway configuration'
  );

  if (apiConfig) {
    try {
      const config = JSON.parse(apiConfig);
      log('API Gateway Configuration:', 'green');
      console.log(`- Name: ${config.Name}`);
      console.log(`- Protocol: ${config.ProtocolType}`);
      console.log(`- Stage: ${config.Tags?.stage || 'unknown'}`);
      console.log(`- Created: ${config.CreatedDate}`);
    } catch (error) {
      log('Error parsing API configuration', 'red');
    }
  }

  // 2. Check API Gateway stages
  log('\n2. Checking API Gateway stages...', 'yellow');
  const stages = runCommand(
    `aws apigatewayv2 get-stages --api-id ${apiId}`,
    'Getting API Gateway stages'
  );

  if (stages) {
    try {
      const stagesData = JSON.parse(stages);
      log('Available Stages:', 'green');
      stagesData.Items.forEach(stage => {
        console.log(`- ${stage.StageName} (${stage.StageVariables?.stage || 'default'})`);
      });
    } catch (error) {
      log('Error parsing stages', 'red');
    }
  }

  // 3. Check CloudWatch logs for API Gateway
  log('\n3. Checking API Gateway CloudWatch logs...', 'yellow');
  const logGroupName = `/aws/apigateway/${apiId}`;
  
  const logStreams = runCommand(
    `aws logs describe-log-streams --log-group-name "${logGroupName}" --order-by LastEventTime --descending --max-items 3`,
    'Getting API Gateway log streams'
  );

  if (logStreams) {
    try {
      const streams = JSON.parse(logStreams);
      if (streams.logStreams && streams.logStreams.length > 0) {
        log('API Gateway Log Streams:', 'green');
        streams.logStreams.forEach(stream => {
          console.log(`- ${stream.logStreamName} (Last Event: ${new Date(stream.lastEventTime).toISOString()})`);
        });

        // Get logs from the most recent stream
        const latestStream = streams.logStreams[0].logStreamName;
        log(`\nGetting logs from: ${latestStream}`, 'blue');
        
        const logs = runCommand(
          `aws logs get-log-events --log-group-name "${logGroupName}" --log-stream-name "${latestStream}" --start-time $(( $(date +%s) * 1000 - 3600000 ))`,
          'Getting recent API Gateway log events'
        );
        
        if (logs) {
          const logEvents = JSON.parse(logs);
          log('Recent API Gateway Logs:', 'green');
          logEvents.events.forEach(event => {
            console.log(`[${new Date(event.timestamp).toISOString()}] ${event.message}`);
          });
        }
      } else {
        log('No API Gateway log streams found', 'yellow');
        log('This might indicate that API Gateway logging is not enabled', 'yellow');
      }
    } catch (error) {
      log('Error parsing API Gateway logs', 'red');
    }
  } else {
    log('API Gateway logging might not be enabled', 'yellow');
    log('To enable logging, run:', 'blue');
    log(`aws apigatewayv2 update-stage --api-id ${apiId} --stage-name \$default --default-route-settings LoggingLevel=INFO`, 'blue');
  }

  // 4. Check for integration errors
  log('\n4. Checking for integration errors...', 'yellow');
  const integrations = runCommand(
    `aws apigatewayv2 get-integrations --api-id ${apiId}`,
    'Getting API Gateway integrations'
  );

  if (integrations) {
    try {
      const integrationsData = JSON.parse(integrations);
      log('API Gateway Integrations:', 'green');
      integrationsData.Items.forEach(integration => {
        console.log(`- ${integration.IntegrationId}: ${integration.IntegrationType} -> ${integration.IntegrationUri}`);
        if (integration.IntegrationResponse) {
          console.log(`  Response: ${JSON.stringify(integration.IntegrationResponse, null, 2)}`);
        }
      });
    } catch (error) {
      log('Error parsing integrations', 'red');
    }
  }

  log('\n✅ API Gateway check completed!', 'green');
  log('\nCommon issues to look for:', 'yellow');
  log('1. Integration errors in the logs', 'blue');
  log('2. Lambda function timeouts', 'blue');
  log('3. CORS issues', 'blue');
  log('4. Authentication/authorization errors', 'blue');
  log('5. Lambda function not responding', 'blue');
}

main().catch(console.error);
