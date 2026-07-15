import { PublicHeader } from "@/components/public-header";

export default function LabsLoading() {
  return (
    <>
      <PublicHeader active="labs" />
      <main className="section">
        <div className="wide-container">
          <div className="section-head">
            <div><p className="eyebrow">MISSION BOARD</p><h1>Pilih target.<br />Ambil flag.</h1></div>
            <p className="skeleton-line wide" />
          </div>
          <div className="lab-summary-grid">
            {Array.from({ length: 4 }).map((_, index) => <article className="skeleton-card" key={index} />)}
          </div>
          <div className="lab-filter-panel skeleton-filter" />
          <div className="challenge-grid">
            {Array.from({ length: 9 }).map((_, index) => <article className="challenge-card skeleton-card" key={index} />)}
          </div>
        </div>
      </main>
    </>
  );
}
