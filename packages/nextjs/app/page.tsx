"use client";

import Image from "next/image";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import type { NextPage } from "next";
import { useAccount } from "wagmi";

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();

  return (
    <div className="flex flex-col items-center min-h-screen w-full p-4 md:p-8">
      <div className="bg-white rounded-xl shadow-xl max-w-6xl w-full p-6 md:p-8">
        {/* Hero Section */}
        <div className="max-w-4xl mx-auto text-center px-4 z-10">
          <div className="mb-4">
            <Image src="/logo-b.png" alt="PowerChain Logo" width={150} height={150} className="mx-auto" />
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-3 text-gray-900">SolarFlow</h1>

          <p className="text-lg mb-6 text-gray-800 max-w-2xl mx-auto">
            Revolutionising how energy is tracked, traded, and managed on the blockchain. Connect your wallet to access
            the future of transparent energy distribution.
          </p>

          {/* Main Call-to-Action */}
          <div className="flex justify-center py-3 mb-6">
            {!connectedAddress ? (
              <div className="transform transition-all hover:scale-105">
                <ConnectButton label="Connect Your Wallet" />
              </div>
            ) : (
              <div className="bg-gray-100 p-4 rounded-lg shadow">
                <p className="text-lg font-medium text-green-800 mb-1">Wallet Connected!</p>
                <p className="text-sm text-gray-600">You can now access the PowerChain dashboard</p>
                <div className="mt-3">
                  <a
                    href="/dashboard"
                    className="inline-block px-6 py-2 bg-green-700 hover:bg-green-800 text-white rounded-lg font-medium transition-colors"
                  >
                    Go to Dashboard
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Features Section with reduced spacing */}
        <div className="mt-6 px-4">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-100 p-4 rounded-lg shadow">
              <h3 className="text-lg font-bold text-green-800 mb-2">Transparent Energy Trading</h3>
              <p className="text-gray-700">
                Track energy production and consumption with immutable blockchain records.
              </p>
            </div>

            <div className="bg-gray-100 p-4 rounded-lg shadow">
              <h3 className="text-lg font-bold text-green-800 mb-2">Decentralized Grid</h3>
              <p className="text-gray-700">
                Participate in a network that removes central authorities from energy distribution.
              </p>
            </div>

            <div className="bg-gray-100 p-4 rounded-lg shadow">
              <h3 className="text-lg font-bold text-green-800 mb-2">Tokenized Energy</h3>
              <p className="text-gray-700">Buy, sell, and invest in energy assets through secure smart contracts.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
