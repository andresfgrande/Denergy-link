# Energy Contract API Documentation

This documentation provides an overview of the endpoints provided by our API.

## Base URL

All URLs referenced in this documentation have the following base:

http://localhost:3000

This base URL represents the root of the API.

## Endpoints

### 1. Home Page

- **URL:** `/`
- **Method:** `GET`
- **Description:** Fetches the main HTML file for the application.

### 2. Register Energy Production

- **URL:** `/registerEnergyProduction`
- **Method:** `POST`
- **Data Params:**

```json
{
    "energyProduced": "<energy produced in kilowatts>"
}