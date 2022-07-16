const fs = require('fs')
fs.readFile(__dirname + '/build/blockchain_contracts_Lottery_sol_Lottery.abi', 'utf-8', function (err, data) {
    if (err) return console.log(err)
    fs.writeFile(__dirname + '/build/lottery.js', `
        const lotteryAbi = ${data};
        const lotteryContract = web3 => {
            return new web3.eth.Contract(
                lotteryAbi,
                "0x39ec7C11687435565697140Fa33b93774e83170E"
            )
        };
        export default lotteryContract;
    `.replace(/\s+/g, ' ').trim(), function (_, __) {
        console.log('OK!');
    })
})