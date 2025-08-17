import { Field, ObjectType, ID } from "type-graphql";
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from "typeorm";
import { User } from "./User";
import { Exercise } from "./Exercise";

@ObjectType()
@Entity()
export class Workout {

        @Field(() => ID)
        @PrimaryGeneratedColumn()
        id!: number;

        @Field()
        @Column()
        startTime?: Date;

        @Field()
        @Column()
        endTime?: Date;


        //TODO:  Evaluate enum for :
        // 1) Cardio
        // 2) strength
        // 3) flexibility
        @Field()
        @Column()
        type?: string;

        @Field(() => User)
        @ManyToOne(() => User, user => user.workouts, { onDelete: 'CASCADE' })
        user: User = undefined!;


        @Field(() => [Exercise])
        @OneToMany(() => Exercise, exercise => exercise.workout, { onDelete: 'CASCADE', cascade: true })
        exercises?: Exercise[]
}
