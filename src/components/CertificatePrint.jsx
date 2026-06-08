import { useMemo, useState } from "react";

const getToday = () => {
  return new Date().toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const generateCertificateId = () => {
  const saved = localStorage.getItem("companaCertificateId");
  if (saved) return saved;

  const id = `CMP-${new Date().getFullYear()}-${String(
    Math.floor(Math.random() * 99999)
  ).padStart(5, "0")}`;

  localStorage.setItem("companaCertificateId", id);
  return id;
};

export default function CertificatePrint({
  targetRole = "Frontend Developer",
  completedTasks = 0,
  totalTasks = 0,
  onBack,
}) {
  const [name, setName] = useState(
    localStorage.getItem("certificateName") || ""
  );

  const [signature, setSignature] = useState(
    localStorage.getItem("certificateSignature") || ""
  );

  const [showCertificate, setShowCertificate] = useState(false);

  const certificateId = useMemo(() => generateCertificateId(), []);
  const today = getToday();

  const isEligible = totalTasks > 0 && completedTasks >= totalTasks;

  const handleNameChange = (e) => {
    setName(e.target.value);
    localStorage.setItem("certificateName", e.target.value);
  };

  const handleSignatureChange = (e) => {
    setSignature(e.target.value);
    localStorage.setItem("certificateSignature", e.target.value);
  };

  const handleShowCertificate = () => {
    if (!name.trim()) {
      alert("Nama lengkap wajib diisi dulu.");
      return;
    }

    setShowCertificate(true);
  };

  const handlePrint = () => {
    window.print();
  };

  if (!isEligible) {
    return (
      <div className="cert-page">
        <div className="cert-locked-card">
          <div className="cert-locked-icon">🔒</div>
          <h2>Sertifikat belum tersedia</h2>
          <p>
            Selesaikan semua task terlebih dahulu untuk membuka fitur cetak
            sertifikat.
          </p>
          <div className="cert-progress-text">
            {completedTasks} / {totalTasks} task selesai
          </div>
          <button onClick={onBack}>Kembali ke Dashboard</button>
        </div>

        <style>{certificateStyles}</style>
      </div>
    );
  }

  return (
    <div className="cert-page">
      {!showCertificate && (
        <div className="cert-form-card no-print">
          <div className="cert-badge">
            <span />
            Sertifikasi Compana
          </div>

          <h1>
            Cetak <span>Sertifikatmu</span>
          </h1>

          <p>
            Isi nama lengkap untuk ditampilkan pada sertifikat. Tanda tangan
            boleh dikosongkan.
          </p>

          <div className="cert-form-group">
            <label>Nama Lengkap</label>
            <input
              value={name}
              onChange={handleNameChange}
              placeholder="Contoh: Arif Abdul"
            />
          </div>

          <div className="cert-form-group">
            <label>Tanda Tangan Opsional</label>
            <input
              value={signature}
              onChange={handleSignatureChange}
              placeholder="Boleh dikosongkan"
            />
          </div>

          <div className="cert-info-grid">
            <div>
              <small>Bidang Karir</small>
              <strong>{targetRole}</strong>
            </div>
            <div>
              <small>Tanggal</small>
              <strong>{today}</strong>
            </div>
          </div>

          <button className="cert-primary-btn" onClick={handleShowCertificate}>
            Lihat Sertifikat →
          </button>

          <button className="cert-secondary-btn" onClick={onBack}>
            Kembali
          </button>
        </div>
      )}

      {showCertificate && (
        <>
          <div className="cert-actions no-print">
            <button onClick={() => setShowCertificate(false)}>
              Edit Data
            </button>
            <button onClick={handlePrint}>Cetak / Save PDF</button>
          </div>

          <div className="cert-outer certificate-print">
            <div className="cert-bg-pattern" />
            <div className="cert-border-frame" />

            <div className="cert-corner cert-tl" />
            <div className="cert-corner cert-tr" />
            <div className="cert-corner cert-bl" />
            <div className="cert-corner cert-br" />

            <div className="cert-inner">
              <div className="cert-header">
                <div className="cert-logo">
                  <div className="cert-logo-mark">C</div>
                  <div>
                    Comp<span>ana</span>
                  </div>
                </div>

                <div className="cert-id">{certificateId}</div>
              </div>

              <div className="cert-divider" />

              <div className="cert-title-wrap">
                <p>Certificate of Achievement</p>
                <h1>
                  Sertifikat <span>Kompeten</span>
                </h1>
              </div>

              <div className="cert-ornament">
                <div />
                <span />
                <strong />
                <span />
                <div />
              </div>

              <div className="cert-recipient">
                <p>Diberikan dengan bangga kepada</p>
                <h2>{name || "Nama Penerima"}</h2>
              </div>

              <div className="cert-body-text">
                Telah berhasil menyelesaikan seluruh task pembelajaran bersama
                Compana untuk jalur karir
                <h3>{targetRole}</h3>
                dengan dedikasi, konsistensi, dan pencapaian nyata.
              </div>

              <div className="cert-meta-band">
                <div>
                  <p>Total Task</p>
                  <strong>{totalTasks}</strong>
                </div>
                <div>
                  <p>Status</p>
                  <strong>Selesai</strong>
                </div>
                <div>
                  <p>Tanggal Terbit</p>
                  <strong>{today}</strong>
                </div>
                <div>
                  <p>Platform</p>
                  <strong>Compana AI</strong>
                </div>
              </div>

              <div className="cert-footer">
                <div className="cert-sign">
                  <div className="cert-line" />
                  <strong>Tim Compana</strong>
                  <p>Career Intelligence Platform</p>
                </div>

                <div className="cert-seal">
                  <div>
                    <span>🏅</span>
                    <strong>Verified</strong>
                  </div>
                </div>

                <div className="cert-sign">
                  <div className="cert-line" />
                  <strong>
                    {signature.trim() || "________________"}
                  </strong>
                  <p>Penerima Sertifikat</p>
                </div>
              </div>
            </div>

            <div className="cert-bottom-strip">
              <span>Terverifikasi secara digital oleh Compana AI</span>
              <span>ID: {certificateId}</span>
            </div>
          </div>
        </>
      )}

      <style>{certificateStyles}</style>
    </div>
  );
}

const certificateStyles = `
  .cert-page {
    min-height: 100vh;
    background: #0a1f12;
    padding: 32px 18px 48px;
    display: flex;
    flex-direction: column;
    align-items: center;
    color: white;
    font-family: 'DM Sans', sans-serif;
    box-sizing: border-box;
  }

  .cert-form-card,
  .cert-locked-card {
    width: 100%;
    max-width: 520px;
    background: rgba(255,255,255,0.055);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 22px;
    padding: 32px;
    box-shadow: 0 24px 70px rgba(0,0,0,0.25);
  }

  .cert-locked-card {
    text-align: center;
  }

  .cert-locked-icon {
    width: 58px;
    height: 58px;
    border-radius: 50%;
    background: rgba(61,186,116,0.14);
    border: 1px solid rgba(61,186,116,0.28);
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 18px;
    font-size: 26px;
  }

  .cert-locked-card h2,
  .cert-form-card h1 {
    font-family: 'Playfair Display', serif;
    font-size: 30px;
    line-height: 1.15;
    margin: 0 0 10px;
  }

  .cert-form-card h1 span {
    color: #3dba74;
  }

  .cert-form-card p,
  .cert-locked-card p {
    color: rgba(255,255,255,0.55);
    font-size: 13px;
    line-height: 1.7;
    margin: 0 0 22px;
  }

  .cert-badge {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    background: rgba(61,186,116,0.13);
    border: 1px solid rgba(61,186,116,0.28);
    color: #4de89a;
    font-size: 12px;
    font-weight: 900;
    border-radius: 999px;
    padding: 7px 14px;
    margin-bottom: 16px;
  }

  .cert-badge span {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #4de89a;
    box-shadow: 0 0 8px rgba(77,232,154,0.75);
  }

  .cert-form-group {
    margin-bottom: 15px;
  }

  .cert-form-group label {
    display: block;
    font-size: 11px;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 0.07em;
    color: rgba(255,255,255,0.55);
    margin-bottom: 7px;
  }

  .cert-form-group input {
    width: 100%;
    border: 1px solid rgba(255,255,255,0.13);
    background: rgba(255,255,255,0.07);
    color: white;
    border-radius: 12px;
    padding: 12px 14px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    outline: none;
  }

  .cert-form-group input:focus {
    border-color: rgba(61,186,116,0.6);
    background: rgba(61,186,116,0.08);
  }

  .cert-info-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    margin: 18px 0 20px;
  }

  .cert-info-grid div {
    background: rgba(255,255,255,0.045);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 14px;
    padding: 12px;
  }

  .cert-info-grid small {
    display: block;
    color: rgba(255,255,255,0.38);
    font-size: 10px;
    text-transform: uppercase;
    margin-bottom: 4px;
  }

  .cert-info-grid strong {
    color: #3dba74;
    font-size: 13px;
  }

  .cert-primary-btn,
  .cert-secondary-btn,
  .cert-actions button,
  .cert-locked-card button {
    width: 100%;
    border: none;
    border-radius: 13px;
    padding: 13px 16px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    font-weight: 900;
    cursor: pointer;
  }

  .cert-primary-btn,
  .cert-actions button:last-child,
  .cert-locked-card button {
    background: #2d8c5e;
    color: white;
  }

  .cert-secondary-btn,
  .cert-actions button:first-child {
    margin-top: 10px;
    background: rgba(255,255,255,0.07);
    color: rgba(255,255,255,0.75);
    border: 1px solid rgba(255,255,255,0.12);
  }

  .cert-progress-text {
    color: #3dba74;
    font-weight: 900;
    margin-bottom: 18px;
  }

  .cert-actions {
    width: 100%;
    max-width: 720px;
    display: flex;
    gap: 12px;
    margin-bottom: 16px;
  }

  .cert-actions button {
    margin: 0 !important;
  }

  .cert-outer {
    width: 100%;
    max-width: 760px;
    background: #f7f3ea;
    color: #0a1f12;
    border-radius: 6px;
    position: relative;
    overflow: hidden;
    box-shadow: 0 28px 90px rgba(0,0,0,0.35);
  }

  .cert-bg-pattern {
    position: absolute;
    inset: 0;
    opacity: 0.045;
    background-image:
      repeating-linear-gradient(45deg,#1a5c3e 0,#1a5c3e 1px,transparent 0,transparent 50%),
      repeating-linear-gradient(-45deg,#1a5c3e 0,#1a5c3e 1px,transparent 0,transparent 50%);
    background-size: 22px 22px;
  }

  .cert-border-frame {
    position: absolute;
    inset: 12px;
    border: 1.5px solid #2d6e47;
    pointer-events: none;
    z-index: 2;
  }

  .cert-border-frame::before {
    content: "";
    position: absolute;
    inset: 5px;
    border: 0.5px solid rgba(45,110,71,0.35);
  }

  .cert-corner {
    position: absolute;
    width: 28px;
    height: 28px;
    border: 2px solid #2d6e47;
    z-index: 3;
  }

  .cert-tl {
    top: 8px;
    left: 8px;
    border-right: none;
    border-bottom: none;
  }

  .cert-tr {
    top: 8px;
    right: 8px;
    border-left: none;
    border-bottom: none;
  }

  .cert-bl {
    bottom: 8px;
    left: 8px;
    border-right: none;
    border-top: none;
  }

  .cert-br {
    bottom: 8px;
    right: 8px;
    border-left: none;
    border-top: none;
  }

  .cert-inner {
    position: relative;
    z-index: 1;
    padding: 42px 54px 36px;
  }

  .cert-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 14px;
  }

  .cert-logo {
    display: flex;
    align-items: center;
    gap: 10px;
    font-weight: 900;
    font-size: 18px;
  }

  .cert-logo span {
    color: #2d8c5e;
  }

  .cert-logo-mark {
    width: 34px;
    height: 34px;
    border-radius: 9px;
    background: #0a1f12;
    color: #3dba74;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 900;
  }

  .cert-id {
    font-family: monospace;
    font-size: 11px;
    color: #6c8978;
    text-transform: uppercase;
  }

  .cert-divider {
    height: 1.5px;
    background: linear-gradient(90deg, transparent, #2d6e47, transparent);
    margin: 16px 0;
  }

  .cert-title-wrap {
    text-align: center;
  }

  .cert-title-wrap p {
    font-family: serif;
    font-style: italic;
    font-size: 14px;
    letter-spacing: 2px;
    color: #5a7d6a;
    text-transform: uppercase;
  }

  .cert-title-wrap h1 {
    font-family: 'Playfair Display', serif;
    font-size: 40px;
    line-height: 1.1;
    margin: 5px 0 0;
  }

  .cert-title-wrap h1 span {
    color: #2d8c5e;
  }

  .cert-ornament {
    display: flex;
    align-items: center;
    gap: 10px;
    margin: 18px 0 20px;
  }

  .cert-ornament div {
    flex: 1;
    height: 1px;
    background: rgba(45,110,71,0.35);
  }

  .cert-ornament span {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: #2d8c5e;
    opacity: 0.55;
  }

  .cert-ornament strong {
    width: 9px;
    height: 9px;
    background: #2d8c5e;
    transform: rotate(45deg);
  }

  .cert-recipient {
    text-align: center;
  }

  .cert-recipient p {
    font-size: 11px;
    color: #7a9987;
    text-transform: uppercase;
    letter-spacing: 1.2px;
  }

  .cert-recipient h2 {
    font-family: 'Playfair Display', serif;
    font-style: italic;
    font-size: 42px;
    line-height: 1.15;
    margin: 8px 0 0;
  }

  .cert-body-text {
    text-align: center;
    color: #4a6657;
    font-family: serif;
    font-size: 15px;
    line-height: 1.75;
    max-width: 540px;
    margin: 18px auto 0;
  }

  .cert-body-text h3 {
    font-family: 'Playfair Display', serif;
    font-size: 23px;
    color: #1a5c3e;
    margin: 5px 0;
  }

  .cert-meta-band {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    border-top: 1px solid rgba(45,110,71,0.25);
    border-bottom: 1px solid rgba(45,110,71,0.25);
    margin: 24px 0;
  }

  .cert-meta-band div {
    text-align: center;
    padding: 13px 12px;
    border-right: 1px solid rgba(45,110,71,0.18);
  }

  .cert-meta-band div:last-child {
    border-right: none;
  }

  .cert-meta-band p {
    font-size: 9px;
    color: #7a9987;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin: 0 0 5px;
  }

  .cert-meta-band strong {
    font-family: 'Playfair Display', serif;
    font-size: 15px;
  }

  .cert-footer {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    gap: 18px;
  }

  .cert-sign {
    flex: 1;
    text-align: center;
  }

  .cert-line {
    width: 130px;
    height: 1px;
    background: #2d6e47;
    margin: 0 auto 8px;
  }

  .cert-sign strong {
    font-size: 12px;
    font-weight: 900;
  }

  .cert-sign p {
    font-size: 10px;
    color: #7a9987;
    margin-top: 3px;
  }

  .cert-seal {
    width: 76px;
    height: 76px;
    border-radius: 50%;
    border: 2px solid #2d6e47;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .cert-seal div {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    border: 1px solid rgba(45,110,71,0.4);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .cert-seal span {
    font-size: 22px;
  }

  .cert-seal strong {
    font-size: 8px;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: #1a5c3e;
  }

  .cert-bottom-strip {
    position: relative;
    z-index: 1;
    background: #0a1f12;
    padding: 11px 30px;
    color: #4de89a;
    display: flex;
    justify-content: space-between;
    gap: 12px;
    font-size: 10px;
  }

  @media (max-width: 680px) {
    .cert-page {
      padding: 22px 12px 38px;
    }

    .cert-form-card,
    .cert-locked-card {
      padding: 26px 20px;
      border-radius: 18px;
    }

    .cert-info-grid,
    .cert-actions {
      grid-template-columns: 1fr;
      flex-direction: column;
    }

    .cert-inner {
      padding: 34px 28px 30px;
    }

    .cert-header {
      flex-direction: column;
      text-align: center;
    }

    .cert-title-wrap h1 {
      font-size: 32px;
    }

    .cert-recipient h2 {
      font-size: 34px;
    }

    .cert-meta-band {
      grid-template-columns: repeat(2, 1fr);
    }

    .cert-meta-band div:nth-child(2) {
      border-right: none;
    }

    .cert-meta-band div:nth-child(1),
    .cert-meta-band div:nth-child(2) {
      border-bottom: 1px solid rgba(45,110,71,0.18);
    }

    .cert-footer {
      flex-direction: column;
      align-items: center;
      gap: 22px;
    }

    .cert-sign {
      width: 100%;
    }

    .cert-seal {
      order: -1;
    }

    .cert-bottom-strip {
      flex-direction: column;
      text-align: center;
      align-items: center;
    }
  }

  @media print {
    body * {
      visibility: hidden !important;
    }

    .certificate-print,
    .certificate-print * {
      visibility: visible !important;
    }

    .no-print,
    .no-print * {
      display: none !important;
      visibility: hidden !important;
    }

    .cert-page {
      background: white !important;
      padding: 0 !important;
      min-height: auto !important;
      display: block !important;
    }

    .certificate-print {
      position: absolute !important;
      left: 0 !important;
      top: 0 !important;
      width: 100% !important;
      max-width: none !important;
      box-shadow: none !important;
      border-radius: 0 !important;
    }

    @page {
      size: A4 landscape;
      margin: 0;
    }
  }
`;