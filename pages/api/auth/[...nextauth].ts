// pages/api/auth/[...nextauth].js
import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { connectToDB } from "@/lib/mongoose"; // Your MongoDB connection logic
import User from "@/lib/models/user.model"; // Your User model

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await connectToDB(); // Ensure you're connected to your database

        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        const user = await User.findOne({
          email: credentials.email,
        });

        if (!user) {
          throw new Error("No user found with the entered email");
        }

        const isCorrectPassword = await user.isValidPassword(
          credentials.password
        );

        if (!isCorrectPassword) {
          throw new Error("Incorrect password");
        }

        // Return a safe subset of the user object that can be exposed to the client
        return user;
      },
    }),
  ],
  // The rest of your NextAuth config...
  debug: process.env.NODE_ENV === "development",
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);
