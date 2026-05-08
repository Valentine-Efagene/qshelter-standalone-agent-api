import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class AddPayoutsTable1778208000000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        const hasPayoutsTable = await queryRunner.hasTable('payouts');
        if (hasPayoutsTable) {
            return;
        }

        await queryRunner.createTable(
            new Table({
                name: 'payouts',
                columns: [
                    { name: 'id', type: 'int', isPrimary: true, isGenerated: true, generationStrategy: 'increment' },
                    { name: 'created_at', type: 'datetime', default: 'CURRENT_TIMESTAMP' },
                    { name: 'updated_at', type: 'datetime', default: 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' },
                    { name: 'deleted_at', type: 'datetime', isNullable: true },
                    { name: 'agent_id', type: 'int' },
                    { name: 'reviewed_by', type: 'int', isNullable: true },
                    { name: 'reviewed_at', type: 'timestamp', isNullable: true },
                    { name: 'amount', type: 'double precision', precision: 20, scale: 2 },
                    { name: 'status', type: 'enum', enum: ['PENDING', 'APPROVED', 'REJECTED'], default: `'PENDING'` },
                    { name: 'rejection_reason', type: 'text', isNullable: true },
                ],
            }),
        );

        await queryRunner.createForeignKeys('payouts', [
            new TableForeignKey({
                columnNames: ['agent_id'],
                referencedTableName: 'agents',
                referencedColumnNames: ['id'],
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
            }),
            new TableForeignKey({
                columnNames: ['reviewed_by'],
                referencedTableName: 'users',
                referencedColumnNames: ['id'],
                onDelete: 'SET NULL',
                onUpdate: 'CASCADE',
            }),
        ]);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const hasPayoutsTable = await queryRunner.hasTable('payouts');
        if (!hasPayoutsTable) {
            return;
        }

        await queryRunner.dropTable('payouts');
    }
}
