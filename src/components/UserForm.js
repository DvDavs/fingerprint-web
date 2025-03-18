// src/components/UserForm.js
import React, { useState } from 'react';
import axios from 'axios';

const UserForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  // Guardaremos el userId que nos devuelve el back al crear usuario
  const [userId, setUserId] = useState(null);

  // Para la sesión de enrolamiento
  const [enrollmentSession, setEnrollmentSession] = useState(null);
  const [enrollmentMessage, setEnrollmentMessage] = useState('');

  // 1) Crear usuario (sin huella)
  const createBaseUser = () => {
    axios.post('http://localhost:8080/api/users', { name, email })
      .then(response => {
        const createdUser = response.data;
        setUserId(createdUser.id); // guardamos el ID en el estado
        alert('Usuario creado sin huella. ID=' + createdUser.id);
      })
      .catch(error => {
        console.error('Error al crear usuario:', error);
        alert('Error al crear usuario.');
      });
  };

  // 2) Iniciar enrolamiento
  const startEnrollment = () => {
    if (!userId) {
      alert('Primero crea el usuario para obtener un userId');
      return;
    }
    axios.post('http://localhost:8080/api/v1/fingerprint/enroll/start')
      .then(response => {
        setEnrollmentSession(response.data); // sessionId
        setEnrollmentMessage('Enrolamiento iniciado. Captura la primera huella.');
      })
      .catch(error => {
        console.error('Error al iniciar enrolamiento:', error);
        setEnrollmentMessage('Error al iniciar enrolamiento.');
      });
  };

  // 3) Capturar huella (cada llamada hace una de las 4 capturas)
  const captureEnrollment = () => {
    if (!enrollmentSession) {
      alert('Inicia el enrolamiento primero (no hay sessionId)');
      return;
    }
    if (!userId) {
      alert('No tenemos userId. Crea un usuario primero.');
      return;
    }
    axios.post(`http://localhost:8080/api/v1/fingerprint/enroll/capture/${enrollmentSession}/${userId}`)
      .then(response => {
        const data = response.data;
        if (data.complete) {
          // Se completó la cuarta captura.
          // El back-end ya guardó la huella en la BD (gracias a userId).
          setEnrollmentMessage('Enrolamiento completo. Huella guardada en el usuario.');
          setEnrollmentSession(null); // ya no hay session en curso
        } else {
          // Aún faltan capturas
          setEnrollmentMessage(data.message); // "Capture successful, X captures remaining"
        }
      })
      .catch(error => {
        console.error('Error al capturar huella:', error);
        setEnrollmentMessage('Error al capturar huella.');
      });
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Gestionar Usuario y Huella (Opción A)</h2>

      <div className="space-y-4 mb-6">
        {/* Datos básicos del usuario */}
        <div>
          <label className="block mb-1">Nombre:</label>
          <input
            type="text"
            className="border p-2 w-full"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label className="block mb-1">Email:</label>
          <input
            type="email"
            className="border p-2 w-full"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <button
          type="button"
          onClick={createBaseUser}
          className="bg-blue-500 text-white p-2 rounded"
        >
          Crear Usuario (sin huella)
        </button>
      </div>

      {userId && (
        <p>Usuario creado con ID = {userId}</p>
      )}

      <hr className="my-4" />

      <div className="space-y-2">
        <button
          type="button"
          onClick={startEnrollment}
          className="bg-green-500 text-white p-2 rounded"
        >
          Iniciar Enrolamiento
        </button>
        <button
          type="button"
          onClick={captureEnrollment}
          className="bg-green-500 text-white p-2 rounded"
        >
          Capturar Huella
        </button>
        <p>{enrollmentMessage}</p>
      </div>
    </div>
  );
};

export default UserForm;
