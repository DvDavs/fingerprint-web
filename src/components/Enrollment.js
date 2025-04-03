// src/components/Enrollment.js
import React, { useState } from 'react';
import axios from 'axios';

const Enrollment = ({ selectedReader, userId }) => {
  const [sessionId, setSessionId] = useState(null);
  const [info, setInfo] = useState('');

  const startEnrollment = async () => {
    if (!selectedReader) {
      alert('Selecciona un lector primero');
      return;
    }
    try {
      const res = await axios.post(
        `http://localhost:8080/api/v1/multi-fingerprint/enroll/start/${encodeURIComponent(selectedReader)}`
      );
      setSessionId(res.data);
      setInfo(`Enrolamiento iniciado. SessionId=${res.data}`);
    } catch (err) {
      console.error('Error al iniciar enrolamiento:', err);
      setInfo('Error al iniciar enrolamiento');
    }
  };

  const captureEnrollment = async () => {
    if (!sessionId) {
      alert('Inicia el enrolamiento primero');
      return;
    }
    try {
      // Enviamos userId si queremos guardar la huella
      const res = await axios.post(
        `http://localhost:8080/api/v1/multi-fingerprint/enroll/capture/${encodeURIComponent(selectedReader)}/${encodeURIComponent(sessionId)}?userId=${userId || ''}`
      );
      setInfo(JSON.stringify(res.data));
      if (res.data.complete) {
        alert('Enrolamiento completado. Template guardado en el usuario.');
        setSessionId(null);
      }
    } catch (err) {
      console.error('Error en captureEnrollment:', err);
      setInfo('Error al capturar huella');
    }
  };

  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Enrolamiento</h2>
      <p>Lector seleccionado: <b>{selectedReader || 'Ninguno'}</b></p>
      <p>Usuario ID (opcional): <b>{35 || '(no asignado)'}</b></p>

      <div className="flex space-x-4 my-4">
        <button onClick={startEnrollment} className="bg-blue-600 text-white p-2 rounded">
          Iniciar Enrolamiento
        </button>
        <button onClick={captureEnrollment} className="bg-green-600 text-white p-2 rounded">
          Capturar Huella
        </button>
      </div>

      <p className="text-sm text-gray-700">{info}</p>
    </div>
  );
};

export default Enrollment;
