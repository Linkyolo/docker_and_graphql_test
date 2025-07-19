import { Field, ObjectType, ID } from "type-graphql";
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { User } from "./User";

@ObjectType()
@Entity()
export class Workout {

        @Field(() => ID)
        @PrimaryGeneratedColumn()
        id!: number;

        @Field()
        @Column()
        date?: Date;

        @Field()
        @Column()
        type?: string;

        @Field(() => User)
        @ManyToOne(() => User, user => user.workouts, { onDelete: 'CASCADE' })
        user: User = undefined!;

}
