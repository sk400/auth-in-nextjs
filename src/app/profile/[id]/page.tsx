import React from "react";

interface Params {
  id: string;
}

const UserProfile = ({ params }: { params: Params }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-gray-100">
      <div className="bg-white rounded-lg p-8 shadow-lg w-full lg:w-1/2">
        <h1 className="text-3xl font-bold mb-4">User Profile</h1>
        <div className="flex flex-row mb-4">
          <div className="flex flex-col w-1/2">
            <p className="font-bold">User id:</p>
            <p className="font-bold">Username:</p>
            <p className="font-bold">Email:</p>
          </div>
          <div className="flex flex-col w-1/2">
            <p className="">{params.id}</p>
            <p className="">John</p>
            <p className="">john.doe@example.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
// Create a user profile page and hard code the user information. Use tailwind css to style the page. Make it modern responsive that delivers a good user experience
