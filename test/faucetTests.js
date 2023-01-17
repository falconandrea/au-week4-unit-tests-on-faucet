const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers')
const { expect } = require('chai')

describe('Faucet', function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployContractAndSetVariables () {
    // Contracts are deployed using the first signer/account by default
    const [owner, notOwner] = await ethers.getSigners()

    const Faucet = await ethers.getContractFactory('Faucet')
    const faucet = await Faucet.deploy()

    return { faucet, owner, notOwner }
  }

  it('should deploy and set the owner correctly', async function () {
    const { faucet, owner } = await loadFixture(deployContractAndSetVariables)

    expect(await faucet.owner()).to.equal(owner.address)
  })

  it('should not allow to withdraw above .1 ETH', async function () {
    const { faucet } = await loadFixture(deployContractAndSetVariables)

    // Try to withdraw 1 ETH
    const withdrawAmount = ethers.utils.parseUnits('1', 'ether')

    await expect(faucet.withdraw(withdrawAmount)).to.be.reverted
  })

  it('should block withdrawAll for a not-owner user', async function () {
    const { faucet, owner, notOwner } = await loadFixture(deployContractAndSetVariables)

    await expect(faucet.connect(notOwner).withdrawAll()).to.be.revertedWith('You are not the owner')
  })
})
