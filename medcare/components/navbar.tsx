"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import styles from "./styles/navbar.module.css";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [loggingIn, setLoggingIn] = useState(true); //  Prevent initial flicker
  const router = useRouter();
  const pathname = usePathname();

  const checkToken = () => {
    const token = localStorage.getItem("token");
    if (token) {
      setLoggedIn(true);
    }
  };

  useEffect(() => {
    checkToken();
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setLoggedIn(false);
    router.push("/login");
  };

  return (
    <nav className={styles["nav-container"]}>
      {/* Logo Section */}
      <div className={styles["logo-title"]}>
        <span>
          <div className={styles["frame"]}>
            <Image
              className={styles.img}
              src="/Trust.png"
              alt="Logo"
              width={30}
              height={30}
            />
          </div>
        </span>
        <h1>MedCare</h1>
      </div>

      {/* Hamburger Icon */}
      <div className={styles.hamburger} onClick={() => setIsOpen(!isOpen)}>
        <div className={`${styles.bar} ${isOpen ? styles.open : ""}`} />
        <div className={`${styles.bar} ${isOpen ? styles.open : ""}`} />
        <div className={`${styles.bar} ${isOpen ? styles.open : ""}`} />
      </div>

      {/* Navigation Links */}
      <div className={`${styles["list-buttons"]} ${isOpen ? styles.show : ""}`}>
        <ul className={`${styles["link-list"]} ${isOpen ? styles.show : ""}`}>
          <li>
            <Link href="/" onClick={() => setIsOpen(false)}>
              Home
            </Link>
          </li>
          <li>
            <Link href="/appointment" onClick={() => setIsOpen(false)}>
              Appointment
            </Link>
          </li>
          <li>
            <Link href="/healthblog" onClick={() => setIsOpen(false)}>
              Health Blog
            </Link>
          </li>
          <li>
            <Link href="/Emergency" onClick={() => setIsOpen(false)}>
              Emergency
            </Link>
          </li>
        </ul>

        {/* Conditional Rendering for Login/Logout */}
        <div className={`${styles.buttons} ${isOpen ? styles.show : ""}`}>
          {loggedIn ? (
            <div className="relative">
              <button onClick={handleLogout} className={styles["login"]}>
                Logout
              </button>
            </div>
          ) : (
            <>
              <Link href="/login">
                <button
                  onClick={() => setIsOpen(false)}
                  className={styles["login"]}
                >
                  Login
                </button>
              </Link>
              <Link href="/signUp">
                <button
                  onClick={() => setIsOpen(false)}
                  className={styles["register"]}
                >
                  Register
                </button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
