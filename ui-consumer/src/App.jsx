import { useState } from 'react'
import Header from "./components/Header"
import ConnectWallet from './components/ConnectWallet';
import './App.css'
import './style/Header.css'

function App() {
  const [address, setAddress] = useState('');
  const [balance, setBalance] = useState(0);

  return (
    <>
      <div>
        <Header  setAddress={setAddress} setBalance={setBalance} address={address}></Header>
        
      </div>
    </>
  )
}

export default App
