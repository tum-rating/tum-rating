import { ClientSession, Model } from 'mongoose';

export abstract class BaseRepository<T> {
    private model: Model<T>;

    protected constructor(model: Model<T>) {
        this.model = model;
    }

    public async create(data: T, session?: ClientSession): Promise<WithId<T>> {
        const savedModel = new this.model(data).save({ session }) as unknown as Promise<WithId<T>>;

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

    public async deleteOneById(id: string, session?: ClientSession) {
        return this.model.findByIdAndDelete(id, { session });
    }
}
