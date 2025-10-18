"use client";

import { useEffect, useState } from "react";
import { Wallet, Plus } from "lucide-react";
import { apiClient } from "@/lib/api/client";
import { useToast } from "@/components/ui/toast";

export function WalletWidget() {
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [addingTokens, setAddingTokens] = useState(false);
  const { showToast } = useToast();

  const fetchBalance = async () => {
    try {
      const response = await apiClient.get("/api/wallet/balance");
      setBalance(response.data.balance);
    } catch (err) {
      console.error("Failed to fetch wallet balance", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBalance();
  }, []);

  const addDemoTokens = async () => {
    setAddingTokens(true);
    try {
      const response = await apiClient.post("/api/wallet/add-tokens", {
        amount: 1000,
      });
      setBalance(response.data.balance);
      showToast("1000 tokens added to your wallet!", "success");
    } catch (err: any) {
      showToast(err.response?.data?.error || "Failed to add tokens", "error");
    } finally {
      setAddingTokens(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 px-4 py-2 bg-card rounded-lg border animate-pulse">
        <Wallet className="h-5 w-5 text-muted-foreground" />
        <div className="h-4 w-20 bg-muted rounded"></div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-card rounded-lg border">
      <Wallet className="h-5 w-5 text-primary" />
      <div className="flex flex-col">
        <span className="text-xs text-muted-foreground">Wallet</span>
        <span className="text-sm font-bold text-foreground">
          {balance.toFixed(2)} tokens
        </span>
      </div>
      <button
        onClick={addDemoTokens}
        disabled={addingTokens}
        className="ml-2 p-1.5 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors disabled:opacity-50"
        title="Add 1000 demo tokens"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}
