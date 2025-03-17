// src/App.js
import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import ReaderSelection from "./components/ReaderSelection";
import Capture from "./components/Capture";
import Verification from "./components/Verification";
import Identification from "./components/Identification";
import UserList from "./components/UserList";
import UserForm from "./components/UserForm";
import UserIdentification from "./components/UserIdentification";

function App() {
  const [selectedReader, setSelectedReader] = useState(null);

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <header className="bg-blue-600 text-white p-4">
          <h1 className="text-2xl font-bold">Fingerprint Web App</h1>
          <nav className="mt-4">
            <Link to="/" className="mr-4">Inicio</Link>
            <Link to="/capture" className="mr-4">Captura</Link>
            <Link to="/verification" className="mr-4">Verificación</Link>
            <Link to="/users" className="mr-4">Gestión de Usuarios</Link>
            <Link to="/user-identification" className="mr-4">Identificación de Usuario</Link>
          </nav>
        </header>
        <main className="p-4">
          <ReaderSelection onSelect={setSelectedReader} />
          <Routes>
            <Route path="/capture" element={<Capture selectedReader={selectedReader} />} />
            <Route path="/verification" element={<Verification selectedReader={selectedReader} />} />
            <Route path="/identification" element={<Identification selectedReader={selectedReader} />} />
            <Route path="/users" element={
              <>
                <UserForm selectedReader={selectedReader} />
                <UserList />
              </>
            } />
            <Route path="/user-identification" element={<UserIdentification />} />
            <Route path="/" element={
              <div>
                <h2 className="text-xl font-bold mt-4">Bienvenido a la aplicación de huellas</h2>
                <p>Selecciona un lector y navega por el menú.</p>
              </div>
            } />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;