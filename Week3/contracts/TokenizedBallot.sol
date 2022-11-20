// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;
/// @title Voting with delegation.
import "./ERC20Votes.sol";


contract Ballot {
    // This declares a new complex type which will
    // be used for variables later.
    // It will represent a single voter.
    MyToken public voteToken;
    uint256 public targetBlock;

    // This is a type for a single proposal.
    struct Proposal {
        bytes32 name;   // short name (up to 32 bytes)
        uint voteCount; // number of accumulated votes
    }

    // A dynamically-sized array of `Proposal` structs.
    mapping (address => uint256) public votePowerSpent;

    Proposal[] public proposals;

    /// Create a new ballot to choose one of `proposalNames`.
    constructor(bytes32[] memory proposalNames, address _voteToken, uint256 _targetBlock) {
        voteToken = MyToken(_voteToken);
        // to the end of the array.
        for (uint i = 0; i < proposalNames.length; i++) {
            // `Proposal({...})` creates a temporary
            // Proposal object and `proposals.push(...)`
            // appends it to the end of `proposals`.
            proposals.push(Proposal({
                name: proposalNames[i],
                voteCount: 0
            }));
        }
        targetBlock = _targetBlock;
    }

    // Give `voter` the right to vote on this ballot.
    // May only be called by `chairperson`.

    /// Delegate your vote to the voter `to`.
  
    /// Give your vote (including votes delegated to you)
    /// to proposal `proposals[proposal].name`.
    function vote(uint proposal, uint256 amount) external {
        // TODO: implement logic
        require(votePower(msg.sender) >= amount, "Not enough vote power");

        proposals[proposal].voteCount += amount;
        votePowerSpent[msg.sender] += amount;
    }

    function votePower(address account) public view returns (uint256) {
        return voteToken.getPastVotes(account, targetBlock) - votePowerSpent[account];
    }

    /// @dev Computes the winning proposal taking all
    /// previous votes into account.
    function winningProposal() public view
            returns (uint winningProposal_)
    {
        uint winningVoteCount = 0;
        for (uint p = 0; p < proposals.length; p++) {
            if (proposals[p].voteCount > winningVoteCount) {
                winningVoteCount = proposals[p].voteCount;
                winningProposal_ = p;
            }
        }
    }

    // Calls winningProposal() function to get the index
    // of the winner contained in the proposals array and then
    // returns the name of the winner
    function winnerName() external view
            returns (bytes32 winnerName_)
    {
        winnerName_ = proposals[winningProposal()].name;
    }
}