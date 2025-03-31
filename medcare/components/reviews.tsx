"use client";
import { useState, useEffect } from "react";
import styles from "./styles/reviews.module.css";
import CustomToast from "./customToast";
const ReviewSection = ({ doctorId }: { doctorId: number }) => {
  const [rating, setRating] = useState<number>(0);
  const [hover, setHover] = useState<number>(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<"success" | "error" | "info">(
    "info"
  );
  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      alert("Please select a star rating before submitting!");
      return;
    }
    const reviewData = {
      doctorId,
      rating,
    };

    //  Send review to API
    const res = await fetch("http://localhost:3000/updateRating", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reviewData),
    });

    console.log(res);
    if (res.ok) {
      //  Update reviews dynamically
      setToastMessage("Review Submitted");
      setToastType("success");
      //   alert("Successfully Submitted");

      setRating(0); // Reset rating after submission
    } else {
      alert("Failed to submit review.");
    }
  };

  return (
    <div className={styles.reviews}>
      {toastMessage && <CustomToast message={toastMessage} type={toastType} />}
      <strong>Patient Rating:</strong>

      {/* Add Review Form */}
      <form onSubmit={handleReviewSubmit} className={styles.reviewForm}>
        <div className={styles.starRating}>
          {[...Array(5)].map((_, index) => {
            const currentRating = index + 1;
            // Inside the map loop of starRating
            return (
              <span
                key={index}
                className={`${styles.star} ${
                  currentRating <= (hover || rating)
                    ? styles.filled
                    : styles.empty
                }`}
                onClick={() => {
                  console.log(`Star clicked with rating: ${currentRating}`); //  Debug
                  setRating(currentRating);
                }}
                onMouseEnter={() => setHover(currentRating)}
                onMouseLeave={() => setHover(0)}
              >
                ★
              </span>
            );
          })}
        </div>
        <button type="submit" className={styles.submitBtn}>
          Submit Review
        </button>
      </form>
    </div>
  );
};

export default ReviewSection;
