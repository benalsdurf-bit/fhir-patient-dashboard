import { useState, useEffect } from 'react';
import fhirService from '../services/fhirService';
import './PatientSummary.css';

function PatientSummary({ patientId, onBack }) {
  const [patient, setPatient] = useState(null);
  const [conditions, setConditions] = useState([]);
  const [medications, setMedications] = useState([]);
  const [labResults, setLabResults] = useState([]);
  const [vitalSigns, setVitalSigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPatientData();
  }, [patientId]);

  const loadPatientData = async () => {
    try {
      setLoading(true);
      
      // Load all patient data in parallel
      const [
        patientData,
        conditionsBundle,
        medsBundle,
        labsBundle,
        vitalsBundle
      ] = await Promise.all([
        fhirService.getPatient(patientId),
        fhirService.getConditions(patientId),
        fhirService.getMedications(patientId),
        fhirService.getLabResults(patientId),
        fhirService.getVitalSigns(patientId)
      ]);

      setPatient(patientData);
      setConditions(conditionsBundle.entry?.map(e => e.resource) || []);
      setMedications(medsBundle.entry?.map(e => e.resource) || []);
      setLabResults(labsBundle.entry?.map(e => e.resource) || []);
      setVitalSigns(vitalsBundle.entry?.map(e => e.resource) || []);
    } catch (err) {
      console.error('Error loading patient data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading patient summary...</div>;
  if (!patient) return <div className="error">Patient not found</div>;

  return (
    <div className="patient-summary">
      <button onClick={onBack} className="back-button">← Back to Patient List</button>
      
      {/* Patient Demographics */}
      <section className="demographics">
        <h1>{fhirService.getPatientName(patient)}</h1>
        <div className="demo-grid">
          <div>
            <strong>DOB:</strong> {patient.birthDate} 
            ({fhirService.calculateAge(patient.birthDate)} years)
          </div>
          <div><strong>Gender:</strong> {patient.gender}</div>
          <div><strong>Patient ID:</strong> {patient.id}</div>
          {patient.address && patient.address[0] && (
            <div>
              <strong>Address:</strong> {patient.address[0].city}, {patient.address[0].state}
            </div>
          )}
        </div>
      </section>

      {/* Active Conditions */}
      <section className="conditions">
        <h2>Active Conditions</h2>
        {conditions.length === 0 ? (
          <p className="no-data">No active conditions</p>
        ) : (
          <ul className="condition-list">
            {conditions.map(condition => (
              <li key={condition.id}>
                <strong>{fhirService.getCodeDisplay(condition.code)}</strong>
                {condition.onsetDateTime && (
                  <span className="onset"> (since {condition.onsetDateTime.split('T')[0]})</span>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Current Medications */}
      <section className="medications">
        <h2>Current Medications</h2>
        {medications.length === 0 ? (
          <p className="no-data">No active medications</p>
        ) : (
          <ul className="med-list">
            {medications.map(med => (
              <li key={med.id}>
                <strong>{fhirService.getCodeDisplay(med.medicationCodeableConcept)}</strong>
                {med.dosageInstruction && med.dosageInstruction[0] && (
                  <div className="dosage">{med.dosageInstruction[0].text}</div>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Recent Lab Results */}
      <section className="lab-results">
        <h2>Recent Lab Results</h2>
        {labResults.length === 0 ? (
          <p className="no-data">No recent lab results</p>
        ) : (
          <table className="results-table">
            <thead>
              <tr>
                <th>Test</th>
                <th>Value</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {labResults.map(obs => (
                <tr key={obs.id}>
                  <td>{fhirService.getCodeDisplay(obs.code)}</td>
                  <td>
                    {obs.valueQuantity 
                      ? `${obs.valueQuantity.value} ${obs.valueQuantity.unit}`
                      : obs.valueString || 'N/A'
                    }
                  </td>
                  <td>{obs.effectiveDateTime?.split('T')[0]}</td>
                  <td>
                    {obs.interpretation && obs.interpretation[0] && (
                      <span className={`status ${obs.interpretation[0].coding[0].code.toLowerCase()}`}>
                        {obs.interpretation[0].coding[0].code}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {/* Vital Signs */}
      <section className="vital-signs">
        <h2>Recent Vital Signs</h2>
        {vitalSigns.length === 0 ? (
          <p className="no-data">No recent vital signs</p>
        ) : (
          <div className="vitals-grid">
            {vitalSigns.map(obs => (
              <div key={obs.id} className="vital-card">
                <div className="vital-name">{fhirService.getCodeDisplay(obs.code)}</div>
                <div className="vital-value">
                  {obs.valueQuantity 
                    ? `${obs.valueQuantity.value} ${obs.valueQuantity.unit}`
                    : obs.component?.map(c => 
                        `${c.valueQuantity.value} ${c.valueQuantity.unit}`
                      ).join(' / ')
                  }
                </div>
                <div className="vital-date">{obs.effectiveDateTime?.split('T')[0]}</div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default PatientSummary;
