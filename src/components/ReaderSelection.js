// ReaderSelection.js (refactor)
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ReaderSelection = ({ onSelect }) => {
  const [availableReaders, setAvailableReaders] = useState([]);
  const [selectedReader, setSelectedReader] = useState(null);

  useEffect(() => {
    // 1) Obtener solo los lectores disponibles
    axios.get('http://localhost:8080/api/v1/multi-fingerprint/available-readers')
      .then(response => {
        setAvailableReaders(response.data);
      })
      .catch(error => {
        console.error('Error al obtener lectores disponibles:', error);
        alert('No se pudieron cargar los lectores disponibles');
      });
  }, []);

  const handleSelect = async (readerName) => {
    try {
      // 2) Reservar lector
      const res = await axios.post(
        `http://localhost:8080/api/v1/multi-fingerprint/reserve/${encodeURIComponent(readerName)}`
      );
      if (res.status === 200) {
        setSelectedReader(readerName);
        onSelect(readerName); // Notificar al padre
        alert(`Lector reservado: ${readerName}`);
      }
    } catch (error) {
      console.error('Error al reservar lector:', error);
      alert('Error al reservar el lector');
    }
  };

  return (
    <div>
      <h2>Selecciona un lector</h2>
      <ul>
        {availableReaders.map(reader => (
          <li key={reader}>
            <button
              onClick={() => handleSelect(reader)}
              disabled={selectedReader === reader} // si ya está seleccionado
            >
              {reader}
            </button>
          </li>
        ))}
      </ul>
      {selectedReader && (
        <p>Lector seleccionado: {selectedReader}</p>
      )}
    </div>
  );
};

export default ReaderSelection;
