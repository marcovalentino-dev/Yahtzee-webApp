import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

const categories = [
  "Aces", "Twos", "Threes", "Fours", "Fives", "Sixes",
  "Three of a Kind", "Four of a Kind", "Full House",
  "Small Straight", "Large Straight", "Yahtzee", "Chance"
];

export default function YahtzeeGame() {
  const [players, setPlayers] = useState([]);
  const [playerName, setPlayerName] = useState("");
  const [gameStarted, setGameStarted] = useState(false);
  const [scores, setScores] = useState({});

  const addPlayer = () => {
    if (!playerName.trim()) return;
    setPlayers([...players, playerName.trim()]);
    setScores({ ...scores, [playerName.trim()]: {} });
    setPlayerName("");
  };

  const handleScoreChange = (player, category, value) => {
    setScores((prev) => ({
      ...prev,
      [player]: {
        ...prev[player],
        [category]: isNaN(parseInt(value)) ? "" : parseInt(value),
      },
    }));
  };

  const totalScore = (player) => {
    return Object.values(scores[player] || {}).reduce(
      (sum, val) => sum + (parseInt(val) || 0),
      0
    );
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-200 to-sky-300 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <motion.h1
          className="text-4xl font-bold text-center text-gray-800"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          🎲 Yahtzee Party Game
        </motion.h1>

        {!gameStarted ? (
          <Card className="p-4 rounded-2xl shadow-xl bg-white">
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Nome giocatore"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                />
                <Button onClick={addPlayer}>Aggiungi</Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {players.map((name, idx) => (
                  <span
                    key={idx}
                    className="bg-sky-100 text-sky-800 px-3 py-1 rounded-full text-sm"
                  >
                    {name}
                  </span>
                ))}
              </div>
              {players.length > 0 && (
                <Button className="w-full mt-4" onClick={() => setGameStarted(true)}>
                  Inizia Partita
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {players.map((player, idx) => (
              <Card key={idx} className="rounded-2xl shadow-xl">
                <CardContent className="p-4 space-y-2">
                  <h2 className="text-xl font-semibold text-indigo-800">{player}</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {categories.map((cat, i) => (
                      <div key={i} className="flex flex-col">
                        <label className="text-sm text-gray-600">{cat}</label>
                        <Input
                          type="number"
                          min="0"
                          value={scores[player]?.[cat] || ""}
                          onChange={(e) => handleScoreChange(player, cat, e.target.value)}
                        />
                      </div>
                    ))}
                  </div>
                  <p className="text-right font-bold text-lg text-green-700">
                    Totale: {totalScore(player)} punti
                  </p>
                </CardContent>
              </Card>
            ))}
            <div className="bg-white p-4 rounded-2xl shadow-xl">
              <h2 className="text-2xl font-bold mb-2">Classifica Finale</h2>
              {players
                .sort((a, b) => totalScore(b) - totalScore(a))
                .map((player, idx) => (
                  <p key={idx} className="text-lg">
                    🏅 {player} — <span className="font-semibold">{totalScore(player)} punti</span>
                  </p>
                ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
