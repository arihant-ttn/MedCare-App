"use client";

import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import styles from "../../styles/updateDoctors.module.css"; 
import { useSearchParams } from "next/navigation";
import CustomToast from "@/components/customToast";
interface Doctor {
  id: string;
  qualification: string;
  diseases: string;
  rating: number;
  image: string;
  reviews: string;
  description: string;
}

const UpdateDoctorForm: React.FC = () => {
  const searchParams = useSearchParams();
  const doctorId = searchParams.get("id");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<"success" | "error" | "info">(
    "info"
  );

  const [formData, setFormData] = useState<Doctor>({
    id: doctorId || "",
    qualification: "",
    diseases: "", // Change to string
    rating: 0,
    image: "",
    reviews: "", // Change to string
    description: "",
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const API_URL = "http://localhost:3000/manageDoctors/update";

  //  Fetch Doctor Data
  useEffect(() => {
    const fetchDoctorData = async () => {
      try {
        const res = await fetch(`${API_URL}/${doctorId}`);
        const data = await res.json();
        if (data.success) {
          setFormData(data.data);
        }
      } catch (error) {
        console.error("Error fetching doctor data:", error);
      }
    };

    fetchDoctorData();
  }, [doctorId]);

  //  Handle Input Changes
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  //  Handle Array Inputs (Diseases, Reviews)

  //  Handle File Upload
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  //  Upload Image to Cloudinary
  const uploadImage = async () => {
    if (!selectedFile) return formData.image;

    const data = new FormData();
    data.append("file", selectedFile);
    data.append("upload_preset", "doctor_images");

    try {
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/diorqjb4l/image/upload",
        {
          method: "POST",
          body: data,
        }
      );
      const result = await res.json();
      return result.secure_url;
    } catch (error) {
      console.error("Error uploading image:", error);
      return formData.image;
    }
  };

  //  Handle Form Submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Upload image first if a new image is selected
    const uploadedImageUrl = await uploadImage();

    // Prepare form data with updated image
    const updatedData = {
      ...formData,
      image: uploadedImageUrl,
    };

    try {
      const res = await fetch(`${API_URL}/${doctorId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      const result = await res.json();
      if (result.success) {
        // alert("Doctor updated successfully!");
        setToastMessage("Doctor Updated Successfully");
        setToastType("success");

      } else {
        alert("Error updating doctor");
      }
    } catch (error) {
      console.error("Error updating doctor:", error);
    }
  };

  return (
    <><div className={styles["header"]}>Medcare Admin</div><div className={styles.container}>
      {toastMessage && <CustomToast message={toastMessage} type={toastType} />}

      <h2 className={styles.title}>Update Doctor Details</h2>

      <form onSubmit={handleSubmit} className={styles.form}>
        {/* Qualification */}
        <div className={styles.formGroup}>
          <label className={styles.label}>Qualification</label>
          <input
            type="text"
            name="qualification"
            value={formData.qualification}
            onChange={handleChange}
            className={styles.input} />
        </div>

        {/* Diseases */}
        <div className={styles.formGroup}>
          <label className={styles.label}>Diseases Treated</label>
          <input
            type="text"
            name="diseases"
            value={formData.diseases} // No array handling
            onChange={handleChange}
            className={styles.input} />
        </div>

        {/* Rating */}
        <div className={styles.formGroup}>
          <label className={styles.label}>Rating (0 to 5)</label>
          <input
            type="number"
            name="rating"
            value={formData.rating}
            min="0"
            max="5"
            onChange={handleChange}
            className={styles.input} />
        </div>

        {/* Description */}
        <div className={styles.formGroup}>
          <label className={styles.label}>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className={styles.textarea} />
        </div>

        {/* Reviews */}
        <div className={styles.formGroup}>
          <label className={styles.label}>Reviews</label>
          <input
            type="text"
            name="reviews"
            value={formData.reviews} // No array handling
            onChange={handleChange}
            className={styles.input} />
        </div>

        {/* Image Upload */}
        <div className={styles.formGroup}>
          <label className={styles.label}>Upload New Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className={styles.input} />
          {formData.image && (
            <img
              src={formData.image}
              alt="Doctor"
              className={styles.imagePreview} />
          )}
        </div>

        {/* Submit Button */}
        <button type="submit" className={styles.submitBtn}>
          Update Doctor
        </button>
      </form>
    </div></>
  );
};

export default UpdateDoctorForm;
