import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import { expect } from 'chai'
import { ethers } from 'hardhat'

let Reakoin: any
let reakoin: any
let owner: SignerWithAddress
let addr1: SignerWithAddress
let addr2: SignerWithAddress
let addrs: SignerWithAddress[]

describe('Deployment Reakoin', async function () {
  it('Should return the name this token', async function () {
    Reakoin = await ethers.getContractFactory('Reakoin')
    reakoin = await Reakoin.deploy('Reakoin', 'REAK')
    await reakoin.deployed()
    expect(await reakoin.name()).to.equal('Reakoin')
  })

  it('Should return the Total Supply', async function () {
    Reakoin = await ethers.getContractFactory('Reakoin')
    reakoin = await Reakoin.deploy('Reakoin', 'REAK')
    await reakoin.deployed()
    expect(await reakoin.totalSupply()).to.equal('50000000000000000000000000')
  })

  it('Should return maxTX', async function () {
    Reakoin = await ethers.getContractFactory('Reakoin')
    reakoin = await Reakoin.deploy('Reakoin', 'REAK')
    await reakoin.deployed()
    await reakoin.deployed()
    expect(await reakoin.maxTX()).to.equal('10000000000000000000000')
  })

  it('Should set the right owner', async function () {
    Reakoin = await ethers.getContractFactory('Reakoin')
    reakoin = await Reakoin.deploy('Reakoin', 'REAK')
    await reakoin.deployed()
    ;[owner, addr1, addr2, ...addrs] = await ethers.getSigners()
    expect(await reakoin.owner()).to.equal(owner.address)
  })

  it('Should assign the total supply of tokens to the owner', async function () {
    Reakoin = await ethers.getContractFactory('Reakoin')
    reakoin = await Reakoin.deploy('Reakoin', 'REAK')
    await reakoin.deployed()
    ;[owner, addr1, addr2, ...addrs] = await ethers.getSigners()
    const ownerBalance = await reakoin.balanceOf(owner.address)
    expect(await reakoin.totalSupply()).to.equal(ownerBalance)
  })
})

describe('Transactions', function () {
  it('Should transfer tokens between accounts', async function () {
    Reakoin = await ethers.getContractFactory('Reakoin')
    reakoin = await Reakoin.deploy('Reakoin', 'REAK')
    await reakoin.deployed()
    ;[owner, addr1, addr2, ...addrs] = await ethers.getSigners()
    // Transfer 50 tokens from owner to addr1
    const amountTransferOwner = ethers.utils.parseEther('1000')
    await reakoin.transfer(addr1.address, amountTransferOwner)
    const addr1Balance = await reakoin.balanceOf(addr1.address)
    const bal = addr1Balance.toString()
    expect(bal).to.equal(amountTransferOwner)
    // Transfer 50 tokens from addr1 to addr2
    // use .connect(signer) to send a transaction from another account

    const amountTransfer = ethers.utils.parseEther('500')
    await reakoin.connect(addr1).transfer(addr2.address, amountTransfer)
    const addr2Balance = await reakoin.balanceOf(addr2.address)
    expect(addr2Balance).to.equal(amountTransfer)
  })

  it('Should fail if sender doesn’t have enough tokens', async function () {
    Reakoin = await ethers.getContractFactory('Reakoin')
    reakoin = await Reakoin.deploy('Reakoin', 'REAK')
    await reakoin.deployed()
    ;[owner, addr1, addr2, ...addrs] = await ethers.getSigners()

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
    Reakoin = await ethers.getContractFactory('Reakoin')
    reakoin = await Reakoin.deploy('Reakoin', 'REAK')
    await reakoin.deployed()
    ;[owner, addr1, addr2, ...addrs] = await ethers.getSigners()

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
