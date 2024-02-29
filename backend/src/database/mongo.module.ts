import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
    imports: [
        MongooseModule.forRootAsync({
            inject: [ConfigService],

            useFactory: async (configService: ConfigService) => {
                return {
                    uri: configService.getOrThrow('mongo.uri'),
                    useNewUrlParser: true,
                    useUnifiedTopology: true,
                    retryWrites: true,
                    dbName: configService.getOrThrow('mongo.dbName'),
                };
            },
        }),
    ],
})
export class MongoModule {}
