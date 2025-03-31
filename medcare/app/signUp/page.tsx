"use client"; // If using Next.js App Router
import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "../../components/styles/signUp.module.css";
import CustomToast from "@/components/customToast";
interface FormData {
  name: string;
  email: string;
  password: string;
}

const SignUp = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
  });

  const router = useRouter();
   const [toastMessage, setToastMessage] = useState<string | null>(null);
    const [toastType, setToastType] = useState<"success" | "error" | "info">(
      "info"
    );
  //  Redirect if token exists in localStorage
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.replace("/appointment"); // Redirect if already logged in
    }
  }, [router]);

  //  Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3000/signUp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Ensure correct content type
        },
        body: JSON.stringify(formData), // Convert form data to JSON
      });
      // console.log("Hello")
      // console.log(response);
      // const data = await response.json()
      // console.log(data);
      console.log("HTTP Respsonse ", response.status);
      // console.log(formData);
      if (response.status == 409) {
        //  409 Conflict - User already exists
        setToastMessage("user Already exists")
        setToastType('info')
      } else if (response.ok) {
        const data = await response.json();
        setToastMessage("user Registered Successfully")
        setToastType('success')
        router.push("/login"); // Redirect to login page
      } else {
        alert("Error occurred while signing up!");
      }
    } catch (error) {
      console.error("Error:", error);
      setToastMessage("Failed to connect to server")
        setToastType('error')
      // alert("Failed to connect to server. Please try again later.");
    }
  };

  //  Handle input changes
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className={styles["login-container"]}>
      {/* Sign Up Form */}
      {toastMessage && <CustomToast message={toastMessage} type={toastType} />}
      <div className={styles["login-box"]}>
        <div className={styles["login-header"]}>
          <h2>Sign Up</h2>
          <p className={styles["signup-message"]}>
            Already a member? <Link href="/login">Login here</Link>
          </p>
        </div>
        <form className={styles["login-form"]} onSubmit={handleSubmit}>
          <label>Name</label>
          <input
            type="text"
            placeholder="Name"
            name="name"
            onChange={handleChange}
            required
          />
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
              Submit
            </button>
            <button className={styles["reset-button"]} type="reset">
              Reset
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
