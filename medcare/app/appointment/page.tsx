"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import styles from "../../components/styles/appointments.module.css";
import Footer from "@/components/footer";
import Link from "next/link";

import CheckAuth from "@/components/CheckAuth";
//  Doctor Interface
interface Doctor {
  id: number;
  name: string;
  specialization: string;
  experience: number;
  rating: number;
  gender: "Male" | "Female";
  image: string;
}

//  Fetch Doctors from API
const fetchDoctors = async (filters: {
  search?: string;
  rating?: string;
  experience?: string;
  gender?: string;
  page?: number;
  limit?: number;
}) => {
  const filteredParams = Object.fromEntries(
    Object.entries(filters).filter(
      ([_, v]) => v !== undefined && v !== "undefined" && v !== ""
    )
  );
  const queryParams = new URLSearchParams(filteredParams as any).toString();
  

  const res = await fetch(`http://localhost:3000/listDoctors?${queryParams}`);

  if (!res.ok) throw new Error("Failed to fetch doctors");

  const data = await res.json();

  return data;
};

const DoctorsList = () => {
  const route = useRouter();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalDoctors, setTotalDoctors] = useState<number>(0);
  const doctorsPerPage = 6; //  Doctors per page
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);

  //  Filter States
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [search, setSearch] = useState<string>("");
  const [experience, setExperience] = useState<string>("");
  const [rating, setRating] = useState<string>("showAll");
  const [gender, setGender] = useState<string>("showAll");

  //  Fetch Doctors on Page Load & Filter Change
  useEffect(() => {
    const filters = {
      search: searchQuery || undefined,
      rating: rating !== "showAll" ? rating : undefined,
      experience: experience || undefined,
      gender: gender !== "showAll" ? gender : undefined,
      page: currentPage,
      limit: doctorsPerPage,
    };
  
    updateURL(); //  Update URL on state change
  
    fetchDoctors(filters)
      .then((data) => {
        setFilteredDoctors(data.doctors);
        setTotalDoctors(data.totalDoctors);
        setDoctors(data.fDoctors);
      })
      .catch((error) => {
        console.error("Error fetching doctors:", error);
        setFilteredDoctors([]);
        setTotalDoctors(0);
      });
  }, [searchQuery, experience, rating, gender, currentPage]);
  
  useEffect(() => {
    //  Parse URL Query Parameters
    const searchParams = new URLSearchParams(window.location.search);
  
    //  Set Initial States from URL
    const searchValue = searchParams.get("search") || "";
    const experienceValue = searchParams.get("experience") || "";
    const ratingValue = searchParams.get("rating") || "showAll";
    const genderValue = searchParams.get("gender") || "showAll";
    const pageValue = parseInt(searchParams.get("page") || "1", 10);
  
    setSearch(searchValue);
    setSearchQuery(searchValue);
    setExperience(experienceValue);
    setRating(ratingValue);
    setGender(genderValue);
    setCurrentPage(pageValue);
  }, []);
  const updateURL = () => {
    const queryParams = new URLSearchParams();
  
    if (searchQuery) queryParams.set("search", searchQuery);
    if (experience) queryParams.set("experience", experience);
    if (rating !== "showAll") queryParams.set("rating", rating);
    if (gender !== "showAll") queryParams.set("gender", gender);
    queryParams.set("page", currentPage.toString());
  
    //  Push updated URL with query params
    route.push(`?${queryParams.toString()}`);
  };
  
  //  Handle Input Change
  const handleSearch = (value: string) => {
    setSearch(value); // Only update input value
  };

  //  Handle Search on Button Click
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!search.trim()) {
      alert("Please enter a valid search query!");
      return;
    }

    //  Set search query only on button click
    setSearchQuery(search);
    console.log(`Searching for: ${search}`);
  };

  //  Generate Pagination with Ellipsis
  const generatePageNumbers = () => {
    const totalPages = Math.ceil(totalDoctors / doctorsPerPage);
    const pageNumbers = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pageNumbers.push(1, 2, 3, "...", totalPages);
      } else if (currentPage > totalPages - 3) {
        pageNumbers.push(1, "...", totalPages - 2, totalPages - 1, totalPages);
      } else {
        pageNumbers.push(
          1,
          "...",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          totalPages
        );
      }
    }
    return pageNumbers;
  };

  const nextPage = () => {
    setCurrentPage((prev) => {
      const nextPage = Math.min(prev + 1, Math.ceil(totalDoctors / doctorsPerPage));
      updateURL(); //  Update URL on page change
      return nextPage;
    });
  };
  
  const prevPage = () => {
    setCurrentPage((prev) => {
      const prevPage = Math.max(prev - 1, 1);
      updateURL(); //  Update URL on page change
      return prevPage;
    });
  };
  
  //  Reset All Filters
  const resetFilters = () => {
    setSearch("");
    setSearchQuery("");
    setExperience("");
    setRating("showAll");
    setGender("showAll");
    setCurrentPage(1);
    updateURL(); // Reset URL on filter reset
  };
  

  return (
    <>
      <CheckAuth />

      <div className={styles.container}>
        {/*  Search Bar */}
        <div className={styles.boxShadow}>
          <div className={styles.searchSection}>
            <div className={styles.searchTitle}>
              Find a doctor at your own ease
            </div>

            <div >
              <form onSubmit={handleSubmit} className={styles.searchBar}>
              <input
                type="text"
                placeholder="Search for doctors..."
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
              />
              <button type="submit" 
               className={styles.searchBtn}
               disabled={!search.trim()}>
                Search
              </button>
              </form>
            </div>
          </div>
        </div>

        {/*  Doctor Count Info */}
        <div className={styles.doctorCount}>
          <h2>{doctors.length} Doctors Available</h2>
          <p>
            Book appointments with minimum wait-time & verified doctor details
          </p>
        </div>

        {/*  Filters Section */}
        <div className={styles.doctorContainer}>
          <div className={styles.filters}>
            <div className={styles.filterheader}>
              <span className={styles.filterText}>Filter By:</span>
              <button className={styles.resetBtn} onClick={resetFilters}>
                Reset
              </button>
            </div>

            {/*  Rating Filter */}
            <div className={styles.filterGroup}>
              <h4>Rating</h4>
              {["showAll", 1, 2, 3, 4, 5].map((star) => (
                <label key={star}>
                  <input
                    type="radio"
                    name="rating"
                    value={star.toString()}
                    checked={rating === star.toString()}
                    onChange={() => setRating(star.toString())}
                  />
                  {star === "showAll" ? "Show All" : ` ${star} Star`}
                </label>
              ))}
            </div>

            {/*  Experience Filter */}
            <div className={styles.filterGroup}>
              <h4>Experience</h4>
              {["15+", "10-15", "5-10", "3-5", "1-3", "0-1"].map((exp) => (
                <label key={exp}>
                  <input
                    type="radio"
                    name="experience"
                    value={exp}
                    checked={experience === exp}
                    onChange={() => setExperience(exp)}
                  />
                  {exp} Years
                </label>
              ))}
            </div>

            {/*  Gender Filter */}
            <div className={styles.filterGroup}>
              <h4>Gender</h4>
              {["showAll", "Male", "Female"].map((g) => (
                <label key={g}>
                  <input
                    type="radio"
                    name="gender"
                    value={g}
                    checked={gender === g}
                    onChange={() => setGender(g)}
                  />
                  {g === "showAll" ? "Show All" : g}
                </label>
              ))}
            </div>
          </div>

          {/*  Doctor List Section */}
          <div className={styles.rightSection}>
            <div className={styles.doctorSection}>
              <div className={styles.doctorsList}>
                {filteredDoctors.length > 0 ? (
                  filteredDoctors.map((doctor) => (
                    <div key={doctor.id} className={styles.card}>
                      <Link
                        key={doctor.id}
                        href={`./doctor-profile/${doctor.id}`}
                      >
                        <div>
                          <Image
                            src={doctor.image}
                            alt={doctor.name}
                            width={150}
                            height={180}
                            className={styles.image}
                          />
                          <h3>{doctor.name}</h3>
                        </div>
                      </Link>
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
                            route.push(`/appointments-form?id=${doctor.id}`)
                          }
                        >
                          Book Appointment
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className={styles.noResults}>No doctors found.</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/*  Pagination Section with Ellipsis */}
        <div className={styles.pagination}>
          <button
            onClick={prevPage}
            className={`${styles.dirBtn} ${
              currentPage === 1 ? styles.disabledBtn : ""
            }`}
            disabled={currentPage === 1}
          >
            Prev
          </button>
          {generatePageNumbers().map((num, index) => (
            <button
              key={index}
              className={`${
                currentPage === num
                  ? styles.activePage
                  : num === "..."
                  ? styles.ellipsis
                  : styles.pageBtn
              }`}
              onClick={() => typeof num === "number" && setCurrentPage(num)}
              disabled={num === "..."}
            >
              {num}
            </button>
          ))}
          <button
            onClick={nextPage}
            className={`${styles.dirBtn} ${
              currentPage === Math.ceil(totalDoctors / doctorsPerPage)
                ? styles.disabledBtn
                : ""
            }`}
            disabled={currentPage === Math.ceil(totalDoctors / doctorsPerPage)}
          >
            Next
          </button>
        </div>
      </div>

      {/*  Footer */}
      <Footer />
    </>
  );
};

export default DoctorsList;
