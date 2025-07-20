import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPass = process.env.ADMIN_PASSWORD;

        if (
          credentials?.email === adminEmail &&
          credentials?.password === adminPass
        ) {
          return { id: "1", name: "Admin", email: adminEmail };
        }
        return null;
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
};

// ✅ Export both the handler and authOptions
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST};
