"use client";
import React, { useEffect, useState } from "react";
import getCurrentUser from "@/lib/actions/getCurrentUser";
import { getAllUsers } from "@/lib/actions";

interface User {
  email: string;
  role: string;
}
interface User {
  email: string;
  role: string;
  store?: string;
  password: string; // Add password field to the User interface
}

interface Store {
  name: string;
  websiteURL: string;
  priceTag: string;
  stockTag: string;
  owner?: string; // Assuming this will be the user ID of the owner
}

interface Store {
  name: string;
  websiteURL: string;
  priceTag: string;
  stockTag: string;
  owner?: string; // Optional owner field, assuming it will be the user ID
}

const AdminPage = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[] | null>([]);

  const [user, setUser] = useState<User>({
    email: "",
    role: "",
    store: "",
    password: "",
  });

  const [store, setStore] = useState<Store>({
    name: "",
    websiteURL: "",
    priceTag: "",
    stockTag: "",
    owner: "",
  });

  // Handle changes for the user form
  const handleStoreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStore({ ...store, [e.target.name]: e.target.value });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent the default form submit action
    const response = await fetch("/api/register/user", {
      method: "POST", // Specify the request method
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user), // Use the 'user' state directly
    });

    const data = await response.json();
    console.log(data); // Log or handle the response data as needed
    setUser({ email: "", role: "", store: "", password: "" }); // Reset form fields
  };
  const handleStoreSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent the default form submit action
    const response = await fetch("/api/register/store", {
      method: "POST", // Specify the request method
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(store), // Use the 'user' state directly
    });

    const data = await response.json();

    // Implement your API call to add a store here
    console.log("Adding store:", data);
    // Reset store fields after submission
    setStore({
      name: "",
      websiteURL: "",
      priceTag: "",
      stockTag: "",
      owner: "",
    });
  };

  useEffect(() => {
    const fetchUsers = async () => {
      const users = await getAllUsers();
      setUsers(users);
    };

    const fetchUser = async () => {
      const user = await getCurrentUser();
      setCurrentUser(user);
      setLoading(false);
    };

    fetchUser();
    fetchUsers();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!currentUser) {
    return <p>Unauthorized</p>;
  }

  if (currentUser?.role === "admin") {
    return (
      <>
        <div>
          <h1>Admin Interface</h1>
          <form onSubmit={handleSubmit}>
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={user.email}
              onChange={handleChange}
              required
            />
            <input
              name="password"
              type="password"
              placeholder="Password"
              value={user.password}
              onChange={handleChange}
              required
            />
            <select
              name="role"
              value={user.role}
              onChange={handleChange}
              required
            >
              <option value="">Select Role</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
              <option value="seller">Seller</option>
            </select>
            <input
              name="store"
              placeholder="Store ID (optional)"
              value={user.store}
              onChange={handleChange}
            />

            <button type="submit">Add User</button>
          </form>

          {/* New form for adding a store */}
          <form onSubmit={handleStoreSubmit}>
            <input
              name="name"
              placeholder="Store Name"
              value={store.name}
              onChange={handleStoreChange}
              required
            />
            <input
              name="websiteURL"
              type="url"
              placeholder="Website URL"
              value={store.websiteURL}
              onChange={handleStoreChange}
              required
            />
            <input
              name="priceTag"
              placeholder="Price Tag Selector"
              value={store.priceTag}
              onChange={handleStoreChange}
            />
            <input
              name="stockTag"
              placeholder="Stock Tag Selector"
              value={store.stockTag}
              onChange={handleStoreChange}
            />
            {/* Assuming owner selection logic is handled elsewhere or not needed for this form */}
            <button type="submit">Add Store</button>
          </form>
          <div>
            {users.map((user, index) => (
              <div key={index}>
                {/* Render your product details here */}
                <p>{user.email}</p>
                <p>{user.role}</p>
                <p>{user.store}</p>
                {/* Add more product details as needed */}
              </div>
            ))}
          </div>
        </div>
      </>
    );
  }

  return <p>Unauthorized</p>;
};

export default AdminPage;
