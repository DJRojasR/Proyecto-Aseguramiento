import React, { useEffect, useState, useCallback } from "react";
import PropTypes from "prop-types"; // ✅ Faltaba este import
import "./Users.css";
import axios from "axios";
import { toast } from "react-toastify";

const Users = ({ url }) => {
  const [users, setUsers] = useState([]); // ✅ setUsers (consistente)

  const fetchList = useCallback(async () => {
    const response = await axios.get(`${url}/api/user/list`);
    if (response.data.success) {
      setUsers(response.data.data);
    } else {
      toast.error("ERROR");
    }
  }, [url]);

  const removeUser = async (userID) => {
    const response = await axios.post(`${url}/api/user/remove`, { id: userID });
    await fetchList();
    if (response.data.success) {
      toast.success("Usuario removido correctamente", { autoClose: 1500 });
    } else {
      toast.error("Error al remover el item", { autoClose: 1500 });
    }
  };

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  return (
    <div className="list add flex-col users-section">
      <p>Lista de Usuarios</p>
      <div className="list-table">
        <div className="list-table-format title">
          <b>Nombre</b>
          <b>Email</b>
          <b>Acción</b>
        </div>
        {users.map((item) => (
          <div key={item._id} className="list-table-format"> {/* ✅ item._id no index._id */}
            <p>{item.name}</p>
            <p>{item.email}</p>
            <button onClick={() => removeUser(item._id)} className="cursor">
              Eliminar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

Users.propTypes = {
  url: PropTypes.string.isRequired,
};

export default Users;