import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Course, CourseDocument } from 'src/database/documents/course';
import { BaseRepository } from './base.repository';

export class CourseRepository extends BaseRepository<Course> {
    constructor(
        @InjectModel(Course.name)
        private readonly _courseModel: Model<CourseDocument>,
    ) {
        super(_courseModel);
    }

    public async getSession() {
        return this._courseModel.startSession();
    }

    public async findAllOverview() {
        return this._courseModel.find().select('-reviews -__v');
    }

    public async getCoursesByQuery(pageNumber: number, pageSize: number, search?: string) {
        // rage base pagination - think how to combine with text search, for now good enough
        // let query = {_id: {$gt: pageId}}

        let query = {};

        if (search) {
            query['$text'] = { $search: search };
        }

        // align page number with index 0
        const alignedPageNumber = pageNumber - 1;

        return this._courseModel
            .find(query)
            .sort({ course: 1 })
            .select('-reviews -__v')
            .skip(alignedPageNumber * pageSize)
            .limit(pageSize);
    }

    public async findOneByIdWithPopulatedReviews(id: string) {
        return this._courseModel.findById(id).populate('reviews', '-__v').select('-__v');
    }

    public async addReview(courseId: string, reviewId: string) {
        return this._courseModel.findOneAndUpdate(
            { _id: courseId },
            {
                $push: { reviews: reviewId },
            },
        );
    }

    public async updateCourseStats(courseId: string, stats: Pick<Course, 'howEasyRatingAverage' | 'howInterestingRatingAverage' | 'votesNumber'>) {
        return this._courseModel.updateOne({ _id: courseId }, stats);
    }
}
