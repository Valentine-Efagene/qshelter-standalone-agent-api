import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class AddBankAccountsTable1778210000000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        const hasTable = await queryRunner.hasTable('bank_accounts');
        if (hasTable) {
            return;
        }

        await queryRunner.createTable(
            new Table({
                name: 'bank_accounts',
                columns: [
                    { name: 'id', type: 'int', isPrimary: true, isGenerated: true, generationStrategy: 'increment' },
                    { name: 'created_at', type: 'datetime', default: 'CURRENT_TIMESTAMP' },
                    { name: 'updated_at', type: 'datetime', default: 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' },
                    { name: 'deleted_at', type: 'datetime', isNullable: true },
                    { name: 'agent_id', type: 'int', isUnique: true },
                    { name: 'bank_name', type: 'varchar' },
                    { name: 'account_name', type: 'varchar' },
                    { name: 'account_number', type: 'varchar' },
                ],
            }),
        );

        await queryRunner.createForeignKey(
            'bank_accounts',
            new TableForeignKey({
                columnNames: ['agent_id'],
                referencedTableName: 'agents',
                referencedColumnNames: ['id'],
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const hasTable = await queryRunner.hasTable('bank_accounts');
        if (!hasTable) {
            return;
        }

        await queryRunner.dropTable('bank_accounts');
    }
}
