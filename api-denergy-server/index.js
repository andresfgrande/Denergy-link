// Initialize values
const express = require('express');
const cors = require('cors');
const Web3 = require('web3');
require('dotenv').config();
const productionAbi = require('./Abi/EnergyProductionAbi.json');
const consumptionAbi = require('./Abi/EnergyConsumptionAbi.json');
const energyApiConsumerAbi = require('./Abi/EnergyApiConsumerAbi.json');
const path = require('path');

// Configuration
const app = express();
app.use(cors());
app.use(express.json()); 
app.use(express.static(path.join(__dirname, 'public'))); // Statc files in directory public

// Set network provider
const web3 = new Web3(new Web3.providers.HttpProvider(process.env.WEB3_PROVIDER_URL));

// Set contract details
const contractProductionAddress = '0xf74b7507C29E3eE7453b05E6c086a55cDE12a0F9';
const contractConsumptionAddress = '0x5f097B1D6811E0948D60b9c8Aa17fCcB98128845'; 
const contractEnergyApiConsumerAddress = '0x91bD19A582aE9d34cb4fb949C355385c0cEa0aC4';  
const contract = new web3.eth.Contract(productionAbi, contractProductionAddress);
const contractConsumption = new web3.eth.Contract(consumptionAbi, contractConsumptionAddress); 
const contractEnergyApiConsumer = new web3.eth.Contract(energyApiConsumerAbi, contractEnergyApiConsumerAddress);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

/**
 * Regsiter energy production in EnergyProductionContract
 */
app.post('/registerEnergyProduction', async (req, res) => {
    let { energyProduced } = req.body;

    let productionCost = 0.03 + Math.random() * (0.075 - 0.03); //Simulation of the production energy price
    productionCost = web3.utils.toWei(productionCost.toString(), 'ether'); // Convert productionCost to Wei

    const functionAbi = contract.methods.registerEnergyProduction(energyProduced, productionCost).encodeABI();

    const tx = {
        from: process.env.OWNER_ADDRESS,
        to: contractProductionAddress,
        gas: 2000000,
        data: functionAbi,
    };

    try {
        const privateKey = process.env.OWNER_PRIVATE_KEY;
        const signedTx = await web3.eth.accounts.signTransaction(tx, privateKey);
        const result = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
        res.send({ transactionHash: result.transactionHash });
    } catch (error) {
        res.status(400).send(error.toString());
    }
});

/**
 * Register energy consumption in EnergyConsumptionContract
 */
app.post('/registerEnergyConsumption', async (req, res) => {
    const { consumerAddress, consumedEnergy } = req.body;

    const functionAbi = contractConsumption.methods.registerEnergyConsumption(consumerAddress, consumedEnergy).encodeABI();

    const tx = {
        from: process.env.OWNER_ADDRESS,
        to: contractConsumptionAddress,
        gas: 2000000,
        data: functionAbi,
    };

    try {
        const privateKey = process.env.OWNER_PRIVATE_KEY;
        const signedTx = await web3.eth.accounts.signTransaction(tx, privateKey);
        const result = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
        res.send({ transactionHash: result.transactionHash });
    } catch (error) {
        res.status(400).send(error.toString());
    }
});

/**
 * Register energy production in EnergyProductionContract using test method
 */
app.post('/registerEnergyProductionTest', async (req, res) => {
    const { energyProduced, timestamp } = req.body;

    let productionCost = 0.03 + Math.random() * (0.075 - 0.03); //Simulation of the production energy price
    productionCost = web3.utils.toWei(productionCost.toString(), 'ether'); // Convert productionCost to Wei

    const functionAbi = contract.methods.registerEnergyProductionTest(energyProduced, productionCost, timestamp).encodeABI();

    const tx = {
        from: process.env.OWNER_ADDRESS,
        to: contractProductionAddress,
        gas: 2000000,
        data: functionAbi,
    };

    try {
        const privateKey = process.env.OWNER_PRIVATE_KEY;
        const signedTx = await web3.eth.accounts.signTransaction(tx, privateKey);
        const result = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
        res.send({ transactionHash: result.transactionHash });
    } catch (error) {
        res.status(400).send(error.toString());
    }
});

/**
 * Register energy consumption test in EnergyConsumptionContract
 */
app.post('/registerEnergyConsumptionTest', async (req, res) => {
    const { consumerAddress, consumedEnergy, timestamp } = req.body;

    const functionAbi = contractConsumption.methods.registerEnergyConsumptionTest(consumerAddress, consumedEnergy, timestamp).encodeABI();

    const tx = {
        from: process.env.OWNER_ADDRESS,
        to: contractConsumptionAddress,
        gas: 2000000,
        data: functionAbi,
    };

    try {
        const privateKey = process.env.OWNER_PRIVATE_KEY;
        const signedTx = await web3.eth.accounts.signTransaction(tx, privateKey);
        const result = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
        res.send({ transactionHash: result.transactionHash });
    } catch (error) {
        res.status(400).send(error.toString());
    }
});

/****************************/

function calculateHourDelay(){
    const currentTime = new Date();
    const nextHour = new Date();
    nextHour.setHours(nextHour.getHours() + 1);
    nextHour.setMinutes(0);
    nextHour.setSeconds(0);
    const delay = nextHour - currentTime;
    return delay;
}

async function executeEveryHour() {
    
    var delay = calculateHourDelay();

    // Call requestEnergyPrice from EnergyApiConsumer contract for update energy price value
    const functionAbi = contractEnergyApiConsumer.methods.requestEnergyPrice().encodeABI();
    const tx = {
        from: process.env.OWNER_ADDRESS,
        to: contractEnergyApiConsumerAddress,
        gas: 2000000,
        data: functionAbi,
    };

    try {
        const privateKey = process.env.OWNER_PRIVATE_KEY;
        const signedTx = await web3.eth.accounts.signTransaction(tx, privateKey);
        await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
    } catch (error) {
        console.error(`Failed to call requestEnergyPrice: ${error.toString()}`);
    }

    // Schedule the next execution at the start of the next hour
    setTimeout(executeEveryHour, delay);
}

async function firstExecution(){
    // Calculate initial delay and initial execution to update energy price
    const functionAbi = contractEnergyApiConsumer.methods.requestEnergyPrice().encodeABI();
    const tx = {
        from: process.env.OWNER_ADDRESS,
        to: contractEnergyApiConsumerAddress,
        gas: 2000000,
        data: functionAbi,
    };

    try {
        const privateKey = process.env.OWNER_PRIVATE_KEY;
        const signedTx = await web3.eth.accounts.signTransaction(tx, privateKey);
        await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
    } catch (error) {
        console.error(`Failed to call requestEnergyPrice: ${error.toString()}`);
    }
}
  
  firstExecution();
  var initialDelay = calculateHourDelay();
  setTimeout(executeEveryHour, initialDelay);

app.listen(5339, () => console.log('App listening on port 5339!'));

