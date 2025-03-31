"use client";

import React from "react";
import { useRouter } from "next/navigation";

interface ButtonProps {
  //   redirectTo?: string;
  id: number;
  className?: string;
}

const BookBtn: React.FC<ButtonProps> = ({ className, id }) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/appointments-form?id=${id}`);
  };

  return (
    <button onClick={handleClick} className={`${className}`}>
      Book Appointment
    </button>
  );
};

export default BookBtn;
