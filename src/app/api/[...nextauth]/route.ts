import NextAuth from "next-auth";
import type { AuthOptions } from "next-auth";
import CredentialProvider from "next-auth/providers/credentials";

export const authOptions: AuthOptions = {
  providers: [
    CredentialProvider({
      name: "Crendential",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any, req) {
        if (typeof credentials !== "undefined") {
          const response = await authenticate(
            credentials.useraname,
            credentials.password
          );
          if (typeof response !== "undefined") {
            return { ...response.user, apiToken: response.token };
          }
        } else {
          return null;
        }
      },
    }),
  ],
  session: { strategy: "jwt" },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
