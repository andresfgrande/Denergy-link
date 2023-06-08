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
import './style/InitialPopup.css'

function App() {
  const [address, setAddress] = useState('');
  const [balance, setBalance] = useState(0);
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [totalConsumption, setTotalConsumption] = useState(0);
  const [totalUnpaid, setTotalUnpaid] = useState(0);
  const [ethPrice, setEthPrice] = useState(0);

  return (
    <>
      <div>
        <Header  setAddress={setAddress} setBalance={setBalance} address={address} balance={balance}></Header>
        <MonthConsumption 
        setYear={setYear}
        setMonth={setMonth}
        setTotalUnpaid={setTotalUnpaid} 
        setEthPrice={setEthPrice}
        address={address}
        year={year}
        month={month}
        totalUnpaid={totalUnpaid}
        ethPrice={ethPrice}
        > 
        </MonthConsumption >
        <Totals 
        setTotalConsumption={setTotalConsumption} 
        setTotalUnpaid={setTotalUnpaid} 
        address={address} 
        totalConsumption={totalConsumption}
        totalUnpaid={totalUnpaid}
        ethPrice={ethPrice}
        >
        </Totals>
        <PreviousMonths 
        setYear={setYear}
        setMonth={setMonth}
        setTotalConsumption={setTotalConsumption}
        setTotalUnpaid={setTotalUnpaid}
        address={address}
        year={year}
        month={month}
        totalConsumption={totalConsumption}
        totalUnpaid={totalUnpaid}
        ethPrice={ethPrice}
        ></PreviousMonths>
      </div>
    </>
  )
}

export default App
