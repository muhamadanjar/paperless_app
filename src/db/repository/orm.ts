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

// ─────────────────────────────────────────────
// Type definitions
// ─────────────────────────────────────────────

export type Table = PgTable | MySqlTable | SQLiteTable;
export type DbInstance = any; // Drizzle DB instance

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

export type SimpleFilter = [string, any];           // [field, value] — defaults to '='
export type ComplexFilter = [string, Operator, any]; // [field, operator, value]
export type BaseFilter = SimpleFilter | ComplexFilter;

export type AndFilter = { and: FilterInput[] };
export type OrFilter = { or: FilterInput[] };
export type LogicalFilter = AndFilter | OrFilter;

export type FilterInput = BaseFilter | LogicalFilter;

export type OrderDirection = 'asc' | 'desc';
export type Order = [string, OrderDirection?];

export interface Pagination {
  page?: number;
  limit?: number;
}

export interface QueryOptions {
  order?: Order | Order[];
  pagination?: Pagination;
  select?: string[];
}

// ─────────────────────────────────────────────
// Error classes
// ─────────────────────────────────────────────

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

// ─────────────────────────────────────────────
// Repository interface
// ─────────────────────────────────────────────

export interface BaseRepository<T extends Table> {
  find(filters?: FilterInput | BaseFilter[], options?: QueryOptions): Promise<any[]>;
  findOne(filters?: FilterInput | BaseFilter[], options?: QueryOptions): Promise<any | null>;
  findById(id: any): Promise<any | null>;
  create(data: any): Promise<any>;
  createMany(data: any[]): Promise<any[]>;
  update(id: any, data: any): Promise<any>;
  updateWhere(filters: FilterInput | BaseFilter[], data: any): Promise<any[]>;
  upsert(data: any, conflictTarget: string[]): Promise<any>;
  delete(id: any): Promise<boolean>;
  deleteWhere(filters: FilterInput | BaseFilter[]): Promise<number>;
  count(filters?: FilterInput | BaseFilter[]): Promise<number>;
  transaction<R>(fn: (tx: DbInstance) => Promise<R>): Promise<R>;
}

// ─────────────────────────────────────────────
// CustomORM — main entry point
// ─────────────────────────────────────────────

export class CustomORM {
  private repositoryCache = new WeakMap<Table, Repository<any>>();

  constructor(private db: DbInstance) {}

  /** Return (or create) a cached repository for the given table */
  repository<T extends Table>(table: T): BaseRepository<T> {
    if (!this.repositoryCache.has(table)) {
      this.repositoryCache.set(table, new Repository<T>(this.db, table));
    }
    return this.repositoryCache.get(table) as Repository<T>;
  }

  // Convenience pass-throughs
  async read<T extends Table>(table: T, filters?: FilterInput | BaseFilter[], options?: QueryOptions) {
    return this.repository(table).find(filters, options);
  }
  async findOne<T extends Table>(table: T, filters?: FilterInput | BaseFilter[], options?: QueryOptions) {
    return this.repository(table).findOne(filters, options);
  }
  async findById<T extends Table>(table: T, id: any) {
    return this.repository(table).findById(id);
  }
  async create<T extends Table>(table: T, data: any) {
    return this.repository(table).create(data);
  }
  async createMany<T extends Table>(table: T, data: any[]) {
    return this.repository(table).createMany(data);
  }
  async update<T extends Table>(table: T, id: any, data: any) {
    return this.repository(table).update(id, data);
  }
  async updateWhere<T extends Table>(table: T, filters: FilterInput | BaseFilter[], data: any) {
    return this.repository(table).updateWhere(filters, data);
  }
  async upsert<T extends Table>(table: T, data: any, conflictTarget: string[]) {
    return this.repository(table).upsert(data, conflictTarget);
  }
  async delete<T extends Table>(table: T, id: any) {
    return this.repository(table).delete(id);
  }
  async deleteWhere<T extends Table>(table: T, filters: FilterInput | BaseFilter[]) {
    return this.repository(table).deleteWhere(filters);
  }
  async count<T extends Table>(table: T, filters?: FilterInput | BaseFilter[]) {
    return this.repository(table).count(filters);
  }
  async transaction<R>(fn: (tx: DbInstance) => Promise<R>): Promise<R> {
    return this.db.transaction(fn);
  }
}

