import { Resolver, Query, Mutation, Arg, Int } from 'type-graphql'
import { User, Workout } from '../../entities';
import { AppDataSource } from '../../data-source';
import { } from '../../entities';

@Resolver(() => Workout)
export class WorkoutResolver {
        private workoutRepo = AppDataSource.getRepository(Workout);
        private userRepo = AppDataSource.getRepository(User);

        @Query(() => [Workout])
        async workouts(): Promise<Workout[]> {
                return this.workoutRepo.find({ relations: ['user'] })
        };


        @Query(() => Workout, { nullable: true })
        async workout(@Arg('id') id: number): Promise<Workout | null> {

                //TODO: last 20, 50, 10orkout in reverse order
                return this.workoutRepo.findOne({ where: { id }, relations: ['workouts'], });
        }

        @Mutation(() => Workout)
        async createWorkout(
                @Arg('startTime') startTime: Date,
                @Arg('endTime') endTime: Date,
                @Arg('type') type: string,
                @Arg('userId', () => Int) userId: number,

        ): Promise<Workout> {
                const user = await this.userRepo.findOneBy({ id: userId });
                if (!user) {
                        throw new Error('User not found')

                }

                const workout = new Workout()
                workout.startTime = startTime;
                workout.endTime = endTime;
                workout.type = type;
                workout.user = user;
                this.workoutRepo.save(workout)

                return this.workoutRepo.save(workout)




        }
}
