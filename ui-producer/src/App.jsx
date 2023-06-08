import { useState, useEffect } from 'react'
import Header from "./components/Header"
import MonthProduction from './components/MonthProduction';
import PreviousMonths from './components/PreviousMonths';
import './App.css';
import './style/Header.css';
import './style/MonthProduction.css';
import './style/PreviousMonths.css';
import './style/InitialPopup.css';

function App() {
  const [address, setAddress] = useState('');
  const [balance, setBalance] = useState(0);
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [energyProduced, setEnergyProduced] = useState(0);
  const [energyConsumed, setEnergyConsumed] = useState(0);
  const [cost, setCost] = useState(0);
  const [revenue, setRevenue] = useState(0);
  const [ethPrice, setEthPrice] = useState(0);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    if (!address) {
      setShowPopup(true);
    }
  }, [address]);

  const closePopup = () => {
    setShowPopup(false);
  }


  return (
    <>
      <div className='producer--container'>
      <Header  setAddress={setAddress} setBalance={setBalance} address={address} balance={balance}></Header>
      <MonthProduction
      setAddress={setAddress}
      setBalance={setBalance}
      setEnergyProduced={setEnergyProduced}
      setEnergyConsumed={setEnergyConsumed}
      setCost={setCost}
      setRevenue={setRevenue}
      setYear={setYear}
      setMonth={setMonth}
      setEthPrice={setEthPrice}
      address={address}
      balance={balance}
      energyProduced={energyProduced}
      energyConsumed={energyConsumed}
      cost={cost}
      revenue={revenue}
      year={year}
      month={month}
      ethPrice={ethPrice}
      ></MonthProduction>
      <PreviousMonths
      setAddress={setAddress}
      setBalance={setBalance}
      setEnergyProduced={setEnergyProduced}
      setEnergyConsumed={setEnergyConsumed}
      setCost={setCost}
      setRevenue={setRevenue}
      setYear={setYear}
      setMonth={setMonth}
      setEthPrice={setEthPrice}
      address={address}
      balance={balance}
      energyProduced={energyProduced}
      energyConsumed={energyConsumed}
      cost={cost}
      revenue={revenue}
      year={year}
      month={month}
      ethPrice={ethPrice}
      ></PreviousMonths>
     </div>
    </>
  )
}

export default App
