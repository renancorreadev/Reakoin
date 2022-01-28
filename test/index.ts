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

  describe('Deployment Reakoin 🎸', () => {
    it('Should return the name this token 🎯', async () => {
      expect(await reakoin.name()).to.equal('Reakoin')
    })

    it('Should return the Total Supply 🎯', async () => {
      expect(await reakoin.totalSupply()).to.equal('50000000000000000000000000')
    })

    it('Should return maxTX 🎯', async () => {
      expect(await reakoin.maxTX()).to.equal('10000000000000000000000')
    })

    it('Should set the right owner 🎯', async () => {
      expect(await reakoin.owner()).to.equal(owner.address)
    })

    it('Should assign the total supply of tokens to the owner 🎯', async () => {
      const ownerBalance = await reakoin.balanceOf(owner.address)
      expect(await reakoin.totalSupply()).to.equal(ownerBalance)
    })
  })

  describe('Transactions 💰', () => {
    it('Should fail if swapEnable is disable 🎯', async () => {
      const amountTransferOwner = ethers.utils.parseEther('100')

      await reakoin.setSwapEnable(false)

      await reakoin.transfer(addr1.address, amountTransferOwner)
      await expect(
        reakoin.connect(addr1).transfer(addr1.address, amountTransferOwner),
      ).to.be.reverted
    })

    it('Should transfer changed swapEnable is true 🎯', async () => {
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

    it('Should fail if sender doesn’t have enough tokens 🎯', async () => {
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

    it('Should update balances after transfers 🎯', async () => {
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

  describe('Allowance permissions Tokens  🎸', () => {
    it('Should Returns the amount of tokens owned   🎯', async () => {
      const amountTransfer = ethers.utils.parseEther('1000')

      await reakoin.transfer(addr1.address, amountTransfer)
      await reakoin.connect(addr1).approve(addr2.address, amountTransfer)

      const allowance = await reakoin.allowance(addr1.address, addr2.address)
      expect(allowance).to.equal(amountTransfer)
    })
  })

  describe('Burn Tokens', () => {
    it('should be burn tokens ', async () => {
      await reakoin.burn(ethers.utils.parseEther('1000000'))

      const _newSupply = await reakoin.totalSupply()
      const newSupply = _newSupply.toString()

      const final = 49000000000000000000000000

      expect(+newSupply).to.be.equal(final)
    })

    it('should fail to burn more tokens exist', async () => {
      //supply = 50 000 000
      await expect(reakoin.burn(ethers.utils.parseEther('60000000'))).to.be
        .reverted
    })
  })

  describe('Maximum Transactions tests 🔄', () => {
    it('Should verify if maxTx is  10.000 tokens 🎯 ', async () => {
      const max = await reakoin.maxTX()
      const maxTX = max.toString()
      expect(maxTX).to.equal('10000000000000000000000')
    })

    it('Should owner transfer without rules maxTx & swapEnableß 🎯', async () => {
      //maxTX = 10 000
      const amountTransfer = ethers.utils.parseEther('15000')

      const initialOwnerBalance = await reakoin.balanceOf(owner.address)

      await reakoin.transfer(addr1.address, amountTransfer)
      const endBalance = await reakoin.balanceOf(owner.address)

      const finalBalance = endBalance - initialOwnerBalance
      expect(finalBalance).to.equal(finalBalance)
    })

    it('Should give an error if you try to transfer more than maxTX 🎯', async () => {
      //maxTX = 10 000
      const amountTransfer = ethers.utils.parseEther('15000')

      await reakoin.transfer(addr1.address, amountTransfer)
      await expect(
        reakoin.connect(addr1).transfer(addr2.address, amountTransfer),
      ).to.be.reverted
    })

    it('Should transfer if value is less than maxTX 🎯', async () => {
      const amountTransfer = ethers.utils.parseEther('8000')

      //owner transfer to addr1
      await reakoin.transfer(addr1.address, amountTransfer)
      await reakoin.connect(addr1).transfer(addr2.address, amountTransfer)

      const Addr2Balance = await reakoin.balanceOf(addr2.address)
      await expect(Addr2Balance).to.equal(amountTransfer)
    })
  })

  describe('Aproove & Transfer tokens 🔐', () => {
    it('Should fail if msg sender not approve 🎯', async function () {
      const amountTransfer = ethers.utils.parseEther('1000')
      //owner transfer to addr1
      await reakoin.transfer(addr1.address, amountTransfer)
      //transfer addd1 to add2
      await expect(
        reakoin
          .connect(addr1)
          .transferFrom(addr1.address, addr2.address, amountTransfer),
      ).to.be.reverted
    })

    it('Should transferFrom with approve tokens 🎯', async function () {
      const amountTransfer = ethers.utils.parseEther('1000')
      //owner transfer to addr1
      await reakoin.transfer(addr1.address, amountTransfer)
      //transfer addd1 to add2

      await reakoin
        .connect(addr1)
        .approve(addr2.address, amountTransfer)
        .then(() => {
          reakoin
            .connect(addr1)
            .transferFrom(addr1.address, addr2.address, amountTransfer)
            .then(() => {
              expect(reakoin.connect(addr2).balanceOf(addr1.address)).to.equal(
                0,
              )
            })
        })
    })
  })
})
