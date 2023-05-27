import React, { useEffect , useState} from "react";
import Web3 from 'web3';
import EnergyConsumptionAbi from '../Abi/EnergyConsumptionAbi.json';


export default function PreviousMonths({setYear, setMonth, setTotalConsumption ,address, year, month, totalConsumption}){
  
      const [rows, setRows] = useState([]);


  useEffect(() => {
    if (window.ethereum) {
      const web3 = new Web3(window.ethereum);
      const contractAbi = EnergyConsumptionAbi;
      const contractAddress = "0x200cdb515DBA84671b865E16d631e4c76A986B18";
      const contract = new web3.eth.Contract(contractAbi, contractAddress);

      const fetchMonthlyData = async () => {
        const consumptionMonths = await contract.methods.getConsumptionMonths(address).call();

        let total = 0;
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
          total += Number(consumedEnergy);  // Update total energy consumption
          console.log(total);
          rowsData.push(row);
        }
        setTotalConsumption(total);  // Save total energy consumption to state
        setRows(rowsData);
      }
      fetchMonthlyData();
    }
  }, [address, year,month]);

    
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
          <tr className="data--item--month" key={index}  onClick={() => { setMonth(row.month); setYear(row.year);}}>
            <td>{row.month} / {row.year}</td>
            <td>{row.consumption} kWh</td>
            <td>{Number.parseFloat(row.bill).toFixed(2)} €</td>
            <td>{row.paid ? 
              <img 
              src="./src/assets/paid.png"
              className="payment--image--table"
              />
            : 
            <img 
            src="./src/assets/pending-payment.png"
            className="pending--payment--image--table"
            />
            }</td>
          </tr>
        ))}
      </tbody>
    </table>
        </div>
     
    )
}