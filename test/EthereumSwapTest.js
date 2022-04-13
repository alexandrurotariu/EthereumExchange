const { assert } = require("chai")
const { default: Web3 } = require("web3")

require('chai')
  .use(require('chai-as-promised'))
  .should()

const Token = artifacts.require('Token')
const EthereumSwap = artifacts.require('EthereumSwap')

// Funzione ausiliaria per convertire da Ether a Wei
// es. 1000000 => 1000000000000000000000000
function tokens(n) {
    return web3.utils.toWei(n, 'ether');
}

// deployer corrisponde ad account[0] e quindi a msg.sender
// investor corrisponde ad account[1]
contract('EthereumSwap', ([deployer, investor]) => {
    let token, ethereumSwap

    before(async() => {
        token = await Token.new()
        ethereumSwap = await EthereumSwap.new(token.address)
        // Trasferimento di tutti i token ad EthereumSwap 
        await token.transfer(ethereumSwap.address, tokens('1000000'))    
    })

    describe('valori iniziali EthereumSwap', async() => {
        it('lo smart contract ha un nome', async() => {
            const name = await ethereumSwap.name()
            assert.equal(name, 'Ethereum Instant Exchange')
        })

        it('lo smart contract ha tutti i token iniziali (1 milione)', async() => {
            let balance = await token.balanceOf(ethereumSwap.address)
            assert.equal(balance.toString(), tokens('1000000'))
        })
    })

    describe('funzione buyTokens()', async() => {
        let result

        before(async() => {
            // Acquistiamo dei token prima di ciascun esempio
            // L'utente(investor) acquista in token il corrispettivo di 1 ETH
            result = await ethereumSwap.buyTokens({from: investor, value: tokens('1')});
        })

        it('permette ad un utente di acquistare token dall exchange (ethereumSwap) ad prezzo fissato', async() => {
            // Controlliamo che l'investitore abbia dei token dopo l'acquisto
            let investorBalance = await token.balanceOf(investor)
            assert.equal(investorBalance.toString(), tokens('100'), 'l investitore possiede dei token')

            // Controlliamo il bilancio dell' exchange dopo l'acquisto dell'investitore
            let ethSwapBalance = await token.balanceOf(ethereumSwap.address)
            let ethSwapEthereumBalance = await web3.eth.getBalance(ethereumSwap.address)
            // all'inizio l'exchange ha 1.000.000 di token
            // l'investitore spende 1 eth per comprare 100 token
            // alla fine l'exchange possiede 1 eth e 999.900 token
            assert.equal(ethSwapBalance.toString(), tokens('999900'))
            assert.equal(ethSwapEthereumBalance.toString(), web3.utils.toWei('1', 'Ether'))
        
            // Controlliamo che l'evento relativo all'acquisto di token sia stato emesso e che i valori corrispondenti siano esatti
            const event = result.logs[0].args
            assert.equal(event.account, investor)
            assert.equal(event.token, token.address)
            assert.equal(event.quantita.toString(), tokens('100').toString())
            assert.equal(event.rate.toString(), '100')
        })
    })

    describe('funzione sellTokens()', async() => {
        let result

        before(async() => {
            // L'utente (investor) deve approvare i token che saranno venduti all'exchange
            await token.approve(ethereumSwap.address, tokens('100'), {from: investor}); 
            result = await ethereumSwap.sellTokens(tokens('100'), {from: investor});
        })

        it('permette ad un utente di vendere token all exchange (ethereumSwap) ad prezzo fissato', async() => {
            // Controlliamo il numero di token posseduti dall'utente dopo la vendita
            let investorBalance = await token.balanceOf(investor)
            assert.equal(investorBalance.toString(), tokens('0'))

            // Controlliamo il numero di token dell' exchange dopo l'acquisto
            let ethSwapBalance = await token.balanceOf(ethereumSwap.address)
            let ethSwapEthereumBalance = await web3.eth.getBalance(ethereumSwap.address)
            assert.equal(ethSwapBalance.toString(), tokens('1000000'))
            assert.equal(ethSwapEthereumBalance.toString(), web3.utils.toWei('0', 'Ether'))
        
            // Controlliamo che l'evento relativo alla vendita di token sia stato emesso e che i valori corrispondenti siano esatti
            const event = result.logs[0].args
            assert.equal(event.account, investor)
            assert.equal(event.token, token.address)
            assert.equal(event.quantita.toString(), tokens('100').toString())
            assert.equal(event.rate.toString(), '100')
        
            // Verifichiamo che l'utente(investor) non possa vendere più token di quanti ne abbia
            await ethereumSwap.sellTokens(tokens('500'), {from: investor}).should.be.rejected
        })
    })
})