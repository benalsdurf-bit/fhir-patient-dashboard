import { useState } from 'react'
import PatientList from './components/PatientList'
import PatientSummary from './components/PatientSummary'
import './App.css'

function App() {
  const [selectedPatientId, setSelectedPatientId] = useState(null);

  return (
    <div className="App">
      <header className="App-header">
        <h1>🏥 FHIR Patient Dashboard</h1>
        <p>Interactive patient data viewer using FHIR API</p>
      </header>
      
      <main className="App-main">
        {selectedPatientId ? (
          <PatientSummary 
            patientId={selectedPatientId}
            onBack={() => setSelectedPatientId(null)}
          />
        ) : (
          <PatientList onSelectPatient={setSelectedPatientId} />
        )}
      </main>

      <footer className="App-footer">
        <p>Built with React + HAPI FHIR Server | Data: Synthea Synthetic Patients</p>
      </footer>
    </div>
  );
}

export default App
