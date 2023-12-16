import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import {
    ReviewProposal,
    ReviewProposalDocument,
} from 'src/database/documents/reviewProposal';

import { BaseRepository } from './base.repository';

export class ReviewProposalRepository extends BaseRepository<ReviewProposal> {
    constructor(
        @InjectModel(ReviewProposal.name)
        private readonly _reviewProposalModel: Model<ReviewProposalDocument>,
    ) {
        super(_reviewProposalModel);
    }
}
