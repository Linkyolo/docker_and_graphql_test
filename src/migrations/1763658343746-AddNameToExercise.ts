import { MigrationInterface, QueryRunner } from "typeorm";

export class AddNameToExercise1763658343746 implements MigrationInterface {
    name = 'AddNameToExercise1763658343746'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "exercise" ("id" SERIAL NOT NULL, "typology" character varying NOT NULL, "reps" integer NOT NULL, "rest" integer NOT NULL, "sets" integer NOT NULL, "name" character varying DEFAULT '', "workoutId" integer, CONSTRAINT "PK_a0f107e3a2ef2742c1e91d97c14" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "workout" ("id" SERIAL NOT NULL, "startTime" TIMESTAMP NOT NULL, "endTime" TIMESTAMP NOT NULL, "type" character varying NOT NULL, "userId" integer, CONSTRAINT "PK_ea37ec052825688082b19f0d939" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "exercise" ADD CONSTRAINT "FK_e0d55aed97abd4c9a3df6ab2695" FOREIGN KEY ("workoutId") REFERENCES "workout"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "workout" ADD CONSTRAINT "FK_5c6e4714ac75eab49d2009f956c" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "workout" DROP CONSTRAINT "FK_5c6e4714ac75eab49d2009f956c"`);
        await queryRunner.query(`ALTER TABLE "exercise" DROP CONSTRAINT "FK_e0d55aed97abd4c9a3df6ab2695"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "workout"`);
        await queryRunner.query(`DROP TABLE "exercise"`);
    }

}
