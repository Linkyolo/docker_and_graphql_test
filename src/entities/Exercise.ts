import { Field, ObjectType, ID } from "type-graphql";
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Workout } from "./Workout";

@ObjectType()
@Entity()
export class Exercise {

        @Field(() => ID)
        @PrimaryGeneratedColumn()
        id!: number;

        //TODO:  add enum for isometric holds normal 
        @Field()
        @Column()
        typology?: string;

        @Field()
        @Column()
        reps?: string;

        @Field()
        @Column()
        rest?: number;

        @Field()
        @Column({ type: 'varchar', default: '', nullable: true })
        name?: string;

        @Field(() => Workout)
        @ManyToOne(() => Workout, workout => workout.exercises, { onDelete: 'CASCADE' })
        workout: Workout = undefined!;

}
