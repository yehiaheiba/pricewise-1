import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { connectToDB } from "@/lib/mongoose"; // Make sure this is your database connection logic
import User from "@/lib/models/user.model"; // Import the User model
import getCurrentUser from "@/lib/actions/getCurrentUser";
import Store from "@/lib/models/store.model";

export async function POST(request: Request) {
  const user = await getCurrentUser();

  if (user?.role == "admin") {
    await connectToDB(); // Ensure MongoDB connection

    const body = await request.json();
    const { name, websiteURL, priceTag, stockTag } = body;

    try {
      const store = new Store({
        name,
        websiteURL,
        priceTag,
        stockTag,
      });

      await store.save(); // Save the store to the database

      // Modify the response as needed
      const responseStore = {
        id: store._id,
        name: store.name,
        websiteURL: store.websiteURL,
      };

      return new Response(JSON.stringify(responseStore), {
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
  } else {
    return new Response(
      JSON.stringify({ error: "Couldnt retrieve current user to create user" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
