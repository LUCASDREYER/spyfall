"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { decodeToken } from "@/lib/game";
import { Check, Copy, ExternalLink, ArrowLeft, Users } from "lucide-react";

function HostContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [copied, setCopied] = useState<number | null>(null);
  const [baseUrl, setBaseUrl] = useState("");

  useEffect(() => {
    setBaseUrl(window.location.origin);
  }, []);

  const names = searchParams.get("names")?.split(",") ?? [];
  const playerTokens = names.map((_, i) => searchParams.get(`p${i}`) ?? "");

  const getPlayerUrl = (token: string) => `${baseUrl}/play?t=${token}`;

  const copyLink = async (token: string, i: number) => {
    await navigator.clipboard.writeText(getPlayerUrl(token));
    setCopied(i);
    setTimeout(() => setCopied(null), 2000);
  };

  const openLink = (token: string) => {
    window.open(getPlayerUrl(token), "_blank");
  };

  const firstToken = playerTokens[0] ? decodeToken(playerTokens[0]) : null;

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 p-4">
      <div className="max-w-lg mx-auto space-y-5">
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between pt-2"
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/")}
            className="text-slate-400 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-1" /> New Game
          </Button>
          <div className="text-right">
            <p className="text-white font-bold">Share Links</p>
            {firstToken && (
              <p className="text-slate-400 text-xs">
                {firstToken.timerMinutes} min · {firstToken.spyCount} {firstToken.spyCount === 1 ? "spy" : "spies"}
              </p>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-purple-900/40 border-purple-700/50 backdrop-blur">
            <CardContent className="pt-4 pb-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-purple-600/50 flex items-center justify-center shrink-0 mt-0.5">
                  <Users className="w-4 h-4 text-purple-300" />
                </div>
                <div>
                  <p className="text-purple-200 text-sm font-medium">How to share</p>
                  <p className="text-purple-300/70 text-xs mt-0.5">
                    Send each player their unique link — each link reveals only their role. Players open the link on their own phone. Do <strong className="text-purple-200">not</strong> share your own link!
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="space-y-3">
          {names.map((name, i) => {
            const token = playerTokens[i];
            const decoded = token ? decodeToken(token) : null;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + i * 0.07 }}
              >
                <Card className="bg-slate-800/60 border-slate-700 backdrop-blur overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white font-bold text-sm">
                          {name[0]?.toUpperCase()}
                        </div>
                        <span className="text-white font-semibold">{name}</span>
                      </div>
                      <Badge className="bg-slate-700 text-slate-300 border-0 text-xs">
                        Player {i + 1}
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => copyLink(token, i)}
                        variant="outline"
                        size="sm"
                        className="flex-1 border-slate-600 text-slate-300 hover:text-white hover:border-purple-500 bg-slate-700/50 transition-all"
                      >
                        {copied === i ? (
                          <><Check className="w-3.5 h-3.5 mr-1.5 text-green-400" /> Copied!</>
                        ) : (
                          <><Copy className="w-3.5 h-3.5 mr-1.5" /> Copy Link</>
                        )}
                      </Button>
                      <Button
                        onClick={() => openLink(token)}
                        variant="outline"
                        size="sm"
                        className="border-slate-600 text-slate-300 hover:text-white hover:border-purple-500 bg-slate-700/50"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center text-slate-500 text-xs pb-4"
        >
          Once everyone has their link, start asking questions!
        </motion.div>
      </div>
    </main>
  );
}

export default function HostPage() {
  return (
    <Suspense>
      <HostContent />
    </Suspense>
  );
}
