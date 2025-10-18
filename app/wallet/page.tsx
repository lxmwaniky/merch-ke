"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { Wallet, Plus, ArrowDownLeft, ArrowUpRight, Loader2 } from "lucide-react";
import { apiClient } from "@/lib/api/client";
import { useToast } from "@/components/ui/toast";

interface Transaction {
  id: number;
  amount: number;
  type: "credit" | "debit";
  description: string;
  balance_after: number;
  created_at: string;
}

export default function WalletPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { showToast } = useToast();
  const [balance, setBalance] = useState<number>(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingTokens, setAddingTokens] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      fetchWalletData();
    }
  }, [user]);

  const fetchWalletData = async () => {
    try {
      const api = apiClient.getInstance();
      const [balanceRes, transactionsRes] = await Promise.all([
        api.get("/api/wallet/balance"),
        api.get("/api/wallet/transactions"),
      ]);
      setBalance(balanceRes.data.balance);
      setTransactions(transactionsRes.data.transactions || []);
    } catch (err) {
      showToast("Failed to load wallet data", "error");
    } finally {
      setLoading(false);
    }
  };

  const addDemoTokens = async () => {
    setAddingTokens(true);
    try {
      const api = apiClient.getInstance();
      const response = await api.post("/api/wallet/add-tokens", {
        amount: 1000,
      });
      setBalance(response.data.balance);
      showToast("1000 tokens added to your wallet!", "success");
      fetchWalletData(); // Refresh transactions
    } catch (err: any) {
      showToast(err.response?.data?.error || "Failed to add tokens", "error");
    } finally {
      setAddingTokens(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-bold text-foreground mb-8">My Wallet</h1>

        {/* Balance Card */}
        <div className="bg-gradient-to-br from-primary to-primary/80 rounded-2xl p-8 text-primary-foreground mb-8 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90 mb-2">Available Balance</p>
              <p className="text-4xl font-bold">{balance.toFixed(2)} tokens</p>
              <p className="text-sm opacity-75 mt-2">
                ≈ KSh {balance.toFixed(2)} (1:1 for demo)
              </p>
            </div>
            <Wallet className="h-16 w-16 opacity-30" />
          </div>
          <button
            onClick={addDemoTokens}
            disabled={addingTokens}
            className="mt-6 flex items-center gap-2 px-6 py-3 bg-white text-primary rounded-lg font-medium hover:bg-gray-100 transition-colors disabled:opacity-50"
          >
            <Plus className="h-5 w-5" />
            {addingTokens ? "Adding..." : "Add 1000 Demo Tokens"}
          </button>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-8">
          <p className="text-sm text-blue-900 dark:text-blue-200">
            <strong>Demo Mode:</strong> This is a token-based system for simulation purposes. 
            No real money is involved. New users start with 1000 tokens, and you can add more 
            for testing purchases.
          </p>
        </div>

        {/* Transactions */}
        <div className="bg-card rounded-lg shadow border">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold text-foreground">Transaction History</h2>
          </div>
          <div className="divide-y">
            {transactions.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                No transactions yet
              </div>
            ) : (
              transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-full ${
                        transaction.type === "credit"
                          ? "bg-green-100 dark:bg-green-900/30"
                          : "bg-red-100 dark:bg-red-900/30"
                      }`}
                    >
                      {transaction.type === "credit" ? (
                        <ArrowDownLeft className="h-5 w-5 text-green-600 dark:text-green-400" />
                      ) : (
                        <ArrowUpRight className="h-5 w-5 text-red-600 dark:text-red-400" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">
                        {transaction.description}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(transaction.created_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`font-bold ${
                        transaction.type === "credit"
                          ? "text-green-600 dark:text-green-400"
                          : "text-red-600 dark:text-red-400"
                      }`}
                    >
                      {transaction.type === "credit" ? "+" : "-"}
                      {transaction.amount.toFixed(2)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Balance: {transaction.balance_after.toFixed(2)}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
