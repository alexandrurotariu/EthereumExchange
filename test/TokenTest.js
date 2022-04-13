/*
// test token totali al momento del deployment
const { assert } = require("chai");

var Token = artifacts.require("Token");

contract('Token', async function(accounts) { 
    var tokenInstance;
    
    it('inizializza il contratto con i valori corretti', function() {
        return Token.deployed().then(function(instance){
            tokenInstance = instance;
            return tokenInstance.name();
        }).then(function(name){
            assert.equal(name, 'RomaTre Token', 'il nome è corretto');
            return tokenInstance.symbol();
        }).then(function(symbol){
            assert.equal(symbol, 'RM3', 'il simbolo è corretto');
        });
    });

    it('set token iniziali al deployment', function() {
        return Token.deployed().then(function(instance){
            tokenInstance = instance;
            return tokenInstance.totalSupply();
        }).then(function(totalSupply){
            assert.equal(totalSupply.toNumber(), 1000000, 'set token totali a 1,000,000');
            return tokenInstance.balanceOf(accounts[0]);
        }).then(function(adminBalance){
            assert.equal(adminBalance.toNumber(),1000000, 'assegnazione token all admin');
        });
    });

    
    it('trasferimento token', function() {
        return Token.deployed().then(function(instance){
            tokenInstance = instance;
            return tokenInstance.transfer.call(accounts[1], 99999999999);
        }).then(assert.fail).catch(function(error){
            assert(error.message.indexOf('revert') >=0, 'errore saldo insufficiente');
            return tokenInstance.transfer.call(accounts[1], 250000, {from: accounts[0]});
        }).then(function(success){
            assert.equal(success, true, 'torna true');
            return tokenInstance.transfer(accounts[1], 250000, {from: accounts[0]});
        }).then(function(receipt){
            assert.equal(receipt.logs.length, 1, 'triggera un evento');
            assert.equal(receipt.logs[0].event, 'Transfer', 'dovrebbe essere evento "Transfer"');
            assert.equal(receipt.logs[0].args._from, accounts[0], 'log da cui vengono trasferiti i token');
            assert.equal(receipt.logs[0].args._to, accounts[1], 'log verso cui vengono trasferiti i token');
            assert.equal(receipt.logs[0].args._value, 250000, 'log l ammontare di token trasferiti');
            return tokenInstance.balanceOf(accounts[1]);
        }).then(function(balance){
            assert.equal(balance.toNumber(), 250000, 'token aggiunti all account destinatario');
            return tokenInstance.balanceOf(accounts[0]);
        }).then(function(balance){
            assert.equal(balance.toNumber(), 750000, 'token sottratti all account mittente');
        });
    });

    it('approvazione trasferimento delegato di token', function() {
        return Token.deployed().then(function(instance){
            tokenInstance = instance;
            return tokenInstance.approve.call(accounts[1], 100);
        }).then(function(success){
            assert.equal(success, true, 'torna true');
            return tokenInstance.approve(accounts[1], 100, {from: accounts[0]});
        }).then(function(receipt){
            assert.equal(receipt.logs.length, 1, 'triggera un evento');
            assert.equal(receipt.logs[0].event, 'Approval', 'dovrebbe essere evento "Approval"');
            assert.equal(receipt.logs[0].args._owner, accounts[0], 'log da chi approva il trasferimento di token');
            assert.equal(receipt.logs[0].args._spender, accounts[1], 'log verso cui vengono trasferiti i token');
            assert.equal(receipt.logs[0].args._value, 100, 'log l ammontare di token trasferiti');
            return tokenInstance.allowance(accounts[0], accounts[1]);
        }).then(function(allowance){
            assert.equal(allowance.toNumber(), 100, 'memorizza i permessi per i trasferimenti delegati');
        });
    });


    it('gestione trasferimento delegato di token', function() {
        return Token.deployed().then(function(instance){
            tokenInstance = instance;
            fromAccount = accounts[2]; 
            toAccount = accounts[3];   
            spendingAccount = accounts[4];
            // 1. from account riceve 100 token
            // 2. spending account è autorizzato a spendere 10 token da from account
            //    < fromAccount, <spendingAccount,10> >  

            //trasferimento di qualche token verso il fromAccount
            return tokenInstance.transfer(fromAccount, 100, {from:accounts[0]});
        }).then(function(receipt){
            //approvazione per spandingAccount a spendere 10 token da fromAccount
            return tokenInstance.approve(spendingAccount, 10, {from: fromAccount});
        }).then(function(receipt){
            //prova a trasferire più di quanto ha a disposizione il mittente fromAccount (saldo insuff)
            return tokenInstance.transferFrom(fromAccount, toAccount, 9999, {from: spendingAccount});
        }).then(assert.fail).catch(function(error){
            assert(error.message.indexOf('revert') >=0, 'errore trasferimento saldo insufficiente');
            //prova a trasferire più di quanto è stato approvato (saldo suff)
            return tokenInstance.transferFrom(fromAccount, toAccount, 20, {from: spendingAccount});
        }).then(assert.fail).catch(function(error){
            assert(error.message.indexOf('revert') >=0, 'errore trasferimento quantità superiore a quella approvata');
            return tokenInstance.transferFrom.call(fromAccount, toAccount, 10, {from: spendingAccount});
        }).then(function(success){
            assert.equal(success,true);
            return tokenInstance.transferFrom(fromAccount, toAccount, 10, {from: spendingAccount});
        }).then(function(receipt){
            assert.equal(receipt.logs.length, 1, 'triggera un evento');
            assert.equal(receipt.logs[0].event, 'Transfer', 'dovrebbe essere evento "Transfer"');
            assert.equal(receipt.logs[0].args._from, fromAccount, 'log da cui vengono trasferiti i token');
            assert.equal(receipt.logs[0].args._to, toAccount, 'log verso cui vengono trasferiti i token');
            assert.equal(receipt.logs[0].args._value, 10, 'log l ammontare di token trasferiti');
            return tokenInstance.balanceOf(fromAccount);
        }).then(function(balance){
            assert.equal(balance.toNumber(), 90, 'ricalcolo saldo dell account mittente');
            return tokenInstance.balanceOf(toAccount);
        }).then(function(balance){
            assert.equal(balance.toNumber(), 10, 'ricalcolo saldo dell account destinatario');
            return tokenInstance.allowance(fromAccount, spendingAccount);
        }).then(function(allowance){
            assert.equal(allowance, 0, 'ricalcolo saldo allowance');
        });
    });

});
*/