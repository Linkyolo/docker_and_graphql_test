import { Exercise } from "../../../entities";
import { GraphQLJSONObject } from "graphql-scalars";
import { Field, GraphQLISODateTime, InputType, Int } from "type-graphql";
import { ExerciseInput } from "../exercise/ExerciseInput";


@InputType()
export class WorkoutInput {
        @Field(() => GraphQLISODateTime)
        startTime!: Date;

        @Field(() => GraphQLISODateTime)
        endTime!: Date;

        @Field()
        type!: string;

        @Field(() => Int)
        userId!: number;

        @Field(() => [ExerciseInput])
        exercises!: [ExerciseInput];
}
