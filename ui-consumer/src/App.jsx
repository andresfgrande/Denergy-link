import { useState } from 'react'
import Header from "./components/Header"
import MonthConsumption from './components/MonthConsumption'
import PreviousMonths from './components/PreviousMonths'
import Totals from './components/Totals'
import './App.css'
import './style/Header.css'
import './style/MonthConsumption.css'
import './style/PreviousMonths.css'
import './style/Totals.css'

function App() {
  const [address, setAddress] = useState('');
  const [balance, setBalance] = useState(0);
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [totalConsumption, setTotalConsumption] = useState(0);

  return (
    <>
      <div>
        <Header  setAddress={setAddress} setBalance={setBalance} address={address}></Header>
        <MonthConsumption 
        setYear={setYear}
        setMonth={setMonth}
        address={address}
        year={year}
        month={month}
        > 
        </MonthConsumption >
        <Totals setTotalConsumption={setTotalConsumption} address={address} totalConsumption={totalConsumption}></Totals>
        <PreviousMonths 
        setYear={setYear}
        setMonth={setMonth}
        setTotalConsumption={setTotalConsumption}
        address={address}
        year={year}
        month={month}
        totalConsumption={totalConsumption}
        ></PreviousMonths>
      </div>
    </>
  )
}

export default App
