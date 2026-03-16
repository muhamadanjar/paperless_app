/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  SQL,
  eq,
  ne,
  inArray,
  notInArray,
  gt,
  lt,
  gte,
  lte,
  like,
  ilike,
  and,
  or,
  asc,
  desc,
  isNull,
  isNotNull,
  AnyColumn,
  sql,
} from 'drizzle-orm';
import { PgTable } from 'drizzle-orm/pg-core';
import { MySqlTable } from 'drizzle-orm/mysql-core';
import { SQLiteTable } from 'drizzle-orm/sqlite-core';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export type Table = PgTable | MySqlTable | SQLiteTable;
export type DbInstance = any;

export type Operator =
  | '='
  | '!='
  | 'in'
  | 'not_in'
  | 'gt'
  | 'lt'
  | 'gte'
  | 'lte'
  | 'like'
  | 'ilike'
  | 'between'
  | 'not_between'
  | 'is_null'
  | 'is_not_null';

export type SimpleFilter  = [string, any];            // [field, value]  → defaults to '='
export type ComplexFilter = [string, Operator, any];  // [field, operator, value]
export type BaseFilter    = SimpleFilter | ComplexFilter;

export type AndFilter     = { and: FilterInput[] };
export type OrFilter      = { or: FilterInput[] };
export type LogicalFilter = AndFilter | OrFilter;

export type FilterInput = BaseFilter | LogicalFilter;

export type OrderDirection = 'asc' | 'desc';
export type Order = [string, OrderDirection?];

export interface Pagination {
  page?:  number; // default 1
  limit?: number; // default 10
}

export interface QueryOptions {
  order?:      Order | Order[];
  pagination?: Pagination;
  select?:     string[];
}

// ── Pagination result ─────────────────────────────────────────────────────────

export interface PaginationMeta {
  total:       number;        // total rows matching the filter
  page:        number;        // current page (1-based)
  limit:       number;        // rows per page
  totalPages:  number;        // Math.ceil(total / limit)
  hasNextPage: boolean;
  hasPrevPage: boolean;
  nextPage:    number | null; // null when on the last page
  prevPage:    number | null; // null when on the first page
}

export interface PaginatedResult<TData = any> {
  data: TData[];
  meta: PaginationMeta;
}

// ─────────────────────────────────────────────────────────────────────────────
// Errors
// ─────────────────────────────────────────────────────────────────────────────

export class ORMError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'ORMError';
  }
}

