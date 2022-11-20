import { MyToken__factory } from "../typechain-types";
import { ethers } from 'hardhat';
//import { dotenv } from 'dotenv';

const TEST_MINT_VALUE = ethers.utils.parseEther("10");

async function main() {
    const accounts = await ethers.getSigners();
    const [minter, voter, other] = accounts;
    const conractFactory = new MyToken__factory(minter);
    const contract = await conractFactory.deploy();
    await contract.deployed();
    console.log(`Tokenized Votes contract deployed at ${contract.address}`);
    let voterTokenBalance = await contract.balanceOf(voter.address)
    const mintTx = await contract.mint(voter.address, TEST_MINT_VALUE)
    await mintTx.wait();
    console.log(`The voter starts with ${voterTokenBalance} decimals of balance`)
    voterTokenBalance = await contract.balanceOf(voter.address)
    console.log(`After the mint, the voter has ${voterTokenBalance} decimals of balance`)

    let votePower = await contract.getVotes(voter.address)
    console.log(`After the mint, the voter has ${votePower} decimals of power`)

    const delegateTx = await contract.connect(voter).delegate(voter.address);
    await delegateTx.wait();
    votePower = await contract.getVotes(voter.address)
    console.log(`After has ${votePower} of votePower`)
    const transferTx = await contract.connect(voter).transfer(other.address, TEST_MINT_VALUE.div(2))
    await transferTx.wait();
    votePower = await contract.getVotes(voter.address)
    console.log(`After the transfer, voter has ${votePower}`)
    votePower = await contract.getVotes(other.address);
    console.log(`After transfer, other account has ${votePower} vote power`)
    const currentBlock = await ethers.provider.getBlock("latest")

    const delegateOtherTx = await contract.connect(other).delegate(other.address);
    await delegateOtherTx.wait();
    votePower = await contract.getVotes(other.address);
    console.log(`After the self delegation, the other account has ${votePower} decimals of vote power\n`);
  

    for (let blockNumber = currentBlock.number - 1; blockNumber >= 0; blockNumber--) {
        const pastVotePower = await contract.getPastVotes(voter.address, blockNumber)
        console.log(`At block ${blockNumber} the voter had ${pastVotePower} voting power`)
    }
}

main().catch((err) => {
    console.log(err);
    process.exitCode = 1;
});