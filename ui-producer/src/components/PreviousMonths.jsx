import React, { useEffect , useState} from "react";
import Web3 from 'web3';
import EnergyProductionAbi from '../Abi/EnergyProductionAbi.json';

export default function PreviousMonths({setAddress, setBalance, setEnergyProduced, 
    setEnergyConsumed, setCost, setRevenue, setYear, setMonth, setEthPrice, address, balance, energyProduced, energyConsumed, cost, revenue, year, month, ethPrice}){

    const [rows, setRows] = useState([]);
    const [totals, setTotals] = useState({totalProduced: 0, totalConsumed: 0});

    useEffect(() => {
      console.log('address: ', address);
      console.log('rows: ', rows);
      console.log('totals: ', totals);
      if(address){
        if (window.ethereum) {
          const web3 = new Web3(window.ethereum);
          const contractAbi = EnergyProductionAbi;
          const contractAddress = "0xf74b7507C29E3eE7453b05E6c086a55cDE12a0F9";  // Update with the correct contract address
          const contract = new web3.eth.Contract(contractAbi, contractAddress);
    
          const fetchMonthlyData = async () => {
            const productionMonths = await contract.methods.getProductionMonths().call();
    
            let totalProduced = 0;
            let totalConsumed = 0;
            const rowsData = [];
            for (let month of productionMonths) {
              const year = Math.floor(month / 100);
              const monthOfYear = month % 100;
              const { energyProduced, energyConsumed, revenue, cost } = await contract.methods.getMonthlyData(year, monthOfYear).call();
              const row = {
                month: monthOfYear,
                year: year,
                produced: energyProduced,
                consumed: energyConsumed,
                revenue: web3.utils.fromWei(revenue.toString(), 'ether'),
                cost: web3.utils.fromWei(cost.toString(), 'ether')
              }
              totalProduced += Number(energyProduced);
              totalConsumed += Number(energyConsumed);  
              rowsData.push(row);
            }
            let totals = {
              totalProduced: totalProduced, 
              totalConsumed: totalConsumed
            }
            setTotals(totals);
            setRows(rowsData);
          }
          fetchMonthlyData();
        }
      }
      
    }, [address, year, month]);
  
    const handleRowClick = (row) => {
      setMonth(row.month);
      setYear(row.year);
      scrollToTopSmoothly();
    };
  
    const scrollToTopSmoothly = () => {
      window.scrollTo({top: 0, behavior: 'smooth'});
    };  

    return(
        <>
        <div className="container--totals">
            <h1 className="container--title">Totals</h1>
            <div className="grid--totals">
                <div className="card--totals ">
                    <h3 className="card--title--totals">Produced</h3>
                    <h1 className="num--kwh">{Number.parseFloat(totals.totalProduced)} kWh</h1>
                </div>
                <div className="card--totals ">
                    <h3 className="card--title--totals">Consumed</h3>
                    <h1 className="num--kwh">{Number.parseFloat(totals.totalConsumed)} kwH</h1>
                </div>
            </div>
        </div>
        <div className="previous--months--container">
            <h1 className="container--title">Previous months</h1>
            <table className="production--table">
                <thead>
                    <tr>
                        <th>Month</th>
                        <th>Produced</th>
                        <th>Consumed</th>
                        <th>Revenue</th>
                        <th>Cost</th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, index) => (
                        <tr className="data--item--month" key={index} onClick={() => handleRowClick(row)}>
                            <td>{row.month} / {row.year}</td>
                            <td>{row.produced}</td>
                            <td>{row.consumed}</td>
                            <td>{Number.parseFloat(row.revenue/ethPrice).toFixed(4)} ETH = ${Number.parseFloat(row.revenue).toFixed(2)} </td>
                            <td>{Number.parseFloat(row.cost/ethPrice).toFixed(4)} ETH = ${Number.parseFloat(row.cost).toFixed(2)} </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        </>
    );
}
