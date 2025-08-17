import { InputType, Field } from "type-graphql";

@InputType()
export class ExerciseInput {
        @Field()
        typology!: string;

        @Field()
        reps!: number;

        @Field()
        rest!: number;

        @Field()
        sets!: number;

        @Field({ nullable: true })
        name?: string;
}
