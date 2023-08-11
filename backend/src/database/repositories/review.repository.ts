import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model } from 'mongoose';
import { Review, ReviewDocument, UserReview } from 'src/database/documents/Review';
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
        return this._reviewModel.find().select('-reviews -__v')
    }

    public async getById(id: string) {
        return this._reviewModel.findById(id).select('-__v');
    }

    public async addUserReview(
        userReview: Pick<UserReview, 'userId' | 'howEasyRating' | 'howInterestingRating' | 'comment'>,
        reviewId: string,
        session?: ClientSession
    ) {
        const review = await this._reviewModel.findById(reviewId);

        review.reviews.push(userReview as UserReview);

        if (review.votesNumber === 0) {
            review.howInterestingRatingAverage = userReview.howInterestingRating;
            review.howEasyRatingAverage = userReview.howEasyRating;
        } else {
            review.howInterestingRatingAverage = 
                Math.round((review.howInterestingRatingAverage * review.votesNumber + userReview.howInterestingRating) / (review.votesNumber + 1));
            review.howEasyRatingAverage = 
                Math.round(((review.howEasyRatingAverage * review.votesNumber + userReview.howEasyRating) / (review.votesNumber + 1))); 
        }

        review.votesNumber++;

        review.updatedAt = new Date();

        return review.save({session});
    }
}