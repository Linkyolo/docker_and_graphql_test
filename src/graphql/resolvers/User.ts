import { Resolver, Query, Mutation, Arg } from 'type-graphql'
import { User } from '../../entities/User';
import { AppDataSource } from '../../data-source';

@Resolver(() => User)
export class UserResolver {
        private repo = AppDataSource.getRepository(User);

        @Query(() => [User])
        async users(): Promise<User[]> {
                return this.repo.find({ relations: ['workouts'] })
        };


        @Query(() => User, { nullable: true })
        async user(@Arg('id') id: number): Promise<User | null> {
                return this.repo.findOne({ where: { id }, relations: ['workouts'], });
        }

        @Mutation(() => User)
        async createUser(@Arg('name') name: string): Promise<User> {
                const user = this.repo.create({ name });
                return this.repo.save(user)
        }
}
