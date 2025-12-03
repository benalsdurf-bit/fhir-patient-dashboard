import { useState, useEffect } from 'react';
import fhirService from '../services/fhirService';
import './PatientList.css';

function PatientList({ onSelectPatient }) {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    try {
      setLoading(true);
      const bundle = await fhirService.getPatients(20);
      const patientResources = bundle.entry?.map(e => e.resource) || [];
      setPatients(patientResources);
      setError(null);
    } catch (err) {
      setError('Failed to load patients: ' + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading patients...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="patient-list">
      <h2>Patients ({patients.length})</h2>
      <div className="patient-cards">
        {patients.map(patient => (
          <div 
            key={patient.id} 
            className="patient-card"
            onClick={() => onSelectPatient(patient.id)}
          >
            <h3>{fhirService.getPatientName(patient)}</h3>
            <div className="patient-details">
              <p>
                <strong>DOB:</strong> {patient.birthDate} 
                {patient.birthDate && ` (${fhirService.calculateAge(patient.birthDate)} years)`}
              </p>
              <p><strong>Gender:</strong> {patient.gender}</p>
              <p><strong>ID:</strong> {patient.id}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PatientList;
