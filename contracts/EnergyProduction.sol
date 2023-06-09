// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "https://github.com/bokkypoobah/BokkyPooBahsDateTimeLibrary/blob/master/contracts/BokkyPooBahsDateTimeLibrary.sol";

/**
 *  Mumbai network
 *  This Contract Address : 0xf74b7507C29E3eE7453b05E6c086a55cDE12a0F9
 *  EnergyConsumption Contract : 0x5f097B1D6811E0948D60b9c8Aa17fCcB98128845
 */

contract EnergyProduction {
    
    struct ProductionData {
        uint256 energyProduced;
        uint256 energyConsumed;
        uint256 revenue;
        uint256 cost;
    }

    mapping(uint256 => ProductionData) public monthlyProductionData;
    uint256[] productionMonths;
    mapping(uint256 => bool) hasMonth;

    address payable public owner;
    // The address of the EnergyConsumption contract
    address public energyConsumptionContract;

    AggregatorV3Interface internal priceFeedEth;
    AggregatorV3Interface internal priceFeedEur;


    event EnergyProductionRegistered(
        uint256 indexed month,
        uint256 energyProduced,
        uint256 timestamp
    );

    event EnergyConsumptionRegistered(
        uint256 indexed month,
        uint256 energyConsumed,
        uint256 timestamp
    );

      event EnergyBillRegistered(
        uint256 indexed month,
        uint256 energyBill,
        uint256 timestamp
    );

    modifier onlyOwner() {
        require(msg.sender == owner, "Caller is not the owner");
        _;
    }

    modifier onlyEnergyConsumptionContract() {
        require(msg.sender == energyConsumptionContract, "Caller is not the EnergyConsumption contract");
        _;
    }

    /**
     * Network: Mumbai
     * Aggregator: ETH/USD
     * Address: 0x0715A7794a1dc8e42615F059dD6e406A6594651A

     * Network: Mumbai
     * Aggregator: EUR/USD
     * Address: 0x7d7356bF6Ee5CDeC22B216581E48eCC700D0497A
     */
    constructor() {
        owner = payable(msg.sender);
        priceFeedEth = AggregatorV3Interface(0x0715A7794a1dc8e42615F059dD6e406A6594651A);
        priceFeedEur = AggregatorV3Interface(0x7d7356bF6Ee5CDeC22B216581E48eCC700D0497A);
    }

    function setAddressEnergyConsumptionContract(address _addressEnergyConsumptionContract) public onlyOwner{
        energyConsumptionContract = _addressEnergyConsumptionContract;
    }

    function getLatestEthPrice() public view returns (uint256) {
        (, int256 price, , , ) = priceFeedEth.latestRoundData();
        return uint256(price); // wei USD
    }

    function getLatestEurPrice() public view returns (uint256) {
        (, int256 price, , , ) = priceFeedEur.latestRoundData();
        return uint256(price); // wei USD
    }

    function registerEnergyProduction(uint256 _energyProduced, uint256 _productionCost) public onlyOwner {
        uint256 timestamp = block.timestamp;
        uint256 year = getCurrentYear(timestamp);
        uint256 month = getCurrentMonth(timestamp);
        uint256 key = year * 100 + month;

       if (!hasMonth[key]) {
            productionMonths.push(key);
            hasMonth[key] = true;
        }

        monthlyProductionData[key].energyProduced += _energyProduced;
        monthlyProductionData[key].cost += _energyProduced * _productionCost; //in wei USD

        emit EnergyProductionRegistered(key, _energyProduced, block.timestamp);
    }

    function registerEnergyProductionTest(uint256 _energyProduced, uint256 _productionCost, uint256 _timestamp) public onlyOwner {
        uint256 year = getCurrentYear(_timestamp);
        uint256 month = getCurrentMonth(_timestamp);
        uint256 key = year * 100 + month;

       if (!hasMonth[key]) {
            productionMonths.push(key);
            hasMonth[key] = true;
        }

        monthlyProductionData[key].energyProduced += _energyProduced;
        monthlyProductionData[key].cost += _energyProduced * _productionCost; //in wei USD

        emit EnergyProductionRegistered(key, _energyProduced, block.timestamp);
    }

    function registerConsumedEnergy(uint256 _energyConsumed, uint256 _monthKey) public onlyEnergyConsumptionContract{
        monthlyProductionData[_monthKey].energyConsumed += _energyConsumed; //in kWh

        emit EnergyConsumptionRegistered(_monthKey, _energyConsumed, block.timestamp);
    }

    function registerRevenue(uint256 _paidBill, uint256 _monthKey) public onlyEnergyConsumptionContract{
        monthlyProductionData[_monthKey].revenue += _paidBill; //in wei USD

        emit EnergyBillRegistered(_monthKey, _paidBill, block.timestamp);
    }

    function getMonthlyData(uint256 _year, uint256 _month) public view returns (uint256 energyProduced, uint256 energyConsumed, uint256 revenue, uint256 cost) {
        uint256 key = _year * 100 + _month;
        energyProduced = monthlyProductionData[key].energyProduced;
        energyConsumed = monthlyProductionData[key].energyConsumed;
        revenue = monthlyProductionData[key].revenue;
        cost = monthlyProductionData[key].cost;
    }

    function getProductionMonths() public view returns (uint256[] memory){
        return productionMonths;
    }

    function getCurrentYear(uint256 timestamp) public pure returns (uint256 year) {
        year = BokkyPooBahsDateTimeLibrary.getYear(timestamp);
    }

    function getCurrentMonth(uint256 timestamp) public pure returns (uint256 month) {
        month = BokkyPooBahsDateTimeLibrary.getMonth(timestamp);
    }
}