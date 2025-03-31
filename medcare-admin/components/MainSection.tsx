"use client";
import Image from "next/image";
import styles from "../styles/MainSection.module.css";
import { useRouter } from "next/navigation";
const MainSection = () => {
  const router = useRouter();
  return (
    <div className={styles["container"]}>
      <div className={styles["left-section"]}>
        <div className={styles["hero-content"]}>
          <h1>Medcare Admin Portal</h1>

          <button
            className={styles["hero-button"]}
            onClick={() => router.push("/dashboard")}
          >
            Dashboard
          </button>
        </div>
      </div>

      <div className={styles["right-section"]}>
        <div className={styles["HeroImage"]}>
          <Image
            src="/HeroImage.png"
            alt="Hero Image"
            fill
            style={{ objectFit: "fill" }}
          />
        </div>
      </div>
    </div>
  );
};

export default MainSection;
