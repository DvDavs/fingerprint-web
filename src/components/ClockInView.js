/*
// src/components/ClockInView.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

function ClockInView() {
  const [connected, setConnected] = useState(false);
  const [lastImage, setLastImage] = useState(null);
  const [readerName, setReaderName] = useState('');

  // Creamos el stompClient una sola vez con useState
  const [stompClient] = useState(() => {
    return new Client({
      // 1) Usamos SockJS, no definimos brokerURL directamente.
      webSocketFactory: () => new SockJS('http://localhost:8080/ws-fingerprint'),

      // 2) Opcional: logs de debug
      debug: (str) => {
        // console.log('STOMP: ', str);
      },

      // 3) Evento cuando se establece la conexión STOMP
      onConnect: () => {
        console.log('Conectado WebSocket STOMP');
        setConnected(true);

        // Nos suscribimos al canal donde el back publica huellas
        stompClient.subscribe('/topic/fingerprints', (message) => {
          const data = JSON.parse(message.body);
          setLastImage(data.base64);
          setReaderName(data.readerName);
        });
      },

      // 4) Evento cuando ocurre un error STOMP
      onStompError: (frame) => {
        console.error('Error STOMP: ', frame);
      },
    });
  });

  // Activamos/desactivamos el cliente STOMP en el ciclo de vida del componente
  useEffect(() => {
    stompClient.activate(); // inicia la conexión

    return () => {
      stompClient.deactivate(); // limpia la conexión al desmontar
    };
  }, [stompClient]);

  // Iniciar la captura continua en todos los lectores
  const startAll = async () => {
    try {
      const res = await axios.post('http://localhost:8080/api/v1/multi-fingerprint/capture/start');
      alert(res.data);
    } catch (err) {
      console.error(err);
      alert('Error al iniciar captura continua');
    }
  };

  // Detener la captura continua en todos los lectores
  const stopAll = async () => {
    try {
      const res = await axios.post('http://localhost:8080/api/v1/multi-fingerprint/capture/stop');
      alert(res.data);
    } catch (err) {
      console.error(err);
      alert('Error al detener captura continua');
    }
  };
  const autoSelectReaders = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/v1/multi-fingerprint/auto-select');
      alert(res.data);
    } catch (err) {
      console.error(err);
      alert('Error al hacer auto-select de lectores');
    }
  };

  return (
    <div>
      <h2>Reloj Checador / Captura Continua</h2>
      <p>WS: {connected ? 'Conectado' : 'Desconectado'}</p>
      <button onClick={autoSelectReaders}>Auto-Select Lectores</button>
        <hr />
      <button onClick={startAll}>Iniciar Captura Continua</button>
        <hr />
      <button onClick={stopAll}>Detener Captura Continua</button>

      {lastImage && (
        <div style={{ marginTop: '1rem' }}>
          <h3>Última Huella (lector: {readerName})</h3>
          <img
            src={`data:image/png;base64,${lastImage}`}
            alt="Última huella"
            style={{ border: '1px solid #ccc', maxWidth: '300px', display: 'block' }}
          />
        </div>
      )}
    </div>
  );
}

export default ClockInView;
*/