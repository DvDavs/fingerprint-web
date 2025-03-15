import React, { useState } from 'react';
import axios from 'axios';

const Identification = ({ selectedReader }) => {
  const [message, setMessage] = useState('');
  const [enrolledCount, setEnrolledCount] = useState(0);

  const enrollFingerprint = () => {
    if (!selectedReader) {
      alert('Selecciona un lector primero');
      return;
    }
    axios.post('http://localhost:8080/api/fingerprint/identify/enroll')
      .then(response => {
        setMessage(response.data);
        setEnrolledCount(prev => prev + 1);
      })
      .catch(error => {
        console.error('Error al enrolar huella para identificación:', error);
        setMessage('Error al enrolar la huella');
      });
  };

  const identifyFingerprint = () => {
    if (!selectedReader) {
      alert('Selecciona un lector primero');
      return;
    }
    if (enrolledCount === 0) {
      setMessage('Enrola al menos una huella primero');
      return;
    }
    axios.post('http://localhost:8080/api/fingerprint/identify')
      .then(response => setMessage(response.data))
      .catch(error => {
        console.error('Error al identificar huella:', error);
        setMessage('Error al identificar la huella');
      });
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Identificación de Huella</h2>
      <button onClick={enrollFingerprint} className="bg-blue-500 text-white p-2 rounded mb-4">
        Enrolar Huella
      </button>
      <button onClick={identifyFingerprint} className="bg-green-500 text-white p-2 rounded mb-4">
        Identificar Huella
      </button>
      <p>{message}</p>
      <p>Huellas enroladas: {enrolledCount}</p>
    </div>
  );
};

export default Identification;