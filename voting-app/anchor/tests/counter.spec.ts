import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Voting } from "../target/types/voting";
import { PublicKey } from "@solana/web3.js";
const IDL = require("../target/idl/voting.json");

const votingAddress = new PublicKey(
  "9Haw7CtchWgJA9AJkWRdVegganiRwMResXq5yFa3uWs7"
);

describe("Voting", () => {
  let context;
  let provider;
  anchor.setProvider(anchor.AnchorProvider.env());
  let votingProgram = anchor.workspace.Voting as Program<Voting>;

  beforeAll(async () => {
    // context = await startAnchor(
    //   "",
    //   [{ name: "voting", programId: votingAddress }],
    //   []
    // );
    // provider = new BankrunProvider(context);
    // votingProgram = new Program<Voting>(IDL, provider);
  });

  it("Initialize Poll", async () => {
    await votingProgram.methods
      .initializePoll(
        new anchor.BN(1),
        "What is your favorite candidate?",
        new anchor.BN(0),
        new anchor.BN(1821246480)
      )
      .rpc();

    const [pollAddress] = PublicKey.findProgramAddressSync(
      [new anchor.BN(1).toArrayLike(Buffer, "le", 8)],
      votingAddress
    );

    const poll = await votingProgram.account.poll.fetch(pollAddress);

    console.log(poll);

    expect(poll.pollId.toNumber()).toBe(1);
    expect(poll.description).toBe("What is your favorite candidate?");
    expect(poll.pollStart.toNumber()).toBeLessThan(poll.pollEnd.toNumber());
  });

  it("initialize candidate", async () => {
    await votingProgram.methods
      .initializeCandidate("trump", new anchor.BN(1))
      .rpc();
    await votingProgram.methods
      .initializeCandidate("kamala", new anchor.BN(1))
      .rpc();

    const [kamalaAddress] = PublicKey.findProgramAddressSync(
      [new anchor.BN(1).toArrayLike(Buffer, "le", 8), Buffer.from("kamala")],
      votingAddress
    );
    const kamalaCandidate = await votingProgram.account.candidate.fetch(
      kamalaAddress
    );
    console.log(kamalaCandidate);

    expect(kamalaCandidate.candidateVotes.toNumber()).toEqual(0);

    const [trumpAddress] = PublicKey.findProgramAddressSync(
      [new anchor.BN(1).toArrayLike(Buffer, "le", 8), Buffer.from("trump")],
      votingAddress
    );
    const trumpCandidate = await votingProgram.account.candidate.fetch(
      trumpAddress
    );
    console.log(trumpCandidate);
    expect(trumpCandidate.candidateVotes.toNumber()).toEqual(0);
  });

  it("vote", async () => {
    await votingProgram.methods.vote("trump", new anchor.BN(1)).rpc();

    const [trumpAddress] = PublicKey.findProgramAddressSync(
      [new anchor.BN(1).toArrayLike(Buffer, "le", 8), Buffer.from("trump")],
      votingAddress
    );
    const trumpCandidate = await votingProgram.account.candidate.fetch(
      trumpAddress
    );
    console.log(trumpCandidate);
    expect(trumpCandidate.candidateVotes.toNumber()).toEqual(1);
  });
});
