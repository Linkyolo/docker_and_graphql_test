import { DataSource } from "typeorm";
import { User } from "./entities/User";
import { Workout } from "./entities/Workout";
import { Exercise } from "./entities/Exercise";

export const TestDataSource = new DataSource({
        type: "postgres",
        host: process.env.DB_HOST || "localhost",
        port: Number(process.env.DB_PORT) || 5432,
        username: process.env.DB_USERNAME || "postgres",
        password: process.env.DB_PASSWORD || "postgres",
        database: "postgres_test", // <-- DATABASE DIVERSO PER I TEST!
        synchronize: true, // Auto-crea le tabelle
        logging: false,
        dropSchema: true, // Pulisce tutto all'inizio di ogni run di test
        entities: [User, Workout, Exercise],
});
