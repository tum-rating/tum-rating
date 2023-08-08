import { Model } from 'mongoose';

export type CreateReturn<T> = T & { id: string };

export abstract class BaseRepository<T> {
    private model: Model<T>;

    protected constructor(model: Model<T>) {
        this.model = model;
    }

    public async create(data: T) {
        const savedModel = new this.model(data).save();

        return savedModel;
    }

    public async findOneById(id: string): Promise<CreateReturn<T>> {
        return this.model.findById(id);
    }

    public async findAll(): Promise<CreateReturn<T>[]> {
        return this.model.find();
    }

    public async updateOneById(id: string, data: Partial<T>): Promise<CreateReturn<T>> {
        return this.model.findByIdAndUpdate(id, data, { new: true });
    }

    public async deleteOneById(id: string) {
        return this.model.findByIdAndDelete(id);
    }
}
