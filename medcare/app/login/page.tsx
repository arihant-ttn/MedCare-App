"use client"; // If using Next.js App Router
import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "../../components/styles/login.module.css";
import { useSearchParams } from "next/navigation";
import dotenv from "dotenv";
dotenv.config();
import CustomToast from "@/components/customToast";

interface FormData {
  email: string;
  password: string;
}

const Login = () => {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<"success" | "error" | "info">(
    "info"
  );

  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  //  Store Token in Local Storage if found
  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
      console.log("Token stored:", token);
    } else {
      console.log("No token found");
    }
  }, [token]);

  //  Initialize router for redirect
  const router = useRouter();
  const admin = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
  const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;

  // ✅ Google Login Handler
  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:3000/google";
  };

  //  Redirect if token exists in Local Storage
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.replace("/appointment"); // Redirect if token exists
    }
  }, [router]);

  //  Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    //  Admin Login Check
    if (formData.email === admin && formData.password === adminPassword) {
      window.open("http://localhost:3002/dashboard", "_blank");
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem("token", data.token);
        localStorage.setItem("userId", data.user.id);
        console.log("Token:", data.token);
        console.log("User ID:", data.user.id);

        //  Redirect to /appointment after successful login
        router.replace("/appointment");
        setToastMessage("Logging In");
        setToastType("success");
      } else {
        console.log("Login failed.");
        setToastMessage("Incorrect Password or Email");
        setToastType("info");
      }
    } catch (error) {
      console.error("Error during login:", error);
      setToastMessage("Something went wrong! Please try again.");
      setToastType("error");
    }
  };

  //  Handle input changes
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <>
      {toastMessage && <CustomToast message={toastMessage} type={toastType} />}
      <div className={styles["login-container"]}>
        {/* Login Form */}
        <div className={styles["login-box"]}>
          <div className={styles["login-header"]}>
            <h2>Login</h2>
            <p className={styles["signup-message"]}>
              Are you a new member? <Link href="/signUp">Sign up here</Link>
            </p>
          </div>
          <form className={styles["login-form"]} onSubmit={handleSubmit}>
            <label>Email</label>
            <input
              type="email"
              placeholder="Email"
              name="email"
              onChange={handleChange}
              required
            />
            <label>Password</label>
            <input
              type="password"
              placeholder="Password"
              name="password"
              onChange={handleChange}
              required
            />
            <div className={styles["button-group"]}>
              <button className={styles["login-button"]} type="submit">
                Login
              </button>
              <button className={styles["reset-button"]} type="reset">
                Reset
              </button>
              <p
                className={styles["forgot-password"]}
                onClick={() => router.push("/forgot-password")}
              >
                Forgot Password?
              </p>
            </div>
          </form>

          {/* Google Login Button */}
          <button className={styles["google-btn"]} onClick={handleGoogleLogin}>
            <div className={styles["google-icon"]}></div>
            <span className={styles["google-btn-text"]}>
              Sign in with Google
            </span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Login;
