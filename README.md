# FHIR Patient Dashboard

A React-based patient data viewer that integrates with FHIR APIs to display comprehensive patient medical records.

## 🎯 Features

- **Patient List View**: Browse all patients with demographics
- **Patient Detail View**: Click any patient to see their complete medical record
- **Medical Data Display**:
  - Active medical conditions with onset dates
  - Current medications with dosage instructions
  - Recent laboratory results with interpretation (High/Low/Normal)
  - Vital signs (blood pressure, weight, BMI, etc.)
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Real-time Data**: Direct integration with FHIR R4 API

## 🛠️ Tech Stack

- **Frontend**: React 18 with Vite
- **Backend**: HAPI FHIR Server (FHIR R4)
- **API Client**: Axios
- **Data**: Synthea synthetic patient generator
- **Deployment**: Docker

## 🚀 Quick Start

### Prerequisites

- Docker Desktop
- Node.js 18+
- Git

### Installation

1. **Clone the repository**
```bash
   git clone https://github.com/YOUR_USERNAME/fhir-patient-dashboard.git
   cd fhir-patient-dashboard
```

2. **Start FHIR server**
```bash
   docker run -d -p 8080:8080 --name fhir-server hapiproject/hapi:latest
```

3. **Install dependencies**
```bash
   npm install
```

4. **Start development server**
```bash
   npm run dev
```

5. **Open browser**
```
   http://localhost:5173
```

## 📊 Loading Sample Data

To populate the FHIR server with synthetic patient data:

1. **Generate patients with Synthea**
```bash
   cd ../
   git clone https://github.com/synthetichealth/synthea.git
   cd synthea
   ./run_synthea -p 10 "New York"
```

2. **Upload to FHIR server** (use the provided Python script)

## 🏗️ Architecture
```
┌─────────────────┐
│  React App      │  ← User Interface (Port 5173)
│  (Vite)         │
└────────┬────────┘
         │ HTTP Requests
         │ (Proxied)
         ▼
┌─────────────────┐
│  HAPI FHIR      │  ← Data Storage (Port 8080)
│  Server         │     FHIR R4 Compliant
│  (Docker)       │
└─────────────────┘
```

## 📁 Project Structure
```
fhir-patient-dashboard/
├── src/
│   ├── components/
│   │   ├── PatientList.jsx       # Patient list view
│   │   ├── PatientList.css
│   │   ├── PatientSummary.jsx    # Patient detail view
│   │   └── PatientSummary.css
│   ├── services/
│   │   └── fhirService.js        # FHIR API client
│   ├── App.jsx                   # Main app component
│   ├── App.css
│   └── main.jsx
├── vite.config.js                # Vite configuration with proxy
├── package.json
└── README.md
```

## 🔌 FHIR Resources Used

- **Patient**: Demographics and identifiers
- **Condition**: Active diagnoses (SNOMED CT, ICD-10 codes)
- **MedicationRequest**: Active prescriptions (RxNorm codes)
- **Observation (laboratory)**: Lab results with LOINC codes
- **Observation (vital-signs)**: BP, weight, BMI, etc.

## 🎨 Key Features

### Service Layer Pattern
Clean separation of concerns with `fhirService.js` handling all API interactions:
```javascript
await fhirService.getPatients(20);
await fhirService.getConditions(patientId);
await fhirService.getMedications(patientId);
```

### Parallel Data Loading
Efficient data fetching using Promise.all():
```javascript
const [patient, conditions, meds, labs, vitals] = 
  await Promise.all([...]);
```

### Responsive Grid Layouts
CSS Grid for adaptive layouts that work on any screen size.

## 🚧 Future Enhancements

- [ ] Search and filter patients
- [ ] Trending charts for lab values over time
- [ ] Care gaps detection
- [ ] Risk stratification scoring
- [ ] Export patient summary to PDF
- [ ] SMART on FHIR authentication


## 🤝 Contributing

This is a portfolio project, but feedback is welcome! Open an issue or submit a pull request.

## 📄 License

MIT License - feel free to use this code for your own projects.

## 👤 Author

Ben ALsdurf
---

Built with React + HAPI FHIR Server | Data: Synthea Synthetic Patients
