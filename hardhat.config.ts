import * as dotenv from 'dotenv'

import { HardhatUserConfig, task } from 'hardhat/config'
import '@nomiclabs/hardhat-etherscan'
import '@nomiclabs/hardhat-waffle'
import '@typechain/hardhat'
import 'hardhat-gas-reporter'
import 'solidity-coverage'

dotenv.config()
const privateKey =
  '4a0b3c16bc2251d65b19816eef5a9810f1f339f9b0dddaa055837409d8c2e1f5'

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task('accounts', 'Prints the list of accounts', async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners()

  for (const account of accounts) {
    console.log(account.address)
  }
})

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

const config: HardhatUserConfig = {
  etherscan: {
    apiKey: {
      bsc: '8CKWUD7MPJ1W897VDY4BRND4FZXCIJS94F',
      bscTestnet: '8CKWUD7MPJ1W897VDY4BRND4FZXCIJS94F',
    },
  },
  solidity: '0.8.4',
  defaultNetwork: 'hardhat',
  networks: {
    localhost: {
      url: 'http://127.0.0.1:8545',
    },
    hardhat: {},
    testnet: {
      url: 'https://data-seed-prebsc-1-s1.binance.org:8545',
      chainId: 97,
      gasPrice: 10000000000,
      accounts: [privateKey],
    },
    mainnet: {
      url: 'https://bsc-dataseed.binance.org/',
      chainId: 56,
      gasPrice: 20000000000,
      accounts: [privateKey],
    },
  },
}

export default config
