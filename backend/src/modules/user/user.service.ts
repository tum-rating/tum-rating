import { Injectable } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';

import { UserRepository } from 'src/database/repositories/user.repository';
import { User } from 'src/database/documents/user';
import { UserBanRepository } from 'src/database/repositories/userBan.repository';
import { ReviewRepository } from 'src/database/repositories/review.repository';
import { CourseRepository } from 'src/database/repositories/course.repository';
import { NotFoundError } from 'src/utils/errors/errors';

import { CreateUserDto } from './dto/CreateUser.dto';
import { UpsertUserDto } from './dto/UpsertUser.dto';

@Injectable()
export class UserService {
    constructor(
        private readonly _logger: PinoLogger,
        private readonly _courseRepository: CourseRepository,
        private readonly _reviewRepository: ReviewRepository,
        private readonly _userRepository: UserRepository,
        private readonly _userBanRepository: UserBanRepository,
    ) {
        this._logger.setContext(UserService.name);
    }

    public async createUser(user: CreateUserDto) {
        const userToCreate = {...user} as User;

        const emailUsernameSuffix = this.extractEmailUsernameDotSuffix(userToCreate.email);

        if (emailUsernameSuffix) {
            userToCreate.emailDotSuffix = emailUsernameSuffix;
        }

        return this._userRepository.create(userToCreate);
    }

    public async getUserByEmail(email: string) {
        return this._userRepository.getByEmail(email);
    }

    public async upsertUser(userToUpsert: UpsertUserDto): Promise<{user: WithId<User>, newlyCreated: boolean}> {
        // TODO change username that is empty for tumId users

        const user = await this.getUserByEmail(userToUpsert.email);

        if (!user) {
            const user = await this._userRepository.createUserWithTumId(userToUpsert.email, userToUpsert.sub); 
            return { user, newlyCreated: true };

        }

        return { user, newlyCreated: false };
    }

    public async getUsers() {
        return this._userRepository.getAllAndOmit();
    }

    public async getUser(id: string) {
        const user = await this._userRepository.findOneById(id);

        if(!user)
            throw new NotFoundError(`User with id ${id} not found`);

        return user;
    }

    // tum email have 2 possible username formats:
    // 1. as12asd - some random id
    // 2. <user input>.<student surname> - user input can be whatever, .<student surname> is mandatory
    public extractEmailUsernameDotSuffix(email: string) {
        const emailUsername = email.split('@')[0];
        const dotSuffixSplit = emailUsername.split('.')

        if (dotSuffixSplit.length < 2) return null;

        return dotSuffixSplit[dotSuffixSplit.length - 1];
    }

    public async getUsersWithMatchingEmailSuffix(email: string) {
        const dotSuffix = this.extractEmailUsernameDotSuffix(email);

        if (!dotSuffix) return [];

        const restults = await this._userRepository.getByEmailUsernameDotSuffix(dotSuffix);

        return this._userRepository.getByEmailUsernameDotSuffix(dotSuffix);
    }

    public async updateUser(id: string, user: Partial<User>) {
        return this._userRepository.updateOneById(id, user);
    }

    public async deleteUser(id: string) {
        const session = await this._userRepository.startSession();

        session.startTransaction();

        try {
            const deletedUser = await this._userRepository.deleteOneById(id, session);

            if(!deletedUser) throw new NotFoundError(`User with id ${id} not found`);

            const deletedReview = await this._reviewRepository.deleteReviewsByUserID(id, session);

            const coursesToUpdate: {[key: string]: boolean} = {};
            for (const review of deletedReview) {
                coursesToUpdate[review.courseId as unknown as string] = true;
            };

            for (const courseId in coursesToUpdate) {
                const stats = await this._reviewRepository.getStatsByCourseId(courseId, session);

                await this._courseRepository.updateCourseStats(courseId, stats, session);
            }

            await session.commitTransaction();

            return deletedUser;
        } catch(error) {
            await session.abortTransaction();

            if (error instanceof NotFoundError) {
                throw error;
            }

            throw error;
        } finally {
            await session.endSession();
        }
    }

    public async activateEmail(id: string) {
        return this._userRepository.activateEmail(id);
    }

    public async updatePassword(id: string, newPasswordHash: string, newPasswordSalt: string) {
        return this._userRepository.updatePassword(id, newPasswordHash, newPasswordSalt);
    }

    public async toggleBan(userId: string, isBanned: boolean) {
        const session = await this._userRepository.startSession();

        session.startTransaction();

        try {
            const user = await this._userRepository.findOneById(userId, session)

            if(!user) {
                throw new NotFoundError(`User with id ${userId} not found`);
            }

            if (isBanned) {
                await this._userBanRepository.upsert(userId, session);
            } else {
                await this._userBanRepository.deleteByUserId(userId, session);
            }

            await this._userRepository.updateOneById(userId, { isBanned }, session);

            const reviewUpdateResults = await this._reviewRepository.toggleReviewVisibilityByUserID(userId, isBanned, session);

            const coursesToUpdate: {[key: string]: boolean} = {};
            for (const review of reviewUpdateResults) {
                coursesToUpdate[review.courseId as unknown as string] = true;
            };

            for (const courseId in coursesToUpdate) {
                const stats = await this._reviewRepository.getStatsByCourseId(courseId, session);

                await this._courseRepository.updateCourseStats(courseId, stats, session);
            }

            await session.commitTransaction();
        } catch(error) {
            await session.abortTransaction();
            throw error;
        } finally {
            await session.endSession();
        }
    }

    public async isBanned(id: string) {
        const bannedUser = await this._userBanRepository.findByUserId(id);

        return !!bannedUser;
    }
}
