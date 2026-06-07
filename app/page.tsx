"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { DEFAULT_LOCATION_NAMES, LOCATIONS } from "@/lib/locations";
import { generateGame, encodeToken } from "@/lib/game";
import { Eye, EyeOff, Plus, Trash2, Users, MapPin, Skull } from "lucide-react";

export default function Home() {
  const router = useRouter();
  const [players, setPlayers] = useState<string[]>(["", ""]);
  const [spyCount, setSpyCount] = useState(1);
  const [selectedLocations, setSelectedLocations] = useState<Set<string>>(
    new Set(DEFAULT_LOCATION_NAMES)
  );
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [error, setError] = useState("");

  const addPlayer = () => {
    if (players.length < 12) setPlayers([...players, ""]);
  };

  const removePlayer = (i: number) => {
    if (players.length > 2) setPlayers(players.filter((_, idx) => idx !== i));
  };

  const updatePlayer = (i: number, val: string) => {
    const next = [...players];
    next[i] = val;
    setPlayers(next);
  };

  const toggleLocation = (name: string) => {
    const next = new Set(selectedLocations);
    if (next.has(name)) {
      if (next.size > 1) next.delete(name);
    } else {
      next.add(name);
    }
    setSelectedLocations(next);
  };

  const startGame = () => {
    const filled = players.map((p) => p.trim()).filter(Boolean);
    if (filled.length < 2) {
      setError("Add at least 2 players.");
      return;
    }
    if (spyCount >= filled.length) {
      setError("Spy count must be less than player count.");
      return;
    }
    setError("");

    const game = generateGame({
      players: filled,
      timerMinutes: 0,
      spyCount,
      locationNames: Array.from(selectedLocations),
    });

    const params = new URLSearchParams();
    game.tokens.forEach((t, i) => {
      params.set(`p${i}`, encodeToken(t));
    });
    params.set("count", String(filled.length));
    router.push(`/game?${params.toString()}`);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg space-y-5"
      >
        {/* Header */}
        <div className="text-center space-y-1">
          <h1 className="text-5xl font-black tracking-tight text-white">
            Spy<span className="text-purple-400">Fall</span>
          </h1>
          <p className="text-slate-400 text-sm">Who among you is the spy?</p>
        </div>

        {/* Players */}
        <Card className="bg-slate-800/60 border-slate-700 backdrop-blur">
          <CardHeader className="pb-3">
            <CardTitle className="text-white flex items-center gap-2 text-base">
              <Users className="w-4 h-4 text-purple-400" /> Players
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <AnimatePresence>
              {players.map((p, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex gap-2"
                >
                  <Input
                    value={p}
                    onChange={(e) => updatePlayer(i, e.target.value)}
                    placeholder={`Player ${i + 1}`}
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
                    onKeyDown={(e) => e.key === "Enter" && addPlayer()}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removePlayer(i)}
                    disabled={players.length <= 2}
                    className="shrink-0 text-slate-400 hover:text-red-400 hover:bg-red-400/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </motion.div>
              ))}
            </AnimatePresence>
            <Button
              variant="outline"
              size="sm"
              onClick={addPlayer}
              disabled={players.length >= 12}
              className="w-full border-dashed border-slate-600 text-slate-400 hover:text-white hover:border-purple-500 bg-transparent"
            >
              <Plus className="w-4 h-4 mr-1" /> Add player
            </Button>
          </CardContent>
        </Card>

        {/* Settings */}
        <Card className="bg-slate-800/60 border-slate-700 backdrop-blur">
          <CardContent className="pt-5 space-y-5">
            {/* Spy count */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-slate-300 flex items-center gap-2">
                  <Skull className="w-4 h-4 text-purple-400" /> Spies
                </Label>
                <span className="text-white font-semibold">{spyCount}</span>
              </div>
              <div className="flex gap-2">
                {[1, 2].map((n) => (
                  <Button
                    key={n}
                    variant={spyCount === n ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSpyCount(n)}
                    className={spyCount === n
                      ? "bg-purple-600 hover:bg-purple-700 border-0"
                      : "border-slate-600 text-slate-400 hover:text-white bg-transparent"}
                  >
                    {n} {n === 1 ? "spy" : "spies"}
                  </Button>
                ))}
              </div>
            </div>

            {/* Locations */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-slate-300 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-purple-400" /> Locations
                </Label>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-slate-700 text-slate-300">
                    {selectedLocations.size}/{LOCATIONS.length}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowLocationPicker(!showLocationPicker)}
                    className="text-slate-400 hover:text-white h-7 px-2"
                  >
                    {showLocationPicker ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              <AnimatePresence>
                {showLocationPicker && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="flex justify-between mb-2">
                      <Button variant="ghost" size="sm" className="text-xs text-slate-400 h-6 px-2"
                        onClick={() => setSelectedLocations(new Set(DEFAULT_LOCATION_NAMES))}>
                        Select all
                      </Button>
                      <Button variant="ghost" size="sm" className="text-xs text-slate-400 h-6 px-2"
                        onClick={() => setSelectedLocations(new Set([LOCATIONS[0].name]))}>
                        Deselect all
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-1 max-h-52 overflow-y-auto pr-1">
                      {LOCATIONS.map((loc) => (
                        <button
                          key={loc.name}
                          onClick={() => toggleLocation(loc.name)}
                          className={`text-left text-xs px-2 py-1.5 rounded border transition-colors ${
                            selectedLocations.has(loc.name)
                              ? "bg-purple-600/30 border-purple-500 text-purple-200"
                              : "bg-slate-700/40 border-slate-600 text-slate-400 hover:border-slate-500"
                          }`}
                        >
                          {loc.name}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </CardContent>
        </Card>

        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-red-400 text-sm text-center"
          >
            {error}
          </motion.p>
        )}

        <Button
          onClick={startGame}
          size="lg"
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold text-lg h-14 rounded-xl shadow-lg shadow-purple-900/40"
        >
          Deal Cards
        </Button>
      </motion.div>
    </main>
  );
}
