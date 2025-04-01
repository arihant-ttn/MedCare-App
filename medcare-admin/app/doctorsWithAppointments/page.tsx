"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "../../styles/doctorsWithAppointments.module.css";
import { useRouter } from "next/navigation";

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

  //  Fetch Doctors on Page Load
  const fetchDoctors = async () => {
    try {
      const res = await fetch("http://localhost:3000/doctorsWithAppointments");
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
      <div className={styles["header"]}>Medcare Admin</div>
      <h1>Doctors With Appointments</h1>
      <div className={styles.doctorsList}>
        {doctors?.length > 0 ? (
          doctors.map((doctor) => (
            <div key={doctor.id} className={styles.card}>
              <div>
                <Image
                  src="/Frame.png"
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
                <button
                  className={styles.bookBtn}
                  onClick={() =>
                    router.push(`/appointmentsTable?id=${doctor.docid}`)
                  }
                >
                  View Appointments
                </button>
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
