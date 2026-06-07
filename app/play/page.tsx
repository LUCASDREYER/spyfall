"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { decodeToken, PlayerToken } from "@/lib/game";
import { Eye, EyeOff, MapPin, Clock, Skull, ChevronDown, ChevronUp, Users } from "lucide-react";

function useTimer(token: PlayerToken | null) {
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);

  useEffect(() => {
    if (!token) return;
    const endMs = token.startedAt + token.timerMinutes * 60 * 1000;

    const tick = () => {
      const left = Math.max(0, Math.round((endMs - Date.now()) / 1000));
      setSecondsLeft(left);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [token]);

  return secondsLeft;
}

function formatTime(s: number) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

function PlayContent() {
  const searchParams = useSearchParams();
  const [revealed, setRevealed] = useState(false);
  const [showLocations, setShowLocations] = useState(false);
  const [token, setToken] = useState<PlayerToken | null>(null);
  const [invalid, setInvalid] = useState(false);

  useEffect(() => {
    const t = searchParams.get("t");
    if (!t) { setInvalid(true); return; }
    const decoded = decodeToken(t);
    if (!decoded) { setInvalid(true); return; }
    setToken(decoded);
  }, [searchParams]);

  const secondsLeft = useTimer(token);
  const isExpired = secondsLeft === 0;
  const urgentThreshold = token ? Math.min(60, token.timerMinutes * 10) : 60;
  const isUrgent = secondsLeft !== null && secondsLeft <= urgentThreshold && secondsLeft > 0;

  if (invalid) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <p className="text-4xl">🕵️</p>
          <p className="text-white font-bold text-xl">Invalid link</p>
          <p className="text-slate-400">This link doesn't look right. Ask the host for a new one.</p>
        </div>
      </main>
    );
  }

  if (!token) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 flex flex-col items-center justify-center p-4 gap-4">
      {/* Player name */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-2"
      >
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white font-bold">
          {token.playerName[0]?.toUpperCase()}
        </div>
        <span className="text-white font-semibold text-lg">{token.playerName}</span>
      </motion.div>

      {/* Role card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="w-full max-w-sm"
      >
        <Card className={`border-2 backdrop-blur overflow-hidden ${
          token.isSpy
            ? "bg-red-950/60 border-red-700/70"
            : "bg-slate-800/60 border-purple-700/50"
        }`}>
          <CardContent className="p-6 space-y-4">
            <div className="text-center space-y-1">
              <p className="text-slate-400 text-xs uppercase tracking-widest">Your card</p>
              <AnimatePresence mode="wait">
                {!revealed ? (
                  <motion.div
                    key="hidden"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="py-6"
                  >
                    <div className="text-4xl mb-2">🃏</div>
                    <p className="text-slate-400">Tap to reveal your role</p>
                    <p className="text-slate-500 text-xs mt-1">Make sure no one is watching!</p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="revealed"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-3 py-2"
                  >
                    {token.isSpy ? (
                      <div className="space-y-2">
                        <div className="text-5xl">🕵️</div>
                        <p className="text-red-300 font-black text-3xl tracking-tight">YOU ARE</p>
                        <p className="text-red-400 font-black text-4xl tracking-tighter">THE SPY</p>
                        <p className="text-red-300/60 text-xs mt-2">Figure out the location without getting caught!</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="space-y-1">
                          <p className="text-slate-400 text-xs uppercase tracking-wider">Location</p>
                          <div className="flex items-center justify-center gap-2">
                            <MapPin className="w-4 h-4 text-purple-400" />
                            <p className="text-white font-black text-2xl">{token.location}</p>
                          </div>
                        </div>
                        <div className="h-px bg-slate-700" />
                        <div className="space-y-1">
                          <p className="text-slate-400 text-xs uppercase tracking-wider">Your role</p>
                          <p className="text-purple-300 font-bold text-xl">{token.role}</p>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Button
              onClick={() => setRevealed(!revealed)}
              className={`w-full font-semibold ${
                token.isSpy
                  ? "bg-red-700 hover:bg-red-800 text-white"
                  : "bg-purple-600 hover:bg-purple-700 text-white"
              }`}
            >
              {revealed ? (
                <><EyeOff className="w-4 h-4 mr-2" /> Hide</>
              ) : (
                <><Eye className="w-4 h-4 mr-2" /> Reveal</>
              )}
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Timer */}
      {secondsLeft !== null && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card className={`backdrop-blur border ${
            isExpired
              ? "bg-slate-800/60 border-slate-600"
              : isUrgent
              ? "bg-red-950/60 border-red-700/50"
              : "bg-slate-800/60 border-slate-700"
          }`}>
            <CardContent className="px-6 py-3 flex items-center gap-3">
              <Clock className={`w-4 h-4 ${isExpired ? "text-slate-500" : isUrgent ? "text-red-400" : "text-purple-400"}`} />
              <span className={`font-mono font-bold text-2xl tabular-nums ${
                isExpired ? "text-slate-500" : isUrgent ? "text-red-400" : "text-white"
              }`}>
                {isExpired ? "Time's up!" : formatTime(secondsLeft)}
              </span>
              {isUrgent && !isExpired && (
                <Badge className="bg-red-700 border-0 text-red-100 text-xs animate-pulse">
                  Hurry!
                </Badge>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Locations list */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.25 }}
        className="w-full max-w-sm"
      >
        <button
          onClick={() => setShowLocations(!showLocations)}
          className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-slate-800/60 border border-slate-700 text-slate-300 hover:text-white transition-colors"
        >
          <span className="flex items-center gap-2 text-sm font-medium">
            <MapPin className="w-4 h-4 text-purple-400" />
            All possible locations ({token.allLocations.length})
          </span>
          {showLocations ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        <AnimatePresence>
          {showLocations && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <Card className="mt-2 bg-slate-800/60 border-slate-700 backdrop-blur">
                <CardContent className="p-3">
                  <div className="grid grid-cols-2 gap-1">
                    {token.allLocations.map((loc) => {
                      const isThis = !token.isSpy && loc === token.location;
                      return (
                        <div
                          key={loc}
                          className={`text-xs px-2 py-1 rounded flex items-center gap-1 ${
                            isThis
                              ? "bg-purple-600/30 text-purple-200"
                              : "text-slate-400"
                          }`}
                        >
                          {isThis && <MapPin className="w-3 h-3 shrink-0" />}
                          {loc}
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Game info footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex items-center gap-3 text-slate-500 text-xs"
      >
        <span className="flex items-center gap-1">
          <Users className="w-3 h-3" /> {token.totalPlayers} players
        </span>
        <span>·</span>
        <span className="flex items-center gap-1">
          <Skull className="w-3 h-3" /> {token.spyCount} {token.spyCount === 1 ? "spy" : "spies"}
        </span>
        <span>·</span>
        <span className="flex items-center gap-1">
          <Clock className="w-3 h-3" /> {token.timerMinutes} min
        </span>
      </motion.div>
    </main>
  );
}

export default function PlayPage() {
  return (
    <Suspense>
      <PlayContent />
    </Suspense>
  );
}
