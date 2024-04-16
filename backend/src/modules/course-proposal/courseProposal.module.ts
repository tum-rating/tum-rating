import { Module, Logger } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JWTService } from 'src/utils/jwt/jwt.service';
import { CourseProposal, CourseProposalSchema } from 'src/database/documents/courseProposal';
import { CourseModule } from 'src/modules/course/course.module';
import { UserModule } from 'src/modules/user/user.module';
import { CourseProposalRepository } from 'src/database/repositories/courseProposal.repository';

import { CourseProposalControllerV1 } from './courseProposal.controller.v1';
import { CourseProposalService } from './courseProposal.service';

@Module({
    imports: [
        CourseModule,
        UserModule, 
        MongooseModule.forFeature([
            { name: CourseProposal.name, schema: CourseProposalSchema }
        ])
    ],
    controllers: [CourseProposalControllerV1],
    providers: [
        JWTService,
        CourseProposalService,
        CourseProposalRepository,
        Logger
    ],
    exports: [CourseProposalService],
})
export class CourseProposalModule {}
