import {
  Connection,
  Keypair,
  PublicKey,
  SystemProgram,
  Transaction,
  sendAndConfirmTransaction,
} from "https://cdn.skypack.dev/@solana/web3.js";
import {
  createMint,
  getOrCreateAssociatedTokenAccount,
  mintTo,
} from "https://cdn.skypack.dev/@solana/spl-token";

// Connect wallet button
const connectWalletBtn = document.getElementById("connectWallet");
const walletAddressDisplay = document.getElementById("walletAddress");
let provider = null;
let walletPublicKey = null;

connectWalletBtn.addEventListener("click", async () => {
  if ("solana" in window) {
    provider = window.solana;
    if (provider.isPhantom) {
      try {
        const response = await provider.connect();
        walletPublicKey = response.publicKey;
        walletAddressDisplay.textContent = `Wallet: ${walletPublicKey.toString()}`;
      } catch (err) {
        console.error("Wallet connection failed:", err);
      }
    }
  } else {
    alert("Phantom Wallet not found. Please install it.");
  }
});

// Launch token form
document.getElementById("launchForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!walletPublicKey) {
    alert("Connect your wallet first.");
    return;
  }

  const tokenName = document.getElementById("tokenName").value;
  const tokenSymbol = document.getElementById("tokenSymbol").value;
  const tokenSupply = Number(document.getElementById("tokenSupply").value);
  const statusMessage = document.getElementById("statusMessage");

  try {
    statusMessage.textContent = "Launching token...";

    const connection = new Connection("https://api.mainnet-beta.solana.com", "confirmed");

    // Generate mint
    const mint = await createMint(
      connection,
      walletPublicKey,
      walletPublicKey,
      null,
      9 // 9 decimal places
    );

    // Get associated token account
    const tokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      walletPublicKey,
      mint,
      walletPublicKey
    );

    // Mint to the wallet
    await mintTo(
      connection,
      walletPublicKey,
      mint,
      tokenAccount.address,
      walletPublicKey,
      tokenSupply * 10 ** 9
    );

    statusMessage.innerHTML = `
      ✅ Token Launched!<br>
      Token Mint Address: <br><a href="https://solscan.io/token/${mint}" target="_blank">${mint}</a>
    `;
  } catch (err) {
    console.error(err);
    statusMessage.textContent = "❌ Error launching token. Check console.";
  }
});
