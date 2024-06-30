import { Module, Logger } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CourseRepository } from 'src/database/repositories/course.repository';
import { Course, CourseSchema } from 'src/database/documents/course';
import { JWTService } from 'src/utils/jwt/jwt.service';
import { Review, ReviewSchema } from 'src/database/documents/review';
import { UserModule } from 'src/modules/user/user.module';
import { ReviewRepository } from 'src/database/repositories/review.repository';

import { CourseControllerV1 } from './course.controller.v1';
import { CourseControllerAdminV1 } from './course.controller.admin.v1';
import { CourseService } from './course.service';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Course.name, schema: CourseSchema },
            { name: Review.name, schema: ReviewSchema },
        ]),
        UserModule,
    ],
    controllers: [CourseControllerV1, CourseControllerAdminV1],
    providers: [JWTService, CourseService, CourseRepository, ReviewRepository, Logger],
    exports: [CourseService, CourseRepository],
})
export class CourseModule {}
