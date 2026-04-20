import React from "react";
import "./Header.css";

const Header = () => {
  return (
    <div className="header">
      <div className="header-contents">
        <h2>¡Del mar fresco a tu mesa!</h2>
        <p>
          Con <strong>JuliaFish</strong>, disfruta de los sabores más frescos
          del océano. Ordena tu platillo favorito en solo unos pasos y déjate
          sorprender por nuestra deliciosa selección de mariscos y pescados.
        </p>
        <button>¡Ordena ahora!</button>
      </div>
    </div>
  );
};

export default Header;
