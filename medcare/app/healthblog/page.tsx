"use client";

import React from "react";
import styles from "../../components/styles/blog.module.css";

const blogPosts = [
  {
    id: 1,
    title: "5 Tips for a Healthy Lifestyle",
    summary:
      "Learn simple tips to maintain a balanced lifestyle and stay fit.",
    image: "/images/healthy-lifestyle.jpg",
    date: "March 28, 2025",
  },
  {
    id: 2,
    title: "Importance of Hydration",
    summary: "Discover the benefits of staying hydrated and drinking water.",
    image: "/images/hydration.jpg",
    date: "March 25, 2025",
  },
  {
    id: 3,
    title: "Managing Stress Effectively",
    summary: "Techniques to reduce stress and improve mental health.",
    image: "/images/stress-management.jpg",
    date: "March 20, 2025",
  },
  {
    id: 4,
    title: "Top 10 Superfoods for Your Diet",
    summary:
      "Add these nutrient-rich superfoods to your daily routine for better health.",
    image: "/images/superfoods.jpg",
    date: "March 18, 2025",
  },
];

const BlogPage = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Health Blog</h1>
      <p className={styles.subtitle}>
        Stay updated with the latest health tips and advice.
      </p>

      <div className={styles.grid}>
        {blogPosts.map((post) => (
          <div key={post.id} className={styles.card}>
            <div className={styles.content}>
              <h2 className={styles.postTitle}>{post.title}</h2>
              <p className={styles.summary}>{post.summary}</p>
              <p className={styles.date}>Published on: {post.date}</p>
              <a href="#" className={styles.readMore}>
                Read More
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogPage;
