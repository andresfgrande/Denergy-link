import React, { useEffect , useState} from "react";
import Web3 from 'web3';
import EnergyConsumptionAbi from '../Abi/EnergyConsumptionAbi.json';


export default function MonthConsumption({setYear, setMonth, setTotalUnpaid, setEthPrice, address, year, month, totalUnpaid, ethPrice}){

  const [energy, setEnergy] = useState("");
  const [bill, setBill] = useState("");
  //const [ethPrice, setEthPrice] = useState("");
  const [paid, setPaid] = useState(false);
  const [processing, setProcessing] = useState(false);
  
  const loadEnergyData = async (address) => {
    if (window.ethereum) {
      const web3 = new Web3(window.ethereum);
      const contractAbi = EnergyConsumptionAbi;
      const contractAddress = "0x200cdb515DBA84671b865E16d631e4c76A986B18";
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
    setProcessing(true);
    if (window.ethereum) {
      const web3 = new Web3(window.ethereum);
      const contractAbi = EnergyConsumptionAbi;
      const contractAddress = "0x200cdb515DBA84671b865E16d631e4c76A986B18";
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


  useEffect(() => {
    if(address){
      loadEnergyData(address);
    }
  }, [address, year, month, totalUnpaid])

  return(
    <div>
        <div className="month--consumption">
                <h1> Energy consumption - {getMonthName(month)} {year}</h1>
        <div className="month--data">
            <div className="energy--consumed">
                <h1>{energy} kWh</h1>
            </div>
            <div className="month--bill">
                <h2>{Number.parseFloat(bill).toFixed(2)}€</h2>
                <h2>{Number.parseFloat(bill/ethPrice).toFixed(4)}ETH</h2>
            </div>

            {paid ? 
              <div className="month--paid">
                <h2>Paid</h2>
                <img 
                src="./src/assets/paid.png"
                className="payment--image"
                />
              </div>
              : 
              <div className="month--pending--payment" onClick={payBill}>
                <h2>Pay this month</h2>
                {processing ? 
                <div>
                  <img 
                src="./src/assets/processing-payment.png"
                className="payment--image--processing"
                />
                <p>Processing payment...</p>
                </div>
                
                :
                <img 
                  src="./src/assets/payment.png"
                  className="payment--image"
                  />
                }
                
                
              </div>
              }
           
        </div>
        </div> 
       
    </div>
  )
}
