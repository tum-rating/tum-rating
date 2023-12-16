import { ClientSession, Model } from 'mongoose';

export type CreateReturn<T> = T & { id: string };

export abstract class BaseRepository<T> {
    private model: Model<T>;

    protected constructor(model: Model<T>) {
        this.model = model;
    }

    public async create(data: T, session?: ClientSession) {
        const savedModel = new this.model(data).save({ session });

        return savedModel;
    }

    public async findOneById(id: string, session?: ClientSession): Promise<CreateReturn<T>> {
        return this.model.findById(id, undefined, { session });
    }

    public async findAll(): Promise<CreateReturn<T>[]> {
        return this.model.find();
    }

    public async updateOneById(id: string, data: Partial<T>, session?: ClientSession): Promise<CreateReturn<T>> {
        return this.model.findByIdAndUpdate(id, data, { new: true, session });
    }

    public async deleteOneById(id: string, session?: ClientSession) {
        return this.model.findByIdAndDelete(id, { session });
    }
}
