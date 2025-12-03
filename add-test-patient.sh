#!/bin/bash

curl -X POST http://localhost:8080/fhir/Patient \
  -H "Content-Type: application/fhir+json" \
  -d '{
  "resourceType": "Patient",
  "name": [
    {
      "use": "official",
      "family": "Smith",
      "given": ["John", "Robert"]
    }
  ],
  "gender": "male",
  "birthDate": "1974-05-15",
  "address": [
    {
      "use": "home",
      "line": ["123 Main St"],
      "city": "Brooklyn",
      "state": "NY",
      "postalCode": "11201"
    }
  ]
}'
