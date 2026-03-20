import { Document, Model, UpdateQuery } from "mongoose";
import { ApiFeatures } from "./api-features.util";

// ---------------------------------------------------------------------------
// Shared pagination envelope returned by findAll
// ---------------------------------------------------------------------------
export interface PaginatedResult<T> {
  data: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// ---------------------------------------------------------------------------
// ORM-agnostic repository contract
// ---------------------------------------------------------------------------
export interface IBaseRepository<T> {
  create(data: Partial<T>): Promise<T>;
  createMany(data: Partial<T>[]): Promise<T[]>;
  /**
   * Returns a paginated, filterable, sortable, searchable list of documents.
   *
   * @param queryParams  Raw req.query — passed to ApiFeatures for filtering /
   *                     sorting / field-limiting / searching / pagination.
   * @param filter       Hard server-side filter applied before ApiFeatures
   *                     (e.g. { owner: req.user.id } — never overrideable by client).
   * @param searchFields Fields to search against when ?search= is provided.
   * @param populate     Mongoose populate spec (string | PopulateOptions).
   */
  findAll(
    queryParams?: Record<string, any>,
    filter?: Record<string, any>,
    searchFields?: string[],
    populate?: any,
  ): Promise<PaginatedResult<T>>;
  findById(id: string): Promise<T | null>;
  findOne(filter: Record<string, any>): Promise<T | null>;
  update(id: string, data: Partial<T>): Promise<T | null>;
  delete(id: string): Promise<boolean>;
  deleteMany(filter: Record<string, any>): Promise<boolean>;
}

// ---------------------------------------------------------------------------
// Mongoose implementation
// ---------------------------------------------------------------------------
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

  async findAll(
    queryParams: Record<string, any> = {},
    filter: Record<string, any> = {},
    searchFields: string[] = [],
    populate?: any,
  ): Promise<PaginatedResult<T>> {
    // Apply the hard server-side filter first, then let ApiFeatures layer
    // client-driven filtering / sorting / field-limiting / search on top.
    const queryBuilder = this._model.find(filter);

    const features = new ApiFeatures(queryBuilder, queryParams)
      .filter()
      .sort()
      .limitFields()
      .search(searchFields);

    // Count BEFORE paginating so the total reflects the filtered set
    const total = await features.query.clone().countDocuments();

    features.paginate();

    if (populate) {
      features.query = features.query.populate(populate);
    }

    const data = await features.query.exec();

    const page = Number(queryParams.page) || 1;
    const limit = Number(queryParams.limit) || 10;
    const totalPages = Math.ceil(total / limit);

    return { data, page, limit, total, totalPages };
  }

  async findById(id: string) {
    return this._model.findById(id).exec();
  }

  async findOne(filter: Record<string, any>) {
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

  async deleteMany(filter: Record<string, any>) {
    return (await this._model.deleteMany(filter).exec()).acknowledged;
  }
}
