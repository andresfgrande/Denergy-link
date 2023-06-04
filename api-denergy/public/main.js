document.getElementById('energy-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const energyProduced = document.getElementById('energyProduced').value;

    fetch('http://localhost:3000/registerEnergyProduction', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            energyProduced: energyProduced,
        }),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
});

document.getElementById('consumption-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const consumerAddress = document.getElementById('consumerAddress').value;
    const consumedEnergy = document.getElementById('consumedEnergy').value;

    fetch('http://localhost:3000/registerEnergyConsumption', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            consumerAddress: consumerAddress,
            consumedEnergy: consumedEnergy,
        }),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
});

document.getElementById('production-test-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const energyProduced = document.getElementById('energyProducedTest').value;
    const timestampInput = document.getElementById('timestampTest').value;
    
    // Convert date string into timestamp in seconds
    const timestamp = Math.floor(new Date(timestampInput).getTime() / 1000);

    fetch('http://localhost:3000/registerEnergyProductionTest', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            energyProduced: energyProduced,
            timestamp: timestamp,
        }),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
});

document.getElementById('consumption-test-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const consumerAddress = document.getElementById('consumerAddressTest').value;
    const consumedEnergy = document.getElementById('consumedEnergyTest').value;
    const timestampInput = document.getElementById('timestampTestCon').value;
    
    // Convert date string into timestamp in seconds
    const timestamp = Math.floor(new Date(timestampInput).getTime() / 1000);

    fetch('http://localhost:3000/registerEnergyConsumptionTest', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            consumerAddress: consumerAddress,
            consumedEnergy: consumedEnergy,
            timestamp: timestamp,
        }),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
});
