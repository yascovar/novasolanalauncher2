import { Connection, clusterApiUrl, PublicKey, Transaction, SystemProgram } from "@solana/web3.js";
import { createSetAuthorityInstruction, AuthorityType } from "@solana/spl-token";

export default async function handler(req, res) {
  try {
    const { mintAddress, wallet } = req.body;

    const connection = new Connection(clusterApiUrl("mainnet-beta"), "confirmed");
    const mint = new PublicKey(mintAddress);
    const owner = new PublicKey(wallet);

    const instruction = createSetAuthorityInstruction(
      mint,
      owner,
      AuthorityType.MintTokens,
      null
    );

    const transaction = new Transaction().add(instruction);
    const serializedTransaction = transaction.serialize({
      requireAllSignatures: false,
      verifySignatures: false,
    });

    res.status(200).json({ transaction: serializedTransaction.toString("base64") });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Revoke mint authority failed" });
  }
}
