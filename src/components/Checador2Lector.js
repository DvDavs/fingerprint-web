import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

function Checador2Lector({ selectedReader }) {
  const [readerName] = useState(selectedReader || ''); // readerName es fijo por props
  const [connected, setConnected] = useState(false);
  const [lastImage, setLastImage] = useState(null);
  const [availableReaders, setAvailableReaders] = useState([]);
  const subscriptionRef = useRef(null);
  const stompClient = useRef(null);

  // Inicialización del WebSocket
  useEffect(() => {
    stompClient.current = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/ws-fingerprint'),
      onConnect: () => {
        console.log('Conectado al WebSocket STOMP');
        setConnected(true);
        subscribeToReader();
      },
      onStompError: (frame) => {
        console.error('Error STOMP:', frame);
        setConnected(false);
      },
      onDisconnect: () => {
        console.log('Desconectado del WebSocket');
        setConnected(false);
      },
    });

    stompClient.current.activate();

    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
      }
      stompClient.current.deactivate();
    };
  }, []); // Solo se ejecuta al montar el componente

  // Función para suscribirse al topic del lector
  const subscribeToReader = () => {
    if (!readerName || !stompClient.current.active) return;

    if (subscriptionRef.current) {
      subscriptionRef.current.unsubscribe();
    }

    subscriptionRef.current = stompClient.current.subscribe(
      `/topic/fingerprints/${readerName}`,
      (message) => {
        const data = JSON.parse(message.body);
        if (data.readerName === readerName) { // Filtrar por readerName
          setLastImage(data.base64);
          // Opcional: Guardar en localStorage
          localStorage.setItem(`fingerprint_${readerName}`, data.base64);
        }
      }
    );
    console.log(`Suscrito al topic: /topic/fingerprints/${readerName}`);
  };

  // Reconectar la suscripción si cambia el estado de conexión
  useEffect(() => {
    if (connected && readerName) {
      subscribeToReader();
    }
  }, [connected, readerName]);

  // Cargar lectores disponibles
  const fetchAvailableReaders = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/v1/multi-fingerprint/readers');
      setAvailableReaders(response.data);
    } catch (error) {
      console.error('Error al obtener lectores:', error);
      setAvailableReaders([]);
    }
  };

  // Iniciar captura
  const startCapture = async () => {
    if (!readerName) {
      alert('No se ha asignado un lector a esta instancia');
      return;
    }
    try {
      const res = await axios.post(
        `http://localhost:8080/api/v1/multi-fingerprint/capture/start/${encodeURIComponent(readerName)}`
      );
      alert(res.data);
    } catch (error) {
      console.error('Error al iniciar captura:', error);
      alert('Error al iniciar captura');
    }
  };

  // Limpiar imagen
  const clearImage = () => setLastImage(null);

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        Checador de Huellas - Lector {readerName}
      </h2>

      <p className="mb-4">
        Estado WebSocket:{' '}
        <span className={connected ? 'text-green-500' : 'text-red-500'}>
          {connected ? 'Conectado' : 'Desconectado'}
        </span>
      </p>

      <div className="mb-4">
        <p className="text-gray-700 font-medium">Lector Asignado: {readerName || 'Ninguno'}</p>
        <button
          onClick={fetchAvailableReaders}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition mt-2"
        >
          Ver Lectores Disponibles
        </button>
      </div>

      <div className="flex space-x-4 mb-4">
        <button
          onClick={startCapture}
          className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition disabled:bg-gray-400"
          disabled={!readerName || !connected}
        >
          Iniciar Captura
        </button>
        <button
          onClick={clearImage}
          className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition"
        >
          Limpiar Imagen
        </button>
      </div>

      {lastImage && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Última Huella Recibida (Lector: {readerName})
          </h3>
          <img
            src={`data:image/png;base64,${lastImage}`}
            alt="Huella dactilar"
            className="border border-gray-300 rounded-md max-w-xs"
          />
        </div>
      )}
    </div>
  );
}

export default Checador2Lector;