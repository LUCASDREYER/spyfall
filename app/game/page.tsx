"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { decodeToken, PlayerToken } from "@/lib/game";
import { useI18n } from "@/lib/i18n";
import { Eye, EyeOff, MapPin, ChevronDown, ChevronUp, ArrowRight, CheckCircle2, Home } from "lucide-react";

type Phase = "handoff" | "viewing";

function GameContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { t } = useI18n();

  const count = Number(searchParams.get("count") ?? "0");
  const tokens: PlayerToken[] = [];
  for (let i = 0; i < count; i++) {
    const raw = searchParams.get(`p${i}`);
    const decoded = raw ? decodeToken(raw) : null;
    if (decoded) tokens.push(decoded);
  }

  const [playerIndex, setPlayerIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>("handoff");
  const [revealed, setRevealed] = useState(false);
  const [showLocations, setShowLocations] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    setRevealed(false);
    setShowLocations(false);
  }, [playerIndex]);

  if (tokens.length === 0) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <p className="text-4xl">🕵️</p>
          <p className="text-white font-bold text-xl">{t("noGame")}</p>
          <Button onClick={() => router.push("/")} className="bg-purple-600 hover:bg-purple-700">
            {t("startNew")}
          </Button>
        </div>
      </main>
    );
  }

  if (done) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 flex flex-col items-center justify-center p-6 gap-8">
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="text-center space-y-3"
        >
          <div className="text-7xl mb-2">🎉</div>
          <h2 className="text-white font-black text-3xl tracking-tight">{t("allDealt")}</h2>
          <p className="text-slate-400 text-base">{t("everyoneReady")}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="w-full max-w-xs"
        >
          <Button
            onClick={() => router.push("/")}
            size="lg"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold h-14 rounded-xl"
          >
            {t("newGame")}
          </Button>
        </motion.div>
      </main>
    );
  }

  const token = tokens[playerIndex];
  const isLastPlayer = playerIndex === tokens.length - 1;
  const nextName = tokens[playerIndex + 1]?.playerName;

  const advance = () => {
    if (isLastPlayer) {
      setDone(true);
    } else {
      setPlayerIndex((i) => i + 1);
      setPhase("handoff");
    }
  };

  // --- Handoff screen ---
  if (phase === "handoff") {
    return (
      <main className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 gap-10 relative">
        <button
          onClick={() => router.push("/")}
          className="absolute top-4 left-4 flex items-center gap-1.5 text-slate-600 hover:text-slate-400 transition-colors text-sm"
        >
          <Home className="w-4 h-4" /> {t("home")}
        </button>

        <motion.div
          key={`handoff-${playerIndex}`}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-4"
        >
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white font-black text-3xl mx-auto">
            {token.playerName[0]?.toUpperCase()}
          </div>
          <div className="space-y-1">
            <p className="text-slate-400 text-sm uppercase tracking-widest">{t("passPhoneTo")}</p>
            <p className="text-white font-black text-4xl tracking-tight">{token.playerName}</p>
          </div>
          <p className="text-slate-500 text-sm">
            {t("playerOf", { n: playerIndex + 1, total: tokens.length })}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="w-full max-w-xs"
        >
          <Button
            onClick={() => setPhase("viewing")}
            size="lg"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold text-lg h-14 rounded-xl shadow-lg shadow-purple-900/50"
          >
            {t("iHavePhone")} <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </motion.div>
      </main>
    );
  }

  // --- Card viewing screen ---
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 flex flex-col items-center justify-center p-4 gap-5 relative">
      <button
        onClick={() => router.push("/")}
        className="absolute top-4 left-4 flex items-center gap-1.5 text-slate-600 hover:text-slate-400 transition-colors text-sm"
      >
        <Home className="w-4 h-4" /> {t("home")}
      </button>

      {/* Player indicator */}
      <motion.div
        key={`viewing-header-${playerIndex}`}
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-2"
      >
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white font-bold text-sm">
          {token.playerName[0]?.toUpperCase()}
        </div>
        <span className="text-white font-semibold">{token.playerName}</span>
      </motion.div>

      {/* Card */}
      <motion.div
        key={`card-${playerIndex}`}
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.05 }}
        className="w-full max-w-sm"
      >
        <div className={`rounded-2xl border-2 p-6 space-y-5 backdrop-blur transition-colors duration-500 ${
          !revealed
            ? "bg-slate-800/60 border-slate-700"
            : token.isSpy
            ? "bg-red-950/60 border-red-700/70"
            : "bg-slate-800/60 border-purple-700/50"
        }`}>
          <p className="text-center text-slate-400 text-xs uppercase tracking-widest">{t("yourCard")}</p>

          <AnimatePresence mode="wait">
            {!revealed ? (
              <motion.div
                key="hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-6 space-y-2"
              >
                <div className="text-5xl">🃏</div>
                <p className="text-slate-400">{t("tapReveal")}</p>
              </motion.div>
            ) : token.isSpy ? (
              <motion.div
                key="spy"
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="text-center space-y-2 py-2"
              >
                <div className="text-5xl">🕵️</div>
                <p className="text-red-300 font-black text-3xl tracking-tight">{t("youAre")}</p>
                <p className="text-red-400 font-black text-4xl tracking-tighter">{t("theSpy")}</p>
                <p className="text-red-300/60 text-xs mt-1">{t("spyHint")}</p>
              </motion.div>
            ) : (
              <motion.div
                key="role"
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4 py-2"
              >
                <div className="text-center space-y-1">
                  <p className="text-slate-400 text-xs uppercase tracking-wider">{t("location")}</p>
                  <div className="flex items-center justify-center gap-2">
                    <MapPin className="w-4 h-4 text-purple-400 shrink-0" />
                    <p className="text-white font-black text-2xl">{token.location}</p>
                  </div>
                </div>
                <div className="h-px bg-slate-700" />
                <div className="text-center space-y-1">
                  <p className="text-slate-400 text-xs uppercase tracking-wider">{t("yourRole")}</p>
                  <p className="text-purple-300 font-bold text-xl">{token.role}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <Button
            onClick={() => setRevealed((r) => !r)}
            className={`w-full font-semibold transition-colors duration-500 ${
              !revealed
                ? "bg-purple-600 hover:bg-purple-700 text-white"
                : token.isSpy
                ? "bg-red-700 hover:bg-red-800 text-white"
                : "bg-purple-600 hover:bg-purple-700 text-white"
            }`}
          >
            {revealed
              ? <><EyeOff className="w-4 h-4 mr-2" />{t("hide")}</>
              : <><Eye className="w-4 h-4 mr-2" />{t("reveal")}</>
            }
          </Button>
        </div>
      </motion.div>

      {/* Locations accordion */}
      <AnimatePresence>
        {revealed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="w-full max-w-sm overflow-hidden"
          >
            <button
              onClick={() => setShowLocations((s) => !s)}
              className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-slate-800/60 border border-slate-700 text-slate-300 hover:text-white transition-colors"
            >
              <span className="flex items-center gap-2 text-sm font-medium">
                <MapPin className="w-4 h-4 text-purple-400" />
                {t("allLocations", { n: token.allLocations.length })}
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
                  <div className="mt-2 rounded-xl bg-slate-800/60 border border-slate-700 p-3">
                    <div className="grid grid-cols-2 gap-1">
                      {token.allLocations.map((loc) => {
                        const isThis = !token.isSpy && loc === token.location;
                        return (
                          <div
                            key={loc}
                            className={`text-xs px-2 py-1 rounded flex items-center gap-1 ${
                              isThis ? "bg-purple-600/30 text-purple-200" : "text-slate-400"
                            }`}
                          >
                            {isThis && <MapPin className="w-3 h-3 shrink-0" />}
                            {loc}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Advance button */}
      <AnimatePresence>
        {revealed && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="w-full max-w-sm"
          >
            <Button
              onClick={advance}
              size="lg"
              variant="outline"
              className="w-full border-slate-600 text-slate-200 hover:text-white hover:border-purple-500 bg-slate-800/60 font-semibold h-12 rounded-xl"
            >
              {isLastPlayer ? (
                <><CheckCircle2 className="w-4 h-4 mr-2 text-green-400" />{t("donePlaying")}</>
              ) : (
                <><ArrowRight className="w-4 h-4 mr-2" />{t("passTo", { name: nextName ?? "" })}</>
              )}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

export default function GamePage() {
  return (
    <Suspense>
      <GameContent />
    </Suspense>
  );
}
