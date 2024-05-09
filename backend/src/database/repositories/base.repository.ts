import { ClientSession, Model } from 'mongoose';

import { ERROR_MONGO_DUPLICATE_CODE } from 'src/utils/errors/mongoErrorCodes';
import { DuplicateError } from 'src/utils/errors/errors';

export abstract class BaseRepository<T> {
    private model: Model<T>;

    protected constructor(model: Model<T>) {
        this.model = model;
    }

    public async create(data: T, session?: ClientSession): Promise<WithId<T>> {
        let savedModel: WithId<T>;
        
        try {
            savedModel = await (new this.model(data).save({ session })) as unknown as WithId<T>;
        } catch (error) {
            if (error.code == ERROR_MONGO_DUPLICATE_CODE) {
                throw new DuplicateError(error.message, Object.keys(error.keyPattern));
            }

            throw error;
        }

        return savedModel;
    }

    public async findOneById(id: string, session?: ClientSession): Promise<WithId<T>> {
        return this.model.findById(id, undefined, { session });
    }

    public async findAll(): Promise<WithId<T>[]> {
        return this.model.find();
    }

    public async updateOneById(id: string, data: Partial<T>, session?: ClientSession): Promise<WithId<T>> {
        return this.model.findByIdAndUpdate(id, data, { new: true, session });
    }

    public async deleteOneById(id: string, session?: ClientSession): Promise<WithId<T>> {
        return this.model.findByIdAndDelete(id, { session });
    }
}
