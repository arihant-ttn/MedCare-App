"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CustomToast from "./customToast";

function CheckAuth() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<"success" | "error" | "info">(
    "info"
  );

  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      // Show error toast and redirect if no token
      setToastMessage("User not logged in! Redirecting to login...");
      setToastType("error");
      setTimeout(() => {
        router.push("/login"); // Redirect after 1.5 seconds
      }, 1500);
    } else {;
      setToastType("success");
      setLoggedIn(true);
    }
  }, [router]);

  return (
    <div>
      {toastMessage && <CustomToast message={toastMessage} type={toastType} />}
    </div>
  );
}

export default CheckAuth;
