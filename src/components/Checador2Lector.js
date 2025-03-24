// src/components/Checador2Lector.js
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

function Checador2Lector({ selectedReader }) {
  const [readerName] = useState(selectedReader || '');
  const [connected, setConnected] = useState(false);
  const [lastImage, setLastImage] = useState(null);
  const [lastChecadorEvent, setLastChecadorEvent] = useState(null);

  const subscriptionFingerprintRef = useRef(null);
  const subscriptionChecadorRef = useRef(null);
  const stompClient = useRef(null);

  useEffect(() => {
    stompClient.current = new Client({
      // Socket
      webSocketFactory: () => new SockJS('http://localhost:8080/ws-fingerprint'),
      // Callbacks
      onConnect: () => {
        console.log('[Checador2Lector] STOMP conectado');
        setConnected(true);
        subscribeToReaderTopics();
      },
      onStompError: (frame) => {
        console.error('[Checador2Lector] STOMP error:', frame);
      },
      onDisconnect: () => {
        console.log('[Checador2Lector] STOMP desconectado');
        setConnected(false);
      },
    });
    stompClient.current.activate();

    // Cleanup
    return () => {
      if (subscriptionFingerprintRef.current) {
        subscriptionFingerprintRef.current.unsubscribe();
      }
      if (subscriptionChecadorRef.current) {
        subscriptionChecadorRef.current.unsubscribe();
      }
      stompClient.current.deactivate();
    };
  }, []);

  const subscribeToReaderTopics = () => {
    if (!readerName || !stompClient.current.active) return;

    // Suscripción a /topic/fingerprints/{readerName}
    subscriptionFingerprintRef.current = stompClient.current.subscribe(
      `/topic/fingerprints/${readerName}`,
      (message) => {
        const data = JSON.parse(message.body);
        setLastImage(data.base64);
      }
    );

    // Suscripción a /topic/checador/{readerName}
    subscriptionChecadorRef.current = stompClient.current.subscribe(
      `/topic/checador/${readerName}`,
      (message) => {
        const evt = JSON.parse(message.body);
        setLastChecadorEvent(evt);
        console.log('ChecadorEvent recibido:', evt);
      }
    );

    console.log(`Suscrito a: /topic/fingerprints/${readerName} y /topic/checador/${readerName}`);
  };

  const startChecador = async () => {
    if (!readerName) {
      alert('No hay lector asignado');
      return;
    }
    try {
      const res = await axios.post(
        `http://localhost:8080/api/v1/multi-fingerprint/checador/start/${encodeURIComponent(readerName)}`
      );
      alert(res.data);
    } catch (error) {
      console.error('Error al iniciar checador:', error);
      alert('Error al iniciar checador');
    }
  };

  const stopChecador = async () => {
    if (!readerName) {
      alert('No hay lector asignado');
      return;
    }
    try {
      const res = await axios.post(
        `http://localhost:8080/api/v1/multi-fingerprint/checador/stop/${encodeURIComponent(readerName)}`
      );
      alert(res.data);
    } catch (error) {
      console.error('Error al detener checador:', error);
      alert('Error al detener checador');
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        Checador (2 Lector) - Lector: {readerName}
      </h2>
      <p className="mb-4">
        Estado WebSocket:{' '}
        <span className={connected ? 'text-green-500' : 'text-red-500'}>
          {connected ? 'Conectado' : 'Desconectado'}
        </span>
      </p>

      <div className="flex space-x-4 mb-4">
        <button
          onClick={startChecador}
          className="bg-green-500 text-white px-4 py-2 rounded-md"
          disabled={!connected || !readerName}
        >
          Iniciar Checador
        </button>
        <button
          onClick={stopChecador}
          className="bg-red-500 text-white px-4 py-2 rounded-md"
          disabled={!connected || !readerName}
        >
          Detener Checador
        </button>
      </div>

      {lastImage && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Última Huella Recibida
          </h3>
          <img
            src={`data:image/png;base64,${lastImage}`}
            alt="Huella"
            className="border border-gray-300 rounded-md max-w-xs"
          />
        </div>
      )}

      {lastChecadorEvent && (
        <div className="mt-6 p-4 border border-green-400 bg-green-50 rounded">
          <h4 className="font-bold mb-2">¡Usuario identificado!</h4>
          <p>ID: {lastChecadorEvent.userId}</p>
          <p>Nombre: {lastChecadorEvent.userName}</p>
          <p>Email: {lastChecadorEvent.userEmail}</p>
        </div>
      )}
    </div>
  );
}

export default Checador2Lector;
