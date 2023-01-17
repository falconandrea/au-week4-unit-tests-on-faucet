const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers')
const { expect } = require('chai')

describe('Faucet', function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployContractAndSetVariables () {
    // Contracts are deployed using the first signer/account by default
    const [owner] = await ethers.getSigners()

    const Faucet = await ethers.getContractFactory('Faucet')
    const faucet = await Faucet.deploy()

    return { faucet, owner }
  }

  it('should deploy and set the owner correctly', async function () {
    const { faucet, owner } = await loadFixture(deployContractAndSetVariables)

    expect(await faucet.owner()).to.equal(owner.address)
  })
})
