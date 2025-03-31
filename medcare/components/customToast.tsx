// components/CustomToast.tsx
"use client";
import React, { useEffect, useState } from "react";
import styles from "./styles/customToast.module.css";

interface ToastProps {
  message: string;
  type?: "success" | "error" | "info";
  duration?: number;
}

const CustomToast: React.FC<ToastProps> = ({
  message,
  type = "info",
  duration = 2000,
}) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), duration);
    return () => clearTimeout(timer);
  }, [duration]);

  if (!visible) return null;

  return <div className={`${styles.toast} ${styles[type]}`}>{message}</div>;
};

export default CustomToast;
