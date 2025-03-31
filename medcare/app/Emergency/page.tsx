"use client";

import React from "react";
import styles from "../../components/styles/emergency.module.css";

const EmergencyHelp = () => {
  const emergencyContacts = [
    {
      name: "Ambulance",
      number: "108",
      description: "24/7 Emergency Medical Assistance",
    },
    {
      name: "Police",
      number: "100",
      description: "Emergency Police Assistance",
    },
    {
      name: "Fire Brigade",
      number: "101",
      description: "Fire Emergency Services",
    },
    {
      name: "National Emergency Helpline",
      number: "112",
      description: "All-in-one Emergency Helpline",
    },
    {
      name: "Child Helpline",
      number: "1098",
      description: "Emergency Help for Children",
    },
  ];

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Emergency Contact / Help</h1>
      <p className={styles.subtitle}>Quick access to urgent care numbers and emergency contacts.</p>

      <div className={styles.grid}>
        {emergencyContacts.map((contact, index) => (
          <div key={index} className={styles.card}>
            <h2 className={styles.contactName}>{contact.name}</h2>
            <p className={styles.contactDesc}>{contact.description}</p>
            <a
              href={`tel:${contact.number}`}
              className={styles.contactBtn}
            >
              Call {contact.number}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmergencyHelp;
