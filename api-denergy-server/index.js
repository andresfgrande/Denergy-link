// Initialize values
const express = require('express');
const cors = require('cors');
const Web3 = require('web3');
require('dotenv').config();
const productionAbi = require('./Abi/EnergyProductionAbi.json');
const consumptionAbi = require('./Abi/EnergyConsumptionAbi.json');
const path = require('path');

// Configuration
const app = express();
app.use(cors());
app.use(express.json()); 
app.use(express.static(path.join(__dirname, 'public'))); // Statc files in directory public

// Set network provider
const web3 = new Web3(new Web3.providers.HttpProvider(process.env.WEB3_PROVIDER_URL));

// Set contract details
const contractProductionAddress = '0x3b059F2aBd2A677406E04Bf379bF20C92e51CEe5';
const contractConsumptionAddress = '0xc4364bF88dA24A547658a25386bb49a2c08Ee609'; 
const contract = new web3.eth.Contract(productionAbi, contractProductionAddress);
const contractConsumption = new web3.eth.Contract(consumptionAbi, contractConsumptionAddress); // Create a new web3 instance for the consumption contract

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

/**
 * Regsiter energy production in EnergyProductionContract
 */
app.post('/registerEnergyProduction', async (req, res) => {
    let { energyProduced } = req.body;

    let productionCost = 0.055;
    productionCost = web3.utils.toWei(productionCost.toString(), 'ether'); // Convert productionCost to Wei

    const functionAbi = contract.methods.registerEnergyProduction(energyProduced, productionCost).encodeABI();

    const tx = {
        from: '0x626DB02134CB1E1a61483057a61315801809a71c',
        to: contractProductionAddress,
        gas: 2000000,
        data: functionAbi,
    };

    try {
        const privateKey = process.env.MY_PRIVATE_KEY;
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
        from: '0x626DB02134CB1E1a61483057a61315801809a71c',
        to: contractConsumptionAddress,
        gas: 2000000,
        data: functionAbi,
    };

    try {
        const privateKey = process.env.MY_PRIVATE_KEY;
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

    let productionCost = 0.055;
    productionCost = web3.utils.toWei(productionCost.toString(), 'ether'); // Convert productionCost to Wei

    const functionAbi = contract.methods.registerEnergyProductionTest(energyProduced, productionCost, timestamp).encodeABI();

    const tx = {
        from: '0x626DB02134CB1E1a61483057a61315801809a71c',
        to: contractProductionAddress,
        gas: 2000000,
        data: functionAbi,
    };

    try {
        const privateKey = process.env.MY_PRIVATE_KEY;
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
        from: '0x626DB02134CB1E1a61483057a61315801809a71c',
        to: contractConsumptionAddress,
        gas: 2000000,
        data: functionAbi,
    };

    try {
        const privateKey = process.env.MY_PRIVATE_KEY;
        const signedTx = await web3.eth.accounts.signTransaction(tx, privateKey);
        const result = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
        res.send({ transactionHash: result.transactionHash });
    } catch (error) {
        res.status(400).send(error.toString());
    }
});

app.listen(5339, () => console.log('App listening on port 5339!'));

