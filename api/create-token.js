import { NextResponse } from 'next/server';
import {
  Connection,
  PublicKey,
  clusterApiUrl,
  Keypair,
  sendAndConfirmTransaction,
  Transaction,
} from '@solana/web3.js';
import {
  createMint,
  getOrCreateAssociatedTokenAccount,
  mintTo,
} from '@solana/spl-token';

export async function POST(req) {
  try {
    const body = await req.json();
    const { payerPublicKeyBase58, supply } = body;

    const connection = new Connection(clusterApiUrl('mainnet-beta'), 'confirmed');
    const payerPublicKey = new PublicKey(payerPublicKeyBase58);

    // Generate a new token mint (private key will not be saved)
    const mintKeypair = Keypair.generate();

    // Create the mint (this would need payer to actually sign this in a frontend app)
    const tokenMint = await createMint(
      connection,
      mintKeypair, // This would normally be the wallet signer, placeholder for now
      payerPublicKey,
      null,
      9
    );

    // Get the user's associated token account
    const tokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      mintKeypair, // Again, placeholder
      tokenMint,
      payerPublicKey
    );

    // Mint tokens to the user's token account
    const amount = parseInt(supply) * 10 ** 9;
    await mintTo(
      connection,
      mintKeypair,
      tokenMint,
      tokenAccount.address,
      mintKeypair,
      amount
    );

    return NextResponse.json({
      success: true,
      tokenAddress: tokenMint.toBase58(),
    });
  } catch (e) {
    console.error('Token creation failed:', e);
    return NextResponse.json({
      success: false,
      error: e.message || 'Unknown error',
    });
  }
}
