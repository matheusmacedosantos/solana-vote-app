import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Counter } from "../target/types/counter";
import { Voting } from "../target/types/voting";
import { BankrunProvider, startAnchor } from "anchor-bankrun";
import { Keypair, PublicKey } from "@solana/web3.js";
import exp from "constants";

const IDL = require("../target/idl/voting.json");

const votingAddress = new PublicKey(
  "AsjZ3kWAUSQRNt2pZVeJkywhZ6gpLpHZmJjduPmKZDZZ"
);

describe("Voting", () => {
  let context;
  let provider;
  let votingProgram: anchor.Program<Voting>;

  beforeAll(async () => {
    context = await startAnchor(
      "",
      [{ name: "voting", programId: votingAddress }],
      []
    );
    provider = new BankrunProvider(context);

    votingProgram = new Program<Voting>(IDL, provider);
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
      .initializeCandidate("DJ Trump", new anchor.BN(1))
      .rpc();
    await votingProgram.methods
      .initializeCandidate("Kamala Harrys", new anchor.BN(1))
      .rpc();

    const [kamalaAddress] = PublicKey.findProgramAddressSync(
      [
        new anchor.BN(1).toArrayLike(Buffer, "le", 8),
        Buffer.from("Kamala Harrys"),
      ],
      votingAddress
    );
    const kamalaCandidate = await votingProgram.account.candidate.fetch(
      kamalaAddress
    );
    console.log(kamalaCandidate);

    expect(kamalaCandidate.candidateVotes.toNumber()).toEqual(0);

    const [trumpAddress] = PublicKey.findProgramAddressSync(
      [new anchor.BN(1).toArrayLike(Buffer, "le", 8), Buffer.from("DJ Trump")],
      votingAddress
    );
    const trumpCandidate = await votingProgram.account.candidate.fetch(
      trumpAddress
    );
    console.log(trumpCandidate);
    expect(trumpCandidate.candidateVotes.toNumber()).toEqual(0);
  });

  it("vote", async () => {
    await votingProgram.methods.vote("DJ Trump", new anchor.BN(1)).rpc();

    const [trumpAddress] = PublicKey.findProgramAddressSync(
      [new anchor.BN(1).toArrayLike(Buffer, "le", 8), Buffer.from("DJ Trump")],
      votingAddress
    );
    const trumpCandidate = await votingProgram.account.candidate.fetch(
      trumpAddress
    );
    console.log(trumpCandidate);
    expect(trumpCandidate.candidateVotes.toNumber()).toEqual(1);
  });
});
