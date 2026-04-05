"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

// 1. กำหนด type ของข้อมูล
interface Attraction {
  id: number;
  name: string;
  detail?: string;
  coverimage?: string;
  latitude: number;
  longitude: number;
}

export default function Page() {
  const [rows, setRows] = useState<Attraction[]>([]); // 2. ระบุ generic type
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function getAttractions() {
      try {
        const apiHost = process.env.NEXT_PUBLIC_API_HOST;
        const res = await fetch(`${apiHost}/attractions`, { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to fetch");
        const data: Attraction[] = await res.json();
        setRows(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err)); // 3. แก้ setError ซ้อนกัน
      } finally {
        setLoading(false);
      }
    }

    getAttractions();
  }, []);

  if (loading) {
    return (
      <main className="container">
        <div className="empty">Loading...</div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="container">
        <div className="empty">Error: {error}</div>
      </main>
    );
  }

  return (
    <main className="container">
      <header className="header">
        <h1 className="title">Attractions</h1>
        <h3 className="title">Methanun Nampundung</h3>
        <p className="subtitle">Discover points of interest nearby</p>
      </header>

      {rows.length === 0 ? (
        <div className="empty">No attractions found.</div>
      ) : (
        <section className="grid" aria-live="polite">
          {rows.map((x) => (
            <article key={x.id} className="card" tabIndex={0}>
              {x.coverimage && (
                <div className="media">
                  {/* 4. ใช้ fill + position relative แทนการระบุ width/height */}
                  <div style={{ position: "relative", width: "100%", height: "200px" }}>
                    <img
                      src={x.coverimage}
                      alt={x.name}
                      className="img"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                </div>
              )}
              <div className="body">
                <h3 className="card-title">{x.name}</h3>
                {x.detail && <p className="detail">{x.detail}</p>}
                <div className="meta">
                  <small>
                    Lat: <span className="code">{x.latitude}</span> · Lng:{" "}
                    <span className="code">{x.longitude}</span>
                  </small>
                </div>
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}