export class ValidationError extends ORMError {
  constructor(message: string) {
    super(message, 'VALIDATION_ERROR');
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends ORMError {
  constructor(message: string = 'Record not found') {
    super(message, 'NOT_FOUND');
    this.name = 'NotFoundError';
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Repository interface
// ─────────────────────────────────────────────────────────────────────────────

export interface BaseRepository<T extends Table> {
  // Read
  find(filters?: FilterInput | BaseFilter[], options?: QueryOptions): Promise<any[]>;
  paginate(filters?: FilterInput | BaseFilter[], options?: QueryOptions): Promise<PaginatedResult>;
  findOne(filters?: FilterInput | BaseFilter[], options?: QueryOptions): Promise<any | null>;
  findById(id: any): Promise<any | null>;
  count(filters?: FilterInput | BaseFilter[]): Promise<number>;

  // Write
  create(data: any): Promise<any>;
  createMany(data: any[]): Promise<any[]>;
  update(id: any, data: any): Promise<any>;
  updateWhere(filters: FilterInput | BaseFilter[], data: any): Promise<any[]>;
  upsert(data: any, conflictTarget: string[]): Promise<any>;
  delete(id: any): Promise<boolean>;
  deleteWhere(filters: FilterInput | BaseFilter[]): Promise<number>;

  // Transaction
  transaction<R>(fn: (tx: DbInstance) => Promise<R>): Promise<R>;
}

// ─────────────────────────────────────────────────────────────────────────────
// CustomORM — main entry point
// ─────────────────────────────────────────────────────────────────────────────

export class CustomORM {
  private cache = new WeakMap<Table, Repository<any>>();

  constructor(private db: DbInstance) {}

  repository<T extends Table>(table: T): BaseRepository<T> {
    if (!this.cache.has(table)) {
      this.cache.set(table, new Repository<T>(this.db, table));
    }
    return this.cache.get(table) as Repository<T>;
  }

  find<T extends Table>(table: T, filters?: FilterInput | BaseFilter[], options?: QueryOptions) {
    return this.repository(table).find(filters, options);
  }

  paginate<T extends Table>(table: T, filters?: FilterInput | BaseFilter[], options?: QueryOptions) {
    return this.repository(table).paginate(filters, options);
  }

  findOne<T extends Table>(table: T, filters?: FilterInput | BaseFilter[], options?: QueryOptions) {
    return this.repository(table).findOne(filters, options);
  }

  findById<T extends Table>(table: T, id: any) {
    return this.repository(table).findById(id);
  }

  count<T extends Table>(table: T, filters?: FilterInput | BaseFilter[]) {
    return this.repository(table).count(filters);
  }

  create<T extends Table>(table: T, data: any) {
    return this.repository(table).create(data);
  }

  createMany<T extends Table>(table: T, data: any[]) {
    return this.repository(table).createMany(data);
  }

  update<T extends Table>(table: T, id: any, data: any) {
    return this.repository(table).update(id, data);
  }

  updateWhere<T extends Table>(table: T, filters: FilterInput | BaseFilter[], data: any) {
    return this.repository(table).updateWhere(filters, data);
  }

  upsert<T extends Table>(table: T, data: any, conflictTarget: string[]) {
    return this.repository(table).upsert(data, conflictTarget);
  }

  delete<T extends Table>(table: T, id: any) {
    return this.repository(table).delete(id);
  }

  deleteWhere<T extends Table>(table: T, filters: FilterInput | BaseFilter[]) {
    return this.repository(table).deleteWhere(filters);
  }

  transaction<R>(fn: (tx: DbInstance) => Promise<R>): Promise<R> {
    return this.db.transaction(fn);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Repository implementation
// ─────────────────────────────────────────────────────────────────────────────

class Repository<T extends Table> implements BaseRepository<T> {
  constructor(private db: DbInstance, private table: T) {}

  // ── Read ──────────────────────────────────────────────────────────────────

  async find(
    filters?: FilterInput | BaseFilter[],
    options?: QueryOptions,
  ): Promise<any[]> {
    try {
      const selectCols = this.buildSelectColumns(options?.select);
      let query = selectCols
        ? this.db.select(selectCols).from(this.table)
        : this.db.select().from(this.table);

      const where = filters ? this.buildWhereClause(filters) : undefined;
      if (where) query = query.where(where);

      if (options?.order) {
        const clauses = this.buildOrderClauses(options.order);
        if (clauses.length) query = query.orderBy(...clauses);
      }

      if (options?.pagination) {
        const { page = 1, limit = 10 } = options.pagination;
        query = query.limit(limit).offset((page - 1) * limit);
      }

      return await query;
    } catch (error) {
      throw new ORMError(`Error in find: ${this.msg(error)}`);
    }
  }

  /**
   * Fetch a page of results together with full pagination metadata.
   * Runs the data query and COUNT query in parallel for efficiency.
   *
   * @example
   * const { data, meta } = await repo.paginate(
   *   [['status', '=', 'active']],
   *   { pagination: { page: 2, limit: 20 }, order: ['createdAt', 'desc'] },
   * );
   *
   * // meta:
   * // {
   * //   total: 83, page: 2, limit: 20, totalPages: 5,
   * //   hasNextPage: true, hasPrevPage: true,
   * //   nextPage: 3, prevPage: 1,
   * // }
   */
  async paginate(
    filters?: FilterInput | BaseFilter[],
    options?: QueryOptions,
  ): Promise<PaginatedResult> {
    try {
      const { page = 1, limit = 10 } = options?.pagination ?? {};

      if (page < 1)  throw new ValidationError('page must be >= 1');
      if (limit < 1) throw new ValidationError('limit must be >= 1');

      const where      = filters ? this.buildWhereClause(filters) : undefined;
      const selectCols = this.buildSelectColumns(options?.select);

      // Build data query
      let dataQuery = selectCols
        ? this.db.select(selectCols).from(this.table)
        : this.db.select().from(this.table);

      // Build count query (always SELECT *, filters still apply)
      let countQuery = this.db
        .select({ count: sql<number>`count(*)` })
        .from(this.table);

      if (where) {
        dataQuery  = dataQuery.where(where);
        countQuery = countQuery.where(where);
      }

      if (options?.order) {
        const clauses = this.buildOrderClauses(options.order);
        if (clauses.length) dataQuery = dataQuery.orderBy(...clauses);
      }

      dataQuery = dataQuery.limit(limit).offset((page - 1) * limit);

      // Run both queries in parallel
      const [data, countResult] = await Promise.all([dataQuery, countQuery]);

      const total      = Number(countResult[0].count);
      const totalPages = total > 0 ? Math.ceil(total / limit) : 0;

      const meta: PaginationMeta = {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
        nextPage:    page < totalPages ? page + 1 : null,
        prevPage:    page > 1         ? page - 1 : null,
      };

      return { data, meta };
    } catch (error) {
      if (error instanceof ORMError) throw error;
      throw new ORMError(`Error in paginate: ${this.msg(error)}`);
    }
  }

  async findOne(
    filters?: FilterInput | BaseFilter[],
    options?: QueryOptions,
  ): Promise<any | null> {
    const results = await this.find(filters, {
      ...options,
      pagination: { page: 1, limit: 1 },
    });
    return results[0] ?? null;
  }

  async findById(id: any): Promise<any | null> {
    const result = await this.db
      .select()
      .from(this.table)
      .where(this.idCondition(id))
      .limit(1);
    return result[0] ?? null;
  }

  async count(filters?: FilterInput | BaseFilter[]): Promise<number> {
    try {
      let query = this.db
        .select({ count: sql<number>`count(*)` })
        .from(this.table);

      if (filters) {
        const where = this.buildWhereClause(filters);
        if (where) query = query.where(where);
      }

      const result = await query;
      return Number(result[0].count);
    } catch (error) {
      throw new ORMError(`Error in count: ${this.msg(error)}`);
    }
  }

  // ── Write ─────────────────────────────────────────────────────────────────

  async create(data: any): Promise<any> {
    try {
      console.log("request", data);
      const result = await this.db.insert(this.table).values(data).returning();
      return result[0];
    } catch (error) {
      throw new ORMError(`Error in create: ${this.msg(error)}`);
    }
  }

  async createMany(data: any[]): Promise<any[]> {
    try {
      if (data.length === 0) return [];
      return await this.db.insert(this.table).values(data).returning();
    } catch (error) {
      throw new ORMError(`Error in createMany: ${this.msg(error)}`);
    }
  }

  async update(id: any, data: any): Promise<any> {
    try {
      const result = await this.db
        .update(this.table)
        .set(data)
        .where(this.idCondition(id))
        .returning();

      if (result.length === 0) throw new NotFoundError(`Record with id ${id} not found`);
      return result[0];
    } catch (error) {
      if (error instanceof ORMError) throw error;
      throw new ORMError(`Error in update: ${this.msg(error)}`);
    }
  }

  async updateWhere(filters: FilterInput | BaseFilter[], data: any): Promise<any[]> {
    try {
      const where = this.buildWhereClause(filters);
      if (!where) throw new ValidationError('updateWhere requires at least one filter');
      return await this.db.update(this.table).set(data).where(where).returning();
    } catch (error) {
      if (error instanceof ORMError) throw error;
      throw new ORMError(`Error in updateWhere: ${this.msg(error)}`);
    }
  }

  async upsert(data: any, conflictTarget: string[]): Promise<any> {
    try {
      const conflictCols = conflictTarget.map((col) => {
        const column = this.getColumn(col);
        if (!column) throw new ValidationError(`Column "${col}" not found in table`);
        return column;
      });

      const result = await this.db
        .insert(this.table)
        .values(data)
        .onConflictDoUpdate({ target: conflictCols, set: data })
        .returning();

      return result[0];
    } catch (error) {
      if (error instanceof ORMError) throw error;
      throw new ORMError(`Error in upsert: ${this.msg(error)}`);
    }
  }

  async delete(id: any): Promise<boolean> {
    try {
      const result = await this.db
        .delete(this.table)
        .where(this.idCondition(id))
        .returning();
      return result.length > 0;
    } catch (error) {
      throw new ORMError(`Error in delete: ${this.msg(error)}`);
    }
  }

  async deleteWhere(filters: FilterInput | BaseFilter[]): Promise<number> {
    try {
      const where = this.buildWhereClause(filters);
      if (!where) throw new ValidationError('deleteWhere requires at least one filter');
      const result = await this.db.delete(this.table).where(where).returning();
      return result.length;
    } catch (error) {
      if (error instanceof ORMError) throw error;
      throw new ORMError(`Error in deleteWhere: ${this.msg(error)}`);
    }
  }

  // ── Transaction ───────────────────────────────────────────────────────────

  transaction<R>(fn: (tx: DbInstance) => Promise<R>): Promise<R> {
    return this.db.transaction(fn);
  }

  // ── Private helpers ───────────────────────────────────────────────────────

  private idCondition(id: any): SQL {
    const col = this.getColumn('id');
    if (!col) throw new ValidationError('Table must have an "id" column');
    return eq(col, id);
  }

  /** Resolve column by JS property name (camelCase) or DB column name (snake_case). */
  private getColumn(columnName: string): AnyColumn | undefined {
    const direct = (this.table as any)[columnName];
    if (direct && typeof direct === 'object' && direct.name) return direct;

    for (const key of Object.keys(this.table as any)) {
      const col = (this.table as any)[key];
      if (col && typeof col === 'object' && col.name === columnName) return col;
    }

    return undefined;
  }

  /** Returns a { field: column } map for partial SELECT, or undefined for SELECT *. */
  private buildSelectColumns(fields?: string[]): Record<string, AnyColumn> | undefined {
    if (!fields || fields.length === 0) return undefined;

    const map: Record<string, AnyColumn> = {};
    for (const field of fields) {
      const col = this.getColumn(field);
      if (!col) throw new ValidationError(`Column "${field}" not found in table`);
      map[field] = col;
    }
    return map;
  }

  private buildWhereClause(filters: FilterInput | BaseFilter[]): SQL | undefined {
    if (this.isLogicalFilter(filters)) {
      return this.buildLogicalFilter(filters as LogicalFilter);
    }

    if (Array.isArray(filters)) {
      // Array of multiple filters → [['field', val], ['field2', 'op', val2], ...]
      if (filters.length > 0 && Array.isArray(filters[0])) {
        const conditions: SQL[] = [];
        for (const f of filters as BaseFilter[]) {
          const c = this.buildFilterCondition(f);
          if (c) conditions.push(c);
        }
        return conditions.length > 0 ? and(...conditions) : undefined;
      }
      // Single filter → ['field', val] or ['field', 'op', val]
      return this.buildFilterCondition(filters as BaseFilter);
    }

    return undefined;
  }

  private isLogicalFilter(input: any): input is LogicalFilter {
    return (
      input !== null &&
      typeof input === 'object' &&
      !Array.isArray(input) &&
      ('and' in input || 'or' in input)
    );
  }

  private buildLogicalFilter(filter: LogicalFilter): SQL | undefined {
    const isAnd      = 'and' in filter;
    const items      = isAnd ? (filter as AndFilter).and : (filter as OrFilter).or;
    const combinator = isAnd ? and : or;
    const conditions: SQL[] = [];

    for (const sub of items) {
      const c = this.buildWhereClause(sub);
      if (c) conditions.push(c);
    }

    return conditions.length > 0 ? combinator(...conditions) : undefined;
  }

  private buildFilterCondition(filter: BaseFilter): SQL | undefined {
    const isSimple = filter.length === 2;
    const field    = filter[0] as string;
    const operator = (isSimple ? '=' : filter[1]) as Operator;
    const value    = isSimple ? filter[1] : filter[2];

    const col = this.getColumn(field);
    if (!col) throw new ValidationError(`Column "${field}" not found in table`);

    switch (operator) {
      case '=':           return eq(col, value);
      case '!=':          return ne(col, value);
      case 'in':          return inArray(col, Array.isArray(value) ? value : [value]);
      case 'not_in':      return notInArray(col, Array.isArray(value) ? value : [value]);
      case 'gt':          return gt(col, value);
      case 'lt':          return lt(col, value);
      case 'gte':         return gte(col, value);
      case 'lte':         return lte(col, value);
      case 'like':        return like(col, value);
      case 'ilike':       return ilike(col, value);
      case 'is_null':     return isNull(col);
      case 'is_not_null': return isNotNull(col);
      case 'between':
        if (!Array.isArray(value) || value.length !== 2)
          throw new ValidationError('"between" requires a [min, max] tuple');
        return and(gte(col, value[0]), lte(col, value[1]));
      case 'not_between':
        if (!Array.isArray(value) || value.length !== 2)
          throw new ValidationError('"not_between" requires a [min, max] tuple');
        return or(lt(col, value[0]), gt(col, value[1]));
      default:
        throw new ValidationError(`Unknown operator: ${operator}`);
    }
  }

  private buildOrderClauses(order: Order | Order[]): SQL[] {
    const isSingle = typeof order[0] === 'string';
    const list     = (isSingle ? [order] : order) as Order[];
    const clauses: SQL[] = [];

    for (const [field, dir = 'asc'] of list) {
      const col = this.getColumn(field);
      if (!col) throw new ValidationError(`Column "${field}" not found in table`);
      clauses.push(dir === 'asc' ? asc(col) : desc(col));
    }

    return clauses;
  }

  private msg(error: unknown): string {
    if (error instanceof Error) return error.message;
    if (typeof error === 'string') return error;
    return 'Unknown error occurred';
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// BaseService
// ─────────────────────────────────────────────────────────────────────────────

export abstract class BaseService<T extends Table> {
  protected repository: BaseRepository<T>;

  constructor(protected orm: CustomORM, protected table: T) {
    this.repository = orm.repository(table);
  }

  find(filters?: FilterInput | BaseFilter[], options?: QueryOptions) {
    return this.repository.find(filters, options);
  }

  /**
   * Fetch a page of data with full pagination metadata.
   *
   * @example
   * const { data, meta } = await this.paginate(
   *   [['isActive', true]],
   *   { pagination: { page: 1, limit: 20 }, order: ['createdAt', 'desc'] },
   * );
   */
  paginate(filters?: FilterInput | BaseFilter[], options?: QueryOptions) {
    return this.repository.paginate(filters, options);
  }

  findOne(filters?: FilterInput | BaseFilter[], options?: QueryOptions) {
    return this.repository.findOne(filters, options);
  }

  findById(id: any) {
    return this.repository.findById(id);
  }

  count(filters?: FilterInput | BaseFilter[]) {
    return this.repository.count(filters);
  }

  create(data: any) {
    return this.repository.create(data);
  }

  createMany(data: any[]) {
    return this.repository.createMany(data);
  }

  update(id: any, data: any) {
    return this.repository.update(id, data);
  }

  updateWhere(filters: FilterInput | BaseFilter[], data: any) {
    return this.repository.updateWhere(filters, data);
  }

  upsert(data: any, conflictTarget: string[]) {
    return this.repository.upsert(data, conflictTarget);
  }

  delete(id: any) {
    return this.repository.delete(id);
  }

  deleteWhere(filters: FilterInput | BaseFilter[]) {
    return this.repository.deleteWhere(filters);
  }

  transaction<R>(fn: (tx: DbInstance) => Promise<R>) {
    return this.repository.transaction(fn);
  }
}