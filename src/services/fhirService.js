import axios from 'axios';

const FHIR_BASE_URL = '/fhir';

class FHIRService {
  async getPatients(count = 20) {
    const response = await axios.get(`${FHIR_BASE_URL}/Patient?_count=${count}`);
    return response.data;
  }

  async getPatient(patientId) {
    const response = await axios.get(`${FHIR_BASE_URL}/Patient/${patientId}`);
    return response.data;
  }

  async getConditions(patientId) {
    const response = await axios.get(
      `${FHIR_BASE_URL}/Condition?patient=${patientId}&clinical-status=active`
    );
    return response.data;
  }

  async getMedications(patientId) {
    const response = await axios.get(
      `${FHIR_BASE_URL}/MedicationRequest?patient=${patientId}&status=active`
    );
    return response.data;
  }

  async getLabResults(patientId) {
    const response = await axios.get(
      `${FHIR_BASE_URL}/Observation?patient=${patientId}&category=laboratory&_sort=-date&_count=10`
    );
    return response.data;
  }

  async getVitalSigns(patientId) {
    const response = await axios.get(
      `${FHIR_BASE_URL}/Observation?patient=${patientId}&category=vital-signs&_sort=-date&_count=5`
    );
    return response.data;
  }

  getPatientName(patient) {
    if (!patient.name || patient.name.length === 0) return 'Unknown';
    const name = patient.name[0];
    return `${name.given?.join(' ') || ''} ${name.family || ''}`.trim();
  }

  calculateAge(birthDate) {
    if (!birthDate) return null;
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  }

  getCodeDisplay(codeableConcept) {
    if (!codeableConcept) return 'Unknown';
    if (codeableConcept.text) return codeableConcept.text;
    if (codeableConcept.coding && codeableConcept.coding.length > 0) {
      return codeableConcept.coding[0].display || codeableConcept.coding[0].code;
    }
    return 'Unknown';
  }
}

export default new FHIRService();
