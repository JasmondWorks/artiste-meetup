import { Document, Model, QueryOptions, UpdateQuery } from "mongoose";

export interface IBaseRepository<T> {
  create(data: Partial<T>): Promise<T>;
  createMany(data: Partial<T>[]): Promise<T[]>;
  findAll(filter?: Record<string, unknown>, options?: QueryOptions): Promise<T[]>;
  findById(id: string): Promise<T | null>;
  findOne(filter: Record<string, unknown>): Promise<T | null>;
  update(id: string, data: Partial<T>): Promise<T | null>;
  delete(id: string): Promise<boolean>;
  deleteMany(filter: Record<string, unknown>): Promise<boolean>;
}

export class MongooseRepository<T extends Document>
  implements IBaseRepository<T>
{
  constructor(private _model: Model<T>) {}

  async create(data: Partial<T>) {
    return this._model.create(data);
  }

  async createMany(data: Partial<T>[]) {
    return this._model.insertMany(data) as unknown as Promise<T[]>;
  }

  async findAll(filter: Record<string, unknown> = {}, options: QueryOptions = {}) {
    return this._model.find(filter, null, options).exec();
  }

  async findById(id: string) {
    return this._model.findById(id).exec();
  }

  async findOne(filter: Record<string, unknown>) {
    return this._model.findOne(filter).exec();
  }

  async update(id: string, data: UpdateQuery<T>) {
    return this._model
      .findByIdAndUpdate(id, data, { new: true, runValidators: true })
      .exec();
  }

  async delete(id: string) {
    return !!(await this._model.findByIdAndDelete(id).exec());
  }

  async deleteMany(filter: Record<string, unknown>) {
    return (await this._model.deleteMany(filter).exec()).acknowledged;
  }
}
