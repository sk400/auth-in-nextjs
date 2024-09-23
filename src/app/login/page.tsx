"use client";

import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const SignupPage = () => {
  const [error, setError] = useState("");
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    if (user.email.length > 0 && user.password.length > 0) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [user]);

  const onLogIn = async () => {
    try {
      setLoading(true);
      setButtonDisabled(true);

      const response = await axios.post("/api/users/login", user);

      if (response.data.success === true) {
        router.push("/profile");
      } else {
        setError(response.data.message);
        return;
      }

      setUser({
        email: "",
        password: "",
      });
    } catch (error: any) {
      console.log(error);
      setError(error.message);
    } finally {
      setButtonDisabled(false);
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    onLogIn();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser((prevValue) => {
      return {
        ...prevValue,
        [e.target.name]: e.target.value,
      };
    });
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-md shadow-md w-96"
      >
        <h1 className="text-3xl font-bold mb-4">
          {loading ? "Loading..." : "Log In"}
        </h1>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="email"
          >
            Email
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="email"
            type="email"
            name="email"
            value={user.email}
            onChange={handleChange}
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="password"
          >
            Password
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="password"
            type="password"
            name="password"
            value={user.password}
            onChange={handleChange}
          />
        </div>

        {error.length > 0 && (
          <p className="text-red-500 text-xs italic">{error}</p>
        )}
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
          type="submit"
          disabled={buttonDisabled}
        >
          Log in
        </button>
        <p className="text-xs  mt-5 text-center">
          Have not any account?{" "}
          <Link href="/signup" className="font-bold">
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
};

export default SignupPage;
