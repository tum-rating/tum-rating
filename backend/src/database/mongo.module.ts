import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
    imports: [
        MongooseModule.forRootAsync({
            inject: [ConfigService],

            useFactory: async (configService: ConfigService) => {
                const uri =
                    'mongodb' +
                    // for multiple nodes
                    (configService.getOrThrow('app.env') === 'production'
                        ? '+srv'
                        : '') +
                    '://' +
                    configService.getOrThrow('mongo.username') +
                    ':' +
                    configService.getOrThrow('mongo.password') +
                    '@' +
                    configService.getOrThrow('mongo.host') +
                    // cannot specify port with srv
                    (configService.getOrThrow('app.env') === 'production'
                        ? ''
                        : ':' + configService.getOrThrow('mongo.port'));

                return {
                    uri,
                    useNewUrlParser: true,
                    useUnifiedTopology: true,
                    retryWrites: true,
                    w: 'majority',
                    dbName: configService.getOrThrow('mongo.dbName'),
                };
            },
        }),
    ],
})
export class MongoModule {}
