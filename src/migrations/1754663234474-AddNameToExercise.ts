import { MigrationInterface, QueryRunner } from "typeorm";

export class AddNameToExercise1754663234474 implements MigrationInterface {
    name = 'AddNameToExercise1754663234474'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // 1. Aggiungi la colonna con valore di default temporaneo
        await queryRunner.query(`ALTER TABLE "exercise" ADD "name" character varying DEFAULT ''`);

        // 2. Aggiorna le righe esistenti (giusto per sicurezza)
        await queryRunner.query(`UPDATE "exercise" SET "name" = '' WHERE "name" IS NULL`);

        // 3. Imposta il vincolo NOT NULL
        await queryRunner.query(`ALTER TABLE "exercise" ALTER COLUMN "name" SET NOT NULL`);

        // 4. Rimuovi il default (opzionale, ma consigliato)
        await queryRunner.query(`ALTER TABLE "exercise" ALTER COLUMN "name" DROP DEFAULT`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Rimuove la colonna
        await queryRunner.query(`ALTER TABLE "exercise" DROP COLUMN "name"`);
    }
}
