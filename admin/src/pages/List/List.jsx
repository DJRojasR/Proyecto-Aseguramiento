import React, { useEffect, useState, useCallback } from "react";
import PropTypes from "prop-types";
import "./List.css";
import axios from "axios";
import { toast } from "react-toastify";

const List = ({ url }) => {
  const [list, setList] = useState([]);

  const fetchList = useCallback(async () => {
    const response = await axios.get(`${url}/api/food/list-admin`);
    if (response.data.success) {
      setList(response.data.data);
    } else {
      toast.error("Error");
    }
  }, [url]);

  const removeFood = async (foodId) => {
    const response = await axios.post(`${url}/api/food/remove`, { id: foodId });
    await fetchList();
    if (response.data.success) {
      toast.success("Item removido correctamente", { autoClose: 1500 });
    } else {
      toast.error("Error al remover el item", { autoClose: 1500 });
    }
  };

  // ✅ Nuevo: activa o desactiva disponibilidad
  const toggleAvailability = async (foodId, currentStatus) => {
    const response = await axios.post(`${url}/api/food/toggle`, { id: foodId });
    if (response.data.success) {
      toast.success(
        currentStatus ? "Producto deshabilitado" : "Producto habilitado",
        { autoClose: 1500 }
      );
      await fetchList();
    } else {
      toast.error("Error al cambiar disponibilidad", { autoClose: 1500 });
    }
  };

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  return (
    <div className="list add flex-col">
      <p>All food List</p>
      <div className="list-table">
        <div className="list-table-format title">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b>Disponible</b> {/* ✅ Nueva columna */}
          <b>Action</b>
        </div>
        {list.map((item) => (
          <div key={item._id} className="list-table-format">
            <img src={`${url}/images/${item.image}`} alt={item.name} />
            <p>{item.name}</p>
            <p>{item.category}</p>
            <p>{item.price}</p>

            {/* ✅ Toggle de disponibilidad */}
            <button
              onClick={() => toggleAvailability(item._id, item.available)}
              className={`toggle-btn ${item.available ? "available" : "unavailable"}`}
            >
              {item.available ? "Disponible" : "No disponible"}
            </button>

            <button onClick={() => removeFood(item._id)} className="cursor">
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

List.propTypes = {
  url: PropTypes.string.isRequired,
};

export default List;