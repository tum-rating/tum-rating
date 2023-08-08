import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
    imports: [
        MongooseModule.forRootAsync({
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => {

                console.log('mongo url: ', 'mongodb://' + configService.getOrThrow('mongo.username') + ':' + configService.getOrThrow('mongo.password') + '@' + configService.getOrThrow('mongo.host') + ':' + configService.getOrThrow('mongo.port') + '/' + configService.getOrThrow('mongo.dbName'))

                return {
                    uri: 'mongodb://' + configService.getOrThrow('mongo.username') + ':' + configService.getOrThrow('mongo.password') + '@' + configService.getOrThrow('mongo.host') + ':' + configService.getOrThrow('mongo.port'),// + '/' + configService.getOrThrow('mongo.dbName'),
                    useNewUrlParser: true,
                    useUnifiedTopology: true,
                };
            }
        }),
    ],
})
export class MongoModule {}
