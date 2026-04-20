import React from "react";
import "./ScrollToTopButton.css";

const ScrollToTopButton = () => {
  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button className="scroll-to-top-btn" onClick={handleClick} aria-label="Ir arriba">
      ↑
    </button>
  );
};

export default ScrollToTopButton;