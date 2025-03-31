// import { FaPhone, FaWhatsapp } from "react-icons/fa";
import styles from "./styles/footer.module.css";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <p>© EmScripts 2024. All Rights Reserved.</p>
      {/* <div className={styles.icons}>
        <FaPhone className={styles.icon} />
        <FaWhatsapp className={styles.icon} />
      </div> */}
    </footer>
  );
};

export default Footer;
