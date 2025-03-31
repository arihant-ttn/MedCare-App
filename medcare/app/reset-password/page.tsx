"use client";

import React, { useState, useEffect, FormEvent } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import styles from "../../components/styles/reset-password.module.css"; //  Import External CSS

const ResetPassword: React.FC = () => {
  const [newPassword, setNewPassword] = useState<string>("");
  const [token, setToken] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();

  //  Get Token from URL Params
  useEffect(() => {
    const tokenFromURL = searchParams.get("token");
    if (tokenFromURL) {
      setToken(tokenFromURL);
    }
  }, [searchParams]);

  //  Handle Form Submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!token) {
      alert("Invalid or missing token.");
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await res.json();
      alert(data.message);

      if (res.ok) {
        router.push("/login"); //Redirect to login after success
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      alert("Error resetting password. Please try again.");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Reset Your Password</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Hidden Token Input */}
          <input type="hidden" name="token" value={token || ""} />

          {/* Password Input */}
          <input
            type="password"
            id="newPassword"
            name="newPassword"
            placeholder="Enter New Password"
            className={styles.input}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />

          {/* Submit Button */}
          <button type="submit" className={styles.button}>
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
