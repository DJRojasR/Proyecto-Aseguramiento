import React, { useEffect, useState, useCallback } from "react";
import PropTypes from "prop-types";
import "./Users.css";
import axios from "axios";
import { toast } from "react-toastify";

const Users = ({ url }) => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState(""); // ✅ estado del buscador

  const fetchList = useCallback(async () => {
    const response = await axios.get(`${url}/api/user/list`);
    if (response.data.success) {
      setUsers(response.data.data);
    } else {
      toast.error("ERROR");
    }
  }, [url]);

  const removeUser = async (userID, userName) => {
    // ✅ Confirmación antes de eliminar
    const confirmed = window.confirm(`¿Estás seguro de eliminar al usuario "${userName}"? Esta acción no se puede deshacer.`);
    if (!confirmed) return;

    const response = await axios.post(`${url}/api/user/remove`, { id: userID });
    await fetchList();
    if (response.data.success) {
      toast.success("Usuario removido correctamente", { autoClose: 1500 });
    } else {
      toast.error("Error al remover el usuario", { autoClose: 1500 });
    }
  };

  const toggleRole = async (userID, currentRole) => {
    const newRole = currentRole === "admin" ? "customer" : "admin";
    const response = await axios.post(`${url}/api/user/update-role`, {
      id: userID,
      role: newRole,
    });
    if (response.data.success) {
      toast.success(`Rol cambiado a ${newRole}`, { autoClose: 1500 });
      await fetchList();
    } else {
      toast.error("Error al cambiar el rol", { autoClose: 1500 });
    }
  };

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  // ✅ Filtrar por nombre o email
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(search.toLowerCase()) ||
    user.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="list add flex-col users-section">
      <p>Lista de Usuarios</p>

      {/* ✅ Barra de búsqueda */}
      <div className="user-search-bar">
        <input
          type="text"
          placeholder="Buscar por nombre o email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="user-search-input"
        />
        {search && (
          <button onClick={() => setSearch("")} className="user-search-clear">
            ✕ Limpiar
          </button>
        )}
      </div>

      {/* ✅ Contador de resultados */}
      <p className="user-search-count">
        {filteredUsers.length} usuario{filteredUsers.length !== 1 ? "s" : ""} encontrado{filteredUsers.length !== 1 ? "s" : ""}
      </p>

      <div className="list-table">
        <div className="list-table-format title">
          <b>Nombre</b>
          <b>Email</b>
          <b>Rol</b>
          <b>Acción</b>
        </div>

        {filteredUsers.length > 0 ? filteredUsers.map((item) => (
          <div key={item._id} className="list-table-format">
            <p>{item.name}</p>
            <p>{item.email}</p>

            <div className="role-cell">
              <span className={`role-badge ${item.role === "admin" ? "role-admin" : "role-customer"}`}>
                {item.role === "admin" ? "Admin" : "Cliente"}
              </span>
              <button
                onClick={() => toggleRole(item._id, item.role)}
                className="role-toggle-btn"
              >
                {item.role === "admin" ? "Quitar Admin" : "Hacer Admin"}
              </button>
            </div>

            <button onClick={() => removeUser(item._id, item.name)} className="cursor">
              Eliminar
            </button>
          </div>
        )) : (
          // ✅ Mensaje si no hay resultados
          <p className="user-no-results">No se encontraron usuarios con "{search}"</p>
        )}
      </div>
    </div>
  );
};

Users.propTypes = {
  url: PropTypes.string.isRequired,
};

export default Users;