import { InjectModel } from '@nestjs/mongoose';
import { Model, Schema as MongooseSchema } from 'mongoose';
import { Course, CourseDocument } from 'src/database/documents/course';
import { BaseRepository } from './base.repository';

export class CourseRepository extends BaseRepository<Course> {
  constructor(
    @InjectModel(Course.name)
    private readonly _CourseModel: Model<CourseDocument>,
  ) {
    super(_CourseModel);
  }
}
