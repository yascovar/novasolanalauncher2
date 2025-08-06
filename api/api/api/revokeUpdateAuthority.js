import { Connection, clusterApiUrl, PublicKey, Transaction } from "@solana/web3.js";
import {
  createUpdateMetadataAccountV2Instruction,
  PROGRAM_ID as TOKEN_METADATA_PROGRAM_ID,
} from "@metaplex-foundation/mpl-token-metadata";

export default async function handler(req, res) {
  try {
    const { mintAddress, wallet } = req.body;

    const connection = new Connection(clusterApiUrl("mainnet-beta"), "confirmed");
    const mint = new PublicKey(mintAddress);
    const metadataAccount = (
      await PublicKey.findProgramAddress(
        [
          Buffer.from("metadata"),
          TOKEN_METADATA_PROGRAM_ID.toBuffer(),
          mint.toBuffer(),
        ],
        TOKEN_METADATA_PROGRAM_ID
      )
    )[0];

    const instruction = createUpdateMetadataAccountV2Instruction(
      {
        metadata: metadataAccount,
        updateAuthority: new PublicKey(wallet),
      },
      {
        updateMetadataAccountArgsV2: {
          data: null,
          updateAuthority: null,
          isMutable: false,
        },
      }
    );

    const tx = new Transaction().add(instruction);

    const serialized = tx.serialize({
      requireAllSignatures: false,
      verifySignatures: false,
    });

    res.status(200).json({ transaction: serialized.toString("base64") });
  } catch (error) {
    console.error("Revoke Update Authority Error:", error);
    res.status(500).json({ error: "Failed to revoke update authority" });
  }
}
