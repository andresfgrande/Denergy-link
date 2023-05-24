import ConnectWallet from './ConnectWallet';

export default function Header({ setAddress, setBalance , address}){
    /*<img 
                src="./src/assets/troll-face.png"
                className="header--image"
            />*/
    return(
        <header className="header">
            <h2 className="header--title">DENERGY - LINK</h2>
            <ConnectWallet setAddress={setAddress} setBalance={setBalance} address={address} />
        </header>
    )
}