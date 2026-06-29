import React, { useState } from "react";
import "./Add.css";
import { assets } from "../../assets/assets";
import PropTypes from "prop-types";
import axios from "axios";
import { toast } from "react-toastify";

const Add = ({url}) => {
  
  const [image, setImage] = useState(false);
  const [data, setData] = useState({
    name: "",
    description: "",
    price: "",
    category: "Ceviche",
  });
  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };
  const onSubmitHandler = async (event) => {
  event.preventDefault();

  // ✅ Validaciones antes de enviar
  if (!image) {
    toast.error("Por favor sube una imagen.", { autoClose: 1500 });
    return;
  }
  if (data.name.trim().length < 2) {
    toast.error("El nombre debe tener al menos 2 caracteres.", { autoClose: 1500 });
    return;
  }
  if (data.description.trim().length < 10) {
    toast.error("La descripción debe tener al menos 10 caracteres.", { autoClose: 1500 });
    return;
  }
  const price = Number(data.price);
  if (!price || price <= 0 || price > 9999) {
    toast.error("El precio debe ser un número entre 1 y 9999.", { autoClose: 1500 });
    return;
  }

  const formData = new FormData();
  formData.append("name", data.name.trim());
  formData.append("description", data.description.trim());
  formData.append("price", price);
  formData.append("category", data.category);
  formData.append("image", image);

  const response = await axios.post(`${url}/api/food/addfood`, formData);

  if (response.data.success) {
    setData({ name: "", description: "", price: "", category: "Ceviche" });
    setImage(false);
    toast.success("Item agregado correctamente!", { autoClose: 1500 });
  } else {
    toast.error("Error al agregar el item", { autoClose: 1500 });
  }
};

  return (
    <div className="add">
      <form className="flex-col" onSubmit={onSubmitHandler}>
        <div className="add-img-upload flex-col">
          <p>Upload Image</p>

          <label htmlFor="image">
            <img
              src={image ? URL.createObjectURL(image) : assets.upload_area}
              alt="Upload"
            />
          </label>

          <input
            onChange={(e) => setImage(e.target.files[0])}
            type="file"
            id="image"
            hidden
            
          />
        </div>
        <div className="add-product-name flex-col">
          <p>Product name</p>
          <input
          onChange={onChangeHandler}
          value={data.name}
          type="text"
          name="name"
          placeholder="Type here"
          required
          maxLength={60}        // ✅ máximo 60 caracteres
        />
        </div>
        <div className="add-product-description flex-col">
          <p>Product description</p>
          <textarea
            onChange={onChangeHandler}
            value={data.description}
            name="description"
            rows="6"
            placeholder="Write content here"
            required
            maxLength={300}       // ✅ máximo 300 caracteres
          />
        </div>
        <div className="add-category-price">
          <div className="add-category flex-col">
            <p>Category</p>
            <select
              onChange={onChangeHandler}
              value={data.category}
              name="category"
            >
              <option value="Ceviche">Ceviche</option>
              <option value="Chaufa">Chaufa</option>
              <option value="Sopa">Sopa</option>
              <option value="Causas">Causas</option>
              <option value="Chicharrones">Chicharrones</option>
              <option value="Cocteles">Cocteles</option>
              <option value="Arroces">Arroces</option>
              <option value="Bebidas">Bebidas</option>
              <option value="Estofados">Estofados</option>
              <option value="Porciones">Porciones</option>
              <option value="Postres">Postres</option>
              
            </select>
          </div>
          <div className="add-price flex-col">
            <p>Price</p>
            <input
              onChange={onChangeHandler}
              onKeyDown={(e) => {
                // ✅ Bloquea 'e', 'E', '+', '-'
                if (['e', 'E', '+', '-'].includes(e.key)) e.preventDefault();
              }}
              value={data.price}
              type="number"
              name="price"
              placeholder="Type here"
              required
              min={1}              // ✅ mínimo 1
              max={9999}           // ✅ máximo 9999
            />
          </div>
        </div>
        <button type="submit" className="add-button">
          Add item
        </button>
      </form>
    </div>
  );
};

Add.propTypes = {
  url: PropTypes.string.isRequired,
};

export default Add;