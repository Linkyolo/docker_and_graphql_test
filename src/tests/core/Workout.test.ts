import "reflect-metadata";
import { Workout } from "../../entities/Workout";
import { User } from "../../entities/User";
import { Exercise } from "../../entities/Exercise";
import { TestDataSource } from "../../data-source-test";

describe("Workout Entity", () => {
        beforeAll(async () => {
                try {
                        await TestDataSource.initialize();
                } catch (error) {
                        console.error("Error initializing test database:", error);
                        throw error;
                }
        });

        afterAll(async () => {
                if (TestDataSource.isInitialized) {
                        await TestDataSource.destroy();
                }
        });

        beforeEach(async () => {
                // Clean up database before each test
                // IMPORTANT: Delete in order of foreign key dependencies
                const exerciseRepo = TestDataSource.getRepository(Exercise);
                const workoutRepo = TestDataSource.getRepository(Workout);
                const userRepo = TestDataSource.getRepository(User);

                // Delete children first, then parents
                await exerciseRepo.createQueryBuilder().delete().execute();
                await workoutRepo.createQueryBuilder().delete().execute();
                await userRepo.createQueryBuilder().delete().execute();
        });
        describe("database operations", () => {
                it("should save and retrieve a workout from database", async () => {
                        const workoutRepo = TestDataSource.getRepository(Workout);
                        const userRepo = TestDataSource.getRepository(User);

                        // Create and save user
                        const user = new User();
                        user.name = "John Doe";
                        const savedUser = await userRepo.save(user);

                        // Create and save workout
                        const workout = new Workout();
                        workout.startTime = new Date("2024-01-15T10:00:00Z");
                        workout.endTime = new Date("2024-01-15T11:00:00Z");
                        workout.type = "strength";
                        workout.user = savedUser;

                        const savedWorkout = await workoutRepo.save(workout);

                        // Retrieve from database
                        const retrievedWorkout = await workoutRepo.findOne({
                                where: { id: savedWorkout.id },
                                relations: ["user"],
                        });

                        expect(retrievedWorkout).toBeDefined();
                        expect(retrievedWorkout?.type).toBe("strength");
                        expect(retrievedWorkout?.user.id).toBe(savedUser.id);
                });

                it("should save workout with exercises", async () => {
                        const workoutRepo = TestDataSource.getRepository(Workout);
                        const userRepo = TestDataSource.getRepository(User);
                        const exerciseRepo = TestDataSource.getRepository(Exercise);

                        // Create user
                        const user = new User();
                        user.name = "Jane Smith";
                        const savedUser = await userRepo.save(user);

                        // Create workout
                        const workout = new Workout();
                        workout.startTime = new Date("2024-01-15T10:00:00Z");
                        workout.endTime = new Date("2024-01-15T11:00:00Z");
                        workout.type = "strength";
                        workout.user = savedUser;
                        const savedWorkout = await workoutRepo.save(workout);

                        // Create exercises
                        const exercise1 = new Exercise();
                        exercise1.name = "Bench Press";
                        exercise1.sets = 3;
                        exercise1.reps = 10;
                        exercise1.rest = 60;
                        exercise1.typology = "normal";
                        exercise1.workout = savedWorkout;

                        const exercise2 = new Exercise();
                        exercise2.name = "Squat";
                        exercise2.sets = 4;
                        exercise2.reps = 8;
                        exercise2.rest = 90;
                        exercise2.typology = "normal";
                        exercise2.workout = savedWorkout;

                        await exerciseRepo.save([exercise1, exercise2]);

                        // Retrieve workout with exercises
                        const retrievedWorkout = await workoutRepo.findOne({
                                where: { id: savedWorkout.id },
                                relations: ["exercises", "user"],
                        });

                        expect(retrievedWorkout?.exercises).toHaveLength(2);
                        expect(retrievedWorkout?.exercises?.[0].name).toBe("Bench Press");
                        expect(retrievedWorkout?.exercises?.[1].name).toBe("Squat");
                });

                it("should delete workout and cascade delete exercises", async () => {
                        const workoutRepo = TestDataSource.getRepository(Workout);
                        const userRepo = TestDataSource.getRepository(User);
                        const exerciseRepo = TestDataSource.getRepository(Exercise);

                        // Create user
                        const user = new User();
                        user.name = "Test User";
                        const savedUser = await userRepo.save(user);

                        // Create workout
                        const workout = new Workout();
                        workout.startTime = new Date();
                        workout.endTime = new Date();
                        workout.type = "cardio";
                        workout.user = savedUser;
                        const savedWorkout = await workoutRepo.save(workout);

                        // Create exercise
                        const exercise = new Exercise();
                        exercise.name = "Running";
                        exercise.sets = 1;
                        exercise.reps = 1;
                        exercise.rest = 0;
                        exercise.typology = "normal";
                        exercise.workout = savedWorkout;
                        const savedExercise = await exerciseRepo.save(exercise);

                        // Delete workout
                        await workoutRepo.delete(savedWorkout.id);

                        // Check exercise was cascade deleted
                        const exerciseExists = await exerciseRepo.findOne({
                                where: { id: savedExercise.id },
                        });

                        expect(exerciseExists).toBeNull();
                });

                it("should update workout properties", async () => {
                        const workoutRepo = TestDataSource.getRepository(Workout);
                        const userRepo = TestDataSource.getRepository(User);

                        // Create and save user
                        const user = new User();
                        user.name = "Alice";
                        const savedUser = await userRepo.save(user);

                        // Create and save workout
                        const workout = new Workout();
                        workout.startTime = new Date("2024-01-15T10:00:00Z");
                        workout.endTime = new Date("2024-01-15T11:00:00Z");
                        workout.type = "strength";
                        workout.user = savedUser;
                        const savedWorkout = await workoutRepo.save(workout);

                        // Update workout
                        savedWorkout.type = "cardio";
                        savedWorkout.endTime = new Date("2024-01-15T12:00:00Z");
                        await workoutRepo.save(savedWorkout);

                        // Retrieve updated workout
                        const updatedWorkout = await workoutRepo.findOne({
                                where: { id: savedWorkout.id },
                        });

                        expect(updatedWorkout?.type).toBe("cardio");
                        expect(updatedWorkout?.endTime).toEqual(new Date("2024-01-15T12:00:00Z"));
                });

                it("should calculate workout duration", async () => {
                        const workoutRepo = TestDataSource.getRepository(Workout);
                        const userRepo = TestDataSource.getRepository(User);

                        const user = new User();
                        user.name = "Bob";
                        const savedUser = await userRepo.save(user);

                        const workout = new Workout();
                        workout.startTime = new Date("2024-01-15T10:00:00Z");
                        workout.endTime = new Date("2024-01-15T11:30:00Z");
                        workout.type = "strength";
                        workout.user = savedUser;

                        const savedWorkout = await workoutRepo.save(workout);

                        const retrieved = await workoutRepo.findOne({
                                where: { id: savedWorkout.id },
                        });

                        const duration = retrieved!.endTime!.getTime() - retrieved!.startTime!.getTime();
                        const durationInMinutes = duration / (1000 * 60);

                        expect(durationInMinutes).toBe(90);
                });
        });
});
