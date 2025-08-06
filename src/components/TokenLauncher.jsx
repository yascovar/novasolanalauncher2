import React, { useState, useEffect } from 'react';

const TokenLauncher = () => {
  const [walletAddress, setWalletAddress] = useState(null);
  const [supply, setSupply] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  // Wallet connection
  const connectWallet = async () => {
    if (window.solana?.isPhantom) {
      try {
        const resp = await window.solana.connect();
        setWalletAddress(resp.publicKey.toString());
      } catch (err) {
        console.error('Wallet connection error:', err);
      }
    } else {
      alert('Phantom wallet not found. Please install it.');
    }
  };

  useEffect(() => {
    if (window.solana?.isPhantom) {
      window.solana.connect({ onlyIfTrusted: true }).then(({ publicKey }) => {
        setWalletAddress(publicKey.toString());
      });
    }
  }, []);

  // Submit token creation
  const launchToken = async () => {
    if (!walletAddress || !supply) return alert('Please connect wallet and enter supply');
    setLoading(true);

    try {
      const res = await fetch('/api/create-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          payerPublicKeyBase58: walletAddress,
          supply,
        }),
      });

      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      alert('Error launching token');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow rounded-xl mt-10">
      <h2 className="text-2xl font-bold mb-4">Launch Your Memecoin</h2>

      {walletAddress ? (
        <p className="mb-2 text-green-600">Connected: {walletAddress}</p>
      ) : (
        <button onClick={connectWallet} className="mb-4 px-4 py-2 bg-purple-600 text-white rounded">
          Connect Phantom Wallet
        </button>
      )}

      <input
        type="number"
        placeholder="Total Supply"
        value={supply}
        onChange={(e) => setSupply(e.target.value)}
        className="border p-2 w-full mb-4"
      />

      <button
        onClick={launchToken}
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        {loading ? 'Launching...' : 'Launch Token'}
      </button>

      {result && result.success && (
        <p className="mt-4 text-green-600">
          ✅ Token launched at address: <br />
          <a href={`https://solscan.io/token/${result.tokenAddress}`} target="_blank" rel="noreferrer">
            {result.tokenAddress}
          </a>
        </p>
      )}

      {result && !result.success && (
        <p className="mt-4 text-red-600">❌ Error: {result.error}</p>
      )}
    </div>
  );
};

export default TokenLauncher;
