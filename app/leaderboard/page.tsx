"use client";

import { useEffect, useState, useCallback } from "react";
import type { CSSProperties } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

interface LeaderboardEntry {
  rank: number;
  walletAddress: string;
  referralCount: number;
  tier: string;
  joinedAt: string;
}

export default function Leaderboard() {
  const router = useRouter();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLeaderboard = useCallback(async (showRefreshing = false) => {
    try {
      if (showRefreshing) {
        setRefreshing(true);
      }
      // Add cache-busting parameter and no-cache headers to ensure fresh data
      const response = await fetch(`/api/leaderboard?t=${Date.now()}`, {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch leaderboard");
      }

      const data = await response.json();
      setLeaderboard(data.leaderboard || []);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to load leaderboard");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    // Initial fetch
    fetchLeaderboard();

    // Set up auto-refresh every 30 seconds for real-time updates
    const interval = setInterval(() => {
      fetchLeaderboard();
    }, 30 * 1000);

    // Refresh when page becomes visible again
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchLeaderboard();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup interval and event listener on unmount
    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [fetchLeaderboard]);

  useEffect(() => {
    // Subscribe to Supabase changes so new users/referrals update instantly
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!supabaseUrl || !supabaseKey) return;

    const supabase = createClient(supabaseUrl, supabaseKey);
    const handleRealtimeUpdate = () => fetchLeaderboard(true);

    const channel = supabase
      .channel("leaderboard-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "users" },
        handleRealtimeUpdate
      )
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "referrals" },
        handleRealtimeUpdate
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
      supabase.removeChannel(channel);
    };
  }, [fetchLeaderboard]);

  const truncateAddress = (address: string) => {
    if (!address) return "";
    if (address.length <= 10) return address;
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getTierStyles = (tier: string): CSSProperties => {
    switch (tier) {
      case "Tourist":
        return {
          backgroundColor: "#F9E87B",
          color: "#0A0A0A",
          borderColor: "#F9E87B",
        };
      case "Survivor":
        return {
          backgroundColor: "#D97A27",
          color: "#FFFFFF",
          borderColor: "#D97A27",
        };
      case "Pain Holder":
        return {
          backgroundColor: "#B10024",
          color: "#FFFFFF",
          borderColor: "#B10024",
        };
      case "Cope Lord":
        return {
          backgroundColor: "#6A0DAD",
          color: "#FFFFFF",
          borderColor: "#6A0DAD",
        };
      case "Peak Cope":
        return {
          backgroundColor: "#0A0A0A",
          color: "#29F3FF",
          borderColor: "#29F3FF",
        };
      default:
        return {
          backgroundColor: "#1F2933", // fallback gray
          color: "#D1D5DB",
          borderColor: "#374151",
        };
    }
  };

  if (loading) {
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
            <div className="text-gray-400">Loading leaderboard...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
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
            <div className="text-center">
              <p className="text-red-400 mb-4">{error}</p>
              <button
                onClick={() => router.push("/dashboard")}
                className="px-6 py-3 bg-gradient-to-r from-cope-orange to-cope-orange-light text-white font-bold rounded-lg hover:opacity-90 transition"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 relative z-10">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={() => fetchLeaderboard(true)}
              disabled={refreshing}
              className="px-4 py-2 bg-cope-orange bg-opacity-20 hover:bg-opacity-30 text-cope-orange font-semibold rounded-lg transition border border-cope-orange border-opacity-40 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <svg 
                className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </button>
            <Link
              href="/"
              className="px-4 py-2 bg-cope-orange bg-opacity-20 hover:bg-opacity-30 text-cope-orange font-semibold rounded-lg transition border border-cope-orange border-opacity-40"
            >
              Home
            </Link>
          </div>
          <h1 className="text-5xl font-black mb-4 bg-gradient-to-r from-cope-orange to-cope-orange-light bg-clip-text text-transparent">
            COPE Pain Leaderboard
          </h1>
          <p className="text-gray-400 text-lg">Ranking the Survivors</p>
          <p className="text-gray-500 text-sm mt-2">Auto-refreshes every 30 seconds</p>
        </header>

        {leaderboard.length === 0 ? (
          <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-cope-orange border-opacity-30 rounded-2xl p-12 shadow-[0_0_20px_rgba(255,122,0,0.15)] text-center">
            <p className="text-gray-400 text-lg">
              No survivors yet. Be the first to join!
            </p>
          </div>
        ) : (
          <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-cope-orange border-opacity-30 rounded-2xl p-6 shadow-[0_0_20px_rgba(255,122,0,0.15)]">
            {/* Top 3 Podium */}
            {leaderboard.length >= 3 && (
              <div className="grid grid-cols-3 gap-4 mb-8">
                {/* 2nd Place */}
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 border-2 border-gray-500 border-opacity-30 rounded-xl p-4 text-center">
                  <div className="text-3xl mb-2">🥈</div>
                  <div className="text-2xl font-black mb-1 bg-gradient-to-r from-gray-300 to-gray-500 bg-clip-text text-transparent">
                    #{leaderboard[1].rank}
                  </div>
                  <div className="text-xs font-mono text-gray-400 mb-2">
                    {truncateAddress(leaderboard[1].walletAddress)}
                  </div>
                  <div className="text-lg font-bold text-white mb-1">
                    {leaderboard[1].referralCount}
                  </div>
                  <div className="mt-1 flex justify-center">
                    <div
                      className="px-3 py-1 rounded-lg text-xs font-semibold border"
                      style={getTierStyles(leaderboard[1].tier)}
                    >
                      {leaderboard[1].tier}
                    </div>
                  </div>
                </div>

                {/* 1st Place */}
                <div className="bg-gradient-to-br from-yellow-900 to-yellow-950 border-2 border-yellow-500 border-opacity-40 rounded-xl p-4 text-center transform scale-105">
                  <div className="text-4xl mb-2">🥇</div>
                  <div className="text-3xl font-black mb-1 bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                    #{leaderboard[0].rank}
                  </div>
                  <div className="text-xs font-mono text-gray-300 mb-2">
                    {truncateAddress(leaderboard[0].walletAddress)}
                  </div>
                  <div className="text-xl font-bold text-white mb-1">
                    {leaderboard[0].referralCount}
                  </div>
                  <div className="mt-1 flex justify-center">
                    <div
                      className="px-3 py-1 rounded-lg text-xs font-semibold border"
                      style={getTierStyles(leaderboard[0].tier)}
                    >
                      {leaderboard[0].tier}
                    </div>
                  </div>
                </div>

                {/* 3rd Place */}
                <div className="bg-gradient-to-br from-orange-900 to-orange-950 border-2 border-orange-500 border-opacity-30 rounded-xl p-4 text-center">
                  <div className="text-3xl mb-2">🥉</div>
                  <div className="text-2xl font-black mb-1 bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
                    #{leaderboard[2].rank}
                  </div>
                  <div className="text-xs font-mono text-gray-400 mb-2">
                    {truncateAddress(leaderboard[2].walletAddress)}
                  </div>
                  <div className="text-lg font-bold text-white mb-1">
                    {leaderboard[2].referralCount}
                  </div>
                  <div className="mt-1 flex justify-center">
                    <div
                      className="px-3 py-1 rounded-lg text-xs font-semibold border"
                      style={getTierStyles(leaderboard[2].tier)}
                    >
                      {leaderboard[2].tier}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Leaderboard Table */}
            <div className="space-y-2">
              {leaderboard.map((entry, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-4 p-4 rounded-lg border ${
                    entry.rank <= 3
                      ? "bg-gradient-to-r from-gray-800 to-gray-900 border-cope-orange border-opacity-20"
                      : "bg-black bg-opacity-40 border-gray-800 border-opacity-30"
                  } hover:border-cope-orange hover:border-opacity-40 transition`}
                >
                  {/* Rank */}
                  <div className="text-2xl font-black w-12 text-center text-gray-500">
                    #{entry.rank}
                  </div>

                  {/* Wallet Address */}
                  <div className="flex-1">
                    <div className="font-mono text-sm text-gray-300">
                      {truncateAddress(entry.walletAddress)}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Joined {formatDate(entry.joinedAt)}
                    </div>
                  </div>

                  {/* Referral Count */}
                  <div className="text-center">
                    <div className="text-xl font-bold text-white">
                      {entry.referralCount}
                    </div>
                    <div className="text-xs text-gray-500">referrals</div>
                  </div>

                  {/* Tier */}
                  <div className="text-right">
                    <div
                      className="px-3 py-1 rounded-lg text-sm font-semibold border"
                      style={getTierStyles(entry.tier)}
                    >
                      {entry.tier}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="mt-6 flex justify-center">
          <button
            onClick={() => router.push("/dashboard")}
            className="px-6 py-3 bg-gradient-to-r from-cope-orange to-cope-orange-light text-white font-bold rounded-lg hover:opacity-90 transition"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
