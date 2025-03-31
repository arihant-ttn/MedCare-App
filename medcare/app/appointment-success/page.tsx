"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import React from "react";
import styles from '../../components/styles/success.module.css'; 

export default function Success() {
  const router = useRouter();
  const [count, setCount] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCount((prev) => prev - 1);
    }, 1000);

    if (count === 0) {
      router.replace("/appointment");
    }

    return () => clearInterval(timer);
  }, [count, router]);

  return (
    <div className={styles["success-container"]}>
      <h1 className={styles["success-heading"]}>Request Sent</h1>
      <p className={styles["success-description"]}>
        Your request has been sent. You will receive a confirmation notification soon.
      </p>
      <p className={styles["success-countdown"]}>
        Redirecting to Appointments page in <span>{count}</span> seconds...
      </p>
    </div>
  );
}
