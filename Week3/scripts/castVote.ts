import { Ballot__factory } from "../typechain-types";
import { MyToken__factory } from "../typechain-types";
import { ethers } from "ethers";
import * as dotenv from "dotenv";
dotenv.config();

const CONTRACT_ADDRESS = '0x18785Bd1006D5D6Bb2D3930b421cB3EB7ebd77e5'
const BALLOT_CONTRACT_ADDRESS = '0x0F917777811cE4415d0271d4c7336fDA8DFFCB64'
const addresses = [
 '0x14436b97836b662aa32d902e2BDc4c2dB65Fed8A',
 '0xEC6AaA2a0061C329C2864082E0d706f2D9664c49',
 '0x63b534BA7aD89A768ae11CABa79f24E46ddd9550',
]

const PROPOSALS = ["cheese"]

const TOKEN_AMOUNT = ethers.utils.parseEther("1");

async function vote() {
 const options = {
  infura: process.env.INFURA_API_KEY
 };
 
 const account = await ethers.getDefaultProvider('goerli', options);
 const wallet = new ethers.Wallet(process.env.PRIVATE_KEY ?? "");
 const signer = wallet.connect(account);

 const balanceBN = await signer.getBalance();
 console.log(`Your Wallet Balance is: ${balanceBN.toString()}`);
 
 const ballotFactory = new Ballot__factory(signer);
 const ballotContract =  ballotFactory.attach(BALLOT_CONTRACT_ADDRESS);

 //cast vote
 console.log("Casting vote...");

 const castVoteTx = await ballotContract.vote(PROPOSALS[0], TOKEN_AMOUNT);
 const castVoteReceipt = await castVoteTx.wait();
 console.log({ castVoteReceipt });

}

vote().catch((error) => {
 console.error(error);
 process.exitCode = 1;
})
.finally(() => process.exit());