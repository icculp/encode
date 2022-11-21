import { Ballot__factory } from "../typechain-types";
import { ethers } from "ethers";
import * as dotenv from "dotenv";
dotenv.config();

const CONTRACT_ADDRESS = "0x18785Bd1006D5D6Bb2D3930b421cB3EB7ebd77e5"

async function getResults() {
 const options = {
  alchemy: process.env.ALCHEMY_API_KEY,
  infura: process.env.INFURA_API_KEY,
  etherscan: process.env.ETHERSCAN_API_KEY,
 };
 
 const account = await ethers.getDefaultProvider('goerli', options);
 const wallet = new ethers.Wallet(process.env.PRIVATE_KEY ?? "");
 const signer = wallet.connect(account);

 const balanceBN = await signer.getBalance();
 console.log(`Your Wallet Balance is: ${balanceBN.toString()}`);
 
 const ballotFactory = new Ballot__factory(signer);
 const ballotContract = ballotFactory.attach(CONTRACT_ADDRESS);

 // Get the results of the vote
 const winningProposal = await ballotContract.winnerName();
 const name = ethers.utils.parseBytes32String(winningProposal);
 console.log(`The winning proposal is: ${name}`);
}

getResults().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});