import React from 'react';
import PropTypes from 'prop-types';
import './ExploreMenu.css';
import { menu_list } from '../../assets/assets';

const ExploreMenu = ({category, setCategory}) => {

  const handleCategoryChange = (menuName) => {
    setCategory(category === menuName ? "All" : menuName);
  };

  return (
    <div className='explore-menu' id='explore-menu'>
      <h1>Explora nuevos sabores</h1>
      <p className="explore-menu-text">
        Descubre una selección exquisita de platillos creados para sorprender tu paladar.
      </p>
      <div className="explore-menu-list">
        {menu_list.map((item) => (
          // ✅ button es interactivo, soporta click y teclado nativamente
          <button
            type="button"
            className="explore-menu-item"
            key={item.menu_name}
            onClick={() => handleCategoryChange(item.menu_name)}
            onKeyDown={(e) => e.key === 'Enter' && handleCategoryChange(item.menu_name)}
          >
            <img
              className={category === item.menu_name ? "active" : ""}
              src={item.menu_image}
              alt={item.menu_name}
            />
            <p>{item.menu_name}</p>
          </button>
        ))}
      </div>
      <hr />
    </div>
  );
};

ExploreMenu.propTypes = {
  category: PropTypes.string.isRequired,
  setCategory: PropTypes.func.isRequired,
};

export default ExploreMenu;