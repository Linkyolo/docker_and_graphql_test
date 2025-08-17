import { MigrationInterface, QueryRunner } from "typeorm";

export class FixRepsToBeIntegerInExercise1755261360182 implements MigrationInterface {
    name = 'FixRepsToBeIntegerInExercise1755261360182'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // 1. Rinomina temporaneamente la colonna esistente
        await queryRunner.query(`ALTER TABLE "exercise" RENAME COLUMN "reps" TO "reps_old"`);

        // 2. Aggiungi la nuova colonna integer, nullable per ora
        await queryRunner.query(`ALTER TABLE "exercise" ADD "reps" integer`);

        // 3. Copia i dati dalla vecchia colonna convertendoli (usa cast da string a int)
        await queryRunner.query(`UPDATE "exercise" SET "reps" = "reps_old"::integer WHERE "reps_old" ~ '^[0-9]+$'`);

        // 4. Sostituisci i valori null con 0 o un valore di default (se necessario)
        await queryRunner.query(`UPDATE "exercise" SET "reps" = 0 WHERE "reps" IS NULL`);

        // 5. Imposta la colonna come NOT NULL
        await queryRunner.query(`ALTER TABLE "exercise" ALTER COLUMN "reps" SET NOT NULL`);

        // 6. Rimuovi la vecchia colonna
        await queryRunner.query(`ALTER TABLE "exercise" DROP COLUMN "reps_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // 1. Aggiungi di nuovo la colonna come string
        await queryRunner.query(`ALTER TABLE "exercise" ADD "reps_old" character varying`);

        // 2. Copia i valori convertendoli a stringa
        await queryRunner.query(`UPDATE "exercise" SET "reps_old" = "reps"::text`);

        // 3. Rimuovi la colonna integer
        await queryRunner.query(`ALTER TABLE "exercise" DROP COLUMN "reps"`);

        // 4. Rinomina la colonna di nuovo a "reps"
        await queryRunner.query(`ALTER TABLE "exercise" RENAME COLUMN "reps_old" TO "reps"`);
    }
}
