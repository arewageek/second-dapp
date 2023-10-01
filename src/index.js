const express = require('express')
require('dotenv').config()
const HDWallet = require('@truffle/hdwallet-provider')
const {Web3} = require('web3')
const app = express()

const secondContract = require('./abi/second.json')
const port = process.env.PORT

const account = {
    address: process.env.ADDRESS,
    privateKey: process.env.PRIVATE,
    phrase: process.env.PHRASE
}

const provider = new HDWallet(
    account.privateKey,
    process.env.INFURA_URL
)

const web3 = new Web3(provider)

app.get('/deploy', async (req, res) => {
    const abi = secondContract.abi
    const byteCode = secondContract.bytecode

    let contract = new web3.eth.Contract(abi)
    contract = await contract
        .deploy({
            data: byteCode
        })
        .send({
            from: account.address
        })
    
    // const funded = await contract.methods.Credit(0.1).send({
    //     from: account.address,
    //     to: 
    // })

    let data = await contract.methods.fetch().call()
    data = await web3.utils.fromWei(data, 'ether')
    data = `${Number(data)} Ethers`

    console.log(contract)
    console.log({data})
    res.json({data})
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})