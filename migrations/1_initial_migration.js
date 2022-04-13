// File js per il deployment degli smart contracts in blockchain.

const EthereumSwap_Migration = artifacts.require("EthereumSwap");

const Token_Migration = artifacts.require("Token");

module.exports = async function(deployer) {
  // Deploy Token
  await deployer.deploy(Token_Migration);
  const token = await Token_Migration.deployed();

  // Deploy EthSwap
  await deployer.deploy(EthereumSwap_Migration, token.address);
  const ethSwap = await EthereumSwap_Migration.deployed();

  // Trasferimento di tutti quanti i token (1 milione) all'exchange (contract EthereumSwap)
  await token.transfer(ethSwap.address, '1000000000000000000000000')
};
