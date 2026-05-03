import mqtt from "mqtt";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import Tank from "../components/Tank";
import DataCard from "../components/DataCard";

function getTempColor(temp) {
  if (temp >= 85 && temp <= 95) return "text-blue-400";
  return "text-red-500";
}

export default function Home() {
  const [data, setData] = useState(null);
  const [status, setStatus] = useState("Disconnected");

  useEffect(() => {
    const client = mqtt.connect(
      "wss://2c4a86ed75a8439d80170f3d36f32cf3.s1.eu.hivemq.cloud:8884/mqtt",
      {
        username: "hivemq.webclient.1777827197775",
        password: "j51W3v,JX7!h.HF?Msgd"
      }
    );

    client.on("connect", () => {
      console.log("MQTT CONNECTED");
      setStatus("Connected");
      client.subscribe("cst/data");
    });

    client.on("message", (topic, message) => {
      console.log("TOPIC:", topic);
      console.log("DATA:", message.toString());

      if (topic !== "cst/data") return;

      try {
        const payload = JSON.parse(message.toString());
        setData(payload);
      } catch (err) {
        console.log("JSON ERROR:", err);
        setData(null);
      }
    });

    client.on("close", () => setStatus("Disconnected"));
    client.on("error", (err) => {
      console.log("MQTT ERROR:", err);
      setStatus("Disconnected");
    });

    return () => client.end();
  }, []);

  // ================= LEVEL =================
  const levels = useMemo(() => {
    return {
      cpo: Number(data?.cpo ?? 0),
      water: Number(data?.water ?? 0),
      sludge: Number(data?.sludge ?? 0)
    };
  }, [data]);

  // ================= TEMPERATURE =================
  const tempAvg = useMemo(() => {
    const t1 = Number(data?.temp1 ?? 0);
    const t2 = Number(data?.temp2 ?? 0);
    return (t1 + t2) / 2;
  }, [data]);

  return (
    <main className="min-h-screen p-4 md:p-8">
      {/* HEADER */}
      <header className="glass mb-6 flex flex-col gap-3 rounded-2xl p-5 md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold tracking-wide text-cyan-300 md:text-3xl">
          CST Monitoring System
        </h1>

        <span
          className={`rounded-full px-4 py-1 text-sm font-semibold ${
            status === "Connected"
              ? "bg-emerald-500/20 text-emerald-300"
              : "bg-red-500/20 text-red-300"
          }`}
        >
          MQTT {status}
        </span>
      </header>

      {!data && (
        <p className="mb-4 text-slate-300">
          Menunggu data MQTT realtime...
        </p>
      )}

      {/* DATA GRID */}
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <DataCard label="Total Level" value={data?.total_level_cm ?? 0} unit="cm" />

        <DataCard label="Volume CPO" value={data?.volume_cpo ?? 0} unit="L" accent="yellow" />
        <DataCard label="Volume Water" value={data?.volume_water ?? 0} unit="L" accent="blue" />
        <DataCard label="Volume Sludge" value={data?.volume_sludge ?? 0} unit="L" accent="amber" />

        <DataCard label="Mass CPO" value={data?.mass_cpo ?? 0} unit="kg" />
        <DataCard label="Mass Water" value={data?.mass_water ?? 0} unit="kg" />
        <DataCard label="Mass Sludge" value={data?.mass_sludge ?? 0} unit="kg" />

        <DataCard label="Weight CPO" value={data?.weight_cpo ?? 0} unit="N" />
        <DataCard label="Weight Water" value={data?.weight_water ?? 0} unit="N" />
        <DataCard label="Weight Sludge" value={data?.weight_sludge ?? 0} unit="N" />

        {/* TEMPERATURE CARD */}
        <motion.div
          className="glass rounded-xl p-4 shadow-card"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <p className="text-xs uppercase tracking-widest text-slate-400">
            Temperature
          </p>

          <p
            className={`mt-2 text-2xl font-semibold ${getTempColor(tempAvg)}`}
          >
            {tempAvg.toFixed(1)} °C
          </p>

          <p className="mt-1 text-xs text-slate-400">
            25-84 merah, 85-95 biru, 96-110 merah
          </p>
        </motion.div>
      </section>

      {/* TANK + INFO */}
      <section className="mt-8 flex flex-col items-center gap-4 md:flex-row md:items-start">
        <Tank
          cpo={levels.cpo}
          water={levels.water}
          sludge={levels.sludge}
        />

        <div className="glass w-full rounded-xl p-4">
          <h2 className="text-lg font-semibold text-cyan-300">
            Realtime Layer Info
          </h2>

          <ul className="mt-3 space-y-2 text-slate-200">
            <li>🟡 CPO: {levels.cpo.toFixed(2)} m</li>
            <li>🔵 Water: {levels.water.toFixed(2)} m</li>
            <li>🟤 Sludge: {levels.sludge.toFixed(2)} m</li>
          </ul>
        </div>
      </section>
    </main>
  );
}
