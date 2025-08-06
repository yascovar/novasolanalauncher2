import React from 'react';
import TokenLauncher from './components/TokenLauncher';

function App() {
  return (
    <main className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-4xl font-bold text-center mb-8">NovaSolanaLauncher</h1>
      <TokenLauncher />
    </main>
  );
}

export default App;
