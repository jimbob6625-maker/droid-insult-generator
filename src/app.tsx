import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { RefreshCcw, Star, List, BarChart } from "lucide-react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

export default function DroidInsultGenerator() {
  const adjectives = [
    "Rusty", "Jammed-up", "Overclocked", "Scrapheap", "Grease-soaked", "Wobbly",
    "Faulty", "Oil-leaking", "Sparking", "Misfiring", "Cheaply-built", "Clogged"
  ];

  const nouns = [
    "Gear grinder", "Circuit-sniffer", "Wireback", "Servo-brain", "Bolt muncher",
    "Oil slurper", "Scrap pile", "Toaster", "Tin can", "Metalhead", "Clank-stack", "Fuse-blower"
  ];

  const [insult, setInsult] = useState("Click below to roast a clanker!");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [batchInsults, setBatchInsults] = useState<string[]>([]);
  const [stats, setStats] = useState({ generated: 0, saved: 0, streak: 0, bestStreak: 0 });

  useEffect(() => {
    const savedFavs = JSON.parse(localStorage.getItem("favorites") || "[]");
    const savedStats = JSON.parse(localStorage.getItem("stats") || "{}");
    if (savedFavs.length) setFavorites(savedFavs);
    if (Object.keys(savedStats).length) setStats(savedStats);
  }, []);

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
    localStorage.setItem("stats", JSON.stringify(stats));
  }, [favorites, stats]);

  const generateInsult = () => {
    const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    const newInsult = `${adj} ${noun}!`;
    setInsult(newInsult);
    setBatchInsults([]);
    updateStats("generated");
  };

  const generateBatch = () => {
    const newBatch = Array.from({ length: 10 }, () => {
      const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
      const noun = nouns[Math.floor(Math.random() * nouns.length)];
      return `${adj} ${noun}!`;
    });
    setBatchInsults(newBatch);
    setInsult("Batch of insults ready!");
    updateStats("generated", 10);
  };

  const saveFavorite = () => {
    if (insult && insult !== "Click below to roast a clanker!" && !favorites.includes(insult)) {
      setFavorites([...favorites, insult]);
      updateStats("saved");
    }
  };

  const updateStats = (type: "generated" | "saved", amount: number = 1) => {
    setStats(prev => {
      let newStats = { ...prev };
      if (type === "generated") {
        newStats.generated += amount;
        newStats.streak += amount;
        if (newStats.streak > newStats.bestStreak) newStats.bestStreak = newStats.streak;
      } else if (type === "saved") {
        newStats.saved += amount;
      }
      return newStats;
    });
  };

  const resetStreak = () => setStats(prev => ({ ...prev, streak: 0 }));

  const pieData = [
    { name: "Generated", value: stats.generated },
    { name: "Saved", value: stats.saved },
  ];
  const COLORS = ["#FFD700", "#FF4500"];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white p-4">
      <div className="max-w-2xl w-full bg-gray-800 shadow-2xl rounded-2xl p-6">
        {/* Title */}
        <h1 className="text-3xl font-extrabold text-center text-yellow-400 mb-6">
          🤖 Droid Insult Generator
        </h1>

        {/* Main insult */}
        <motion.p
          key={insult}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-xl text-center mb-4"
        >
          {insult}
        </motion.p>

        {/* Batch insults */}
        {batchInsults.length > 0 && (
          <ul className="grid grid-cols-1 gap-2 bg-gray-700 p-4 rounded-xl w-full mb-4">
            {batchInsults.map((b, i) => (
              <li key={i} className="text-center">{b}</li>
            ))}
          </ul>
        )}

        {/* Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-6">
          <button onClick={generateInsult} className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-6 py-2 rounded-xl flex items-center gap-2">
            <RefreshCcw size={18}/> Generate
          </button>
          <button onClick={generateBatch} className="bg-red-500 hover:bg-red-600 text-white font-bold px-6 py-2 rounded-xl flex items-center gap-2">
            <List size={18}/> Rapid-Fire (10)
          </button>
          <button onClick={saveFavorite} className="bg-green-500 hover:bg-green-600 text-white font-bold px-6 py-2 rounded-xl flex items-center gap-2">
            <Star size={18}/> Save
          </button>
        </div>

        {/* Stats + Chart */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Stats Card */}
          <div className="bg-gray-900 p-4 rounded-xl">
            <h2 className="text-lg mb-2 flex items-center gap-2 text-blue-400">
              <BarChart size={18}/> Personal Stats
            </h2>
            <p>🔥 Generated: {stats.generated}</p>
            <p>⭐ Saved: {stats.saved}</p>
            <p>⚡ Current Streak: {stats.streak}</p>
            <p>🏆 Best Streak: {stats.bestStreak}</p>
            <button onClick={resetStreak} className="mt-2 bg-gray-700 hover:bg-gray-600 text-white py-1 px-4 rounded-lg text-sm">
              Reset Streak
            </button>
          </div>

          {/* Pie Chart Card */}
          <div className="bg-gray-900 p-4 rounded-xl">
            <h2 className="text-lg mb-2 text-purple-400">📊 Visual Breakdown</h2>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" labelLine={false} outerRadius={70} dataKey="value">
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Favorites */}
        {favorites.length > 0 && (
          <div className="w-full">
            <h2 className="text-xl font-bold text-yellow-300 mb-2">⭐ Favorite Roasts</h2>
            <ul className="bg-gray-700 p-4 rounded-xl grid gap-2 max-h-48 overflow-y-auto">
              {favorites.map((fav, i) => (
                <li key={i} className="text-center">{fav}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
