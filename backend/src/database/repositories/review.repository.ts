import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model } from 'mongoose';
import { Review, ReviewDocument } from 'src/database/documents/review';
import { BaseRepository } from './base.repository';

export class ReviewRepository extends BaseRepository<Review> {
    constructor(
        @InjectModel(Review.name)
        private readonly _reviewModel: Model<ReviewDocument>,
    ) {
        super(_reviewModel);
    }

    public async getSession() {
        return this._reviewModel.startSession();
    }

    public async findAllOverview() {
        return this._reviewModel.find().select('-reviews -__v');
    }

    public async getReviewsByQuery(
        pageNumber: number,
        pageSize: number,
        search?: string,
    ) {
        // rage base pagination - think how to combine with text search, for now good enough
        // let query = {_id: {$gt: pageId}}

        let query = {};

        if (search) {
            query['$text'] = { $search: search };
        }

        // align page number with index 0
        const alignedPageNumber = pageNumber - 1;

        return this._reviewModel
            .find(query)
            .sort({ course: 1 })
            .select('-reviews -__v')
            .skip(alignedPageNumber * pageSize)
            .limit(pageSize);
    }

    public async findOneByIdWithPopulatedReviews(id: string) {
        return this._reviewModel
            .findById(id)
            .populate('reviews', '-__v')
            .select('-__v');
    }

    public async addReviewUser(reviewId: string, reviewUserId: string) {
        return this._reviewModel.findOneAndUpdate(
            { _id: reviewId },
            {
                $push: { reviews: reviewUserId },
            },
        );
    }

    public async updateReviewStats(
        reviewId: string,
        stats: Pick<
            Review,
            | 'howEasyRatingAverage'
            | 'howInterestingRatingAverage'
            | 'votesNumber'
        >,
    ) {
        return this._reviewModel.updateOne({ _id: reviewId }, stats);
    }
}