// ─────────────────────────────────────────────
// Repository implementation
// ─────────────────────────────────────────────

class Repository<T extends Table> implements BaseRepository<T> {
  constructor(private db: DbInstance, private table: T) {}

  // ── find ──────────────────────────────────

  async find(
    filters?: FilterInput | BaseFilter[],
    options?: QueryOptions
  ): Promise<any[]> {
    try {
      // Build SELECT columns
      const columns = this.buildSelectColumns(options?.select);
      let query = columns
        ? this.db.select(columns).from(this.table)
        : this.db.select().from(this.table);

      if (filters) {
        const where = this.buildWhereClause(filters);
        if (where) query = query.where(where);
      }

      if (options?.order) {
        const orderClauses = this.buildOrderClauses(options.order);
        if (orderClauses.length > 0) query = query.orderBy(...orderClauses);
      }

      if (options?.pagination) {
        const { page = 1, limit = 10 } = options.pagination;
        query = query.limit(limit).offset((page - 1) * limit);
      }

      return await query;
    } catch (error) {
      throw new ORMError(`Error executing find query: ${this.msg(error)}`);
    }
  }

  async findOne(
    filters?: FilterInput | BaseFilter[],
    options?: QueryOptions
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

  // ── write ─────────────────────────────────

  async create(data: any): Promise<any> {
    try {
      const result = await this.db.insert(this.table).values(data).returning();
      return result[0];
    } catch (error) {
      throw new ORMError(`Error creating record: ${this.msg(error)}`);
    }
  }

  async createMany(data: any[]): Promise<any[]> {
    try {
      if (data.length === 0) return [];
      return await this.db.insert(this.table).values(data).returning();
    } catch (error) {
      throw new ORMError(`Error creating records: ${this.msg(error)}`);
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
      if (error instanceof NotFoundError) throw error;
      throw new ORMError(`Error updating record: ${this.msg(error)}`);
    }
  }

  async updateWhere(filters: FilterInput | BaseFilter[], data: any): Promise<any[]> {
    try {
      const where = this.buildWhereClause(filters);
      if (!where) throw new ValidationError('updateWhere requires at least one filter');

      return await this.db.update(this.table).set(data).where(where).returning();
    } catch (error) {
      if (error instanceof ORMError) throw error;
      throw new ORMError(`Error updating records: ${this.msg(error)}`);
    }
  }

  /**
   * Insert or update on conflict.
   * @param conflictTarget - column names that form the unique constraint
   */
  async upsert(data: any, conflictTarget: string[]): Promise<any> {
    try {
      const conflictColumns = conflictTarget.map((col) => {
        const column = this.getColumn(col);
        if (!column) throw new ValidationError(`Column "${col}" not found in table`);
        return column;
      });

      const result = await this.db
        .insert(this.table)
        .values(data)
        .onConflictDoUpdate({
          target: conflictColumns,
          set: data,
        })
        .returning();

      return result[0];
    } catch (error) {
      if (error instanceof ORMError) throw error;
      throw new ORMError(`Error upserting record: ${this.msg(error)}`);
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
      throw new ORMError(`Error deleting record: ${this.msg(error)}`);
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
      throw new ORMError(`Error deleting records: ${this.msg(error)}`);
    }
  }

  // ── aggregate ─────────────────────────────

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
      throw new ORMError(`Error counting records: ${this.msg(error)}`);
    }
  }

  // ── transaction ───────────────────────────

  async transaction<R>(fn: (tx: DbInstance) => Promise<R>): Promise<R> {
    return this.db.transaction(fn);
  }

  // ─────────────────────────────────────────
  // Private helpers
  // ─────────────────────────────────────────

  private idCondition(id: any): SQL {
    const col = this.getColumn('id');
    if (!col) throw new ValidationError('Table must have an "id" column');
    return eq(col, id);
  }

  /**
   * Resolve a column by its JS property name (camelCase) or DB column name (snake_case).
   */
  private getColumn(columnName: string): AnyColumn | undefined {
    const direct = (this.table as any)[columnName];
    if (direct && typeof direct === 'object' && direct.name) return direct;

    for (const key of Object.keys(this.table as any)) {
      const col = (this.table as any)[key];
      if (col && typeof col === 'object' && col.name === columnName) return col;
    }

    return undefined;
  }

  /**
   * Build a { col: column } map for SELECT when specific fields are requested.
   * Returns undefined (= SELECT *) when no fields are specified.
   */
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
      // Array of filters  →  [['field', val], ['field2', 'op', val2], ...]
      if (filters.length > 0 && Array.isArray(filters[0])) {
        const conditions: SQL[] = [];
        for (const f of filters as BaseFilter[]) {
          const c = this.buildFilterCondition(f);
          if (c) conditions.push(c);
        }
        return conditions.length > 0 ? and(...conditions) : undefined;
      }
      // Single filter  →  ['field', val]  or  ['field', 'op', val]
      return this.buildFilterCondition(filters as BaseFilter);
    }

    return undefined;
  }

  private isLogicalFilter(input: any): input is LogicalFilter {
    return input !== null && typeof input === 'object' && !Array.isArray(input)
      && ('and' in input || 'or' in input);
  }

  private buildLogicalFilter(filter: LogicalFilter): SQL | undefined {
    const key = 'and' in filter ? 'and' : 'or';
    const combinator = key === 'and' ? and : or;
    const conditions: SQL[] = [];

    for (const sub of filter[key as keyof LogicalFilter] as FilterInput[]) {
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
      case '=':          return eq(col, value);
      case '!=':         return ne(col, value);
      case 'in':         return inArray(col, Array.isArray(value) ? value : [value]);
      case 'not_in':     return notInArray(col, Array.isArray(value) ? value : [value]);
      case 'gt':         return gt(col, value);
      case 'lt':         return lt(col, value);
      case 'gte':        return gte(col, value);
      case 'lte':        return lte(col, value);
      case 'like':       return like(col, value);
      case 'ilike':      return ilike(col, value);          // FIX: tambah ilike
      case 'is_null':    return isNull(col);                // FIX: pakai isNull()
      case 'is_not_null':return isNotNull(col);             // FIX: pakai isNotNull()
      case 'between':                                        // FIX: implementasi between
        if (!Array.isArray(value) || value.length !== 2) {
          throw new ValidationError(`Operator "between" requires a [min, max] array`);
        }
        return and(gte(col, value[0]), lte(col, value[1]));
      case 'not_between':                                    // FIX: implementasi not_between
        if (!Array.isArray(value) || value.length !== 2) {
          throw new ValidationError(`Operator "not_between" requires a [min, max] array`);
        }
        return or(lt(col, value[0]), gt(col, value[1]));
      default:
        throw new ValidationError(`Unknown operator: ${operator}`);
    }
  }

  private buildOrderClauses(order: Order | Order[]): SQL[] {
    // Detect single Order vs Order[]
    const isMulti = Array.isArray(order[0]);
    const orderList = (isMulti ? order : [order]) as Order[];
    const clauses: SQL[] = [];

    for (const [field, direction = 'asc'] of orderList) {
      const col = this.getColumn(field);
      if (!col) throw new ValidationError(`Column "${field}" not found in table`);
      clauses.push(direction === 'asc' ? asc(col) : desc(col));
    }

    return clauses;
  }

  private msg(error: unknown): string {
    if (error instanceof Error) return error.message;
    if (typeof error === 'string') return error;
    return 'Unknown error occurred';
  }
}

// ─────────────────────────────────────────────
// BaseService
// ─────────────────────────────────────────────

export abstract class BaseService<T extends Table> {
  protected repository: BaseRepository<T>;

  constructor(protected orm: CustomORM, protected table: T) {
    this.repository = orm.repository(table);
  }

  find(filters?: FilterInput | BaseFilter[], options?: QueryOptions) {
    return this.repository.find(filters, options);
  }
  findOne(filters?: FilterInput | BaseFilter[], options?: QueryOptions) {
    return this.repository.findOne(filters, options);
  }
  findById(id: any) {
    return this.repository.findById(id);
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
  count(filters?: FilterInput | BaseFilter[]) {
    return this.repository.count(filters);
  }
  transaction<R>(fn: (tx: DbInstance) => Promise<R>) {
    return this.repository.transaction(fn);
  }
}