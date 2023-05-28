import React, { useEffect, useState } from "react";
import Web3 from 'web3';
import EnergyConsumptionAbi from '../Abi/EnergyConsumptionAbi.json';

export default function Totals({setTotalConsumption, setTotalUnpaid, address, totalConsumption, totalUnpaid, ethPrice}){

  return (
    <div className="totals--container">
      <h1>Total consumed</h1>
      <div className="totals--data">
      <div className="totals--consumed">
        <h2>{totalConsumption} kWh</h2>
        </div>
        <div className="totals--unpaid">
            <p className="title--unpaid">Total unpaid bill</p>
            <h2>{Number.parseFloat(totalUnpaid).toFixed(2)} €</h2>
            <h2>{Number.parseFloat(totalUnpaid/ethPrice).toFixed(4)}ETH</h2> 
        </div>
       </div>
    </div>
  );
}
