"use client";

import { useState } from "react";
import { API_BASE } from "../config";

export default function Detection() {
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [subclasses, setSubclasses] = useState<any>(null);

  const samples = [
    { text: "Kinerja pemerintah periode ini sangat lambat dan tidak efisien.", label: "Politik Biasa (Clean)" },
    { text: "Dasar kadrun tolol pembuat gaduh negara, balik aja lu ke gurun!", label: "Cacian Politik (Toxic)" },
    { text: "Saya setuju dengan program kerja baru yang diusulkan oleh dinas kesehatan.", label: "Saran Netral (Clean)" },
    { text: "Awas lu ya ketemu di jalan bakalan gw hajar sampai mati!", label: "Ancaman Kekerasan (Toxic)" },
    { text: "Video porno itu sangat merusak moral generasi muda bangsa.", label: "Sosial/Edukasi (Clean)" },
    { text: "Lu dibilangin malah ngebantah, emang bener-bener babi anjing lu!", label: "Umpatan Kasar (Toxic)" }
  ];

  const analyzeSubclasses = (text: string, isToxic: boolean) => {
    const textLower = text.toLowerCase();
    
    // Heuristic categories
    const profanity_keywords = ["anjing", "babi", "bangsat", "kontol", "memek", "pantek", "jancok", "kampret", "lonte", "pelacur", "perek"];
    const insults_keywords = ["tolol", "goblok", "bego", "bodoh", "pekok", "brengsek", "pecundang", "ampas", "sinting", "gila", "saraf"];
    const threat_keywords = ["bunuh", "hajar", "pukul", "bakar", "tembak", "mati lu", "habisi", "darah", "gorok", "siksa"];
    const identity_keywords = ["cina", "kafir", "syiah", "kristen", "islam", "jawa", "papua", "pki", "kadrun", "cebong", "yahudi", "pribumi"];
    const sexual_keywords = ["ngentot", "sange", "coli", "porno", "seks", "telanjang", "tetek", "peju", "masturbasi"];
    const polarized_keywords = ["rezim", "jokowi", "prabowo", "anies", "ganjar", "pemerintah", "politik", "oposisi", "pemilu", "2024", "curang", "dinasti"];

    const checkKeywords = (keywords: string[]) => {
      let matches = 0;
      keywords.forEach(kw => {
        if (textLower.includes(kw)) matches += 1;
      });
      return matches;
    };

    const hasProfanity = checkKeywords(profanity_keywords);
    const hasInsult = checkKeywords(insults_keywords);
    const hasThreat = checkKeywords(threat_keywords);
    const hasIdentity = checkKeywords(identity_keywords);
    const hasSexual = checkKeywords(sexual_keywords);
    const hasPolarized = checkKeywords(polarized_keywords);

    // Compute probabilities based on presence of keywords and baseline toxicity
    const getProb = (matches: number, baseWeight: number) => {
      if (!isToxic) {
        return matches > 0 ? Math.min(0.25, 0.05 + matches * 0.1) : 0.02;
      }
      // If toxic, give higher probability if matched, else small baseline
      return matches > 0 ? Math.min(0.95, baseWeight + matches * 0.2) : 0.15;
    };

    return {
      profanity: getProb(hasProfanity, 0.65),
      insults: getProb(hasInsult, 0.6),
      threat: getProb(hasThreat, 0.5),
      identity: getProb(hasIdentity, 0.45),
      sexual: getProb(hasSexual, 0.7),
      polarized: getProb(hasPolarized, 0.4)
    };
  };

  const handlePredict = async (textToPredict: string) => {
    if (!textToPredict.trim()) return;
    setLoading(true);
    setInputText(textToPredict);
    try {
      const res = await fetch(`${API_BASE}/api/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: textToPredict }),
      });
      const data = await res.json();
      setResult(data.predictions);
      
      // Compute subclass properties using predictions average
      const isToxic = data.predictions.indobert.label === 1 || data.predictions.indobertweet.label === 1;
      setSubclasses(analyzeSubclasses(textToPredict, isToxic));
    } catch (err) {
      console.error("Prediction failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-enter">
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: 700, letterSpacing: "-0.5px", marginBottom: "0.25rem" }}>
          Toxicity Analysis Engine
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>
          Analisis mendalam teks tunggal menggunakan model ensemble IndoBERT & IndoBERTweet
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "1.5rem" }}>
        
        {/* Left column: Input & Predictions */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          
          <div className="cyber-card">
            <div className="cyber-card-content">
              <h2 className="result-header">Masukkan Teks Komentar</h2>
              
              <textarea
                className="cyber-textarea"
                placeholder="Tulis kalimat di sini untuk diuji..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                style={{ minHeight: "150px", marginBottom: "1.25rem" }}
              />
              
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <button 
                  className="cyber-btn" 
                  style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.1)", color: "var(--text-secondary)" }}
                  onClick={() => {
                    setInputText("");
                    setResult(null);
                    setSubclasses(null);
                  }}
                >
                  Clear Text
                </button>
                
                <button 
                  className="cyber-btn"
                  onClick={() => handlePredict(inputText)}
                  disabled={loading || !inputText.trim()}
                >
                  {loading ? "Menganalisis..." : "Mulai Deteksi"}
                </button>
              </div>
            </div>
          </div>

          {/* Model Predictions Output */}
          {result && (
            <div className="cyber-card">
              <div className="cyber-card-content">
                <h2 className="result-header">Hasil Klasifikasi Model</h2>
                
                <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                  {/* IndoBERT Output */}
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.25rem" }}>
                      <div>
                        <span className="model-name" style={{ fontSize: "1.1rem" }}>IndoBERT (General)</span>
                        <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Backbone: indolem/indobert-base-uncased</div>
                      </div>
                      <span style={{ 
                        fontSize: "1rem",
                        padding: "4px 12px",
                        borderRadius: "50px",
                        fontWeight: 700,
                        backgroundColor: result.indobert.label === 1 ? "rgba(239, 68, 68, 0.15)" : "rgba(16, 185, 129, 0.15)",
                        color: result.indobert.label === 1 ? "var(--color-toxic)" : "var(--color-nontoxic)",
                        border: `1px solid ${result.indobert.label === 1 ? "rgba(239, 68, 68, 0.25)" : "rgba(16, 185, 129, 0.25)"}`
                      }}>
                        {result.indobert.label === 1 ? "TOXIC" : "CLEAN"}
                      </span>
                    </div>
                    
                    <div className="probability-bar-bg" style={{ height: "12px" }}>
                      <div 
                        className={`probability-bar-fill ${result.indobert.label === 1 ? "prob-toxic" : "prob-nontoxic"}`}
                        style={{ width: `${(result.indobert.label === 1 ? result.indobert.toxic : result.indobert.non_toxic) * 100}%` }}
                      />
                    </div>
                    
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", color: "var(--text-secondary)", fontFamily: "var(--font-mono)" }}>
                      <span>Tingkat Toksik: {(result.indobert.toxic * 100).toFixed(2)}%</span>
                      <span>Tingkat Bersih: {(result.indobert.non_toxic * 100).toFixed(2)}%</span>
                    </div>
                  </div>

                  {/* IndoBERTweet Output */}
                  <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "1.25rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.25rem" }}>
                      <div>
                        <span className="model-name" style={{ fontSize: "1.1rem" }}>IndoBERTweet (Twitter)</span>
                        <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Backbone: indolem/indobertweet-base-uncased</div>
                      </div>
                      <span style={{ 
                        fontSize: "1rem",
                        padding: "4px 12px",
                        borderRadius: "50px",
                        fontWeight: 700,
                        backgroundColor: result.indobertweet.label === 1 ? "rgba(239, 68, 68, 0.15)" : "rgba(16, 185, 129, 0.15)",
                        color: result.indobertweet.label === 1 ? "var(--color-toxic)" : "var(--color-nontoxic)",
                        border: `1px solid ${result.indobertweet.label === 1 ? "rgba(239, 68, 68, 0.25)" : "rgba(16, 185, 129, 0.25)"}`
                      }}>
                        {result.indobertweet.label === 1 ? "TOXIC" : "CLEAN"}
                      </span>
                    </div>
                    
                    <div className="probability-bar-bg" style={{ height: "12px" }}>
                      <div 
                        className={`probability-bar-fill ${result.indobertweet.label === 1 ? "prob-toxic" : "prob-nontoxic"}`}
                        style={{ width: `${(result.indobertweet.label === 1 ? result.indobertweet.toxic : result.indobertweet.non_toxic) * 100}%` }}
                      />
                    </div>
                    
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", color: "var(--text-secondary)", fontFamily: "var(--font-mono)" }}>
                      <span>Tingkat Toksik: {(result.indobertweet.toxic * 100).toFixed(2)}%</span>
                      <span>Tingkat Bersih: {(result.indobertweet.non_toxic * 100).toFixed(2)}%</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

        </div>

        {/* Right column: Subcategories & Samples */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          
          {/* Subcategory breakdown (heuristics matching datasets) */}
          <div className="cyber-card">
            <div className="cyber-card-content">
              <h2 className="result-header">Analisis Sub-Kategori Toksisitas</h2>
              
              {subclasses ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", marginBottom: "0.2rem" }}>
                      <span>Polarized (Opini Keras / Polarisasi)</span>
                      <span style={{ color: subclasses.polarized >= 0.5 ? "var(--accent-purple)" : "var(--text-muted)" }}>
                        {(subclasses.polarized * 100).toFixed(0)}%
                      </span>
                    </div>
                    <div className="probability-bar-bg" style={{ height: "5px" }}>
                      <div className="probability-bar-fill" style={{ width: `${subclasses.polarized * 100}%`, backgroundColor: "var(--accent-purple)" }} />
                    </div>
                  </div>

                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", marginBottom: "0.2rem" }}>
                      <span>Profanity / Obscenity (Kata Kasar)</span>
                      <span style={{ color: subclasses.profanity >= 0.5 ? "var(--color-toxic)" : "var(--text-muted)" }}>
                        {(subclasses.profanity * 100).toFixed(0)}%
                      </span>
                    </div>
                    <div className="probability-bar-bg" style={{ height: "5px" }}>
                      <div className="probability-bar-fill" style={{ width: `${subclasses.profanity * 100}%`, backgroundColor: "var(--color-toxic)" }} />
                    </div>
                  </div>

                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", marginBottom: "0.2rem" }}>
                      <span>Threats / Violence (Ancaman)</span>
                      <span style={{ color: subclasses.threat >= 0.5 ? "var(--color-toxic)" : "var(--text-muted)" }}>
                        {(subclasses.threat * 100).toFixed(0)}%
                      </span>
                    </div>
                    <div className="probability-bar-bg" style={{ height: "5px" }}>
                      <div className="probability-bar-fill" style={{ width: `${subclasses.threat * 100}%`, backgroundColor: "var(--color-toxic)" }} />
                    </div>
                  </div>

                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", marginBottom: "0.2rem" }}>
                      <span>Insults (Cacian / Hinaan)</span>
                      <span style={{ color: subclasses.insults >= 0.5 ? "var(--accent-cyan)" : "var(--text-muted)" }}>
                        {(subclasses.insults * 100).toFixed(0)}%
                      </span>
                    </div>
                    <div className="probability-bar-bg" style={{ height: "5px" }}>
                      <div className="probability-bar-fill" style={{ width: `${subclasses.insults * 100}%`, backgroundColor: "var(--accent-cyan)" }} />
                    </div>
                  </div>

                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", marginBottom: "0.2rem" }}>
                      <span>Identity Attack (SARA)</span>
                      <span style={{ color: subclasses.identity >= 0.5 ? "var(--color-warning)" : "var(--text-muted)" }}>
                        {(subclasses.identity * 100).toFixed(0)}%
                      </span>
                    </div>
                    <div className="probability-bar-bg" style={{ height: "5px" }}>
                      <div className="probability-bar-fill" style={{ width: `${subclasses.identity * 100}%`, backgroundColor: "var(--color-warning)" }} />
                    </div>
                  </div>

                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", marginBottom: "0.2rem" }}>
                      <span>Sexually Explicit (Konten Seksual)</span>
                      <span style={{ color: subclasses.sexual >= 0.5 ? "var(--color-toxic)" : "var(--text-muted)" }}>
                        {(subclasses.sexual * 100).toFixed(0)}%
                      </span>
                    </div>
                    <div className="probability-bar-bg" style={{ height: "5px" }}>
                      <div className="probability-bar-fill" style={{ width: `${subclasses.sexual * 100}%`, backgroundColor: "var(--color-toxic)" }} />
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ color: "var(--text-muted)", fontSize: "0.9rem", textAlign: "center", padding: "2rem 0" }}>
                  Silakan jalankan deteksi untuk melihat rincian kategori toksisitas teks.
                </div>
              )}
            </div>
          </div>

          {/* Sample sentences */}
          <div className="cyber-card">
            <div className="cyber-card-content">
              <h2 className="result-header">Contoh Teks Percobaan</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {samples.map((sample, idx) => (
                  <div 
                    key={idx}
                    onClick={() => handlePredict(sample.text)}
                    style={{ 
                      padding: "0.75rem", 
                      backgroundColor: "rgba(255,255,255,0.03)", 
                      border: "1px solid rgba(255,255,255,0.05)", 
                      borderRadius: "6px", 
                      cursor: "pointer",
                      fontSize: "0.85rem",
                      transition: "all 0.2s ease"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "var(--accent-cyan)";
                      e.currentTarget.style.backgroundColor = "rgba(6,182,212,0.05)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "rgba(255,255,255,0.05)";
                      e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.03)";
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.25rem" }}>
                      <span style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>Contoh #{idx + 1}</span>
                      <span style={{ 
                        fontSize: "0.75rem", 
                        fontWeight: 600,
                        color: sample.label.includes("Toxic") ? "var(--color-toxic)" : "var(--color-nontoxic)" 
                      }}>
                        {sample.label}
                      </span>
                    </div>
                    <div style={{ color: "var(--text-primary)" }}>"{sample.text}"</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
