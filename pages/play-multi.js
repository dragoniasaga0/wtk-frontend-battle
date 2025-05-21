
import { useState } from "react";

const playersData = [
  { id: 1, name: "ผู้เล่น 1" },
  { id: 2, name: "ผู้เล่น 2" }
];

const weapons = [
  { name: "ดาบของลิโป้", range: 1 },
  { name: "หอกง้าว (ง้าวมังกรเขียว)", range: 3 },
  { name: "ธนูยาว", range: 5 }
];

const fastHorses = [
  { name: "เซ็กเธาว์", bonus: 1 },
  { name: "ม้าเทา", bonus: 1 },
  { name: "ม้าราตรี", bonus: 1 }
];

const enemyHorses = [
  { name: "ชิวลู่", malus: 1 },
  { name: "ลมกรด", malus: 1 },
  { name: "ดำเงา", malus: 1 }
];

export default function MultiplayerPage() {
  const [turn, setTurn] = useState(1);
  const [players, setPlayers] = useState({
    1: { weapon: null, fastHorse: null, enemyHorse: null },
    2: { weapon: null, fastHorse: null, enemyHorse: null }
  });

  const switchTurn = () => setTurn(turn === 1 ? 2 : 1);

  const updatePlayer = (id, field, value) => {
    setPlayers((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value
      }
    }));
  };

  const getRange = (id) => {
    const p = players[id];
    return (p.weapon?.range || 0) + (p.fastHorse?.bonus || 0) - (players[id === 1 ? 2 : 1].enemyHorse?.malus || 0);
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">โหมดผู้เล่น 2 คน</h1>
      <p className="text-lg font-semibold text-blue-600">ถึงตา: ผู้เล่น {turn}</p>
      <button className="mt-2 px-4 py-2 bg-green-600 text-white rounded" onClick={switchTurn}>
        เปลี่ยนเทิร์น
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
        {playersData.map((player) => {
          const p = players[player.id];
          return (
            <div key={player.id} className="p-4 border rounded bg-white shadow">
              <h2 className="text-xl font-semibold mb-2">{player.name}</h2>

              <label className="block mb-2">อาวุธ</label>
              <select
                className="w-full border p-2 rounded mb-4"
                onChange={(e) =>
                  updatePlayer(
                    player.id,
                    "weapon",
                    weapons.find((w) => w.name === e.target.value)
                  )
                }
              >
                <option value="">-- ไม่เลือก --</option>
                {weapons.map((w) => (
                  <option key={w.name} value={w.name}>
                    {w.name} (ระยะ {w.range})
                  </option>
                ))}
              </select>

              <label className="block mb-2">ม้าเร็ว</label>
              <select
                className="w-full border p-2 rounded mb-4"
                onChange={(e) =>
                  updatePlayer(
                    player.id,
                    "fastHorse",
                    fastHorses.find((h) => h.name === e.target.value)
                  )
                }
              >
                <option value="">-- ไม่เลือก --</option>
                {fastHorses.map((h) => (
                  <option key={h.name} value={h.name}>
                    {h.name} (+{h.bonus})
                  </option>
                ))}
              </select>

              <label className="block mb-2">ม้าศัตรู</label>
              <select
                className="w-full border p-2 rounded"
                onChange={(e) =>
                  updatePlayer(
                    player.id,
                    "enemyHorse",
                    enemyHorses.find((h) => h.name === e.target.value)
                  )
                }
              >
                <option value="">-- ไม่เลือก --</option>
                {enemyHorses.map((h) => (
                  <option key={h.name} value={h.name}>
                    {h.name} (-{h.malus})
                  </option>
                ))}
              </select>

              <div className="mt-4">
                <p className="text-md">
                  <strong>ระยะรวม:</strong>{" "}
                  <span className="text-green-600 text-lg">{getRange(player.id)}</span>
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
