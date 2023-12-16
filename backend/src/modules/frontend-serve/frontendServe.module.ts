import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
    imports: [
        ServeStaticModule.forRootAsync({
            inject: [ConfigService],

            useFactory: async (configService: ConfigService) => {
                if (configService.getOrThrow('app.env') === 'development') {
                    return [
                        {
                            rootPath: join(__dirname, '../../../../frontend/dist'),
                        },
                    ];
                } else {
                    return [{ rootPath: join(__dirname, '../../../public') }];
                }
            },
        }),
    ],
})
export class FrontendModule {}
