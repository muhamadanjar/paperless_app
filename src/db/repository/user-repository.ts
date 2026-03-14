import { db } from "@/utils/db";
import { BaseService, CustomORM } from "./orm";
import { Table } from "@/db/schema";

export default class UserService extends BaseService<typeof Table.users>{

    constructor() {
        super(new CustomORM(db), Table.users);
    }
    async getByEmail(email: string) {
        return await this.findOne(['email', email]);
    }

    async getUsersByStatus(status: string, page: number = 1, limit: number = 10) {
        return await this.find(
        ['status', status],
        {
            order: [['created_at', 'desc']],
            pagination: { page, limit }
        }
        );
    }
    async activateUser(id: number) {
        return await this.update(id, { status: 'active', updated_at: new Date() });
    }

    // async generateResetPasswordToken(userId: string, expiredAt: Date, executor: PgDatabase<any, any, any> = db) {
    //     const result = await executor.insert(Table.resetPasswordToken).values({
    //         token: Math.random().toString(36).substring(2),
    //         expiredAt,
    //         userId,
    //     }).returning()
    //     return result[0];
    // }
}
