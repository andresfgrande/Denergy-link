import { useState } from 'react'
import Header from "./components/Header"
import MonthConsumption from './components/MonthConsumption'
import PreviousMonths from './components/PreviousMonths'
import './App.css'
import './style/Header.css'
import './style/MonthConsumption.css'

function App() {
  const [address, setAddress] = useState('');
  const [balance, setBalance] = useState(0);
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);

  return (
    <>
      <div>
        <Header  setAddress={setAddress} setBalance={setBalance} address={address}></Header>
        <MonthConsumption 
        setYear={setYear}
        setMonth={setMonth}
        address={address}
        year={year}
        month={month}> 
        </MonthConsumption >
        <PreviousMonths setYear={setYear}
        setMonth={setMonth}
        address={address}
        year={year}
        month={month}></PreviousMonths>
      </div>
    </>
  )
}

export default App
