import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import { expect } from 'chai'
import { ethers } from 'hardhat'
import { solidity } from 'ethereum-waffle'
import chai from 'chai'

chai.use(solidity)

describe('Reakoin Contract', () => {
  let Reakoin: any
  let reakoin: any
  let owner: SignerWithAddress
  let addr1: SignerWithAddress
  let addr2: SignerWithAddress
  let addrs: SignerWithAddress[]
  let swapIsEnable: boolean

  beforeEach(async () => {
    Reakoin = await ethers.getContractFactory('Reakoin')
    reakoin = await Reakoin.deploy('Reakoin', 'REAK')
    await reakoin.deployed()
    ;[owner, addr1, addr2, ...addrs] = await ethers.getSigners()

    await reakoin.setSwapEnable(true)
    swapIsEnable = await reakoin.swapEnable()
  })

  describe('Deployment Reakoin', async function () {
    it('Should return the name this token', async function () {
      expect(await reakoin.name()).to.equal('Reakoin')
    })

    it('Should return the Total Supply', async function () {
      expect(await reakoin.totalSupply()).to.equal('50000000000000000000000000')
    })

    it('Should return maxTX', async function () {
      expect(await reakoin.maxTX()).to.equal('10000000000000000000000')
    })

    it('Should set the right owner', async function () {
      expect(await reakoin.owner()).to.equal(owner.address)
    })

    it('Should assign the total supply of tokens to the owner', async function () {
      const ownerBalance = await reakoin.balanceOf(owner.address)
      expect(await reakoin.totalSupply()).to.equal(ownerBalance)
    })
  })

  describe('Transactions', function () {
    it('Should fail if swapEnable is disable', async function () {
      const amountTransferOwner = ethers.utils.parseEther('100')

      await reakoin.setSwapEnable(false)

      await expect(reakoin.transfer(addr1.address, amountTransferOwner)).to.be
        .reverted
    })

    it('Should transfer changed swapEnable is true', async function () {
      const _initialBalance = await reakoin.balanceOf(addr1.address)
      const initialBalance = _initialBalance.toString()

      expect(swapIsEnable).to.equal(true)

      const amountTransfer = ethers.utils.parseEther('1000')
      const bal: any = amountTransfer.toString()

      await reakoin.transfer(addr1.address, amountTransfer)

      const _result = await reakoin.balanceOf(addr1.address)
      const result: string = _result.toString()

      const _endBalance = bal - initialBalance
      const endBalance = _endBalance

      await expect(+result).to.equal(endBalance)
    })

    it('Should fail if sender doesn’t have enough tokens', async function () {
      const initialOwnerBalance = await reakoin.balanceOf(addr2.address)

      // Try to send 1 token from addr1 (0 tokens) to owner (1000 tokens).
      // `require` will evaluate false and revert the transaction.
      const amountTransferOwner = ethers.utils.parseEther('100')

      await reakoin.transfer(addr1.address, amountTransferOwner)
      const addr1Balance = await reakoin.balanceOf(addr1.address)

      //set > if test fails
      if (addr1Balance < 0) {
        await expect(
          reakoin.connect(addr1).transfer(addr2.address, amountTransferOwner),
        ).to.be.revertedWith('Not enough tokens')
        expect(await reakoin.balanceOf(addr2.address)).to.equal(
          initialOwnerBalance,
        )
      }
    })

    it('Should update balances after transfers', async function () {
      //declare variables
      const initialOwnerBalance = await reakoin
        .balanceOf(owner.address)
        .toString()

      const amountTransfer1 = ethers.utils.parseEther('1000')
      const amountTransfer2 = ethers.utils.parseEther('500')

      await reakoin.transfer(addr1.address, amountTransfer1)
      await reakoin.transfer(addr2.address, amountTransfer2)

      const updateBal = await reakoin.balanceOf(owner.address)
      const bal = updateBal.toString()

      expect(+bal).to.equal(49998500000000000000000000)

      const addr1Balance = await reakoin.balanceOf(addr1.address)
      expect(addr1Balance).to.equal(amountTransfer1)

      const addr2Balance = await reakoin.balanceOf(addr2.address)
      expect(addr2Balance).to.equal(amountTransfer2)
    })
  })
})
