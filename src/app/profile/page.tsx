"use client";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

interface User {
  _id: string;
  email: string;
  username: string;
  isAdmin: boolean;
  isVerified: boolean;
}

const ProfilePage = () => {
  const router = useRouter();
  const [userInfo, setUserInfo] = useState<User>();

  const logOut = async () => {
    try {
      const response = await axios.get("/api/users/logout");

      if (response.data.success === true) {
        router.push("/login");
      }
    } catch (error: any) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await axios.get("/api/users/me");
        setUserInfo(response.data.user);
      } catch (error: any) {
        console.log(error.message);
      }
    };
    getUser();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-gray-100">
      <div className="bg-white rounded-lg p-8 shadow-lg w-full lg:w-1/2">
        <h1 className="text-3xl font-bold mb-4">Profile</h1>
        <div className="flex flex-row mb-4">
          <div className="flex flex-col w-1/2">
            <p className="font-bold">Username:</p>
            <p className="font-bold">Email:</p>
            <p className="font-bold">Verified:</p>
            <p className="font-bold">Admin:</p>
          </div>
          <div className="flex flex-col w-1/2">
            <p className="">{userInfo?.username}</p>
            <p className="">{userInfo?.email}</p>
            <p className="">{userInfo?.isVerified ? "Yes" : "No"}</p>
            <p className="">{userInfo?.isAdmin ? "Yes" : "No"}</p>
          </div>
        </div>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={logOut}
        >
          Logout
        </button>
        <Link
          href="/"
          className="bg-gray-200 hover:bg-gray-300 text-black font-bold py-2 px-4 rounded mt-4"
        >
          Go back home
        </Link>
      </div>
    </div>
  );
};

export default ProfilePage;
