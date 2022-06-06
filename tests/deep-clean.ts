import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { DeepClean } from "../target/types/deep_clean";
import { expect } from 'chai';

describe("deep-clean", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider);

  const program = anchor.workspace.DeepClean as Program<DeepClean>;

  it("Is initialized!", async () => {
    // Add your test here.
    const account = anchor.web3.Keypair.generate();
    const user = provider.wallet.publicKey;

    const tx = await program.rpc.initialize(
      true,
      true,
      {
        accounts: {
          data: account.publicKey,
          user: user,
          systemProgram: anchor.web3.SystemProgram.programId,
        },
        signers: [account]
      }
    )
    console.log("Your transaction signature", tx);
  });

  it("Uploaded media!", async () => {
    const account = anchor.web3.Keypair.generate();
    const user = provider.wallet.publicKey;
    await program.rpc.initialize(
      true,
      true,
      {
        accounts: {
          data: account.publicKey,
          user: user,
          systemProgram: anchor.web3.SystemProgram.programId,
        },
        signers: [account]
      }
    )
    let metadata = await program.account.metadata.fetch(account.publicKey);
    let mediahash = "bafkreigsrlyoljeok6nt7roxmxbu37zbhc5xlmwvli3o7lyujkm32nfpz4"
    const tx = await program.rpc.uploadmedia(
      user,
      mediahash,
      { 
        accounts: {
          data: account.publicKey,
        },
        signers: []
    });
    metadata = await program.account.metadata.fetch(account.publicKey)
    expect(metadata.creator.toString()).to.equal(user.toString());

    console.log("Your transaction signature", tx);
  });

  it("Share a media", async () => {
    const account = anchor.web3.Keypair.generate();
    const user = provider.wallet.publicKey;
    await program.rpc.initialize(
      true,
      true,
      {
        accounts: {
          data: account.publicKey,
          user: user,
          systemProgram: anchor.web3.SystemProgram.programId,
        },
        signers: [account]
      }
    )
    let metadata = await program.account.metadata.fetch(account.publicKey);
    const tx = await program.rpc.sharemedia(
      user,
      {
        accounts: {
          data: account.publicKey,
        },
        signers: []
      }
    )
    metadata = await program.account.metadata.fetch(account.publicKey)
    expect(metadata.peopleWhoShared.length).to.greaterThan(0);
    console.log("Your transaction signature", tx);
  });
});

