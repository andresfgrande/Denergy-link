import ConnectWallet from './ConnectWallet';

export default function Header({ setAddress, setBalance , address, balance}){
    return(
        <header className="header">
            <h2 className="header--title">DENERGY - LINK  :  PRODUCER</h2>
            <ConnectWallet setAddress={setAddress} setBalance={setBalance} address={address} balance={balance} />
        </header>
    )
}