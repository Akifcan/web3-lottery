import { useEffect, useState } from 'react'
import Web3 from 'web3'
import createContract from '../blockchain/build/lottery'
import { ethereumWrapper } from '../blockchain/helpers'

const Home = () => {

  const [web3, setWeb3] = useState()
  const [account, setAccount] = useState()
  const [lotteryContract, setContract] = useState()
  const [lotteryPot, setLotteryPot] = useState()
  const [players, setPlayers] = useState([])
  const [balance, setBalance] = useState()
  const [lotteryId, setLotteryId] = useState()
  const [lastWinner, setLastWinner] = useState()

  const connectWallet = async () => {
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' })
      const web3 = new Web3(window.ethereum)
      setWeb3(web3)
      setAccount((await web3.eth.getAccounts())[0])
      const result = createContract(web3)
      setContract(result)
      console.log(await result.methods.owner.call().call())
      window.ethereum.on('accountsChanged', function (accounts) {
        console.log('ok!');
        setAccount((accounts)[0])
      })

    } catch (e) {
      console.log(e)
    }
  }

  const getLotteryId = async () => {
    setLotteryId(await lotteryContract.methods.lotteryId.call().call())
  }

  const getPot = async () => {
    setLotteryPot(web3.utils.fromWei(await lotteryContract.methods.getBalance().call()))
  }

  const getPlayers = async () => {
    setPlayers(await lotteryContract.methods.getPlayers().call())
  }

  const getBalance = async () => {
    setBalance(web3.utils.fromWei(await web3.eth.getBalance(account), 'ether'))
  }

  const getLastWinner = async () => {
    setLastWinner(await lotteryContract.methods.getWinnerByLotter(lotteryId - 1).call())
  }

  const playNow = async () => {
    try {
      await lotteryContract.methods.enter().send({
        from: account,
        value: web3.utils.toWei('0.1', 'ether')
      })
      getPlayers()
      getPot()
    } catch (e) {
      alert('you rejectes this transaction')
    }
  }

  const pickWinner = async () => {
    try {
      await lotteryContract.methods.pickWinner().send({ from: account })
      getPot()
      getPlayers()
      getLotteryId()
    } catch (e) {
      alert(e)
    }
  }

  useEffect(() => {
    if (!lotteryContract) return
    getPot()
    getPlayers()
    getLotteryId()
  }, [lotteryContract])

  useEffect(() => {
    if (!account || !web3) return
    getBalance()
  }, [account, web3])

  useEffect(() => {
    if (!lotteryId) return
    getLastWinner()
  }, [lotteryId])

  return (
    <div>
      <h1>Ether Lottery - {lotteryId && <b>#{lotteryId}</b>}</h1>
      <button onClick={pickWinner}>pick winner</button>
      {balance && (
        <>
          <p>your balance: <b>{balance}ETH</b></p>
          <p>your address: {account}</p>
        </>
      )}
      {!lotteryContract && (
        <button onClick={() => ethereumWrapper(connectWallet)}>Connect Wallet</button>
      )}
      {lotteryContract && (
        <button onClick={playNow}>Play Now</button>
      )}
      {lastWinner && (
        <ul>
          <li>Last winner</li>
          <li><a href={`https://etherscan.io/address/${lastWinner}`} target={'_blank'}>{lastWinner}</a></li>
        </ul>
      )}
      <ul>
        <li>players: {players.length}</li>
        {players.map(player => {
          return <li key={player}><a target={'_blank'} href={`https://etherscan.io/address/${player}`}>{player}</a></li>
        })}
      </ul>
      <b>POT: {lotteryPot}</b>
    </div>
  )
}

export default Home