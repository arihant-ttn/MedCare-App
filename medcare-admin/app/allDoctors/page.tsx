"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "../../styles/allDoctors.module.css";
import { useRouter } from "next/navigation";
import CustomToast from "@/components/customToast";
interface Doctor {
  id: number;
  docid: number;
  name: string;
  specialization: string;
  experience: number;
  rating: number;
  gender: "Male" | "Female";
  image: string;
}

const Page = () => {
  const router = useRouter();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<"success" | "error" | "info">(
    "info"
  );

  const deleteDoctor = async (id: number) => {
    console.log(id);
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/manageDoctors/delete/${id}`,
      {
        method: "DELETE",
      }
    );
    if (res.ok) {
      setDoctors(doctors.filter((doctor) => doctor.id !== id));
      setToastMessage("Doctor Deleted");
      setToastType("success");

    } else {
      alert("Failed to delete doctor.");
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);
  //  Fetch Doctors on Page Load
  const fetchDoctors = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/manageDoctors/getAllDoctors`
      );
      console.log(res);
      if (!res.ok) {
        throw new Error("Failed to fetch doctors");
      }

      const data = await res.json();
      console.log("data", data);
      setDoctors(data.data);
    } catch (error) {
      console.error("Error fetching doctors:", error);
    }
  };

  //  Fetch on Component Mount
  useEffect(() => {
    fetchDoctors();
  }, []);
  console.log(doctors);
  return (
    
    <div className={styles["container"]}>   
     {toastMessage && <CustomToast message={toastMessage} type={toastType} />}


      <div className={styles["header"]}>Medcare Admin</div>

      <h1>Manage Doctors</h1>
      <Link href={"/addDoctors"}>
        {" "}
        <div className={styles["AddDoctor"]}>Add Doctor +</div>
      </Link>

      <div className={styles.doctorsList}>
        {doctors.length > 0 ? (
          doctors.map((doctor) => (
            <div key={doctor.id} className={styles.card}>
              <div>
                <Image
                  src={doctor.image}
                  alt={doctor.name}
                  width={100}
                  height={100}
                  className={styles.image}
                />
                <h3>{doctor.name}</h3>
              </div>

              <div className={styles.details}>
                <div className={styles.rateSpecial}>
                  <p>
                    <Image
                      src="/Stethoscope.png"
                      alt="Specialization"
                      width={17}
                      height={15}
                      className={styles.image}
                    />
                    {doctor.specialization}
                  </p>
                  <p>
                    <Image
                      src="/Hourglass.png"
                      alt="Experience"
                      width={17}
                      height={15}
                      className={styles.image}
                    />
                    {doctor.experience} Years
                  </p>
                </div>
                <p>
                  Ratings:
                  {Array.from({ length: doctor.rating }, (_, i) => (
                    <span key={i}>⭐</span>
                  ))}
                </p>
                <div className={styles["buttons"]}>
                  <button
                    className={styles.bookBtn}
                    onClick={() =>
                      router.push(`/UpdateDoctors?id=${doctor.id}`)
                    }
                  >
                    update
                  </button>
                  <button
                    className={styles.bookBtn}
                    onClick={() => {
                      deleteDoctor(doctor.id);
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className={styles.noResults}>No doctors found.</p>
        )}
      </div>
    </div>
  );
};

export default Page;
