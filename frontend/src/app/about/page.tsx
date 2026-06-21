export default function About() {
  const team = [
    { name: "NLP Research Group", role: "Penyusun Utama & Implementasi Model", email: "nlp.research@semester6.id" },
    { name: "Universitas Indonesia / IndoLEM Team", role: "Penyedia Dataset IndoDiscourse", email: "indolem@gmail.com" }
  ];

  return (
    <div className="page-enter">
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: 700, letterSpacing: "-0.5px", marginBottom: "0.25rem" }}>
          About Project
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>
          Dokumentasi teknis proyek deteksi teks toksik bahasa Indonesia
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        
        {/* Project Background */}
        <div className="cyber-card">
          <div className="cyber-card-content">
            <h2 className="result-header">Latar Belakang Proyek</h2>
            <div style={{ color: "var(--text-secondary)", display: "flex", flexDirection: "column", gap: "1rem", fontSize: "0.95rem" }}>
              <p>
                Proyek ini merupakan implementasi tugas akhir mata kuliah <strong>Natural Language Processing (NLP) Semester 6</strong>, berfokus pada analisis opini dan klasifikasi teks toksik bahasa Indonesia. Dengan pesatnya pertumbuhan media sosial di Indonesia, penyebaran komentar kasar, ujaran kebencian, cacian, polarisasi politik, dan pelecehan verbal telah menjadi masalah sosial yang serius.
              </p>
              <p>
                Untuk mengatasi hal ini, diperlukan sistem moderasi otomatis yang handal dan cepat untuk menyaring konten-konten negatif secara real-time. Melalui proyek <strong>ToxicDetect AI</strong>, kami membandingkan dua arsitektur Deep Learning populer berbasis Transformers, yaitu <strong>IndoBERT</strong> dan <strong>IndoBERTweet</strong>, untuk mengetahui model terbaik dalam mendeteksi ujaran toksik.
              </p>
            </div>
          </div>
        </div>

        {/* Dataset Specifications */}
        <div className="cyber-card">
          <div className="cyber-card-content">
            <h2 className="result-header">Spesifikasi Dataset</h2>
            <div style={{ color: "var(--text-secondary)", display: "flex", flexDirection: "column", gap: "1rem", fontSize: "0.95rem" }}>
              <p>
                Sistem ini memanfaatkan dataset berlabel <strong>`indotoxic2024_annotated_data_v2_final (1).csv`</strong> yang merupakan kelanjutan dari proyek dataset <strong>IndoDiscourse</strong> (bagian dari benchmark <strong>IndoLEM</strong>).
              </p>
              <p>
                Dataset ini memuat <strong>28,448 data baris komentar</strong> dari platform media sosial. Setiap baris dianotasi oleh beberapa annotator independen dengan 9 label kategori:
              </p>
              <ul style={{ paddingLeft: "1.5rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <li><strong>Toxicity (Toksisitas):</strong> Apakah komentar bernada merusak, menjelek-jelekkan, atau menyakiti perasaan orang lain.</li>
                <li><strong>Polarized (Polarisasi Opini):</strong> Keterpolaran opini yang tajam dan ekstrem, biasanya pada konteks isu-isu sosial-politik.</li>
                <li><strong>Insults (Hinaan / Cacian):</strong> Komentar yang secara langsung menghina pribadi, fisik, atau kepribadian seseorang.</li>
                <li><strong>Identity Attack (SARA):</strong> Serangan verbal verbal terhadap ras, agama, suku, atau golongan tertentu.</li>
                <li><strong>Threats & Violence (Ancaman):</strong> Ujaran yang mengandung ajakan melakukan kekerasan atau ancaman fisik.</li>
                <li><strong>Profanity (Kata Kasar):</strong> Penggunaan kata kotor, tabu, atau kasar (umpatan).</li>
                <li><strong>Sexually Explicit (Konten Seksual):</strong> Ujaran vulgar yang merujuk pada aktivitas seksual.</li>
                <li><strong>Spam / Noise:</strong> Komentar sampah, iklan, promosi, atau tulisan yang tidak memiliki arti.</li>
                <li><strong>Elections 2024 Context:</strong> Keterkaitan isu pembicaraan dengan Pemilu Indonesia tahun 2024.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Model Architecture Explanations */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
          
          <div className="cyber-card">
            <div className="cyber-card-content">
              <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--accent-cyan)", marginBottom: "0.75rem" }}>
                Arsitektur IndoBERT
              </h3>
              <div style={{ color: "var(--text-secondary)", display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.9rem" }}>
                <p>
                  <strong>IndoBERT</strong> (dari tim IndoLEM, menggunakan model dasar `indolem/indobert-base-uncased`) ditraining dengan corpus bahasa Indonesia umum berskala besar:
                </p>
                <ul style={{ paddingLeft: "1.25rem", display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                  <li>Artikel Wikipedia Indonesia</li>
                  <li>Situs berita online (Detik, Kompas, Tempo)</li>
                  <li>E-book bahasa Indonesia</li>
                </ul>
                <p>
                  <strong>Karakteristik:</strong> Sangat baik dalam memahami struktur tata bahasa Indonesia baku (formal), namun terkadang kurang sensitif terhadap singkatan tidak baku atau bahasa gaul media sosial.
                </p>
              </div>
            </div>
          </div>

          <div className="cyber-card">
            <div className="cyber-card-content">
              <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--accent-purple)", marginBottom: "0.75rem" }}>
                Arsitektur IndoBERTweet
              </h3>
              <div style={{ color: "var(--text-secondary)", display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.9rem" }}>
                <p>
                  <strong>IndoBERTweet</strong> (base model `indolem/indobertweet-base-uncased`) merupakan model turunan BERT yang dirancang khusus untuk data berciri informal:
                </p>
                <ul style={{ paddingLeft: "1.25rem", display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                  <li>Ditraining menggunakan 409 juta token Twitter Indonesia</li>
                  <li>Mengadopsi vocabulary slang, singkatan (e.g. *yg*, *dgn*, *gw*, *lu*), emoticon, dan tagar</li>
                </ul>
                <p>
                  <strong>Karakteristik:</strong> Sangat sensitif terhadap bahasa gaul, sarkasme media sosial, singkatan percakapan sehari-hari, dan kalimat umpatan kasual yang biasa digunakan di internet.
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Project Contributors */}
        <div className="cyber-card">
          <div className="cyber-card-content">
            <h2 className="result-header">Kontributor Proyek</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1rem", marginTop: "1rem" }}>
              {team.map((member, idx) => (
                <div 
                  key={idx}
                  style={{ 
                    padding: "1rem", 
                    backgroundColor: "rgba(255,255,255,0.02)", 
                    border: "1px solid rgba(255,255,255,0.05)", 
                    borderRadius: "8px" 
                  }}
                >
                  <div style={{ fontWeight: 600, fontSize: "1.05rem", color: "var(--text-primary)" }}>{member.name}</div>
                  <div style={{ fontSize: "0.85rem", color: "var(--accent-cyan)", margin: "0.25rem 0" }}>{member.role}</div>
                  <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>{member.email}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
