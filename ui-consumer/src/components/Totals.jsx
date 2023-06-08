import React, { useEffect, useState } from "react";
import Web3 from 'web3';
import EnergyConsumptionAbi from '../Abi/EnergyConsumptionAbi.json';

export default function Totals({setTotalConsumption, setTotalUnpaid, address, totalConsumption, totalUnpaid, ethPrice}){

  return (
    <div className="totals--container">
      <h1>Total consumed</h1>
      <div className="totals--data">
      <div className="totals--consumed">
        <h1>{totalConsumption} kWh</h1>
        </div>
        <div className="totals--unpaid">
            <p className="title--unpaid">Total unpaid bill</p>
            <h2>{totalUnpaid ? Number.parseFloat(totalUnpaid/ethPrice).toFixed(4) : 0 } ETH</h2> 
            <h3>${Number.parseFloat(totalUnpaid).toFixed(2)} </h3>
        </div>
       </div>
    </div>
  );
}
