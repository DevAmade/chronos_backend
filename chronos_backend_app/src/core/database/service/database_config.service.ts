import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { SequelizeModuleOptions, SequelizeOptionsFactory } from "@nestjs/sequelize";

import { LOGGING_DATABASE } from "../../config/module.config";

@Injectable()
export class DatabaseConfigService implements SequelizeOptionsFactory {

    constructor(private readonly configService: ConfigService) {}

    async createSequelizeOptions(): Promise<SequelizeModuleOptions> {
        return Promise.resolve({
            dialect: this.configService.get('DATABASE_DIALECT'),
            host: this.configService.get('DATABASE_HOST'),
            port: +this.configService.get('DATABASE_PORT'),
            username: this.configService.get('DATABASE_USERNAME'),
            password: this.configService.get('DATABASE_PASSWORD'),
            database: this.configService.get('DATABASE_NAME'),
            autoLoadModels: true,
            // synchronize: true,
            logging: LOGGING_DATABASE,
        });
    }
}