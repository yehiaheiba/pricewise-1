"use client";

import Head from "next/head";
import Link from "next/link";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import getCurrentUser from "@/lib/actions/getCurrentUser";
import { signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    signIn("credentials", {
      ...data,
      redirect: false,
    }).then((callback) => {
      if (callback?.ok) {
        console.log("successfull");
      }
      if (callback?.error) {
        console.log("failed login");
      }
    });
  };
  useEffect(() => {
    async function redirect() {
      const currentUser = await getCurrentUser();
      console.log(currentUser);
      console.log("successful login");
      if (currentUser?.role == "admin") {
        router.push("/admin");
      } else if (currentUser?.role == "seller") {
        router.push("/seller");
      } else if (currentUser?.role == "buyer") {
        router.push("/");
      }
    }

    redirect();
  }, []);
  // Function to determine where to redirect the user based on their role
  return (
    <>
      <Head>
        <title>Login Page</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex flex-col items-center justify-center min-h-screen py-12 bg-gray-50 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <img
            className="w-18 h-18 mb-4"
            alt="Bootstrap logo"
            src="https://getbootstrap.com/docs/4.0/assets/brand/bootstrap-solid.svg"
          />
          <h1 className="mb-3 text-3xl font-medium text-center text-gray-900">
            Please sign in
          </h1>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="rounded-md shadow-sm">
              <input
                type="email"
                {...register("email", { required: "Email is required" })}
                className="relative block w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-none appearance-none rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="useremail@domain.com"
              />
            </div>
            <div className="rounded-md shadow-sm">
              <input
                type="password"
                {...register("password", { required: "Password is required" })}
                className="relative block w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-none appearance-none rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
              />
              {errors && <p className="text-red-500">{errors.message}</p>}
            </div>
            <div className="flex justify-between">
              <div className="text-sm">
                <Link href="/">
                  <p className="font-medium text-indigo-600 hover:text-indigo-500">
                    Forgot Password?
                  </p>
                </Link>
              </div>
            </div>
            <button
              type="submit"
              className="relative flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md group hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
