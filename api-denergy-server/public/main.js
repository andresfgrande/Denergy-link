const baseUrl = `${window.location.protocol}//${window.location.hostname}`;

/**
 * Simulation: call from IoT device for registering produced energy
 */
document.getElementById('energy-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const energyProduced = document.getElementById('energyProduced').value;
    const processingElement = document.getElementById('processing1');
    processingElement.style.display = 'block';

    fetch(`${baseUrl}/registerEnergyProduction`, {
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
        //Show succes message in frontend and transaction data
        console.log('Success:', data);
        alert('Transaction was successful! - ' + "tx hash: " +data.transactionHash);
        processingElement.style.display = 'none'; 
    })
    .catch((error) => {
        //Show success message in frontend and error data
        console.error('Error:', error);
        alert('An error occurred. Please try again.', error);
        processingElement.style.display = 'none'; 
    });
});

/**
 * Simulation: call from IoT device for registering consumed energy
 */
document.getElementById('consumption-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const consumerAddress = document.getElementById('consumerAddress').value;
    const consumedEnergy = document.getElementById('consumedEnergy').value;
    const processingElement = document.getElementById('processing2');
    processingElement.style.display = 'block';

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
        alert('Transaction was successful! - ' + "tx hash: " +data.transactionHash);
        processingElement.style.display = 'none'; 
    })
    .catch((error) => {
        console.error('Error:', error);
        alert('An error occurred. Please try again.', error);
        processingElement.style.display = 'none'; 
    });
});

document.getElementById('production-test-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const energyProduced = document.getElementById('energyProducedTest').value;
    const timestampInput = document.getElementById('timestampTest').value;
    const processingElement = document.getElementById('processing3');
    processingElement.style.display = 'block';
    
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
        alert('Transaction was successful! - ' + "tx hash: " +data.transactionHash);
        processingElement.style.display = 'none'; 
    })
    .catch((error) => {
        console.error('Error:', error);
        alert('An error occurred. Please try again.', error);
        processingElement.style.display = 'none'; 
    });
});

document.getElementById('consumption-test-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const consumerAddress = document.getElementById('consumerAddressTest').value;
    const consumedEnergy = document.getElementById('consumedEnergyTest').value;
    const timestampInput = document.getElementById('timestampTestCon').value;
    const processingElement = document.getElementById('processing4');
    processingElement.style.display = 'block';
    
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
        alert('Transaction was successful! - ' + "tx hash: " +data.transactionHash);
        processingElement.style.display = 'none'; 
    })
    .catch((error) => {
        console.error('Error:', error);
        alert('An error occurred. Please try again.', error);
        processingElement.style.display = 'none'; 
    });
});
