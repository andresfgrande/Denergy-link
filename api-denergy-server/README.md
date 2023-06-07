# Energy Contract API Documentation

This documentation provides an overview of the endpoints provided by our API.

## Base URL

All URLs referenced in this documentation have the following base in a local environment:

http://localhost:3000

This base URL represents the root of the API.

## Endpoints

## Installation

To run this project locally, follow these steps:

1. **Clone the repository**

   You can clone the repository by running the following command in your terminal:

2. **Install dependencies**

    ```bash
    npm install
    ```

2. **Run the project**

    ```bash
    node index.js
    ```


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
    "energyProduced": "<energy produced in kWh>"
}
```

### 3. Register Energy Consumption

- **URL:** `/registerEnergyConsumption`
- **Method:** `POST`
- **Data Params:**

```json
{
    "consumerAddress": "<consumer's Ethereum address>",
    "consumedEnergy": "<energy consumed in kWh>" 
}
```

### 4. Register Energy Production (Test)

- **URL:** `/registerEnergyProductionTest`
- **Method:** `POST`
- **Data Params:**

```json
{
    "energyProduced": "<energy produced in kWh>",
    "timestamp": "<UNIX timestamp>"
}
```


### 4. Register Energy Consumption (Test)

- **URL:** `/registerEnergyConsumptionTest`
- **Method:** `POST`
- **Data Params:**

```json
{
    "consumerAddress": "<consumer's Ethereum address>",
    "consumedEnergy": "<energy consumed in kWh>",
    "timestamp": "<UNIX timestamp>"
}
```