import React, {useEffect, useState} from "react";
import "./Users.css"
import axios from "axios";
import {toast} from "react-toastify"

const Users = ({ url }) => {

  const [users, setUser] = useState([]);
    const fetchList = async ()=>{
        const response = await axios.get(`${url}/api/user/list`);
        if (response.data.success){
            setUser(response.data.data);
        }else{
            toast.error("ERROR");
        }
    }

    const removeuser = async (userID) =>{
        const response = await axios.post(`${url}/api/user/remove`,{id:userID});
        await fetchList();
        if(response.data.success){
            toast.success("Usuario removido correctamente", {
                    autoClose: 1500,
                  });
        }else{
            toast.error("Error al remover el item",{ autoClose:1500});
        }
    };
    useEffect(()=>{
        fetchList();
    },[]);


  return (
    <div className="list add flex-col users-section">
    <p>Lista de Usuarios</p>
    <div className="list-table">
        <div className="list-table-format title">
        <b>Nombre</b>
        <b>Email</b>
        <b>Acción</b>
        </div>
        {users.map((item, index) => (
        <div key={index} className="list-table-format">
            <p>{item.name}</p>
            <p>{item.email}</p>
            <button onClick={() => removeuser(item._id)} className="cursor">Eliminar</button>
        </div>
        ))}
    </div>
    </div>

);


};
export default Users;