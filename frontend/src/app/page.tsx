"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { API_BASE } from "./config";

interface Stats {
  total_records: number;
  counts: {
    toxicity: number;
    polarized: number;
    insults: number;
    identity_attack: number;
  };
  percentages: {
    toxicity: number;
  };
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [health, setHealth] = useState<any>(null);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState<any>(null);
  const [apiError, setApiError] = useState(false);

  useEffect(() => {
    // Fetch stats
    fetch(`${API_BASE}/api/stats`)
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch((err) => {
        console.error("Error fetching stats:", err);
        setApiError(true);
      });

    // Fetch health
    fetch(`${API_BASE}/health`)
      .then((res) => res.json())
      .then((data) => setHealth(data))
      .catch((err) => {
        console.error("Error fetching health:", err);
        setApiError(true);
      });
  }, []);

  const handleQuickPredict = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: inputText }),
      });
      const data = await res.json();
      setPrediction(data.predictions);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-enter">
      {/* Top Header Row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <div>
          <h1 style={{ fontSize: "2rem", fontWeight: 700, letterSpacing: "-0.5px", marginBottom: "0.25rem" }}>
            Cybernetic Dashboard
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>
            Sistem Pemantauan Analitik Dataset & Deteksi Toksisitas Bahasa Indonesia
          </p>
        </div>
        
        <div className="live-indicator">
          <div className="live-dot" style={{ backgroundColor: apiError ? "var(--color-toxic)" : "var(--color-nontoxic)" }}></div>
          <span>{apiError ? "Backend Offline" : "Sistem Online"}</span>
        </div>
      </div>

      {/* Grid Cards (Metrics) */}
      <div className="dashboard-grid">
        <div className="cyber-card">
          <div className="cyber-card-content">
            <div className="metric-title">Ukuran Dataset</div>
            <div className="metric-value">{stats?.total_records?.toLocaleString() || "28,448"}</div>
            <div className="metric-desc">Total komentar berlabel dari IndoDiscourse</div>
          </div>
        </div>

        <div className="cyber-card">
          <div className="cyber-card-content">
            <div className="metric-title">Tingkat Toksisitas</div>
            <div className="metric-value">
              {stats ? `${(stats.percentages.toxicity * 100).toFixed(2)}%` : "14.04%"}
            </div>
            <div className="metric-desc">
              {stats?.counts?.toxicity?.toLocaleString() || "3,995"} komentar tergolong toxic
            </div>
          </div>
        </div>

        <div className="cyber-card">
          <div className="cyber-card-content">
            <div className="metric-title">Model Aktif</div>
            <div className="metric-value">2 / 2</div>
            <div className="metric-desc" style={{ display: "flex", gap: "0.5rem", marginTop: "0.25rem" }}>
              <span style={{ fontSize: "0.75rem", backgroundColor: "rgba(6, 182, 212, 0.15)", color: "var(--accent-cyan)", padding: "2px 6px", borderRadius: "4px", fontFamily: "var(--font-mono)" }}>
                IndoBERT
              </span>
              <span style={{ fontSize: "0.75rem", backgroundColor: "rgba(168, 85, 247, 0.15)", color: "var(--accent-purple)", padding: "2px 6px", borderRadius: "4px", fontFamily: "var(--font-mono)" }}>
                IndoBERTweet
              </span>
            </div>
          </div>
        </div>

        <div className="cyber-card">
          <div className="cyber-card-content">
            <div className="metric-title">Status Model NLP</div>
            <div className="metric-value" style={{ fontSize: "1.5rem", color: "var(--color-nontoxic)", padding: "0.4rem 0" }}>
              {health?.models?.indobert === "loaded" ? "Active (Local)" : "Ready (Mock)"}
            </div>
            <div className="metric-desc">Model PyTorch dimuat pada memori CPU</div>
          </div>
        </div>
      </div>

      {/* Main Dashboard Panel */}
      <div style={{ display: "grid", gridTemplateColumns: "1.8fr 1.2fr", gap: "1.5rem", marginTop: "2rem" }}>
        
        {/* Quick Testing Panel */}
        <div className="cyber-card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div className="cyber-card-content">
            <h2 className="result-header">Uji Deteksi Cepat (Quick Predict)</h2>
            <p style={{ color: "var(--text-secondary)", marginBottom: "1.5rem", fontSize: "0.95rem" }}>
              Ketik kalimat atau komentar bahasa Indonesia di bawah untuk memverifikasi tingkat toksisitas secara real-time menggunakan kedua model model.
            </p>
            
            <form onSubmit={handleQuickPredict}>
              <textarea
                className="cyber-textarea"
                placeholder="Contoh: Dasar pemalas kamu kerjaannya cuma tidur aja..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                style={{ marginBottom: "1rem" }}
              />
              
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
                  Maksimal 128 token per kalimat.
                </span>
                <button type="submit" className="cyber-btn" disabled={loading}>
                  {loading ? (
                    <span>Memproses...</span>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="5 3 19 12 5 21 5 3" />
                      </svg>
                      <span>Analisis Teks</span>
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Quick Prediction Result */}
            {prediction && (
              <div style={{ marginTop: "2rem", padding: "1.25rem", backgroundColor: "rgba(11,19,38,0.5)", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                  
                  {/* IndoBERT Output */}
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9rem" }}>
                      <span className="model-name">IndoBERT</span>
                      <span style={{ 
                        color: prediction.indobert.label === 1 ? "var(--color-toxic)" : "var(--color-nontoxic)",
                        fontWeight: 700 
                      }}>
                        {prediction.indobert.label === 1 ? "TOXIC" : "CLEAN"}
                      </span>
                    </div>
                    <div className="probability-bar-bg">
                      <div 
                        className={`probability-bar-fill ${prediction.indobert.label === 1 ? "prob-toxic" : "prob-nontoxic"}`}
                        style={{ width: `${(prediction.indobert.label === 1 ? prediction.indobert.toxic : prediction.indobert.non_toxic) * 100}%` }}
                      />
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                      <span>Toxic: {(prediction.indobert.toxic * 100).toFixed(1)}%</span>
                      <span>Clean: {(prediction.indobert.non_toxic * 100).toFixed(1)}%</span>
                    </div>
                  </div>

                  {/* IndoBERTweet Output */}
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9rem" }}>
                      <span className="model-name">IndoBERTweet</span>
                      <span style={{ 
                        color: prediction.indobertweet.label === 1 ? "var(--color-toxic)" : "var(--color-nontoxic)",
                        fontWeight: 700 
                      }}>
                        {prediction.indobertweet.label === 1 ? "TOXIC" : "CLEAN"}
                      </span>
                    </div>
                    <div className="probability-bar-bg">
                      <div 
                        className={`probability-bar-fill ${prediction.indobertweet.label === 1 ? "prob-toxic" : "prob-nontoxic"}`}
                        style={{ width: `${(prediction.indobertweet.label === 1 ? prediction.indobertweet.toxic : prediction.indobertweet.non_toxic) * 100}%` }}
                      />
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                      <span>Toxic: {(prediction.indobertweet.toxic * 100).toFixed(1)}%</span>
                      <span>Clean: {(prediction.indobertweet.non_toxic * 100).toFixed(1)}%</span>
                    </div>
                  </div>
                  
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Info Panel */}
        <div className="cyber-card">
          <div className="cyber-card-content">
            <h2 className="result-header">Distribusi Dataset</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9rem", marginBottom: "0.25rem" }}>
                  <span>Toxicity (Toksik)</span>
                  <span style={{ color: "var(--color-toxic)", fontWeight: 600 }}>14.04%</span>
                </div>
                <div className="probability-bar-bg" style={{ height: "6px" }}>
                  <div className="probability-bar-fill prob-toxic" style={{ width: "14.04%" }} />
                </div>
              </div>

              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9rem", marginBottom: "0.25rem" }}>
                  <span>Polarized (Keterpolaran Opini)</span>
                  <span style={{ color: "var(--accent-purple)", fontWeight: 600 }}>23.00%</span>
                </div>
                <div className="probability-bar-bg" style={{ height: "6px" }}>
                  <div className="probability-bar-fill" style={{ width: "23.00%", backgroundColor: "var(--accent-purple)" }} />
                </div>
              </div>

              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9rem", marginBottom: "0.25rem" }}>
                  <span>Insults (Cacian/Hinaan)</span>
                  <span style={{ color: "var(--accent-cyan)", fontWeight: 600 }}>6.84%</span>
                </div>
                <div className="probability-bar-bg" style={{ height: "6px" }}>
                  <div className="probability-bar-fill" style={{ width: "6.84%", backgroundColor: "var(--accent-cyan)" }} />
                </div>
              </div>

              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9rem", marginBottom: "0.25rem" }}>
                  <span>Identity Attack (Menyerang Identitas)</span>
                  <span style={{ color: "var(--color-warning)", fontWeight: 600 }}>6.17%</span>
                </div>
                <div className="probability-bar-bg" style={{ height: "6px" }}>
                  <div className="probability-bar-fill" style={{ width: "6.17%", backgroundColor: "var(--color-warning)" }} />
                </div>
              </div>
            </div>
            
            <div style={{ marginTop: "2rem", textAlign: "center" }}>
              <Link href="/analytics" className="cyber-btn" style={{ width: "100%", padding: "0.65rem" }}>
                <span>Buka Analitik Selengkapnya</span>
              </Link>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}
