import React, { useState, useEffect } from "react";

function App() {
  const [walletAddress, setWalletAddress] = useState(null);
  const [tokenName, setTokenName] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [tokenSupply, setTokenSupply] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  // Connect to Phantom Wallet
  const connectWallet = async () => {
    if (window.solana && window.solana.isPhantom) {
      try {
        const response = await window.solana.connect();
        setWalletAddress(response.publicKey.toString());
      } catch (err) {
        console.error("Wallet connection error:", err);
      }
    } else {
      alert("Phantom Wallet not found. Please install it.");
    }
  };

  // Auto-connect if already authorized
  useEffect(() => {
    const checkWallet = async () => {
      if (window.solana && window.solana.isPhantom) {
        try {
          const res = await window.solana.connect({ onlyIfTrusted: true });
          setWalletAddress(res.publicKey.toString());
        } catch (err) {
          console.warn("Wallet not yet connected");
        }
      }
    };
    checkWallet();
  }, []);

  const handleMint = () => {
    alert(
      `Minting:\nName: ${tokenName}\nSymbol: ${tokenSymbol}\nSupply: ${tokenSupply}\nImage URL: ${imageUrl}`
    );
    // Raydium launch code goes here next
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial" }}>
      <h1>Nova Solana Launcher</h1>

      {!walletAddress ? (
        <button onClick={connectWallet} style={styles.button}>
          Connect Phantom Wallet
        </button>
      ) : (
        <p style={{ color: "green" }}>Connected: {walletAddress}</p>
      )}

      <div style={styles.form}>
        <input
          type="text"
          placeholder="Token Name"
          value={tokenName}
          onChange={(e) => setTokenName(e.target.value)}
          style={styles.input}
        />
        <input
          type="text"
          placeholder="Token Symbol"
          value={tokenSymbol}
          onChange={(e) => setTokenSymbol(e.target.value)}
          style={styles.input}
        />
        <input
          type="number"
          placeholder="Total Supply"
          value={tokenSupply}
          onChange={(e) => setTokenSupply(e.target.value)}
          style={styles.input}
        />
        <input
          type="text"
          placeholder="Image URL (optional)"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          style={styles.input}
        />

        <button onClick={handleMint} style={styles.mintButton}>
          Mint Token (Raydium Coming Soon)
        </button>
      </div>
    </div>
  );
}

const styles = {
  input: {
    display: "block",
    margin: "10px 0",
    padding: "10px",
    width: "100%",
    maxWidth: "400px",
    fontSize: "16px",
  },
  form: {
    marginTop: "2rem",
  },
  button: {
    padding: "12px 20px",
    backgroundColor: "#512da8",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px",
  },
  mintButton: {
    marginTop: "20px",
    padding: "12px 20px",
    backgroundColor: "#1e88e5",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px",
  },
};

export default App;
