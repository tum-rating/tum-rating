import { InjectModel } from '@nestjs/mongoose';
import { Model, Schema as MongooseSchema } from 'mongoose';
import { Subject, SubjectDocument } from 'src/database/documents/Subject';
import { BaseRepository } from './base.repository';

export class SubjectRepository extends BaseRepository<Subject> {
    constructor(
        @InjectModel(Subject.name)
        private readonly _subjectModel: Model<SubjectDocument>,
    ) {
        super(_subjectModel);
    }
}