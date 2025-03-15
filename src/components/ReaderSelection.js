import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ReaderSelection = ({ onSelect }) => {
  const [readers, setReaders] = useState([]);
  const [selectedReader, setSelectedReader] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:8080/api/fingerprint/readers')
      .then(response => {
        console.log('Lectores obtenidos:', response.data);
        setReaders(response.data);
      })
      .catch(error => {
        console.error('Error al obtener lectores:', error);
        alert('No se pudieron cargar los lectores');
      });
  }, []);

  const handleSelect = (reader) => {
    axios.post('http://localhost:8080/api/fingerprint/select', null, { params: { readerName: reader } })
      .then(response => {
        console.log('Respuesta de selección:', response.data);
        if (response.data.includes("Reader selected")) {
          setSelectedReader(reader);
          onSelect(reader);
          alert(`Lector seleccionado: ${reader}`);
        } else {
          alert(`Error: ${response.data}`);
        }
      })
      .catch(error => {
        console.error('Error al seleccionar lector:', error);
        alert('Error al seleccionar el lector');
      });
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Selecciona un lector</h2>
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