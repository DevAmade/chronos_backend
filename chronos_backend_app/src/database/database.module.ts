import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
    imports: [
        SequelizeModule.forRoot({
            dialect: "postgres",
            host: process.env.DATABASE_HOST,
            port: Number(process.env.DATABASE_PORT),
            username: process.env.DATABASE_USERNAME,
            password: process.env.DATABASE_PASSWORD,
            database: process.env.DATABASE_NAME,
        }),
    ],
})
export class DatabaseModule {
    constructor() {
        console.log(process.env)
    }
}