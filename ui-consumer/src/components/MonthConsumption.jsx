import React, { useEffect , useState} from "react";
import Web3 from 'web3';
import EnergyConsumptionAbi from '../Abi/EnergyConsumptionAbi.json';


export default function MonthConsumption({setYear, setMonth, setTotalUnpaid, setEthPrice, address, year, month, totalUnpaid, ethPrice}){

  const [energy, setEnergy] = useState("");
  const [bill, setBill] = useState("");
  const [paid, setPaid] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  
  const loadEnergyData = async (address) => {
    if (window.ethereum) {
      const web3 = new Web3(window.ethereum);
      const contractAbi = EnergyConsumptionAbi;
      const contractAddress = "0x5f097B1D6811E0948D60b9c8Aa17fCcB98128845";
      const contract = new web3.eth.Contract(contractAbi, contractAddress);
      
      const currentYear = year;
      const currentMonth = month 
      const { consumedEnergy, billAmount, paid } = await contract.methods.getMonthlyData(address, currentYear, currentMonth).call();
      setEnergy(consumedEnergy);
      setBill(web3.utils.fromWei(billAmount.toString(), 'ether'));  // Bill amount in wei
      setPaid(paid);

       // Get latest Ethereum price
      const latestEthPrice = await contract.methods.getLatestEthPrice().call();
      setEthPrice(latestEthPrice / 1.e8); 

      const fetchUnpaidTotal = async () => {
        const unpaidTotalWei = await contract.methods.getCustomerTotalUnpaidBillAmount(address).call();
        const unpaidTotalEther = web3.utils.fromWei(unpaidTotalWei.toString(), 'ether');
        console.log('test2',address);
        setTotalUnpaid(unpaidTotalEther);
      }
      fetchUnpaidTotal();

    }
  }

  const payBill = async () => {
    let currentMonth = new Date().getMonth() + 1;
    let currentYear = new Date().getFullYear();

    //Just allow payments whn the month is ended
    if(currentYear > year || (currentYear === year && currentMonth > month)){
      setProcessing(true);
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        const contractAbi = EnergyConsumptionAbi;
        const contractAddress = "0x5f097B1D6811E0948D60b9c8Aa17fCcB98128845";
        const contract = new web3.eth.Contract(contractAbi, contractAddress);
  
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const account = accounts[0];
  
        // Get latest Ethereum price
        const latestEthPrice = await contract.methods.getLatestEthPrice().call();
        setEthPrice(latestEthPrice / 1.e8)
  
        const billInWei = web3.utils.toWei((bill/ethPrice).toString(), 'ether');
        const gasPrice = await web3.eth.getGasPrice();
    
        const options = {
          from: account,
          value: billInWei,
          gasPrice: gasPrice, 
          gas: 300000 
        };
        
        contract.methods.payMonthBill(year, month).send(options)
          .on('receipt', (receipt) => {
            console.log(receipt);
            setProcessing(false);
            loadEnergyData(address);
          })
          .on('error', (error) => {
            console.error(error);
            setProcessing(false);
          });
      }
    }else{
      // If the current month is not yet ended, show the popup
     setShowPopup(true);
   }
    
  };

  function getMonthName(num){
    switch (num) {
      case 1:
        return 'January';
      case 2:
        return 'February';
      case 3:
        return 'March';
      case 4:
        return 'April';
      case 5:
        return 'May';
      case 6:
        return 'June';
      case 7:
        return 'July';
      case 8:
        return 'August';
      case 9:
        return 'September';
      case 10:
        return 'October';
      case 11: 
      return 'November';
      case 12:
        return 'December';
      default:
        return '';
    }
  }

  const goToCurrentMonth = () => {
    setMonth(new Date().getMonth() + 1);
    setYear(new Date().getFullYear());
    scrollToTopSmoothly();
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  useEffect(() => {
    if(address){
      loadEnergyData(address);
    }
  }, [address, year, month, totalUnpaid])

  return(
    <div className="month--container--consumption">
        <div className="month--consumption">
                <h1 className="main--title"> Energy consumption - {getMonthName(month)} {year}</h1>
                <span className="button" onClick={() => goToCurrentMonth()}>
                View current month
              </span>
        <div className="month--data">
            <div className="energy--consumed">
                <h1>{energy ? energy : 0} kWh</h1>
            </div>
            <div className="month--bill">
                <h2>{bill ? Number.parseFloat(bill/ethPrice).toFixed(4) : 0} ETH</h2>
                <h3>${bill ? Number.parseFloat(bill).toFixed(2) : 0}</h3>
            </div>

            {paid ? 
              <div className="month--paid">
                <h2 className="title--paid">Paid</h2>
                <img 
                src="/paid.png"
                className="payment--image"
                />
              </div>
              : 
              <div className="month--pending--payment" onClick={payBill}>
                <h2>Pay this month</h2>
                {processing ? 
                <div>
                  <img 
                src="/processing-payment.png"
                className="payment--image--processing"
                />
                <p className="text--processing">Processing payment...</p>
                </div>
                
                :
                <img 
                  src="/payment.png"
                  className="payment--image"
                  />
                }
                
                
              </div>
              }
           
        </div>
        </div> 
        {showPopup && 
            <div className="backdrop" onClick={closePopup}>
                <div className="popup">
                    <button className="close-btn" onClick={closePopup}>X</button>
                    <p>Payment will be allowed at the end of the month.</p>
                </div>
            </div>}
    </div>
  )
}
