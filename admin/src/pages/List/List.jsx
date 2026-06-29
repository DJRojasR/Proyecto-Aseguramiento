import React, { useEffect, useState, useCallback } from "react";
import PropTypes from "prop-types";
import "./List.css";
import axios from "axios";
import { toast } from "react-toastify";

const List = ({ url }) => {
  const [list, setList] = useState([]);
  const [editingItem, setEditingItem] = useState(null); // ✅ item siendo editado
  const [editData, setEditData] = useState({});
  const [editImage, setEditImage] = useState(null);

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

  const toggleAvailability = async (foodId, currentStatus) => {
    const response = await axios.post(`${url}/api/food/toggle`, { id: foodId });
    if (response.data.success) {
      toast.success(currentStatus ? "Producto deshabilitado" : "Producto habilitado", { autoClose: 1500 });
      await fetchList();
    } else {
      toast.error("Error al cambiar disponibilidad", { autoClose: 1500 });
    }
  };

  // ✅ Abrir modal con datos del item
  const openEdit = (item) => {
    setEditingItem(item._id);
    setEditData({
      name:        item.name,
      description: item.description,
      price:       item.price,
      category:    item.category,
    });
    setEditImage(null);
  };

  // ✅ Guardar cambios
  const handleUpdate = async () => {
    const price = Number(editData.price);
    if (price <= 0 || price > 9999) {
      toast.error("Precio inválido (1-9999)", { autoClose: 1500 });
      return;
    }

    const formData = new FormData();
    formData.append("id",          editingItem);
    formData.append("name",        editData.name);
    formData.append("description", editData.description);
    formData.append("price",       price);
    formData.append("category",    editData.category);
    if (editImage) formData.append("image", editImage);

    const response = await axios.post(`${url}/api/food/update`, formData);
    if (response.data.success) {
      toast.success("Producto actualizado", { autoClose: 1500 });
      setEditingItem(null);
      await fetchList();
    } else {
      toast.error(response.data.message, { autoClose: 1500 });
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
          <b>Disponible</b>
          <b>Editar</b>
          <b>Action</b>
        </div>

        {list.map((item) => (
          <div key={item._id} className="list-table-format">
            <img src={`${url}/images/${item.image}`} alt={item.name} />
            <p>{item.name}</p>
            <p>{item.category}</p>
            <p>S/{item.price}</p>

            <button
              onClick={() => toggleAvailability(item._id, item.available)}
              className={`toggle-btn ${item.available ? "available" : "unavailable"}`}
            >
              {item.available ? "Disponible" : "No disponible"}
            </button>

            {/* ✅ Botón editar */}
            <button onClick={() => openEdit(item)} className="edit-btn">
              Editar
            </button>

            <button onClick={() => removeFood(item._id)} className="cursor">
              Remove
            </button>
          </div>
        ))}
      </div>

      {/* ✅ Modal de edición */}
      {editingItem && (
        <div className="edit-modal-overlay">
          <div className="edit-modal">
            <h3>Editar Producto</h3>

            <label>Nombre</label>
            <input
              type="text"
              value={editData.name}
              maxLength={60}
              onChange={e => setEditData(prev => ({ ...prev, name: e.target.value }))}
            />

            <label>Descripción</label>
            <textarea
              rows={4}
              value={editData.description}
              maxLength={300}
              onChange={e => setEditData(prev => ({ ...prev, description: e.target.value }))}
            />

            <label>Precio (S/)</label>
            <input
              type="number"
              value={editData.price}
              min={1}
              max={9999}
              onKeyDown={e => ['e','E','+','-'].includes(e.key) && e.preventDefault()}
              onChange={e => setEditData(prev => ({ ...prev, price: e.target.value }))}
            />

            <label>Categoría</label>
            <select
              value={editData.category}
              onChange={e => setEditData(prev => ({ ...prev, category: e.target.value }))}
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

            <label>Nueva imagen (opcional)</label>
            <input
              type="file"
              accept="image/*"
              onChange={e => setEditImage(e.target.files[0])}
            />
            {editImage && (
              <img src={URL.createObjectURL(editImage)} alt="preview" className="edit-preview" />
            )}

            <div className="edit-modal-buttons">
              <button onClick={handleUpdate} className="btn-save">Guardar</button>
              <button onClick={() => setEditingItem(null)} className="btn-cancel-edit">Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

List.propTypes = {
  url: PropTypes.string.isRequired,
};

export default List;