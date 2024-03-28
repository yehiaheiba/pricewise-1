import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { connectToDB } from "@/lib/mongoose"; // Make sure this is your database connection logic
import User from "@/lib/models/user.model"; // Import the User model

export async function POST(request: Request) {
  await connectToDB(); // Ensure MongoDB connection

  const body = await request.json();
  const { email, role, store, password } = body;

  const hashedPassword = await bcrypt.hash(password, 12);

  try {
    const user = new User({
      email,
      role,
      ...(role !== "admin" && { store }),
      hashedPassword,
    });

    await user.save(); // Save the user to the database

    // Modify the response as needed, exclude sensitive information
    const responseUser = {
      id: user._id,
      email: user.email,
    };

    return new Response(JSON.stringify(responseUser), {
      status: 201, // HTTP 201 Created
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    // Handle potential errors, such as email uniqueness constraint violation
    return new Response(JSON.stringify({ error: "Failed to create user" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
