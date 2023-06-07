// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";
import "@chainlink/contracts/src/v0.8/ConfirmedOwner.sol";

/**
 *  Mumbai network
 *  This Contract Address : 0x91bD19A582aE9d34cb4fb949C355385c0cEa0aC4
 *  Oracle Operator : 0xBeDd97b7a1490933C5040C3Dc4F6Bf36A1c69e5A
 *  Job ID : "2cd01d652ca345468fc94f211ff1f5ad"
 */

contract EnergyApiConsumer is ChainlinkClient, ConfirmedOwner {
    using Chainlink for Chainlink.Request;

    uint256 private constant ORACLE_PAYMENT = (1 * LINK_DIVISIBILITY) / 10; // 0.1 * 10**18
    uint256 public currentEnergyPrice;

    address public operatorContract;
    string public jobId;

    event RequestEnergyPriceFulfilled(
        bytes32 indexed requestId,
        uint256 indexed price
    );

    /**
     *  Mumbai network
     *  LINK address in Mumbai network: 0x326C977E6efc84E512bB9C30f76E30c160eD06FB
     */
    constructor(address _operatorAddress, string memory _jobId) ConfirmedOwner(msg.sender) {
        operatorContract = _operatorAddress;
        jobId = _jobId;
        setChainlinkToken(0x326C977E6efc84E512bB9C30f76E30c160eD06FB);
    }

    function setJobId (string memory _jobId) public onlyOwner{
        jobId = _jobId;
    }

    function setOperatorAddress (address _operatorAddress) public onlyOwner{
        operatorContract = _operatorAddress;
    }

    function requestEnergyPrice(/*address _oracle, string memory _jobId*/) public onlyOwner {
        Chainlink.Request memory req = buildChainlinkRequest(
            stringToBytes32(jobId),
            address(this),
            this.fulfillEnergyPrice.selector
        );
        req.add(
            "get",
            "https://api.preciodelaluz.org/v1/prices/now?zone=PCB"
        );
        req.add("path", "price");
        req.addInt("times", 1e15); //price in wei
        sendChainlinkRequestTo(operatorContract, req, ORACLE_PAYMENT);
    }

    function fulfillEnergyPrice(
        bytes32 _requestId,
        uint256 _price
    ) public recordChainlinkFulfillment(_requestId) {
        emit RequestEnergyPriceFulfilled(_requestId, _price);
        currentEnergyPrice = _price;
    }

    function getCurrentEnergyPrice() public view returns (uint256){
        return currentEnergyPrice;
    }

    function getChainlinkToken() public view returns (address) {
        return chainlinkTokenAddress();
    }

    function withdrawLink() public onlyOwner {
        LinkTokenInterface link = LinkTokenInterface(chainlinkTokenAddress());
        require(
            link.transfer(msg.sender, link.balanceOf(address(this))),
            "Unable to transfer"
        );
    }

    function cancelRequest(
        bytes32 _requestId,
        uint256 _payment,
        bytes4 _callbackFunctionId,
        uint256 _expiration
    ) public onlyOwner {
        cancelChainlinkRequest(
            _requestId,
            _payment,
            _callbackFunctionId,
            _expiration
        );
    }

    function stringToBytes32(
        string memory source
    ) private pure returns (bytes32 result) {
        bytes memory tempEmptyStringTest = bytes(source);
        if (tempEmptyStringTest.length == 0) {
            return 0x0;
        }

        assembly {
            result := mload(add(source, 32))
        }
    }
}
