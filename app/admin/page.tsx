"use client";
import React, { useEffect, useState } from "react";
import getCurrentUser from "@/lib/actions/getCurrentUser";

interface User {
  email: string;
  role: string;
}

const AdminPage = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const user = await getCurrentUser();
      setCurrentUser(user);
      setLoading(false);
    };

    fetchUser();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!currentUser) {
    return <p>Unauthorized</p>;
  }

  if (currentUser?.role === "admin") {
    return <p>Authorized</p>;
  }

  return <p>Unauthorized</p>;
};

export default AdminPage;
