import React, { useState } from 'react';
import axios from 'axios';

const Capture = ({ selectedReader }) => {
  const [image, setImage] = useState(null);

  const handleCapture = async () => {
    alert('Por favor, coloca tu dedo en el lector y manténgalo hasta que se capture la huella');
    try {
      const response = await axios.get('http://localhost:8080/api/v1/fingerprint/capture');
      console.log('Fingerprint captured:', response.data);
      // Si la respuesta es JSON con mensaje de timeout, se muestra el mensaje
      try {
        const parsed = JSON.parse(response.data);
        if (parsed.status === "timeout") {
          alert(parsed.message);
        }
      } catch (err) {
        // Si no es JSON, se asume que es la imagen en base64
        alert('Huella capturada con éxito');
        setImage(response.data);
      }
    } catch (error) {
      console.error('Error al capturar huella:', error);
      alert('Error: ' + (error.response?.data || 'No se pudo capturar la huella'));
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Captura de Huella</h2>
      <button onClick={handleCapture} className="bg-green-500 text-white p-2 rounded mb-4">
        Capturar
      </button>
      {image && <img src={`data:image/png;base64,${image}`} alt="Fingerprint" className="max-w-full h-auto" />}
    </div>
  );
};

export default Capture;
