import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSetsToExercise1755260362913 implements MigrationInterface {
        name = 'AddSetsToExercise1755260362913'

        public async up(queryRunner: QueryRunner): Promise<void> {
                // 1. Aggiungi la colonna come nullable con default temporaneo
                await queryRunner.query(`ALTER TABLE "exercise" ADD "sets" integer DEFAULT 0`);

                // 2. Assicurati che tutte le righe abbiano un valore
                await queryRunner.query(`UPDATE "exercise" SET "sets" = 0 WHERE "sets" IS NULL`);

                // 3. Rendi la colonna NOT NULL
                await queryRunner.query(`ALTER TABLE "exercise" ALTER COLUMN "sets" SET NOT NULL`);

                // 4. (Opzionale) Rimuovi il default se non desiderato in futuro
                await queryRunner.query(`ALTER TABLE "exercise" ALTER COLUMN "sets" DROP DEFAULT`);
        }

        public async down(queryRunner: QueryRunner): Promise<void> {
                await queryRunner.query(`ALTER TABLE "exercise" DROP COLUMN "sets"`);
        }
}
