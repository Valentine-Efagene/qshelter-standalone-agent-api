import { DataSource } from 'typeorm';
import { AgentTypeLookup } from '../agent-type/agent-type.entity';
import { AgentType } from '../agent/agent.enums';

const AGENT_TYPE_SEEDS: Array<{ code: AgentType; name: string }> = [
    { code: AgentType.QSHELTER_LICENSED, name: 'QShelter Licensed' },
    { code: AgentType.ELITE_PARTNER, name: 'Elite Partner' },
];

export async function seedAgentTypes(dataSource: DataSource): Promise<void> {
    const repository = dataSource.getRepository(AgentTypeLookup);

    for (const item of AGENT_TYPE_SEEDS) {
        const existing = await repository.findOne({ where: { code: item.code } });
        if (existing) {
            if (existing.name !== item.name || !existing.isActive) {
                existing.name = item.name;
                existing.isActive = true;
                await repository.save(existing);
            }
            continue;
        }

        await repository.save(
            repository.create({
                code: item.code,
                name: item.name,
                isActive: true,
            }),
        );
    }
}
