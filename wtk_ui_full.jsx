
import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

const socket = io("https://your-server-url.com"); // เปลี่ยน URL เมื่อ deploy จริง

export default function WTKFullUI() {
  const [players, setPlayers] = useState([]);
  const [role, setRole] = useState(null);
  const [hero, setHero] = useState(null);
  const [hand, setHand] = useState([]);
  const [myTurn, setMyTurn] = useState(false);
  const [log, setLog] = useState([]);
  const [target, setTarget] = useState(null);
  const [roomId, setRoomId] = useState("");
  const [joined, setJoined] = useState(false);

  useEffect(() => {
    socket.on("update_players", setPlayers);
    socket.on("your_role", setRole);
    socket.on("your_hand", setHand);
    socket.on("turn", (isTurn) => setMyTurn(isTurn));
    socket.on("log", (msg) => setLog((prev) => [...prev.slice(-99), msg]));

    return () => {
      socket.off("update_players");
      socket.off("your_role");
      socket.off("your_hand");
      socket.off("turn");
      socket.off("log");
    };
  }, []);

  useEffect(() => {
    const me = players.find(p => socket.id === p.id);
    if (me) setHero(me.hero);
  }, [players]);

  function joinGame() {
    const name = prompt("ชื่อผู้เล่น?");
    const room = prompt("รหัสห้อง (เช่น room123)?") || "demo_room";
    setRoomId(room);
    socket.emit("join_game", { name, room });
    setJoined(true);
  }

  function playCard(card) {
    if (!myTurn) return alert("ไม่ใช่ตาของคุณ");
    if (["โจมตี", "พิเศษ"].includes(card) && !target && players.length > 1) {
      return alert("กรุณาเลือกเป้าหมาย");
    }
    socket.emit("play_card", { card, targetId: target });
    setTarget(null);
  }

  if (!joined) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-3xl font-bold mb-4">⚔️ War of the Three Kingdoms</h1>
        <Button onClick={joinGame}>เข้าสู่เกม</Button>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-6xl mx-auto text-sm">
      <h1 className="text-2xl font-bold mb-2">⚔️ War of the Three Kingdoms</h1>
      <div className="mb-2">ห้อง: <strong>{roomId}</strong> | บทบาท: <strong>{role || "???"}</strong> | ขุนพล: <strong>{hero || "???"}</strong></div>
      <div className="mb-4">{myTurn ? "🟢 ถึงตาคุณแล้ว" : "🔴 รอผู้เล่นอื่น..."}</div>

      <div className="mb-4">
        <h2 className="font-semibold mb-1">🧑‍🤝‍🧑 ผู้เล่นในห้อง:</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {players.map((p, i) => (
            <div
              key={i}
              onClick={() => !p.dead && p.id !== socket.id && setTarget(p.id)}
              className={`border p-2 rounded shadow-sm ${p.id === target ? 'border-blue-500' : 'border-gray-200'} ${p.dead ? 'opacity-40' : 'cursor-pointer hover:border-blue-300'}`}
            >
              <div><strong>{p.name}</strong> ({p.hero})</div>
              <div>❤️ HP: {p.hp} {p.dead && "☠️"}</div>
              <div>
                <Image
                  src={`/heroes/${p.hero?.replace(/\s/g, "").toLowerCase() || "unknown"}.png`}
                  alt={p.hero}
                  width={80}
                  height={80}
                  className="rounded mt-1"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <h2 className="font-semibold mb-1">🃏 การ์ดในมือ:</h2>
        <div className="flex gap-2 flex-wrap">
          {hand.map((card, i) => (
            <Card key={i} onClick={() => playCard(card)} className="cursor-pointer hover:shadow-xl">
              <CardContent className="p-4 text-center font-semibold">
                <Image
                  src={`/cards/${card.toLowerCase()}.png`}
                  alt={card}
                  width={100}
                  height={100}
                />
                <div>{card}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="mt-4 p-2 bg-gray-100 rounded h-48 overflow-auto">
        <h2 className="font-semibold mb-1">📜 Log เหตุการณ์</h2>
        {log.map((entry, i) => (
          <div key={i} className="text-xs">{entry}</div>
        ))}
      </div>
    </div>
  );
}
