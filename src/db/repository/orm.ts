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
  and, 
  or, 
  asc, 
  desc,
  SQLWrapper,
  Column,
  AnyColumn,
  sql
} from 'drizzle-orm';
import { PgTable } from 'drizzle-orm/pg-core';
import { MySqlTable } from 'drizzle-orm/mysql-core';
import { SQLiteTable } from 'drizzle-orm/sqlite-core';

// Type definitions
export type Table = PgTable | MySqlTable | SQLiteTable;
export type DbInstance = any; // Drizzle DB instance type

// Operator types
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
  | 'between'
  | 'not_between'
  | 'is_null'
  | 'is_not_null';

// Filter types
export type SimpleFilter = [string, any]; // [field, value] - defaults to equal
export type ComplexFilter = [string, Operator, any]; // [field, operator, value]
export type BaseFilter = SimpleFilter | ComplexFilter;

// Logical operators
export type AndFilter = { and: FilterInput[] };
export type OrFilter = { or: FilterInput[] };
export type LogicalFilter = AndFilter | OrFilter;

// Combined filter type
export type FilterInput = BaseFilter | LogicalFilter;

// Order types
export type OrderDirection = 'asc' | 'desc';
export type Order = [string, OrderDirection?];

// Pagination type
export interface Pagination {
  page?: number;
  limit?: number;
}

// Query options
export interface QueryOptions {
  order?: Order | Order[];
  pagination?: Pagination;
  select?: string[]; // Fields to select
  joins?: any[]; // Join configurations
}

// Base repository interface
export interface BaseRepository<T extends Table> {
  find(filters?: FilterInput | BaseFilter[], options?: QueryOptions): Promise<any[]>;
  findOne(filters?: FilterInput | BaseFilter[], options?: QueryOptions): Promise<any | null>;
  findById(id: any): Promise<any | null>;
  create(data: any): Promise<any>;
  update(id: any, data: any): Promise<any>;
  delete(id: any): Promise<boolean>;
  count(filters?: FilterInput | BaseFilter[]): Promise<number>;
}

// Error classes
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

export class CustomORM {
  constructor(private db: DbInstance) {}

  /**
   * Create repository for a specific table
   */
  repository<T extends Table>(table: T): BaseRepository<T> {
    return new Repository<T>(this.db, table);
  }

  /**
   * Read records from table with filters and ordering
   */
  async read<T extends Table>(
    table: T,
    filters?: FilterInput | BaseFilter[],
    options?: QueryOptions
  ) {
    return await new Repository<T>(this.db, table).find(filters, options);
  }

  /**
   * Find one record
   */
  async findOne<T extends Table>(
    table: T,
    filters?: FilterInput | BaseFilter[],
    options?: QueryOptions
  ) {
    return await new Repository<T>(this.db, table).findOne(filters, options);
  }

  /**
   * Find by ID
   */
  async findById<T extends Table>(
    table: T,
    id: any
  ) {
    return await new Repository<T>(this.db, table).findById(id);
  }

  /**
   * Create a new record
   */
  async create<T extends Table>(
    table: T,
    data: any
  ) {
    return await new Repository<T>(this.db, table).create(data);
  }

  /**
   * Update a record by id
   */
  async update<T extends Table>(
    table: T,
    id: any,
     data: any
  ) {
    return await new Repository<T>(this.db, table).update(id, data);
  }

  /**
   * Delete a record by id
   */
  async delete<T extends Table>(
    table: T,
    id: any
  ) {
    return await new Repository<T>(this.db, table).delete(id);
  }

  /**
   * Count records with filters
   */
  async count<T extends Table>(
    table: T,
    filters?: FilterInput | BaseFilter[]
  ) {
    return await new Repository<T>(this.db, table).count(filters);
  }
}

// Repository implementation
class Repository<T extends Table> implements BaseRepository<T> {
  constructor(
    private db: DbInstance,
    private table: T
  ) {}

