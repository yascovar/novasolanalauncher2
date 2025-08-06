import React, { useState, useEffect } from "react";
import {
  Connection,
  clusterApiUrl,
  PublicKey,
  Transaction,
} from "@solana/web3.js";

function App() {
  const [walletAddress, setWalletAddress] = useState(null);
  const [tokenSupply, setTokenSupply] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // Connect Phantom wallet
  const connectWallet = async () => {
    if (window.solana && window.solana.isPhantom) {
      try {
        const response = await window.solana.connect();
        setWalletAddress(response.publicKey.toString());
      } catch (err) {
        alert("Wallet connection failed");
      }
    } else {
      alert("Phantom wallet not found. Please install it.");
    }
  };

  // Launch token API call
  const launchToken = async () => {
    if (!walletAddress) {
      alert("Connect wallet first");
      return;
    }
    if (!tokenSupply || isNaN(tokenSupply) || Number(tokenSupply) <= 0) {
      alert("Enter valid token supply");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/launchToken", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          wallet: walletAddress,
          supply: tokenSupply,
        }),
      });
      const data = await res.json();
      if (data.error) {
        alert("Error launching token: " + data.error);
      } else {
        setResult(data);
        alert("Token launched: " + data.tokenAddress);
      }
    } catch (e) {
      alert("Launch failed");
      console.error(e);
    }
    setLoading(false);
  };

  // Revoke Mint Authority
  const handleRevokeMint = async () => {
    if (!walletAddress || !result?.tokenAddress) {
      alert("Connect wallet and launch a token first");
      return;
    }
    try {
      const res = await fetch("/api/revokeMintAuthority", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mintAddress: result.tokenAddress,
          wallet: walletAddress,
        }),
      });
      const { transaction } = await res.json();
      const tx = Transaction.from(Buffer.from(transaction, "base64"));
      const signed = await window.solana.signAndSendTransaction(tx);
      await signed.wait();
      alert("Mint authority revoked ✅");
    } catch (e) {
      alert("Error revoking mint authority");
      console.error(e);
    }
  };

  // Revoke Freeze Authority
  const handleRevokeFreeze = async () => {
    if (!walletAddress || !result?.tokenAddress) {
      alert("Connect wallet and launch a token first");
      return;
    }
    try {
      const res = await fetch("/api/revokeFreezeAuthority", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mintAddress: result.tokenAddress,
          wallet: walletAddress,
        }),
      });
      const { transaction } = await res.json();
      const tx = Transaction.from(Buffer.from(transaction, "base64"));
      const signed = await window.solana.signAndSendTransaction(tx);
      await signed.wait();
      alert("Freeze authority revoked ✅");
    } catch (e) {
      alert("Error revoking freeze authority");
      console.error(e);
    }
  };

  // Revoke Update Authority
  const handleRevokeUpdate = async () => {
    if (!walletAddress || !result?.tokenAddress) {
      alert("Connect wallet and launch a token first");
      return;
    }
    try {
      const res = await fetch("/api/revokeUpdateAuthority", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mintAddress: result.tokenAddress,
          wallet: walletAddress,
        }),
      });
      const { transaction } = await res.json();
      const tx = Transaction.from(Buffer.from(transaction, "base64"));
      const signed = await window.solana.signAndSendTransaction(tx);
      await signed.wait();
      alert("Update authority revoked ✅");
    } catch (e) {
      alert("Error revoking update authority");
      console.error(e);
    }
  };

  return (
    <div className="container mx-auto max-w-md p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Solana MemeCoin Launcher</h1>

      {!walletAddress ? (
        <button
          onClick={connectWallet}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Connect Phantom Wallet
        </button>
      ) : (
        <div className="mb-4 text-center">
          Connected Wallet: {walletAddress}
        </div>
      )}

      <input
        type="number"
        placeholder="Token Supply"
        value={tokenSupply}
        onChange={(e) => setTokenSupply(e.target.value)}
        className="w-full p-2 border border-gray-400 rounded mb-4"
      />

      <button
        onClick={launchToken}
        disabled={loading}
        className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
      >
        {loading ? "Launching..." : "Launch Token"}
      </button>

      {result && (
        <div className="mt-6">
          <p>
            🎉 Token launched! Address:{" "}
            <a
              href={`https://explorer.solana.com/address/${result.tokenAddress}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              {result.tokenAddress}
            </a>
          </p>

          <button
            onClick={handleRevokeMint}
            className="mt-4 w-full bg-red-600 text-white py-2 rounded hover:bg-red-700"
          >
            Revoke Mint Authority
          </button>

          <button
            onClick={handleRevokeFreeze}
            className="mt-2 w-full bg-orange-600 text-white py-2 rounded hover:bg-orange-700"
          >
            Revoke Freeze Authority
          </button>

          <button
            onClick={handleRevokeUpdate}
            className="mt-2 w-full bg-yellow-600 text-white py-2 rounded hover:bg-yellow-700"
          >
            Revoke Update Authority
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
