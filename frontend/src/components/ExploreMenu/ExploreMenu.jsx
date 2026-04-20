import React from 'react';
import './ExploreMenu.css';
import { menu_list } from '../../assets/assets';

const ExploreMenu = ({category, setCategory}) => {
  return (
    <div className='explore-menu' id='explore-menu'>
      <h1>Explora nuevos sabores</h1>
      <p className="explore-menu-text">
        Descubre una selección exquisita de platillos creados para sorprender tu paladar.
      </p>
      <div className="explore-menu-list">
        {/* Iteracion sobre la lista de menus */}
        {menu_list.map((item, index) => (
          <div 
            // Cambiar la categoria al hacer click de acuerdo al menu seleccionado
            onClick={() => setCategory(category === item.menu_name ? "All" : item.menu_name)} className="explore-menu-item" key={index}
          >
            {/* Cambiar la clase activa */}
            <img className={category === item.menu_name ? "active" : ""} src={item.menu_image} alt={item.menu_name} />
            <p>{item.menu_name}</p>
          </div>
        ))}
      </div>
      <hr />
    </div>
  );
};

export default ExploreMenu;