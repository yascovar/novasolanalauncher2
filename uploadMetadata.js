import { bundlrStorage, Metaplex, keypairIdentity } from '@metaplex-foundation/js';
import { Connection, Keypair } from '@solana/web3.js';

export async function uploadMetadata({ name, symbol, imageUri, description }) {
  const connection = new Connection("https://api.mainnet-beta.solana.com");
  const wallet = window.solana;

  if (!wallet.publicKey) {
    throw new Error("Wallet not connected");
  }

  const metaplex = Metaplex.make(connection)
    .use(keypairIdentity(Keypair.generate()))
    .use(bundlrStorage());

  const { uri } = await metaplex.nfts().uploadMetadata({
    name: name,
    symbol: symbol,
    description: description,
    image: imageUri
  });

  return uri;
}
