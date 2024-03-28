import { NextResponse } from "next/server";

import {
  getLowestPrice,
  getHighestPrice,
  getAveragePrice,
  getEmailNotifType,
} from "@/lib/utils";
import { connectToDB } from "@/lib/mongoose";
import Product from "@/lib/models/product.model";
import { scrapeAmazonProduct } from "@/lib/scraper";
import { generateEmailBody, sendEmail } from "@/lib/nodemailer";

export const maxDuration = 5; // This function can run for a maximum of 300 seconds
export const dynamic = "force-dynamic";
export const revalidate = 0;
import mongoose from "mongoose";

export async function GET(request: Request) {
  try {
    connectToDB();

    const products = await Product.find({});

    if (!products) throw new Error("No product fetched");

    // ======================== 1 SCRAPE LATEST PRODUCT DETAILS & UPDATE DB

    return NextResponse.json({
      message: "Ok",
      data: products,
    });
  } catch (error: any) {
    throw new Error(`Failed to get all products: ${error.message}`);
  }
}

export async function POST(request: Request) {
  try {
    connectToDB();

    if (!request) {
      return NextResponse.json({
        message: "No request",
      });
    }
    const body = await request.json();

    const { id, price } = body;
    console.log(typeof id, typeof price);

    const objectId = new mongoose.Types.ObjectId(id);

    //Find the product by ID and update its price
    const updatedProduct = await Product.findByIdAndUpdate(
      objectId,

      {
        $set: { currentPrice: price }, // Use $set operator to specify the field to update
      },
      { new: true } // This option returns the document in its updated form
    );

    if (!updatedProduct) {
      return NextResponse.json({
        message: "No updatedProducts",
      });
    }

    return NextResponse.json({
      message: "Ok",
    });
  } catch (error) {
    return NextResponse.json({
      message: error,
      body: "eror",
    });
  }
}
