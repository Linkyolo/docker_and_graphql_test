import { Field, ObjectType, ID } from "type-graphql";
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Workout } from "./Workout";

@ObjectType()
@Entity()
export class User {
        @Field(() => ID)
        @PrimaryGeneratedColumn()
        id!: number;

        @Field()
        @Column()
        name?: string;

        @Field(() => [Workout])
        @OneToMany(() => Workout, workout => workout.user)
        workouts?: Workout[];
}
