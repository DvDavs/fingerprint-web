import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import ReaderSelection from "./components/ReaderSelection";
import Capture from "./components/Capture";
import Verification from "./components/Verification";
import Identification from "./components/Identification";
import UserList from "./components/UserList";
import UserForm from "./components/UserForm";
import UserIdentification from "./components/UserIdentification";
import Checador2Lector from "./components/Checador2Lector";

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
            <Link to="/checador2lector" className="mr-4">Checador 2 Lector</Link>
          </nav>
        </header>
        <main className="p-4">
          <ReaderSelection onSelect={setSelectedReader} />
          <Routes>
            <Route path="/capture" element={<Capture selectedReader={selectedReader} />} />
            <Route path="/verification" element={<Verification selectedReader={selectedReader} />} />
            <Route path="/identification" element={<Identification selectedReader={selectedReader} />} />
            <Route path="/users" element={
              <React.Fragment>
                <UserForm selectedReader={selectedReader} />
                <UserList />
              </React.Fragment>
            } />
            <Route path="/user-identification" element={<UserIdentification />} />
            <Route path="/checador2lector" element={<Checador2Lector selectedReader={selectedReader} />} />
            <Route path="/checador2lector/1" element={<Checador2Lector selectedReader="05ba&000a&0103{0196B5CE-B7C2-2D47-99E6-5A2DBBBB5049}" />} />
            <Route path="/checador2lector/2" element={<Checador2Lector selectedReader="05ba&000a&0103{5866AC33-6132-D545-A348-C5C2585B2D33}" />} />           
            

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