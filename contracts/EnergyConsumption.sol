// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "https://github.com/bokkypoobah/BokkyPooBahsDateTimeLibrary/blob/master/contracts/BokkyPooBahsDateTimeLibrary.sol";
import "./EnergyProduction.sol";
import "./EnergyApiConsumer.sol";

/**
 *  Mumbai network
 *  This Contract Address : 0x5f097B1D6811E0948D60b9c8Aa17fCcB98128845
 *  EnergyProduction Contract : 0xf74b7507C29E3eE7453b05E6c086a55cDE12a0F9
 *  EnergyApiConsumer : 0x91bD19A582aE9d34cb4fb949C355385c0cEa0aC4
 */

contract EnergyConsumption {

    struct MonthlyData {
        uint256 consumedEnergy;
        uint256 billAmount; //wei USD
        bool paid;
    }

    struct Consumer {
        mapping(uint256 => MonthlyData) monthlyData;
        uint256[] consumptionMonths;
        mapping(uint256 => bool) hasMonth;
        uint256 totalUnpaidBillAmount; //wei USD
    }

    address payable public owner;
    mapping(address => Consumer) public consumers;

    // The address of the EnergyProduction contract
    EnergyProduction public energyProductionContract;

    // The address of the contract to get the updated price of energy
    EnergyApiConsumer public energyApiConsumerContract;

    AggregatorV3Interface internal priceFeedEth;
    AggregatorV3Interface internal priceFeedEur;


    event EnergyConsumptionRegistered(
        address indexed consumer,
        uint256 indexed month,
        uint256 consumedEnergy,
        uint256 timestamp
    );
  
    event PaymentReceived(
        address indexed consumer,
        uint256 indexed month,
        uint256 amount,
        uint256 timestamp
    );

    modifier onlyOwner() {
        require(msg.sender == owner, "Caller is not the owner");
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
    constructor(address _addressEnergyProductionContract, address _addressEnergyApiConsumerContract) {
        owner = payable(msg.sender);
        priceFeedEth = AggregatorV3Interface(0x0715A7794a1dc8e42615F059dD6e406A6594651A);
        priceFeedEur = AggregatorV3Interface(0x7d7356bF6Ee5CDeC22B216581E48eCC700D0497A);
        energyProductionContract = EnergyProduction(_addressEnergyProductionContract);
        energyApiConsumerContract = EnergyApiConsumer(_addressEnergyApiConsumerContract);
    }

    function setAddressEnergyConsumptionContract(address _addressEnergyProductionContract) public onlyOwner{
         energyProductionContract = EnergyProduction(_addressEnergyProductionContract);
    }

    function setAddressEnergyApiConsumerContract(address _addressEnergyApiConsumerContract) public onlyOwner{
        energyApiConsumerContract = EnergyApiConsumer(_addressEnergyApiConsumerContract);
    }

    function getLatestEthPrice() public view returns (uint256) {
        (, int256 price, , , ) = priceFeedEth.latestRoundData();
        return uint256(price); // wei USD
    }

    function getLatestEurPrice() public view returns (uint256) {
        (, int256 price, , , ) = priceFeedEur.latestRoundData();
        return uint256(price); // wei USD
    }

    function getLatestEnergyPrice() public view returns (uint256){
       
        // Current Energy Price retrived with Chainlink oracle
        uint256 energyPriceEur = energyApiConsumerContract.getCurrentEnergyPrice();
        uint256 eurUsdRate = getLatestEurPrice(); //in wei USD

        return (energyPriceEur * eurUsdRate) / 10**8; // in wei USD per kWh
    }

    function registerEnergyConsumptionTest(address _consumer, uint256 _consumedEnergy, uint256 timestamp) public onlyOwner {
        uint256 year = getCurrentYear(timestamp);
        uint256 month = getCurrentMonth(timestamp);
        uint256 key = year * 100 + month;

        uint256 ratePerKWh = getLatestEnergyPrice(); //in wei USD
        uint256 billAmount = _consumedEnergy * ratePerKWh; //in wei USD

        //Updating billAmount in wei USD
        consumers[_consumer].monthlyData[key].consumedEnergy += _consumedEnergy;
        consumers[_consumer].monthlyData[key].billAmount += billAmount;
        consumers[_consumer].monthlyData[key].paid = false;
        consumers[_consumer].totalUnpaidBillAmount += billAmount;

        if (!consumers[_consumer].hasMonth[key]) {
            consumers[_consumer].consumptionMonths.push(key);
            consumers[_consumer].hasMonth[key] = true;
        }

        energyProductionContract.registerConsumedEnergy(_consumedEnergy, key);
      
        emit EnergyConsumptionRegistered(_consumer, key, _consumedEnergy, block.timestamp);
    }

    function registerEnergyConsumption(address _consumer, uint256 _consumedEnergy) public onlyOwner {
        uint256 timestamp = block.timestamp;
        uint256 year = getCurrentYear(timestamp);
        uint256 month = getCurrentMonth(timestamp);
        uint256 key = year * 100 + month;

        uint256 ratePerKWh = getLatestEnergyPrice(); //in wei USD
        uint256 billAmount = _consumedEnergy * ratePerKWh; //in wei USD

        //Updating billAmount in wei USD
        consumers[_consumer].monthlyData[key].consumedEnergy += _consumedEnergy;
        consumers[_consumer].monthlyData[key].billAmount += billAmount;
        consumers[_consumer].monthlyData[key].paid = false;
        consumers[_consumer].totalUnpaidBillAmount += billAmount;

        if (!consumers[_consumer].hasMonth[key]) {
            consumers[_consumer].consumptionMonths.push(key);
            consumers[_consumer].hasMonth[key] = true;
        }
      
        energyProductionContract.registerConsumedEnergy(_consumedEnergy, key);

        emit EnergyConsumptionRegistered(_consumer, key, _consumedEnergy, timestamp);
    }

    function getConsumptionMonths(address _consumer) public view returns (uint256[] memory){
        return consumers[_consumer].consumptionMonths;
    }

    function getCustomerTotalUnpaidBillAmount(address _consumer) public view returns (uint256){
        return consumers[_consumer].totalUnpaidBillAmount;
    }

    function getMonthlyData(address _consumer, uint256 _year, uint256 _month) public view returns (uint256 consumedEnergy, uint256 billAmount, bool paid) {
        uint256 key = _year * 100 + _month;
        consumedEnergy = consumers[_consumer].monthlyData[key].consumedEnergy;
        billAmount = consumers[_consumer].monthlyData[key].billAmount;
        paid = consumers[_consumer].monthlyData[key].paid;
    }

    function payMonthBill(uint256 _year, uint256 _month) public payable {
        require(msg.value > 0, "Payment must be greater than 0");

        uint256 currentYear = BokkyPooBahsDateTimeLibrary.getYear(block.timestamp);
        uint256 currentMonth = BokkyPooBahsDateTimeLibrary.getMonth(block.timestamp);

        require(currentYear > _year || (currentYear == _year && currentMonth > _month), "You can only pay for a month when it has ended");

        uint256 key = _year * 100 + _month;
        uint256 billAmount = consumers[msg.sender].monthlyData[key].billAmount;
        uint256 billAmountInWeiEther = billAmount / getLatestEthPrice(); // conversion from weiUSD to weiEther

        require(!consumers[msg.sender].monthlyData[key].paid, "Bill is already paid");
        require(msg.value >= billAmountInWeiEther, "Payment is less than the outstanding bill amount");

        owner.transfer(msg.value);
        consumers[msg.sender].totalUnpaidBillAmount -= billAmount;
        consumers[msg.sender].monthlyData[key].paid = true;

        energyProductionContract.registerRevenue(billAmount, key);

        emit PaymentReceived(msg.sender, key, msg.value, block.timestamp);
    }


    function getCurrentYear(uint256 timestamp) public pure returns (uint256 year) {
        year = BokkyPooBahsDateTimeLibrary.getYear(timestamp);
    }

    function getCurrentMonth(uint256 timestamp) public pure returns (uint256 month) {
        month = BokkyPooBahsDateTimeLibrary.getMonth(timestamp);
    }

    function getCurrentDay(uint256 timestamp) public pure returns (uint256 day){
        day = BokkyPooBahsDateTimeLibrary.getDay(timestamp);
    }

    function getCurrentHour(uint256 timestamp) public pure returns (uint256 hour){
         hour = BokkyPooBahsDateTimeLibrary.getHour(timestamp);
    }

    function withdraw() external onlyOwner {
        require(address(this).balance > 0, "No funds available for withdrawal");
        owner.transfer(address(this).balance);
    }

    function getCurrentMonthKey(uint256 _year, uint256 _month) public pure returns (uint256 key){
        key = _year * 100 + _month;
    }
}
