
import { useState } from "react";

const weapons = [
  { name: "ดาบของลิโป้", range: 1 },
  { name: "หอกง้าว (ง้าวมังกรเขียว)", range: 3 },
  { name: "ธนูยาว", range: 5 },
];

const fastHorses = [
  { name: "เซ็กเธาว์", bonus: 1 },
  { name: "ม้าเทา", bonus: 1 },
  { name: "ม้าราตรี", bonus: 1 },
];

const enemyHorses = [
  { name: "ชิวลู่", malus: 1 },
  { name: "ลมกรด", malus: 1 },
  { name: "ดำเงา", malus: 1 },
];

export default function PlayPage() {
  const [weapon, setWeapon] = useState(null);
  const [fastHorse, setFastHorse] = useState(null);
  const [enemyHorse, setEnemyHorse] = useState(null);

  const range =
    (weapon?.range || 0) + (fastHorse?.bonus || 0) - (enemyHorse?.malus || 0);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">สนามทดลองติดตั้งการ์ด</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <h2 className="font-semibold mb-2">อาวุธ</h2>
          <select
            className="w-full border p-2 rounded"
            onChange={(e) =>
              setWeapon(weapons.find((w) => w.name === e.target.value))
            }
          >
            <option value="">-- ไม่เลือก --</option>
            {weapons.map((w) => (
              <option key={w.name} value={w.name}>
                {w.name} (ระยะ {w.range})
              </option>
            ))}
          </select>
        </div>

        <div>
          <h2 className="font-semibold mb-2">ม้าเร็ว</h2>
          <select
            className="w-full border p-2 rounded"
            onChange={(e) =>
              setFastHorse(fastHorses.find((h) => h.name === e.target.value))
            }
          >
            <option value="">-- ไม่เลือก --</option>
            {fastHorses.map((h) => (
              <option key={h.name} value={h.name}>
                {h.name} (+{h.bonus})
              </option>
            ))}
          </select>
        </div>

        <div>
          <h2 className="font-semibold mb-2">ม้าศัตรู</h2>
          <select
            className="w-full border p-2 rounded"
            onChange={(e) =>
              setEnemyHorse(enemyHorses.find((h) => h.name === e.target.value))
            }
          >
            <option value="">-- ไม่เลือก --</option>
            {enemyHorses.map((h) => (
              <option key={h.name} value={h.name}>
                {h.name} (-{h.malus})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-6 border p-4 rounded bg-white shadow">
        <h2 className="font-semibold mb-2">สรุประยะโจมตีรวม:</h2>
        <p className="text-lg">
          {weapon ? `อาวุธ: ${weapon.name} (${weapon.range})` : "ไม่มีอาวุธ"}<br />
          {fastHorse ? `ม้าเร็ว: ${fastHorse.name} (+${fastHorse.bonus})` : "ไม่มีม้าเร็ว"}<br />
          {enemyHorse ? `ม้าศัตรู: ${enemyHorse.name} (-${enemyHorse.malus})` : "ไม่มีม้าศัตรู"}<br />
        </p>
        <p className="mt-2 font-bold text-green-600 text-xl">
          ระยะรวม: {range}
        </p>
      </div>
    </div>
  );
}
