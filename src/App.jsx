
import React, { useState } from 'react';
import { Connection, PublicKey, Transaction, clusterApiUrl } from '@solana/web3.js';

const App = () => {
  const [walletAddress, setWalletAddress] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    symbol: '',
    decimals: 9,
    supply: '',
    imageUrl: '',
  });
  const [status, setStatus] = useState('');

  const connectWallet = async () => {
    try {
      const { solana } = window;
      if (solana && solana.isPhantom) {
        const response = await solana.connect();
        setWalletAddress(response.publicKey.toString());
      } else {
        alert('Phantom wallet not found!');
      }
    } catch (error) {
      console.error(error);
      setStatus('Wallet connection failed');
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const createToken = async () => {
    if (!walletAddress) return alert('Please connect your wallet first');
    setStatus('Creating token...');

    try {
      const response = await fetch('/api/create-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, payer: walletAddress }),
      });

      const result = await response.json();
      if (result.success) {
        setStatus(`✅ Token created: ${result.tokenAddress}`);
      } else {
        setStatus(`❌ Error: ${result.error}`);
      }
    } catch (err) {
      console.error(err);
      setStatus('❌ Failed to create token');
    }
  };

  return (
    <div style={{ padding: 20, fontFamily: 'sans-serif' }}>
      <h1>SolNova Token Creator</h1>
      {!walletAddress ? (
        <button onClick={connectWallet}>Connect Phantom Wallet</button>
      ) : (
        <p>Wallet: {walletAddress}</p>
      )}
      <input name="name" placeholder="Token Name" onChange={handleInputChange} /><br />
      <input name="symbol" placeholder="Symbol" onChange={handleInputChange} /><br />
      <input name="supply" placeholder="Total Supply" onChange={handleInputChange} /><br />
      <input name="imageUrl" placeholder="Image URL (optional)" onChange={handleInputChange} /><br />
      <button onClick={createToken}>Launch Token</button>
      <p>{status}</p>
    </div>
  );
};

export default App;
