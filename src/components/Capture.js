// src/components/Capture.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Capture = ({ selectedReader }) => {
  const [image, setImage] = useState(null);

  // Opción A: iniciar/stop captura y luego obtener la última imagen por GET
  const handleStartCapture = async () => {
    if (!selectedReader) {
      alert('No hay lector seleccionado');
      return;
    }
    try {
      const res = await axios.post(
        `http://localhost:8080/api/v1/multi-fingerprint/capture/start/${encodeURIComponent(selectedReader)}`
      );
      alert(res.data);
    } catch (error) {
      console.error('Error al iniciar captura:', error);
      alert('Error al iniciar captura');
    }
  };

  const handleStopCapture = async () => {
    if (!selectedReader) {
      alert('No hay lector seleccionado');
      return;
    }
    try {
      const res = await axios.post(
        `http://localhost:8080/api/v1/multi-fingerprint/capture/stop/${encodeURIComponent(selectedReader)}`
      );
      alert(res.data);
    } catch (error) {
      console.error('Error al detener captura:', error);
      alert('Error al detener captura');
    }
  };

  // Ejemplo de GET last image
  const fetchLastImage = async () => {
    if (!selectedReader) {
      alert('No hay lector seleccionado');
      return;
    }
    try {
      const res = await axios.get(
        `http://localhost:8080/api/v1/multi-fingerprint/last/${encodeURIComponent(selectedReader)}`
      );
      if (res.data && !res.data.startsWith('No hay huella')) {
        setImage(res.data);
      } else {
        alert(res.data);
      }
    } catch (error) {
      console.error('Error al obtener última huella:', error);
      alert('Error al obtener la huella');
    }
  };

  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Captura de Huella (Normal)</h2>
      <p>Lector seleccionado: <b>{selectedReader || 'Ninguno'}</b></p>
      <div className="flex space-x-4 my-4">
        <button onClick={handleStartCapture} className="bg-green-600 text-white p-2 rounded">
          Iniciar Captura
        </button>
        <button onClick={handleStopCapture} className="bg-red-600 text-white p-2 rounded">
          Detener Captura
        </button>
        <button onClick={fetchLastImage} className="bg-blue-600 text-white p-2 rounded">
          Ver Última Huella
        </button>
      </div>
      {image && (
        <div className="mt-4">
          <img
            src={`data:image/png;base64,${image}`}
            alt="Última huella"
            style={{ border: '1px solid gray' }}
          />
        </div>
      )}
    </div>
  );
};

export default Capture;
