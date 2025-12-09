"use client";

<<<<<<< HEAD
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getRank, type User } from "@/lib/storage";
=======
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { getRank, type User } from '@/lib/storage'
>>>>>>> d3ae4d682b35b373c3081655260d2875ed72ce29

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [referralLink, setReferralLink] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const walletAddress = localStorage.getItem("cope_wallet_address");
      if (!walletAddress) {
        router.push("/");
        return;
      }

      try {
        const response = await fetch(
          `/api/getUser?walletAddress=${encodeURIComponent(walletAddress)}`
        );
        if (!response.ok) {
          router.push("/");
          return;
        }

        const data = await response.json();
        setUser(data.user);
        const baseUrl =
          typeof window !== "undefined" ? window.location.origin : "";
        setReferralLink(`${baseUrl}/?ref=${data.user.referralCode}`);
      } catch (error) {
        console.error("Error fetching user:", error);
        router.push("/");
      }
    };

    fetchUser();
  }, [router]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen p-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-end mb-4">
            <Link
              href="/"
              className="px-4 py-2 bg-cope-orange bg-opacity-20 hover:bg-opacity-30 text-cope-orange font-semibold rounded-lg transition border border-cope-orange border-opacity-40"
            >
              Home
            </Link>
          </div>
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-gray-400">Loading...</div>
          </div>
        </div>
      </div>
    );
  }

  const rank = getRank(user.referralCount);
  const joinedDate = new Date(user.createdAt).toLocaleDateString();

  return (
    <div className="min-h-screen p-4 relative z-10">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <div className="flex justify-end mb-4">
            <Link
              href="/"
              className="px-4 py-2 bg-cope-orange bg-opacity-20 hover:bg-opacity-30 text-cope-orange font-semibold rounded-lg transition border border-cope-orange border-opacity-40"
            >
              Home
            </Link>
          </div>
          <h1 className="text-4xl font-black mb-4 bg-gradient-to-r from-cope-orange to-cope-orange-light bg-clip-text text-transparent">
            Your Pain Rank
          </h1>
          <p className="text-gray-400">
            Your Pain Rank depends on how many survivors you bring.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Rank Card */}
          <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-cope-orange border-opacity-30 rounded-2xl p-6 shadow-[0_0_20px_rgba(255,122,0,0.15)]">
            <h2 className="text-xl font-bold mb-4 text-cope-orange">
              Current Rank
            </h2>
            <div className="text-4xl font-black mb-2 bg-gradient-to-r from-cope-orange to-cope-orange-light bg-clip-text text-transparent">
              {rank}
            </div>
            <p className="text-gray-400 text-sm">
              Based on {user.referralCount} referral
              {user.referralCount !== 1 ? "s" : ""}
            </p>
          </div>

          {/* Stats Card */}
          <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-cope-orange border-opacity-30 rounded-2xl p-6 shadow-[0_0_20px_rgba(255,122,0,0.15)]">
            <h2 className="text-xl font-bold mb-4 text-cope-orange">Stats</h2>
            <div className="space-y-3">
              <div>
                <p className="text-gray-400 text-sm">Total Referrals</p>
                <p className="text-3xl font-bold text-white">
                  {user.referralCount}
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Joined</p>
                <p className="text-lg text-white">{joinedDate}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Wallet Address */}
        <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-cope-orange border-opacity-30 rounded-2xl p-6 mb-6 shadow-[0_0_20px_rgba(255,122,0,0.15)]">
          <h2 className="text-xl font-bold mb-4 text-cope-orange">
            Wallet Address
          </h2>
          <p className="font-mono text-sm text-gray-300 break-all">
            {user.walletAddress}
          </p>
        </div>

        {/* Referral Link */}
        <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-cope-orange border-opacity-30 rounded-2xl p-6 mb-6 shadow-[0_0_20px_rgba(255,122,0,0.15)]">
          <h2 className="text-xl font-bold mb-4 text-cope-orange">
            Your Referral Link
          </h2>
          <div className="flex gap-2">
            <input
              type="text"
              value={referralLink}
              readOnly
              className="flex-1 px-4 py-2 bg-black bg-opacity-50 border border-gray-700 rounded-lg text-white text-sm font-mono"
            />
            <button
              onClick={handleCopy}
              className={`px-6 py-2 rounded-lg font-semibold transition ${
                copied
                  ? "bg-green-600 text-white"
                  : "bg-gradient-to-r from-cope-orange to-cope-orange-light text-white hover:opacity-90"
              }`}
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => router.push("/leaderboard")}
            className="px-6 py-3 bg-gradient-to-r from-cope-orange to-cope-orange-light text-white font-bold rounded-lg hover:opacity-90 transition"
          >
            View Leaderboard
          </button>
        </div>
      </div>
    </div>
  );
}
