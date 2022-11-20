import { expect } from "chai";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ethers } from "hardhat";
import { Ballot } from "../typechain-types";

const PROPOSALS = ["Raspberry", "Pistacchio", "Vanilla"]

describe("Ballot", async () => {
    let ballotContract: Ballot;
    let accounts: SignerWithAddress[];
    beforeEach(async () => {
        accounts = await ethers.getSigners();
        const ballotContractFactory = await ethers.getContractFactory("Ballot")
        ballotContract = await ballotContractFactory.deploy(PROPOSALS.map(value => ethers.utils.formatBytes32String(value)));
        await ballotContract.deployed()
    })
    describe("when the contract is deployed", async () => {
        it("has the provided proposals", async  () => {
            for (let index = 0; index < PROPOSALS.length; index++){
                const proposal = await ballotContract.proposals(index);
                expect(ethers.utils.parseBytes32String(proposal.name)).to.eq(
                    PROPOSALS[index]
                );
            }
        });
        it("sets the deployer address as chairperson", async function () {
            const chairperson = await ballotContract.chairperson();
            expect(chairperson).to.eq(accounts[0].address)
        });
        it("sets the voting weight for the chairperson as 1", async function () {
            const chairpersonVoter = await ballotContract.voters(accounts[0].address)
            expect(chairpersonVoter.weight).to.eq(1)
        });
    });
});
