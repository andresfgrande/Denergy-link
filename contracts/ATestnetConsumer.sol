// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";
import "@chainlink/contracts/src/v0.8/ConfirmedOwner.sol";

/**
 * Contract Address : 0xBa676EAeaB84c299BbaA0932b1996F44CB38be29
 * Job ID           : "2cd01d652ca345468fc94f211ff1f5ad"
 */

contract ATestnetConsumer is ChainlinkClient, ConfirmedOwner {
    using Chainlink for Chainlink.Request;

    uint256 private constant ORACLE_PAYMENT = (1 * LINK_DIVISIBILITY) / 10; // 0.1 * 10**18
    uint256 public currentPrice;

    event RequestEthereumPriceFulfilled(
        bytes32 indexed requestId,
        uint256 indexed price
    );

    /**
     *  Mumbai
     *  LINK address in Mumbai network: 0x326C977E6efc84E512bB9C30f76E30c160eD06FB
     */
    constructor() ConfirmedOwner(msg.sender) {
        setChainlinkToken(0x326C977E6efc84E512bB9C30f76E30c160eD06FB);
    }

    function requestEthereumPrice(
        address _oracle,
        string memory _jobId
    ) public onlyOwner {
        Chainlink.Request memory req = buildChainlinkRequest(
            stringToBytes32(_jobId),
            address(this),
            this.fulfillEthereumPrice.selector
        );
        req.add(
            "get",
            "https://api.preciodelaluz.org/v1/prices/now?zone=PCB"
        );
        req.add("path", "price");
        req.addInt("times", 100);
        sendChainlinkRequestTo(_oracle, req, ORACLE_PAYMENT);
    }

    function fulfillEthereumPrice(
        bytes32 _requestId,
        uint256 _price
    ) public recordChainlinkFulfillment(_requestId) {
        emit RequestEthereumPriceFulfilled(_requestId, _price);
        currentPrice = _price;
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
            // solhint-disable-line no-inline-assembly
            result := mload(add(source, 32))
        }
    }
}
