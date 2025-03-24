import React, { useState } from 'react';
import axios from 'axios';

const Verification = ({ selectedReader }) => {
  const [message, setMessage] = useState('');
  const [verificationStarted, setVerificationStarted] = useState(false);

  const startVerification = () => {
    if (!selectedReader) {
      alert('Selecciona un lector primero');
      return;
    }
    axios.post('http://localhost:8080/api/v1/fingerprint/verify/start')
      .then(response => {
        setMessage('Verificación iniciada. Captura la primera huella.');
        setVerificationStarted(true);
      })
      .catch(error => {
        console.error('Error al iniciar verificación:', error);
        setMessage('Error al iniciar la verificación');
      });
  };

  const captureFingerprint = () => {
    if (!verificationStarted) {
      setMessage('Inicia la verificación primero');
      return;
    }
    axios.post(
      'http://localhost:8080/api/v1/fingerprint/capture',
      null,
      { params: { mode: 'verify' } }
    )
      .then(response => {
        setMessage(response.data);
        // Si la respuesta indica el resultado de la verificación, se reinicia el estado
        if (
          response.data.toLowerCase().includes("match") ||
          response.data.toLowerCase().includes("do not match")
        ) {
          setVerificationStarted(false);
        }
      })
      .catch(error => {
        console.error('Error al capturar huella para verificación:', error);
        setMessage('Error al capturar la huella');
      });
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Verificación de Huella</h2>
      <button onClick={startVerification} className="bg-blue-500 text-white p-2 rounded mb-4">
        Iniciar Verificación
      </button>
      <button onClick={captureFingerprint} className="bg-green-500 text-white p-2 rounded mb-4">
        Capturar Huella
      </button>
      <p>{message}</p>
    </div>
  );
};

export default Verification;
