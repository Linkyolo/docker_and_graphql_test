import { Resolver, Query, Mutation, Arg, Int } from 'type-graphql'
import { User, Workout, Exercise } from '../../entities';
import { AppDataSource } from '../../data-source';
import { } from '../../entities';
import { WorkoutInput } from '../inputs/workout/WorkoutInput';

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
                return this.workoutRepo.findOne({ where: { id }, relations: ['user', 'exercises'], });
        }

        @Mutation(() => Workout)
        async createWorkout(
                @Arg("input") input: WorkoutInput
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
        async editWorkout(
                @Arg("id") id: number,
                @Arg("input") input: WorkoutInput
        ): Promise<Workout> {

                const { startTime, endTime, type, userId, exercises } = input;

                const workout = await this.workoutRepo.findOne({
                        where: { id },
                        relations: ["exercises", "user"],
                });

                if (!workout) {
                        throw new Error("Workout not found");
                }

                const user = await this.userRepo.findOneBy({ id: userId });
                if (!user) {
                        throw new Error("User not found");
                }

                // Update workout fields
                workout.startTime = startTime;
                workout.endTime = endTime;
                workout.type = type;
                workout.user = user;

                // Remove old exercises
                await this.exerciseRepo.remove(workout.exercises);

                // Add new exercises
                const updatedExercises = exercises.map((exInput) => {
                        const exercise = this.exerciseRepo.create(exInput);
                        exercise.workout = workout;
                        return exercise;
                });

                workout.exercises = updatedExercises;

                return await this.workoutRepo.save(workout);
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
