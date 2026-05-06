import dataSource from '../data-source';
import { seedAgentTypes } from './agent-type.seed';

async function runSeeds(): Promise<void> {
    try {
        if (!dataSource.isInitialized) {
            await dataSource.initialize();
        }

        await seedAgentTypes(dataSource);
        console.log('Seed completed successfully');
    } catch (error) {
        console.error('Seed failed', error);
        process.exitCode = 1;
    } finally {
        if (dataSource.isInitialized) {
            await dataSource.destroy();
        }
    }
}

runSeeds();
