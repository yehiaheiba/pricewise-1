"use server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import User from "@/lib/models/user.model"; // Adjust the import path to your User model
import { connectToDB } from "@/lib/mongoose"; // Ensure you have a utility function to handle DB connection

export async function getSession() {
  return await getServerSession(authOptions);
}

export default async function getCurrentUser() {
  await connectToDB(); // Ensure the database is connected

  try {
    const session = await getSession();

    if (!session?.user?.email) {
      return null;
    }

    const currentUser = await User.findOne({
      email: session.user.email,
    }).exec();

    if (!currentUser) {
      return null;
    }

    const user = { email: currentUser.email, role: currentUser.role };
    console.log(user);

    return user;
  } catch (error) {
    console.error("Error fetching current user:", error);
    return null;
  }
}
