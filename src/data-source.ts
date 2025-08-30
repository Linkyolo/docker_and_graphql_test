import { DataSource } from "typeorm";
import path from "path";

const isCompiled = process.env.NODE_ENV === "production";

export const AppDataSource = new DataSource({
        type: "postgres",
        host: process.env.DB_HOST || "localhost",
        port: Number(process.env.DB_PORT) || 5432,
        username: process.env.DB_USERNAME || "postgres",
        password: process.env.DB_PASSWORD || "postgres",
        database: process.env.DB_NAME || "postgres",
        synchronize: false,  // Always use migrations in production
        logging: true,
        entities: [
                isCompiled
                        ? path.join(__dirname, "entity/**/*.js")  // Production JS files in 'dist' folder
                        : path.join(__dirname, "../src/entities/**/*.ts"),  // Development TS files in 'src' folder
        ],
        migrations: [
                isCompiled
                        ? path.join(__dirname, "migrations/*.js")  // Production JS migration files
                        : path.join(__dirname, "../src/migrations/*.ts"),  // Development TS migration files
        ],
        subscribers: [],
});
