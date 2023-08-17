import { InjectModel } from '@nestjs/mongoose';
import { Model, Schema as MongooseSchema } from 'mongoose';
import { Professor, ProfessorDocument } from 'src/database/documents/Professor';
import { BaseRepository } from './base.repository';

export class ProfessorRepository extends BaseRepository<Professor> {
  constructor(
    @InjectModel(Professor.name)
    private readonly _professorModel: Model<ProfessorDocument>,
  ) {
    super(_professorModel);
  }
}