  async find(
    filters?: FilterInput | BaseFilter[],
    options?: QueryOptions
  ): Promise<any[]> {
    try {
      let query = this.db.select().from(this.table);

      // Apply filters
      if (filters) {
        const whereClause = this.buildWhereClause(filters);
        if (whereClause) {
          query = query.where(whereClause);
        }
      }

      // Apply ordering
      if (options?.order) {
        const orderClauses = this.buildOrderClauses(options.order);
        if (orderClauses.length > 0) {
          query = query.orderBy(...orderClauses);
        }
      }

      // Apply pagination
      if (options?.pagination) {
        const { page = 1, limit = 10 } = options.pagination;
        const offset = (page - 1) * limit;
        query = query.limit(limit).offset(offset);
      }

      return await query;
    } catch (error) {
      const errorMessage = this.getErrorMessage(error);
      throw new ORMError(`Error executing find query: ${errorMessage}`);
    }
  }

  async findOne(
    filters?: FilterInput | BaseFilter[],
    options?: QueryOptions
  ): Promise<any | null> {
    const results = await this.find(filters, { ...options, pagination: { page: 1, limit: 1 } });
    return results[0] || null;
  }

  async findById(id: any): Promise<any | null> {
    const result = await this.db
      .select()
      .from(this.table)
      .where(this.buildIdCondition(id))
      .limit(1);
    
    return result[0] || null;
  }

  async create(data: any): Promise<any> {
    try {
      const result = await this.db.insert(this.table).values(data).returning();
      return result[0];
    } catch (error) {
      console.log("error",error)
      const errorMessage = this.getErrorMessage(error);
      throw new ORMError(`Error creating record: ${errorMessage}`);
    }
  }

  async update(id: any, data: any): Promise<any> {
    try {
      const result = await this.db
        .update(this.table)
        .set(data)
        .where(this.buildIdCondition(id))
        .returning();
      
      if (result.length === 0) {
        throw new NotFoundError(`Record with id ${id} not found`);
      }
      
      return result[0];
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      const errorMessage = this.getErrorMessage(error);
      throw new ORMError(`Error updating record: ${errorMessage}`);
    }
  }

  async delete(id: any): Promise<boolean> {
    try {
      const result = await this.db
        .delete(this.table)
        .where(this.buildIdCondition(id))
        .returning();
      
      return result.length > 0;
    } catch (error) {
      const errorMessage = this.getErrorMessage(error);
      throw new ORMError(`Error deleting record: ${errorMessage}`);
    }
  }

  async count(filters?: FilterInput | BaseFilter[]): Promise<number> {
    try {
      let query = this.db.select({ count: sql<number>`count(*)` }).from(this.table);

      if (filters) {
        const whereClause = this.buildWhereClause(filters);
        if (whereClause) {
          query = query.where(whereClause);
        }
      }

      const result = await query;
      return Number(result[0].count);
    } catch (error) {
      const errorMessage = this.getErrorMessage(error);
      throw new ORMError(`Error counting records: ${errorMessage}`);
    }
  }

  /**
   * Helper method to build ID condition
   */
  private buildIdCondition(id: any): SQL {
    // Access the 'id' column from the table
    const idColumn = this.getColumn('id');
    if (!idColumn) {
      throw new ValidationError('Table must have an "id" column');
    }
    return eq(idColumn, id);
  }

  /**
   * Get column by name
   * This method is designed to work with Drizzle table schema
   * Drizzle uses the property name (camelCase) but maps to DB column (snake_case)
   */
  private getColumn(columnName: string): AnyColumn | undefined {
    // In Drizzle, we can access columns by their property name (camelCase)
    const column = (this.table as any)[columnName];
    
    // Check if it's a valid Drizzle column
    if (column && typeof column === 'object' && column.name) {
      return column;
    }
    
    // If not found, try to find by DB column name (snake_case)
    // This is a fallback for cases where the property name doesn't match
    const tableKeys = Object.keys(this.table);
    for (const key of tableKeys) {
      const col = (this.table as any)[key];
      if (col && typeof col === 'object' && col.name === columnName) {
        return col;
      }
    }
    
    return undefined;
  }

