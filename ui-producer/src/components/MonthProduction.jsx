import React, { useEffect , useState } from "react";
import Web3 from 'web3';
import EnergyProductionAbi from '../Abi/EnergyProductionAbi.json';

export default function MonthProduction({setAddress, setBalance, setEnergyProduced, 
    setEnergyConsumed, setCost, setRevenue, setYear, setMonth, setEthPrice, address, balance, energyProduced, energyConsumed, cost, revenue, year, month, ethPrice}){

    const fetchData = async () => {
        try {
        
            const web3 = new Web3(Web3.givenProvider);
            const contractAddr = '0xf74b7507C29E3eE7453b05E6c086a55cDE12a0F9'; 
            const energyProductionContract = new web3.eth.Contract(EnergyProductionAbi, contractAddr);
            const key = year * 100 + month;
            const result = await energyProductionContract.methods.monthlyProductionData(key).call();

            // Get latest Ethereum price
            const latestEthPrice = await energyProductionContract.methods.getLatestEthPrice().call();
            setEthPrice(latestEthPrice / 1.e8); 
      
            setEnergyProduced(result.energyProduced);
            setEnergyConsumed(result.energyConsumed);
            setRevenue(web3.utils.fromWei(result.revenue, 'ether'));
            setCost(web3.utils.fromWei(result.cost, 'ether'));
        } catch (err) {
            console.error(err);
        }
    }
    function getMonthName(num){
        switch (num) {
          case 1:
            return 'January';
          case 2:
            return 'February';
          case 3:
            return 'March';
          case 4:
            return 'April';
          case 5:
            return 'May';
          case 6:
            return 'June';
          case 7:
            return 'July';
          case 8:
            return 'August';
          case 9:
            return 'September';
          case 10:
            return 'October';
          case 11: 
          return 'November';
          case 12:
            return 'December';
          default:
            return '';
        }
      }
    
      const goToCurrentMonth = () => {
        setMonth(new Date().getMonth() + 1);
        setYear(new Date().getFullYear());
        scrollToTopSmoothly();
      };

    useEffect(() => {
        if(address){
            fetchData();
        }
    }, [address,energyConsumed,energyProduced,cost, revenue, year, month]);

    return (
        <div className="container--producer--info">
              <h1 className="container--title"> Energy Production - {getMonthName(month)} {year}</h1>
              <span className="button" onClick={() => goToCurrentMonth()}>
                View current month
              </span>
            <div className="grid">
                <div className="card card--produced">
                    <h3 className="card--title">Energy Produced</h3>
                    <h1 className="energy--num">{energyProduced} kWh</h1>
                </div>
                <div className="card card--consumed">
                    <h3 className="card--title">Energy Consumed</h3>
                    <h1 className="energy--num">{energyConsumed} kWh</h1>
                </div>
                <div className="card card--cost">
                    <h3 className="card--title">Cost</h3>
                    <h1 className="energy--num--eth">{cost ? Number.parseFloat(cost/ethPrice).toFixed(4) : 0} ETH</h1>
                    <h3 className="energy--num--usd">${cost ? Number.parseFloat(cost).toFixed(2) : 0}</h3>
                </div>
                <div className="card card--revenue">
                    <h3 className="card--title">Revenue</h3>
                    <h1 className="energy--num--eth">{revenue ? Number.parseFloat(revenue/ethPrice).toFixed(4) : 0} ETH</h1>
                    <h3 className="energy--num--usd">${revenue ? Number.parseFloat(revenue).toFixed(2) : 0}</h3>
                </div>
            </div>
            <div className={(revenue - cost) > 0 ? "card last--element card--profit":"card last--element card--profit negative"}>
                <h2 className="card--title">Profit</h2>
                <h1 className="energy--num--eth">{(revenue && cost) ? Number.parseFloat((revenue - cost)/ethPrice).toFixed(4) :0} ETH</h1>
                <h3 className="energy--num--usd">${Number.parseFloat(revenue - cost).toFixed(2)}</h3>
            </div>
        </div>
    );
    
}

