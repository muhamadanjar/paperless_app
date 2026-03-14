import NextAuth from "next-auth"
import { RoleType } from "./user";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface User {
    id: string;
    name: string;
    email: string;
    avatarUrl: string;
    role?: RoleType;
    isActive?: boolean;
  }
  interface Session {
    user: User;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: number;
    avatarUrl: string;
    role?: RoleType;
    isActive?: boolean;
  }
}
