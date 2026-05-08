import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class AddPayoutStatusReviewHistoryTable1778209000000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        const hasTable = await queryRunner.hasTable('payout_status_review_history');
        if (hasTable) {
            return;
        }

        await queryRunner.createTable(
            new Table({
                name: 'payout_status_review_history',
                columns: [
                    { name: 'id', type: 'int', isPrimary: true, isGenerated: true, generationStrategy: 'increment' },
                    { name: 'created_at', type: 'datetime', default: 'CURRENT_TIMESTAMP' },
                    { name: 'updated_at', type: 'datetime', default: 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' },
                    { name: 'deleted_at', type: 'datetime', isNullable: true },
                    { name: 'payout_id', type: 'int' },
                    { name: 'reviewer_id', type: 'int' },
                    { name: 'from_status', type: 'enum', enum: ['PENDING', 'APPROVED', 'REJECTED'], isNullable: true },
                    { name: 'to_status', type: 'enum', enum: ['PENDING', 'APPROVED', 'REJECTED'] },
                    { name: 'comment', type: 'text', isNullable: true },
                    { name: 'reviewed_at', type: 'timestamp' },
                ],
            }),
        );

        await queryRunner.createForeignKeys('payout_status_review_history', [
            new TableForeignKey({
                columnNames: ['payout_id'],
                referencedTableName: 'payouts',
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

    public async down(queryRunner: QueryRunner): Promise<void> {
        const hasTable = await queryRunner.hasTable('payout_status_review_history');
        if (!hasTable) {
            return;
        }

        await queryRunner.dropTable('payout_status_review_history');
    }
}
