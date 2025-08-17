import { Resolver, Query, Mutation, Arg, Int } from 'type-graphql'
import { User, Workout, Exercise } from '../../entities';
import { AppDataSource } from '../../data-source';
import { } from '../../entities';
import { CreateWorkoutInput } from '../inputs/workout/CreateWorkoutInput';

@Resolver(() => Workout)
export class WorkoutResolver {
        private workoutRepo = AppDataSource.getRepository(Workout);
        private userRepo = AppDataSource.getRepository(User);
        private exerciseRepo = AppDataSource.getRepository(Exercise);

        @Query(() => [Workout])
        async workouts(): Promise<Workout[]> {
                return this.workoutRepo.find({ relations: ['user', 'exercises'] })
        };


        @Query(() => Workout, { nullable: true })
        async workout(@Arg('id') id: number): Promise<Workout | null> {

                //TODO: last 20, 50, 10orkout in reverse order
                return this.workoutRepo.findOne({ where: { id }, relations: ['users'], });
        }

        @Mutation(() => Workout)
        async createWorkout(
                @Arg("input") input: CreateWorkoutInput
        ): Promise<Workout> {


                const { startTime, endTime, type, userId, exercises } = input;

                const user = await this.userRepo.findOneBy({ id: userId });
                if (!user) {
                        throw new Error('User not found')

                }

                const workout = new Workout()
                workout.startTime = startTime;
                workout.endTime = endTime;
                workout.type = type;
                workout.user = user;

                const exerciseEntities = exercises.map((exInput) => {
                        const exercise = this.exerciseRepo.create(exInput);
                        exercise.workout = workout;
                        return exercise;
                });

                workout.exercises = exerciseEntities

                return await this.workoutRepo.save(workout)
        }

        @Mutation(() => Workout)
        async deleteWorkout(@Arg('id') id: number): Promise<Workout> {

                const toBeDeleted = await this.workoutRepo.findOne({ where: { id } });
                if (!toBeDeleted) {
                        throw new Error('Workout not found')
                }
                await this.workoutRepo.delete(id)
                return toBeDeleted;
        }
}
