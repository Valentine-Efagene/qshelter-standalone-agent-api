import {
    MigrationInterface,
    QueryRunner,
    Table,
    TableColumn,
    TableForeignKey,
    TableIndex,
} from 'typeorm';

export class AddCampaignsAgentTypeLookupAndReviewHistory1714992000000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        const hasAgentTypesTable = await queryRunner.hasTable('agent_types');
        if (!hasAgentTypesTable) {
            await queryRunner.createTable(
                new Table({
                    name: 'agent_types',
                    columns: [
                        { name: 'id', type: 'int', isPrimary: true, isGenerated: true, generationStrategy: 'increment' },
                        { name: 'created_at', type: 'datetime', default: 'CURRENT_TIMESTAMP' },
                        { name: 'updated_at', type: 'datetime', default: 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' },
                        { name: 'deleted_at', type: 'datetime', isNullable: true },
                        { name: 'code', type: 'varchar', isUnique: true },
                        { name: 'name', type: 'varchar' },
                        { name: 'is_active', type: 'tinyint', default: 1 },
                    ],
                }),
            );
        }


        const hasCampaignsTable = await queryRunner.hasTable('campaigns');
        if (!hasCampaignsTable) {
            await queryRunner.createTable(
                new Table({
                    name: 'campaigns',
                    columns: [
                        { name: 'id', type: 'int', isPrimary: true, isGenerated: true, generationStrategy: 'increment' },
                        { name: 'created_at', type: 'datetime', default: 'CURRENT_TIMESTAMP' },
                        { name: 'updated_at', type: 'datetime', default: 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' },
                        { name: 'deleted_at', type: 'datetime', isNullable: true },
                        { name: 'name', type: 'varchar' },
                        { name: 'description', type: 'text', isNullable: true },
                        { name: 'is_active', type: 'tinyint', default: 1 },
                        { name: 'priority', type: 'int', default: 0 },
                        { name: 'starts_at', type: 'timestamp', isNullable: true },
                        { name: 'ends_at', type: 'timestamp', isNullable: true },
                    ],
                }),
            );
        }

        const hasCampaignAgentsTable = await queryRunner.hasTable('campaign_agents');
        if (!hasCampaignAgentsTable) {
            await queryRunner.createTable(
                new Table({
                    name: 'campaign_agents',
                    columns: [
                        { name: 'id', type: 'int', isPrimary: true, isGenerated: true, generationStrategy: 'increment' },
                        { name: 'created_at', type: 'datetime', default: 'CURRENT_TIMESTAMP' },
                        { name: 'updated_at', type: 'datetime', default: 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' },
                        { name: 'deleted_at', type: 'datetime', isNullable: true },
                        { name: 'campaign_id', type: 'int' },
                        { name: 'agent_id', type: 'int' },
                    ],
                }),
            );

            await queryRunner.createIndex(
                'campaign_agents',
                new TableIndex({
                    name: 'IDX_campaign_agents_campaign_id_agent_id',
                    columnNames: ['campaign_id', 'agent_id'],
                    isUnique: true,
                }),
            );

            await queryRunner.createForeignKeys('campaign_agents', [
                new TableForeignKey({
                    columnNames: ['campaign_id'],
                    referencedTableName: 'campaigns',
                    referencedColumnNames: ['id'],
                    onDelete: 'CASCADE',
                    onUpdate: 'CASCADE',
                }),
                new TableForeignKey({
                    columnNames: ['agent_id'],
                    referencedTableName: 'agents',
                    referencedColumnNames: ['id'],
                    onDelete: 'CASCADE',
                    onUpdate: 'CASCADE',
                }),
            ]);
        }

        const hasCampaignRatesTable = await queryRunner.hasTable('campaign_agent_type_rates');
        if (!hasCampaignRatesTable) {
            await queryRunner.createTable(
                new Table({
                    name: 'campaign_agent_type_rates',
                    columns: [
                        { name: 'id', type: 'int', isPrimary: true, isGenerated: true, generationStrategy: 'increment' },
                        { name: 'created_at', type: 'datetime', default: 'CURRENT_TIMESTAMP' },
                        { name: 'updated_at', type: 'datetime', default: 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' },
                        { name: 'deleted_at', type: 'datetime', isNullable: true },
                        { name: 'campaign_id', type: 'int' },
                        { name: 'agent_type_code', type: 'varchar' },
                        { name: 'commission_rate', type: 'decimal', precision: 5, scale: 4 },
                    ],
                }),
            );

            await queryRunner.createIndex(
                'campaign_agent_type_rates',
                new TableIndex({
                    name: 'IDX_campaign_rates_campaign_id_agent_type_code',
                    columnNames: ['campaign_id', 'agent_type_code'],
                    isUnique: true,
                }),
            );

            await queryRunner.createForeignKeys('campaign_agent_type_rates', [
                new TableForeignKey({
                    columnNames: ['campaign_id'],
                    referencedTableName: 'campaigns',
                    referencedColumnNames: ['id'],
                    onDelete: 'CASCADE',
                    onUpdate: 'CASCADE',
                }),
                new TableForeignKey({
                    columnNames: ['agent_type_code'],
                    referencedTableName: 'agent_types',
                    referencedColumnNames: ['code'],
                    onDelete: 'RESTRICT',
                    onUpdate: 'CASCADE',
                }),
            ]);
        }

        const hasReviewHistoryTable = await queryRunner.hasTable('agent_status_review_history');
        if (!hasReviewHistoryTable) {
            await queryRunner.createTable(
                new Table({
                    name: 'agent_status_review_history',
                    columns: [
                        { name: 'id', type: 'int', isPrimary: true, isGenerated: true, generationStrategy: 'increment' },
                        { name: 'created_at', type: 'datetime', default: 'CURRENT_TIMESTAMP' },
                        { name: 'updated_at', type: 'datetime', default: 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' },
                        { name: 'deleted_at', type: 'datetime', isNullable: true },
                        { name: 'agent_id', type: 'int' },
                        { name: 'reviewer_id', type: 'int' },
                        {
                            name: 'from_status',
                            type: 'enum',
                            enum: ['BASIC_INFO', 'EMAIL_VERIFIED', 'PROFILE_SETUP', 'DOCUMENTS_UPLOADED', 'SUBMITTED', 'APPROVED', 'REJECTED'],
                            isNullable: true,
                        },
                        {
                            name: 'to_status',
                            type: 'enum',
                            enum: ['BASIC_INFO', 'EMAIL_VERIFIED', 'PROFILE_SETUP', 'DOCUMENTS_UPLOADED', 'SUBMITTED', 'APPROVED', 'REJECTED'],
                        },
                        { name: 'comment', type: 'text', isNullable: true },
                        { name: 'reviewed_at', type: 'timestamp' },
                    ],
                }),
            );

            await queryRunner.createForeignKeys('agent_status_review_history', [
                new TableForeignKey({
                    columnNames: ['agent_id'],
                    referencedTableName: 'agents',
                    referencedColumnNames: ['id'],
                    onDelete: 'CASCADE',
                    onUpdate: 'CASCADE',
                }),
                new TableForeignKey({
                    columnNames: ['reviewer_id'],
                    referencedTableName: 'users',
                    referencedColumnNames: ['id'],
                    onDelete: 'CASCADE',
                    onUpdate: 'CASCADE',
                }),
            ]);
        }

        if (!(await queryRunner.hasColumn('agents', 'id_type'))) {
            await queryRunner.addColumn(
                'agents',
                new TableColumn({
                    name: 'id_type',
                    type: 'enum',
                    enum: ['DRIVERS_LICENSE', 'VOTERS_CARD', 'NIN', 'INTERNATIONAL_PASSPORT'],
                    isNullable: true,
                }),
            );
        }

        if (!(await queryRunner.hasColumn('agents', 'id_document'))) {
            await queryRunner.addColumn(
                'agents',
                new TableColumn({
                    name: 'id_document',
                    type: 'varchar',
                    isNullable: true,
                }),
            );
        }

        if (!(await queryRunner.hasColumn('agents', 'id_number'))) {
            await queryRunner.addColumn(
                'agents',
                new TableColumn({
                    name: 'id_number',
                    type: 'varchar',
                    isNullable: true,
                }),
            );
        }

        if (!(await queryRunner.hasColumn('commissions', 'campaign_id'))) {
            await queryRunner.addColumn(
                'commissions',
                new TableColumn({
                    name: 'campaign_id',
                    type: 'int',
                    isNullable: true,
                }),
            );

            await queryRunner.createForeignKey(
                'commissions',
                new TableForeignKey({
                    columnNames: ['campaign_id'],
                    referencedTableName: 'campaigns',
                    referencedColumnNames: ['id'],
                    onDelete: 'SET NULL',
                    onUpdate: 'CASCADE',
                }),
            );
        }

        if (await queryRunner.hasColumn('agents', 'comment')) {
            await queryRunner.dropColumn('agents', 'comment');
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        if (await queryRunner.hasColumn('commissions', 'campaign_id')) {
            const commissionsTable = await queryRunner.getTable('commissions');
            const campaignForeignKey = commissionsTable?.foreignKeys.find((key) => key.columnNames.includes('campaign_id'));
            if (campaignForeignKey) {
                await queryRunner.dropForeignKey('commissions', campaignForeignKey);
            }
            await queryRunner.dropColumn('commissions', 'campaign_id');
        }

        if (await queryRunner.hasColumn('agents', 'id_number')) {
            await queryRunner.dropColumn('agents', 'id_number');
        }
        if (await queryRunner.hasColumn('agents', 'id_document')) {
            await queryRunner.dropColumn('agents', 'id_document');
        }
        if (await queryRunner.hasColumn('agents', 'id_type')) {
            await queryRunner.dropColumn('agents', 'id_type');
        }

        if (await queryRunner.hasTable('agent_status_review_history')) {
            await queryRunner.dropTable('agent_status_review_history');
        }

        if (await queryRunner.hasTable('campaign_agent_type_rates')) {
            await queryRunner.dropTable('campaign_agent_type_rates');
        }

        if (await queryRunner.hasTable('campaign_agents')) {
            await queryRunner.dropTable('campaign_agents');
        }

        if (await queryRunner.hasTable('campaigns')) {
            await queryRunner.dropTable('campaigns');
        }

        if (await queryRunner.hasTable('agent_types')) {
            await queryRunner.dropTable('agent_types');
        }
    }
}
