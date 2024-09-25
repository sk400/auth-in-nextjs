"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

const VerifyEmail = () => {
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState("");
  const token = new URLSearchParams(window.location.search).get("token");

  useEffect(() => {
    if (token) {
      axios
        .post("/api/users/verify", { token })
        .then((response) => {
          if (response.data.success) {
            setVerified(true);
          } else {
            setError(response.data.message);
          }
        })
        .catch((error) => {
          setError(error.response.data.message);
        });
    }
  }, [token]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-gray-100">
      {error?.length > 0 ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <>
          {verified ? (
            <>
              <p className="text-green-500">
                Your email has been verified. You can now log in.
              </p>
              <Link href="/login">Click here</Link>
            </>
          ) : (
            <p className="text-gray-800">Verifying...</p>
          )}
        </>
      )}
    </div>
  );
};

export default VerifyEmail;
