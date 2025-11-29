import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { BriberyBuster } from "../target/types/bribery_buster";
import { expect } from "chai";
import { PublicKey, Keypair } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID, createMint, createAccount, mintTo } from "@solana/spl-token";

describe("bribery_buster", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.BriberyBuster as Program<BriberyBuster>;
  const authority = provider.wallet as anchor.Wallet;
  
  let treasuryPDA: PublicKey;
  let treasuryBump: number;
  let corruptMint: PublicKey;
  let treasuryTokenAccount: PublicKey;
  let userTokenAccount: PublicKey;

  before(async () => {
    // Derive Treasury PDA
    [treasuryPDA, treasuryBump] = await PublicKey.findProgramAddress(
      [Buffer.from("treasury"), authority.publicKey.toBuffer()],
      program.programId
    );

    // Create CORRUPT token mint
    corruptMint = await createMint(
      provider.connection,
      authority.payer,
      authority.publicKey,
      null,
      9 // 9 decimals
    );

    // Create token accounts
    treasuryTokenAccount = await createAccount(
      provider.connection,
      authority.payer,
      corruptMint,
      treasuryPDA
    );

    userTokenAccount = await createAccount(
      provider.connection,
      authority.payer,
      corruptMint,
      provider.wallet.publicKey
    );

    // Mint initial supply to treasury
    await mintTo(
      provider.connection,
      authority.payer,
      corruptMint,
      treasuryTokenAccount,
      authority.publicKey,
      1_000_000_000 * 10 ** 9 // 1 billion tokens
    );
  });

  it("Initializes the treasury", async () => {
    const tx = await program.methods
      .initialize()
      .accounts({
        treasury: treasuryPDA,
        authority: authority.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();

    console.log("Initialize transaction signature", tx);

    const treasuryAccount = await program.account.treasury.fetch(treasuryPDA);
    expect(treasuryAccount.authority.toString()).to.equal(authority.publicKey.toString());
    expect(treasuryAccount.bump).to.equal(treasuryBump);
    expect(treasuryAccount.totalReports.toNumber()).to.equal(0);
    expect(treasuryAccount.totalRewardsDistributed.toNumber()).to.equal(0);
  });

  it("Submits a corruption report", async () => {
    const reportKeypair = Keypair.generate();
    const reportHash = Buffer.from(new Array(32).fill(1)); // Mock hash

    const tx = await program.methods
      .submitReport(Array.from(reportHash))
      .accounts({
        report: reportKeypair.publicKey,
        treasury: treasuryPDA,
        reporter: authority.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([reportKeypair])
      .rpc();

    console.log("Submit report transaction signature", tx);

    const reportAccount = await program.account.report.fetch(reportKeypair.publicKey);
    expect(reportAccount.reporter.toString()).to.equal(authority.publicKey.toString());
    expect(reportAccount.verified).to.be.false;
    expect(Buffer.from(reportAccount.hash).toString('hex')).to.equal(reportHash.toString('hex'));

    const treasuryAccount = await program.account.treasury.fetch(treasuryPDA);
    expect(treasuryAccount.totalReports.toNumber()).to.equal(1);
  });

  it("Rewards user with CORRUPT tokens", async () => {
    const rewardAmount = new anchor.BN(100 * 10 ** 9); // 100 tokens

    const tx = await program.methods
      .rewardUser(rewardAmount)
      .accounts({
        treasury: treasuryPDA,
        treasuryTokenAccount: treasuryTokenAccount,
        userTokenAccount: userTokenAccount,
        user: authority.publicKey,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .rpc();

    console.log("Reward user transaction signature", tx);

    const treasuryAccount = await program.account.treasury.fetch(treasuryPDA);
    expect(treasuryAccount.totalRewardsDistributed.toString()).to.equal(rewardAmount.toString());
  });
});
