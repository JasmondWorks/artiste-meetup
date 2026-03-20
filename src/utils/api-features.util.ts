import { Document, Query } from "mongoose";

/**
 * Chainable query builder that applies filtering, sorting, field limiting,
 * text search, date filtering, and pagination on top of a Mongoose query.
 *
 * Usage (in MongooseRepository.findAll):
 *   const features = new ApiFeatures(Model.find(hardFilter), req.query)
 *     .filter()
 *     .sort()
 *     .limitFields()
 *     .search(["name", "description"]);
 *   const total = await features.query.clone().countDocuments();
 *   features.paginate();
 *   const data = await features.query.exec();
 *
 * Supported query parameters:
 *   Filtering  : ?status=active&price[gte]=100
 *   Sorting    : ?sort=-createdAt,price    (default: -createdAt)
 *   Fields     : ?fields=name,email        (default: excludes __v)
 *   Search     : ?search=term              (regex across searchFields)
 *   Date range : ?startDate=2024-01-01&endDate=2024-12-31 (filters createdAt)
 *   Soft delete: ?deleted=true             (default hides deleted docs)
 *   Pagination : ?page=2&limit=10          (default page=1, limit=10)
 */
export class ApiFeatures<T extends Document> {
  public query: Query<T[], T>;
  private queryParams: Record<string, any>;

  constructor(query: Query<T[], T>, queryParams: Record<string, any>) {
    this.query = query;
    this.queryParams = queryParams;
  }

  /** Apply field-level filters from the query string, including MongoDB operators. */
  filter(): this {
    const queryObj = { ...this.queryParams };

    // Strip non-filter keys before passing to Mongoose
    const reservedKeys = ["page", "sort", "limit", "fields", "search", "startDate", "endDate", "deleted"];
    reservedKeys.forEach((key) => delete queryObj[key]);

    // Convert bracket operators to Mongoose $ operators: {gte:"10"} → {$gte:"10"}
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  /** Apply sort order from ?sort=field,-otherField. Defaults to newest first. */
  sort(): this {
    if (this.queryParams.sort) {
      const sortBy = (this.queryParams.sort as string).split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }
    return this;
  }

  /** Limit returned fields via ?fields=name,email. Excludes __v by default. */
  limitFields(): this {
    if (this.queryParams.fields) {
      const fields = (this.queryParams.fields as string).split(",").join(" ");
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select("-__v");
    }
    return this;
  }

  /**
   * Apply case-insensitive regex search across specified fields.
   * Requires ?search=term and a non-empty searchFields list.
   */
  search(searchFields: string[]): this {
    if (this.queryParams.search && searchFields.length > 0) {
      const regex = new RegExp(this.queryParams.search as string, "i");
      const conditions = searchFields.map((field) => ({ [field]: regex }));
      this.query = this.query.find({ $or: conditions } as any);
    }
    return this;
  }

  /**
   * Filter by createdAt date range via ?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD.
   * Both bounds are inclusive.
   */
  dateRange(): this {
    const { startDate, endDate } = this.queryParams;
    if (startDate || endDate) {
      const dateFilter: Record<string, Date> = {};
      if (startDate) dateFilter.$gte = new Date(startDate as string);
      if (endDate) dateFilter.$lte = new Date(endDate as string);
      this.query = this.query.find({ createdAt: dateFilter } as any);
    }
    return this;
  }

  /** Apply skip + limit for pagination. Must be called AFTER counting totals. */
  paginate(): this {
    const page = Number(this.queryParams.page) || 1;
    const limit = Number(this.queryParams.limit) || 10;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}
