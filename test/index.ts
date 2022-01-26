import { expect } from 'chai'
import { ethers } from 'hardhat'

describe('Reakoin', function () {
  it("Should return the new greeting once it's changed", async function () {
    const Reakoin = await ethers.getContractFactory('Reakoin')
    const reakoin = await Reakoin.deploy('Reakoin', 'REAK')
    await reakoin.deployed()
    expect(await reakoin.name()).to.equal('Reakoin')
  })
})
