// pages/api/auth/[...nextauth].js
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { authenticateUser } from "../../../utils/auth";

export default NextAuth({
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", required: true },
        password: { label: "Password", type: "password", required: true },
      },
      async authorize(credentials) {
        // Validate user credentials against the "database"
        const user = await authenticateUser(credentials.email, credentials.password);
        if (!user) return null;
        return user;
      },
    }),
  ],
  pages: {
    signIn: "/signin", // use our custom sign-in page
  },
  callbacks: {
    async jwt({ token, user }) {
      // On first sign in, add user info to token
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      // Attach token info to session
      if (token) {
        session.user.id = token.id;
        session.user.email = token.email;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Build an absolute URL for redirection using NEXT_PUBLIC_NEXTAUTH_URL if available
      const base = process.env.NEXT_PUBLIC_NEXTAUTH_URL || baseUrl;
      return `${base}/pollingapp`;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
});
