// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "https://github.com/bokkypoobah/BokkyPooBahsDateTimeLibrary/blob/master/contracts/BokkyPooBahsDateTimeLibrary.sol";

contract EnergyConsumption {

    struct MonthlyData {
        uint256 consumedEnergy;
        uint256 billAmount; //wei Euros
        bool paid;
    }

    struct Consumer {
        mapping(uint256 => MonthlyData) monthlyData;
        uint256[] consumptionMonths;
        mapping(uint256 => bool) hasMonth;
        uint256 totalUnpaidBillAmount; //wei Euros
    }

    address payable public owner;
    mapping(address => Consumer) public consumers;

    AggregatorV3Interface internal priceFeed;

    event EnergyConsumptionRegistered(
        address indexed consumer,
        uint256 consumedEnergy,
        uint256 month,
        uint256 day,
        uint256 hour,
        uint256 timestamp
    );
  
    event PaymentReceived(
        address indexed consumer,
        uint256 year,
        uint256 month,
        uint256 amount,
        uint256 timestamp
    );

    modifier onlyOwner() {
        require(msg.sender == owner, "Caller is not the owner");
        _;
    }

    constructor(address _priceFeed) {
        owner = payable(msg.sender);
        priceFeed = AggregatorV3Interface(_priceFeed);
    }

    function getLatestEthPrice() public view returns (uint256) {
        (, int256 price, , , ) = priceFeed.latestRoundData();
        return uint256(price); // wei USD
    }

    function getLatestEnergyPrice() public pure returns (uint256){
          //Example value, this will be retrieved form external adapter
        return 172040000000000000; // "wei euros" per kWh, 0,17204 €/kWh
    }

    function registerEnergyConsumption(address _consumer, uint256 _consumedEnergy) public onlyOwner {
        uint256 timestamp = block.timestamp;
        uint256 year = getCurrentYear(timestamp);
        uint256 month = getCurrentMonth(timestamp);
        uint256 day = getCurrentDay(timestamp);
        uint256 hour = getCurrentHour(timestamp);
        uint256 key = year * 100 + month;

        uint256 ratePerKWh = getLatestEnergyPrice(); //in wei Euros
        uint256 billAmount = _consumedEnergy * ratePerKWh; //in wei Euros

        //Updating billAmount in wei Euros
        consumers[_consumer].monthlyData[key].consumedEnergy += _consumedEnergy;
        consumers[_consumer].monthlyData[key].billAmount += billAmount;
        consumers[_consumer].monthlyData[key].paid = false;
        consumers[_consumer].totalUnpaidBillAmount += billAmount;

        if (!consumers[_consumer].hasMonth[key]) {
            consumers[_consumer].consumptionMonths.push(key);
            consumers[_consumer].hasMonth[key] = true;
        }
      
        emit EnergyConsumptionRegistered(_consumer, _consumedEnergy, key, day, hour, block.timestamp);
    }

    function getConsumptionMonths(address _consumer) public view returns (uint256[] memory){
        return consumers[_consumer].consumptionMonths;
    }

    function getMonthlyData(address _consumer, uint256 _year, uint256 _month) public view returns (uint256 consumedEnergy, uint256 billAmount, bool paid) {
        uint256 key = _year * 100 + _month;
        consumedEnergy = consumers[_consumer].monthlyData[key].consumedEnergy;
        billAmount = consumers[_consumer].monthlyData[key].billAmount;
        paid = consumers[_consumer].monthlyData[key].paid;
    }

    function payMonthBill(uint256 _year, uint256 _month) public payable {
        require(msg.value > 0, "Payment must be greater than 0");

        uint256 key = _year * 100 + _month;
        uint256 billAmount = consumers[msg.sender].monthlyData[key].billAmount;

        require(!consumers[msg.sender].monthlyData[key].paid, "Bill is already paid");
        require(msg.value >= billAmount, "Payment is less than the outstanding bill amount");
        
        owner.transfer(msg.value);
        consumers[msg.sender].totalUnpaidBillAmount -= billAmount;
        consumers[msg.sender].monthlyData[key].paid = true;
        
        emit PaymentReceived(msg.sender, _year, _month, msg.value, block.timestamp);
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
