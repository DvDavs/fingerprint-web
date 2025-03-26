import React, { useState, useEffect } from 'react';
import axios from 'axios';

function generateSessionId() {
  return Math.random().toString(36).substring(2, 15);
}

const ReaderSelection = ({ onSelect }) => {
  const [readers, setReaders] = useState([]);
  const [selectedReader, setSelectedReader] = useState(null);

  // Obtener o generar sessionId y guardarlo en localStorage
  useEffect(() => {
    let sessionId = localStorage.getItem('sessionId');
    if (!sessionId) {
      sessionId = generateSessionId();
      localStorage.setItem('sessionId', sessionId);
    }
  }, []);

  useEffect(() => {
    axios.get('http://localhost:8080/api/v1/multi-fingerprint/auto-select')
      .then(response => {
        console.log('Lectores auto-seleccionados:', response.data);
        return axios.get('http://localhost:8080/api/v1/multi-fingerprint/readers');
      })
      .then(resp2 => {
        setReaders(resp2.data);
      })
      .catch(error => {
        console.error('Error al obtener lectores:', error);
        alert('No se pudieron cargar los lectores');
      });
  }, []);

  const handleSelect = async (reader) => {
    const sessionId = localStorage.getItem('sessionId');
    try {
      const res = await axios.post(
        `http://localhost:8080/api/v1/multi-fingerprint/reserve/${encodeURIComponent(reader)}?sessionId=${sessionId}`
      );
      console.log('Reserva lector:', res.data);
      setSelectedReader(reader);
      onSelect(reader);
      alert(`Lector reservado: ${reader}`);
    } catch (error) {
      console.error('Error al reservar lector:', error);
      alert('Error al reservar el lector');
    }
  };

  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Selecciona un lector</h2>
      {readers.length === 0 && <p>No hay lectores detectados</p>}
      <ul className="space-y-2">
        {readers.map(reader => (
          <li key={reader}>
            <button
              onClick={() => handleSelect(reader)}
              className={`w-full text-left p-2 rounded ${selectedReader === reader ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            >
              {reader}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ReaderSelection;
