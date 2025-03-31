import React from "react";
import styles from "../../styles/dashboard.module.css";
import Link from "next/link";
const page = () => {
  return (
    <div className={styles["container"]}>
      <div className={styles["header"]}>Medcare Admin</div>
      <div className={styles["main-section"]}>
        <h1>Welcome! Admin</h1>

        <div className={styles["section"]}>
          <Link href={"/doctorsWithAppointments"}>
            <div className={styles["Appointments"]}>
              <h1>Appointments</h1>
            </div>
          </Link>
          <Link href={"/allDoctors"}>
            <div className={styles["Add-Doctors"]}>
              <h1>
                Manage <br />
                Doctors
              </h1>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default page;
