import { ethers } from 'hardhat'

async function main() {
  const Reakoin = await ethers.getContractFactory('Reakoin')
  const reakoin = await Reakoin.deploy()

  await reakoin.deployed()

  console.log('Reakoin deployed to:', reakoin.address)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
