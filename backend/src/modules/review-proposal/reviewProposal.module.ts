import { Module, Logger } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JWTService } from 'src/utils/jwt/jwt.service';
import { ReviewProposal, ReviewProposalSchema } from 'src/database/documents/reviewProposal';
import { ReviewModule } from 'src/modules/review/review.module';
import { UserModule } from 'src/modules/user/user.module';
import { ReviewProposalRepository } from 'src/database/repositories/reviewProposal.repository';

import { ReviewProposalControllerV1 } from './reviewProposal.controller.v1';
import { ReviewProposalService } from './reviewProposal.service';

@Module({
  imports: [
    ReviewModule,
    UserModule,
    MongooseModule.forFeature([
      { name: ReviewProposal.name, schema: ReviewProposalSchema }
    ]),
  ],
  controllers: [ReviewProposalControllerV1],
  providers: [
    JWTService,
    ReviewProposalService,
    ReviewProposalRepository,
    Logger,
  ],
  exports: [ReviewProposalService],
})
export class ReviewProposalModule {}
