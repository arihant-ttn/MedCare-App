"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import styles from "../../styles/addDoctor.module.css";
import CustomToast from "@/components/customToast";
interface DoctorFormData {
  name: string;
  specialization: string;
  experience: string;
  gender: "Male" | "Female";
  qualification: string;
  diseases: string;
  description: string;
  image: File | null;
  reviews: string;
}

const AddDoctorForm: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<DoctorFormData>({
    name: "",
    specialization: "",
    experience: "",
    gender: "Male",
    qualification: "",
    diseases: "",
    description: "",
    image: null,
    reviews: "",
  });
  const API_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/manageDoctors`;
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<"success" | "error" | "info">(
    "info"
  );

  //  Add Doctor API using fetch
  const addDoctor = async (formData: DoctorFormData) => {
    try {
      //  Create FormData object
      const data = new FormData();

      //  Append form data to FormData object
      Object.keys(formData).forEach((key) => {
        const value = (formData as any)[key];

        // Append image separately
        if (key === "image" && value) {
          data.append("image", value);
        }
        // Convert arrays to JSON string before appending
        else {
          data.append(key, value);
        }
      });

      //  Send API request with FormData
      const response = await fetch(`${API_URL}/add`, {
        method: "POST",
        body: data, // FormData automatically sets Content-Type to multipart/form-data
      });

      //  Check if response is OK
      if (!response.ok) {
        throw new Error(`Error adding doctor: ${response.statusText}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Error adding doctor:", error);
      throw error;
    }
  };

  //  Handle Input Change
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type, files } = e.target as HTMLInputElement;

    // Handle file input separately
    if (type === "file" && files) {
      setFormData({ ...formData, [name]: files[0] });
    }
    
    // Default handling for other fields
    else {
      setFormData({ ...formData, [name]: value });
    }
  };
  const [loading, setLoading] = useState(false);

  //  Handle Form Submit
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setLoading(true);
      await addDoctor(formData);
      setLoading(false);

        // alert("Doctor added successfully!");
      setToastMessage("Doctor Added Successfully");
      setToastType("success");

      router.push("/allDoctors");

      // Reset form after submission
      setFormData({
        name: "",
        specialization: "",
        experience: "",
        gender: "Male",
        qualification: "",
        diseases: "",
        description: "",
        image: null,
        reviews: "",
      });
      const fileInput = document.getElementById("image") as HTMLInputElement;
      if (fileInput) {
        fileInput.value = "";
      }
    } catch (error) {
      console.error("Error adding doctor:", error);
      alert("Failed to add doctor. Please try again.");
    }
  };

  return (
    <><div className={styles["header"]}>Medcare Admin</div><form onSubmit={handleSubmit} className={styles["add-doctor-form"]}>
      {/* Doctor Name */}
      {toastMessage && <CustomToast message={toastMessage} type={toastType} />}

      <label htmlFor="name">Doctor Name:</label>
      <input
        type="text"
        name="name"
        id="name"
        placeholder="Enter Doctor Name"
        value={formData.name}
        onChange={handleChange}
        required />

      {/* Specialization */}
      <label htmlFor="specialization">Specialization:</label>
      <input
        type="text"
        name="specialization"
        id="specialization"
        placeholder="Enter Specialization"
        value={formData.specialization}
        onChange={handleChange}
        required />

      {/* Experience */}
      <label htmlFor="experience">Experience (Years):</label>
      <input
        type="number"
        name="experience"
        id="experience"
        placeholder="Enter Experience in Years"
        value={formData.experience}
        onChange={handleChange}
        required />

      {/* Gender */}
      <label htmlFor="gender">Gender:</label>
      <select
        name="gender"
        id="gender"
        value={formData.gender}
        onChange={handleChange}
      >
        <option value="Male">Male</option>
        <option value="Female">Female</option>
      </select>

      {/* Qualification */}
      <label htmlFor="qualification">Qualification:</label>
      <input
        type="text"
        name="qualification"
        id="qualification"
        placeholder="Enter Qualification"
        value={formData.qualification}
        onChange={handleChange}
        required />

      {/* Diseases Treated */}
      <label htmlFor="diseases">Diseases Treated (comma-separated):</label>
      <input
        type="text"
        name="diseases"
        id="diseases"
        placeholder="e.g. Diabetes, Hypertension, Skin Problems"
        value={formData.diseases}
        onChange={handleChange} />

      {/* Description */}
      <label htmlFor="description">Doctor Description:</label>
      <textarea
        name="description"
        id="description"
        placeholder="Enter description about the doctor"
        value={formData.description}
        onChange={handleChange} />

      {/* Reviews */}
      <label htmlFor="reviews">Reviews (comma-separated):</label>
      <input
        type="text"
        name="reviews"
        id="reviews"
        placeholder="e.g. Great doctor, Very helpful"
        value={formData.reviews}
        onChange={handleChange} />

      {/* Image Upload */}
      <label htmlFor="image">Doctor Image:</label>
      <input
        type="file"
        name="image"
        id="image"
        accept="image/*"
        onChange={handleChange}
        required />

      {/* Submit Button */}
      <button type="submit" disabled={loading}>
        {loading ? "Adding Doctor..." : "Add Doctor"}
      </button>
    </form></>
  );
};

export default AddDoctorForm;
