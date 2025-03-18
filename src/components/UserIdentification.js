// src/components/UserIdentification.js
import React, { useState } from 'react';
import axios from 'axios';

const UserIdentification = () => {
  const [message, setMessage] = useState('');
  const [user, setUser] = useState(null);

  const identifyUser = () => {
    // Llama al endpoint de identificación de usuario basado en huella
    axios.post('http://localhost:8080/api/users/identify')
      .then(response => {
        setUser(response.data);
        setMessage('Usuario identificado: ' + response.data.name);
      })
      .catch(error => {
        console.error("Error identificando usuario: ", error);
        setMessage('No se pudo identificar al usuario.');
        setUser(null);
      });
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Identificación de Usuario por Huella</h2>
      <button onClick={identifyUser} className="bg-green-500 text-white p-2 rounded mb-4">
        Identificar Usuario
      </button>
      {message && <p>{message}</p>}
      {user && (
        <div className="mt-4">
          <h3 className="font-bold">Detalles del Usuario:</h3>
          <p>ID: {user.id}</p>
          <p>Nombre: {user.name}</p>
          <p>Email: {user.email}</p>
        </div>
      )}
    </div>
  );
};

export default UserIdentification;