  /**
   * Type guard and helper to get error message
   */
  private getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
      return error.message;
    }
    if (typeof error === 'string') {
      return error;
    }
    return 'Unknown error occurred';
  }

  /**
   * Build WHERE clause from filters
   */
  private buildWhereClause(filters: FilterInput | BaseFilter[]): SQL | undefined {
    if (this.isLogicalFilter(filters)) {
      return this.buildLogicalFilter(filters as LogicalFilter);
    }

    if (Array.isArray(filters)) {
      if (filters.length > 0 && Array.isArray(filters[0])) {
        const conditions: SQL[] = [];
        for (const filter of filters as BaseFilter[]) {
          const condition = this.buildFilterCondition(filter);
          if (condition) {
            conditions.push(condition);
          }
        }
        return conditions.length > 0 ? and(...conditions) : undefined;
      }
      return this.buildFilterCondition(filters as BaseFilter);
    }

    return undefined;
  }

  /**
   * Check if input is a logical filter (AND/OR)
   */
  private isLogicalFilter(input: any): input is LogicalFilter {
    return input && typeof input === 'object' && ('and' in input || 'or' in input);
  }

  /**
   * Build logical filter (AND/OR)
   */
  private buildLogicalFilter(filter: LogicalFilter): SQL | undefined {
    if ('and' in filter) {
      const conditions: SQL[] = [];
      for (const subFilter of filter.and) {
        const condition = this.buildWhereClause(subFilter);
        if (condition) {
          conditions.push(condition);
        }
      }
      return conditions.length > 0 ? and(...conditions) : undefined;
    }

    if ('or' in filter) {
      const conditions: SQL[] = [];
      for (const subFilter of filter.or) {
        const condition = this.buildWhereClause(subFilter);
        if (condition) {
          conditions.push(condition);
        }
      }
      return conditions.length > 0 ? or(...conditions) : undefined;
    }

    return undefined;
  }

  /**
   * Build single filter condition
   */
  private buildFilterCondition(filter: BaseFilter): SQL | undefined {
    const isSimpleFilter = filter.length === 2;
    const field = filter[0];
    const operator = isSimpleFilter ? '=' : filter[1] as Operator;
    const value = isSimpleFilter ? filter[1] : filter[2];

    const column = this.getColumn(field);
    if (!column) {
      throw new ValidationError(`Column ${field} not found in table`);
    }

    switch (operator) {
      case '=':
        return eq(column, value);
      case '!=':
        return ne(column, value);
      case 'in':
        return inArray(column, Array.isArray(value) ? value : [value]);
      case 'not_in':
        return notInArray(column, Array.isArray(value) ? value : [value]);
      case 'gt':
        return gt(column, value);
      case 'lt':
        return lt(column, value);
      case 'gte':
        return gte(column, value);
      case 'lte':
        return lte(column, value);
      case 'like':
        return like(column, value);
      case 'is_null':
        return eq(column, null);
      case 'is_not_null':
        return ne(column, null);
      default:
        throw new ValidationError(`Unknown operator: ${operator}`);
    }
  }

  /**
   * Build ORDER BY clauses
   */
  private buildOrderClauses(order: Order | Order[]): SQL[] {
    const orderArray = Array.isArray(order[0]) ? order : [order];
    const clauses: SQL[] = [];

    for (const [field, direction = 'asc'] of orderArray as Order[]) {
      const column = this.getColumn(field);
      if (!column) {
        throw new ValidationError(`Column ${field} not found in table`);
      }

      clauses.push(direction === 'asc' ? asc(column) : desc(column));
    }

    return clauses;
  }
}

// Base service class
export abstract class BaseService<T extends Table> {
  protected repository: BaseRepository<T>;

  constructor(protected orm: CustomORM, protected table: T) {
    this.repository = orm.repository(table);
  }

  async find(filters?: FilterInput | BaseFilter[], options?: QueryOptions) {
    return await this.repository.find(filters, options);
  }

  async findOne(filters?: FilterInput | BaseFilter[], options?: QueryOptions) {
    return await this.repository.findOne(filters, options);
  }

  async findById(id: any) {
    return await this.repository.findById(id);
  }

  async create(data:any) {
    return await this.repository.create(data);
  }

  async update(id: any, data: any) {
    return await this.repository.update(id, data);
  }

  async delete(id: any) {
    return await this.repository.delete(id);
  }

  async count(filters?: FilterInput | BaseFilter[]) {
    return await this.repository.count(filters);
  }
}

