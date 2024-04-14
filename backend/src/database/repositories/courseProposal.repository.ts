import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CourseProposal, CourseProposalDocument } from 'src/database/documents/courseProposal';

import { BaseRepository } from './base.repository';

export class CourseProposalRepository extends BaseRepository<CourseProposal> {
    constructor(
        @InjectModel(CourseProposal.name)
        private readonly _courseProposalModel: Model<CourseProposalDocument>,
    ) {
        super(_courseProposalModel);
    }
}
