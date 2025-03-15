import React, { useState } from "react";
import ReaderSelection from "./components/ReaderSelection";
import Capture from "./components/Capture";
import Enrollment from "./components/Enrollment";
import Verification from "./components/Verification";
import Identification from "./components/Identification";

function App() {
  const [selectedReader, setSelectedReader] = useState(null);

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white p-4">
        <h1 className="text-2xl font-bold">Fingerprint Web App</h1>
      </header>
      <main className="flex flex-col md:flex-row">
        <ReaderSelection onSelect={setSelectedReader} />
        <div className="flex-1 p-4">
          <Capture selectedReader={selectedReader} />
          <Enrollment selectedReader={selectedReader} />
          <Verification selectedReader={selectedReader} />
          <Identification selectedReader={selectedReader} />
        </div>
      </main>
    </div>
  );
}

export default App;
