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
  it("Initialize Poll", async () => {
    const context = await startAnchor(
      "",
      [{ name: "voting", programId: votingAddress }],
      []
    );
    const provider = new BankrunProvider(context);

    const votingProgram = new Program<Voting>(IDL, provider);

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
});
