import React, { useEffect , useState} from "react";
import Web3 from 'web3';
import EnergyConsumptionAbi from '../Abi/EnergyConsumptionAbi.json';


export default function PreviousMonths({setYear, setMonth, address, year, month}){
  
      const [rows, setRows] = useState([]);

  useEffect(() => {
    if (window.ethereum) {
      const web3 = new Web3(window.ethereum);
      const contractAbi = EnergyConsumptionAbi;
      const contractAddress = "0x74BfF1a72f3d5C34Be7a03D9d8C75b98A50A12C1";
      const contract = new web3.eth.Contract(contractAbi, contractAddress);

      const fetchMonthlyData = async () => {
        const consumptionMonths = await contract.methods.getConsumptionMonths(address).call();

        const rowsData = [];
        for (let month of consumptionMonths) {
          const year = Math.floor(month / 100);
          const monthOfYear = month % 100;
          const { consumedEnergy, billAmount, paid } = await contract.methods.getMonthlyData(address, year, monthOfYear).call();
          const row = {
            month: monthOfYear,
            year: year,
            consumption: consumedEnergy,
            bill: web3.utils.fromWei(billAmount.toString(), 'ether'),
            paid: paid
          }
          rowsData.push(row);
        }
        setRows(rowsData);
      }
      fetchMonthlyData();
    }
  }, [address]);

  const setCurrentMonth = (month, year)=>{
    setYear(year);
    setMonth(month);
  }
    
    return(
        <div>
            <h1>Previous months</h1>
            <table className="consumption--table">
      <thead>
        <tr>
          <th>Month</th>
          <th>Consumption</th>
          <th>Bill</th>
          <th>Paid</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row, index) => (
          <tr key={index}  onClick={() => { setMonth(4); setYear(2022); }}>
            <td>{row.month}</td>
            <td>{row.consumption}</td>
            <td>{row.bill}</td>
            <td>{row.paid ? 'Yes' : 'No'}</td>
          </tr>
        ))}
      </tbody>
    </table>
        </div>
     
    )
}