"use client";

import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const VerifyPage = () => {
  const [verified, setVerified] = useState(false);
  //   const [error, setError] = useState(false);
  const [token, setToken] = useState("");

  async function verifyEmail() {
    try {
      const response = await axios.post("/api/users/verify", { token });

      if (response.data.success === true) {
        setVerified(true);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    const extractedToken = window.location.search.split("=")[1];

    setToken(extractedToken);
  }, []);

  useEffect(() => {
    if (token?.length > 0) {
      verifyEmail();
    }
  }, [token]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-gray-100">
      {verified ? (
        <>
          <p>Your email is verified. You can login now.</p>
          <Link href="/login">Login</Link>
        </>
      ) : (
        <p>Verifying email...</p>
      )}
    </div>
  );
};

export default VerifyPage;
