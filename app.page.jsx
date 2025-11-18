"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function Dashboard() {
  const [balance, setBalance] = useState(0);
  const [mining, setMining] = useState(false);
  const [rate, setRate] = useState(0.002);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  async function loadUser() {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .single();

    if (!error && data) {
      setBalance(data.balance);
      setRate(data.mining_rate);
    }

    setLoading(false);
  }

  useEffect(() => {
    if (!mining) return;

    const interval = setInterval(async () => {
      setBalance((b) => b + rate);

      await supabase.rpc("update_balance", {
        p_amount: rate,
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [mining, rate]);

  return (
    <div style={{
      width: "100%",
      padding: 40,
      fontFamily: "Arial",
      textAlign: "center"
    }}>
      <h1 style={{ fontSize: 40, marginBottom: 20 }}>🚀 LoneCoin Miner</h1>

      <div style={{
        background: "#eef",
        padding: 20,
        borderRadius: 12,
        marginBottom: 20,
        width: "80%",
        marginLeft: "10%"
      }}>
        <h2 style={{ fontSize: 28 }}>💰 Balance</h2>
        <p style={{ fontSize: 32, fontWeight: "bold" }}>
          {balance.toFixed(4)} LCC
        </p>
      </div>

      <div style={{
        background: "#ffe",
        padding: 20,
        borderRadius: 12,
        width: "80%",
        marginLeft: "10%",
        marginBottom: 30
      }}>
        <h3 style={{ fontSize: 22 }}>⛏️ Mining Rate</h3>
        <p style={{ fontSize: 26 }}>
          {rate} LCC / sec
        </p>
      </div>

      <button
        onClick={() => setMining(!mining)}
        style={{
          padding: "18px 40px",
          fontSize: 24,
          background: mining ? "#d44" : "#4caf50",
          color: "white",
          border: "none",
          borderRadius: 10,
          cursor: "pointer"
        }}
      >
        {mining ? "⛔ Stop Mining" : "▶️ Start Mining"}
      </button>
    </div>
  );
}
