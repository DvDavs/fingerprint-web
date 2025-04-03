import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import axios from 'axios';

import ReaderSelection from "./components/ReaderSelection";
import Capture from "./components/Capture";
import Checador2Lector from "./components/Checador2Lector";
import Enrollment from "./components/Enrollment";
import UserList from "./components/UserList";
import UserForm from "./components/UserForm";

function App() {
  const [selectedReader, setSelectedReader] = useState(null);

  useEffect(() => {
    const handleUnload = async () => {
      const sessionId = localStorage.getItem('sessionId');
      if (selectedReader && sessionId) {
        try {
          await axios.post(`http://localhost:8080/api/v1/multi-fingerprint/release/${encodeURIComponent(selectedReader)}?sessionId=${sessionId}`);
        } catch (error) {
          console.error("Error al liberar lector en unload:", error);
        }
      }
    };
    window.addEventListener('beforeunload', handleUnload);
    return () => window.removeEventListener('beforeunload', handleUnload);
  }, [selectedReader]);

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <header className="bg-blue-600 text-white p-4">
          <h1 className="text-2xl font-bold">Fingerprint Web App</h1>
          <nav className="mt-2 space-x-4">
            <Link to="/">Inicio</Link>
            <Link to="/capture">Captura Normal</Link>
            <Link to="/checador">Checador</Link>
            <Link to="/enrollment">Enrolamiento</Link>
            <Link to="/users">Usuarios</Link>
          </nav>
        </header>
        <main className="p-4">
          <ReaderSelection onSelect={setSelectedReader} />
          <Routes>
            <Route path="/capture" element={<Capture selectedReader={selectedReader} />} />
            <Route path="/checador" element={<Checador2Lector selectedReader={selectedReader} />} />
            <Route path="/enrollment" element={<Enrollment selectedReader={selectedReader} userId={1} />} />
            <Route path="/users" element={
              <>
                <UserForm />
                <UserList />
              </>
            }/>
            <Route path="/" element={
              <div>
                <h2 className="text-xl font-bold mt-4">Bienvenido</h2>
                <p>Selecciona un lector y usa el menú para acciones.</p>
              </div>
            }/>
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
