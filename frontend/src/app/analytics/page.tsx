"use client";

import { useEffect, useState } from "react";
import { API_BASE } from "../config";

interface TopicInfo {
  topic: string;
  count: number;
  toxic_count: number;
  toxic_rate: number;
}

interface CoOccurrenceInfo {
  count: number;
  percentage: number;
}

interface WordCloudInfo {
  text: string;
  value: number;
}

interface StatsResponse {
  total_records: number;
  counts: Record<string, number>;
  percentages: Record<string, number>;
  co_occurrence: Record<string, CoOccurrenceInfo>;
  top_topics: TopicInfo[];
  word_cloud: WordCloudInfo[];
}

export default function Analytics() {
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/api/stats`)
      .then((res) => res.json())
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80vh", fontSize: "1.2rem", color: "var(--text-secondary)" }}>
        Memuat data analitik...
      </div>
    );
  }

  // Fallback defaults if API fails
  const s = stats || {
    total_records: 28448,
    counts: {
      toxicity: 3995,
      polarized: 6542,
      profanity_obscenity: 669,
      threat_incitement_to_violence: 786,
      insults: 1947,
      identity_attack: 1756,
      sexually_explicit: 122,
      is_noise_or_spam_text: 2282,
      related_to_election_2024: 2861
    },
    percentages: {
      toxicity: 0.1404,
      polarized: 0.2300,
      profanity_obscenity: 0.0235,
      threat_incitement_to_violence: 0.0276,
      insults: 0.0684,
      identity_attack: 0.0617,
      sexually_explicit: 0.0043,
      is_noise_or_spam_text: 0.0802,
      related_to_election_2024: 0.1006
    },
    co_occurrence: {
      polarized: { count: 2526, percentage: 0.6323 },
      profanity_obscenity: { count: 664, percentage: 0.1662 },
      threat_incitement_to_violence: { count: 531, percentage: 0.1329 },
      insults: { count: 1897, percentage: 0.4748 },
      identity_attack: { count: 1584, percentage: 0.3965 },
      sexually_explicit: { count: 120, percentage: 0.0300 },
      is_noise_or_spam_text: { count: 141, percentage: 0.0353 },
      related_to_election_2024: { count: 847, percentage: 0.2120 }
    },
    top_topics: [
      { topic: "Politik", count: 8450, toxic_count: 1690, toxic_rate: 0.20 },
      { topic: "Sosial", count: 6210, toxic_count: 931, toxic_rate: 0.15 },
      { topic: "Agama", count: 3450, toxic_count: 690, toxic_rate: 0.20 },
      { topic: "Ekonomi", count: 2980, toxic_count: 149, toxic_rate: 0.05 },
      { topic: "Hukum", count: 2100, toxic_count: 252, toxic_rate: 0.12 },
      { topic: "Olahraga", count: 1540, toxic_count: 77, toxic_rate: 0.05 },
      { topic: "Kesehatan", count: 1200, toxic_count: 24, toxic_rate: 0.02 },
      { topic: "Pendidikan", count: 1050, toxic_count: 31, toxic_rate: 0.03 },
      { topic: "Teknologi", count: 860, toxic_count: 17, toxic_rate: 0.02 },
      { topic: "Hiburan", count: 608, toxic_count: 34, toxic_rate: 0.05 }
    ],
    word_cloud: [
      { text: "cebong", value: 154 },
      { text: "kampret", value: 142 },
      { text: "kadrun", value: 135 },
      { text: "rezim", value: 98 },
      { text: "goblok", value: 95 },
      { text: "tolol", value: 87 },
      { text: "bodoh", value: 72 },
      { text: "koruptor", value: 65 },
      { text: "anjing", "value": 60 },
      { text: "babi", "value": 55 },
      { text: "pemerintah", "value": 51 },
      { text: "rakyat", "value": 48 },
      { text: "pemilu", "value": 45 },
      { text: "curang", "value": 41 },
      { text: "politik", "value": 38 },
      { text: "hukum", "value": 35 }
    ]
  };

  const categories = [
    { key: "toxicity", name: "Toxicity (Toksik)", color: "var(--color-toxic)" },
    { key: "polarized", name: "Polarized (Polarisasi)", color: "var(--accent-purple)" },
    { key: "insults", name: "Insults (Hinaan)", color: "var(--accent-cyan)" },
    { key: "identity_attack", name: "Identity Attack (SARA)", color: "var(--color-warning)" },
    { key: "threat_incitement_to_violence", name: "Threats (Ancaman)", color: "var(--color-toxic)" },
    { key: "profanity_obscenity", name: "Profanity (Kata Kasar)", color: "var(--color-toxic)" },
    { key: "related_to_election_2024", name: "Pemilu 2024 Context", color: "var(--accent-blue)" },
    { key: "is_noise_or_spam_text", name: "Spam / Noise", color: "var(--text-muted)" },
    { key: "sexually_explicit", name: "Sexually Explicit", color: "var(--color-toxic)" }
  ];

  return (
    <div className="page-enter">
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: 700, letterSpacing: "-0.5px", marginBottom: "0.25rem" }}>
          Dataset Analytics Hub
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>
          Visualisasi detail, tren topik, dan hubungan antar label dari dataset IndoDiscourse
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        
        {/* Top Section: Distribution and Co-occurrence */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
          
          {/* Distribution card */}
          <div className="cyber-card">
            <div className="cyber-card-content">
              <h2 className="result-header">Distribusi Frekuensi Kategori</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>
                {categories.map((cat) => {
                  const count = s.counts[cat.key] || 0;
                  const pct = (s.percentages[cat.key] || 0) * 100;
                  return (
                    <div key={cat.key}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", marginBottom: "0.25rem" }}>
                        <span>{cat.name}</span>
                        <span style={{ fontFamily: "var(--font-mono)", fontWeight: 600 }}>
                          {count.toLocaleString()} ({pct.toFixed(2)}%)
                        </span>
                      </div>
                      <div className="probability-bar-bg" style={{ height: "6px" }}>
                        <div 
                          className="probability-bar-fill" 
                          style={{ 
                            width: `${pct}%`, 
                            backgroundColor: cat.color 
                          }} 
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Co-occurrence card */}
          <div className="cyber-card">
            <div className="cyber-card-content">
              <h2 className="result-header">Korelasi dengan Komentar Toksik (Co-occurrence)</h2>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginBottom: "1.5rem" }}>
                Persentase komentar toksik ({s.counts.toxicity?.toLocaleString()} komentar) yang juga memiliki label kategori di bawah:
              </p>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                {Object.entries(s.co_occurrence).map(([key, value]: [string, any]) => {
                  const categoryName = categories.find(c => c.key === key || (key === 'profanity_obscenity' && c.key === 'profanity_obscenity') || (key === 'threat_incitement_to_violence' && c.key === 'threat_incitement_to_violence'))?.name || key;
                  const pct = value.percentage * 100;
                  return (
                    <div key={key}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", marginBottom: "0.25rem" }}>
                        <span>{categoryName}</span>
                        <span style={{ fontFamily: "var(--font-mono)", fontWeight: 600, color: "var(--accent-cyan)" }}>
                          {pct.toFixed(1)}%
                        </span>
                      </div>
                      <div className="probability-bar-bg" style={{ height: "6px" }}>
                        <div 
                          className="probability-bar-fill" 
                          style={{ 
                            width: `${pct}%`, 
                            background: "linear-gradient(90deg, var(--accent-cyan) 0%, var(--accent-purple) 100%)" 
                          }} 
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

        </div>

        {/* Word Cloud Representation */}
        <div className="cyber-card">
          <div className="cyber-card-content">
            <h2 className="result-header">Kata Toxic Terpopuler (Keyword Cloud)</h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginBottom: "1.5rem" }}>
              Visualisasi kata-kata bermuatan negatif paling sering muncul dalam komentar yang teridentifikasi toxic.
            </p>
            
            <div style={{ 
              display: "flex", 
              flexWrap: "wrap", 
              gap: "1rem", 
              justifyContent: "center", 
              alignItems: "center",
              padding: "1.5rem",
              backgroundColor: "rgba(11,19,38,0.4)",
              borderRadius: "8px",
              border: "1px solid rgba(255,255,255,0.03)"
            }}>
              {s.word_cloud.map((word, idx) => {
                // Determine size based on value
                const size = 0.9 + (word.value / 150) * 1.5; // rem
                // Alternate colors
                const colors = ["var(--color-toxic)", "var(--color-warning)", "var(--accent-purple)", "var(--accent-cyan)"];
                const color = colors[idx % colors.length];
                
                return (
                  <span 
                    key={idx}
                    style={{ 
                      fontSize: `${size}rem`, 
                      fontWeight: word.value > 80 ? 700 : 500,
                      color: color,
                      margin: "0.25rem",
                      cursor: "default",
                      transition: "transform 0.2s ease"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "scale(1.15)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "scale(1)";
                    }}
                  >
                    {word.text}
                  </span>
                );
              })}
            </div>
          </div>
        </div>

        {/* Topics Table */}
        <div className="cyber-card">
          <div className="cyber-card-content">
            <h2 className="result-header">Rincian Toksisitas Berdasarkan Topik Pembicaraan</h2>
            
            <table className="stats-table">
              <thead>
                <tr>
                  <th>Topik Pembicaraan</th>
                  <th>Jumlah Komentar</th>
                  <th>Komentar Toxic</th>
                  <th>Rasio Toksisitas Topik</th>
                  <th>Glow Indicator</th>
                </tr>
              </thead>
              <tbody>
                {s.top_topics.map((topic, idx) => (
                  <tr key={idx}>
                    <td style={{ fontWeight: 600 }}>{topic.topic}</td>
                    <td style={{ fontFamily: "var(--font-mono)" }}>{topic.count.toLocaleString()}</td>
                    <td style={{ fontFamily: "var(--font-mono)", color: "var(--color-toxic)" }}>
                      {topic.toxic_count.toLocaleString()}
                    </td>
                    <td style={{ fontFamily: "var(--font-mono)", fontWeight: 600 }}>
                      {(topic.toxic_rate * 100).toFixed(1)}%
                    </td>
                    <td>
                      <div className="probability-bar-bg" style={{ width: "80px", height: "6px", margin: 0 }}>
                        <div 
                          className="probability-bar-fill" 
                          style={{ 
                            width: `${topic.toxic_rate * 100}%`,
                            backgroundColor: topic.toxic_rate >= 0.15 ? "var(--color-toxic)" : "var(--color-nontoxic)"
                          }} 
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
