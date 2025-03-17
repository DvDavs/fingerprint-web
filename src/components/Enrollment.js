import React, { useState } from 'react';
import axios from 'axios';

const Enrollment = ({ selectedReader }) => {
  const [sessionId, setSessionId] = useState(null);
  const [message, setMessage] = useState('');
  const [captureCount, setCaptureCount] = useState(0);

  const startEnrollment = () => {
    if (!selectedReader) {
      alert('Selecciona un lector primero');
      return;
    }
    axios.post('http://localhost:8080/api/v1/fingerprint/enroll/start')
      .then(response => {
        setSessionId(response.data);
        setMessage('Enrolamiento iniciado. Captura la primera huella.');
        setCaptureCount(0);
      })
      .catch(error => {
        console.error('Error al iniciar enrolamiento:', error);
        setMessage('Error al iniciar el enrolamiento');
      });
  };

  const captureFingerprint = () => {
    if (!sessionId) {
      setMessage('Inicia el enrolamiento primero');
      return;
    }
    axios.post(`http://localhost:8080/api/v1/fingerprint/enroll/capture/${sessionId}`)
      .then(response => {
        setMessage(response.data);
        if (response.data.includes("captures remaining")) {
          setCaptureCount(prev => prev + 1);
        } else if (response.data === "Enrollment complete") {
          setSessionId(null);
          setCaptureCount(0);
        }
      })
      .catch(error => {
        console.error('Error al capturar huella para enrolamiento:', error);
        setMessage('Error al capturar la huella');
      });
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Enrolamiento de Huella</h2>
      <button onClick={startEnrollment} className="bg-blue-500 text-white p-2 rounded mb-4">
        Iniciar Enrolamiento
      </button>
      <button onClick={captureFingerprint} className="bg-green-500 text-white p-2 rounded mb-4">
        Capturar Huella
      </button>
      <p>{message}</p>
      {sessionId && <p>Capturas realizadas: {captureCount}/4</p>}
    </div>
  );
};

export default Enrollment;
