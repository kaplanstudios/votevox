import NextAuth from "next-auth";
import { CredentialsProvider } from "next-auth/providers";  // Updated import

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const user = { id: 1, email: credentials.email }; // Replace with real authentication logic

        if (user) {
          return user;
        } else {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt(token, user) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },
    async session(session, token) {
      if (token) {
        session.user.id = token.id;
        session.user.email = token.email;
      }
      return session;
    },
  },
  pages: {
    signIn: "/signin", // Specify the custom signin page
    error: "/signin", // Custom error page if necessary
  },
  secret: process.env.SECRET_KEY, // Make sure to set a secret key
});
