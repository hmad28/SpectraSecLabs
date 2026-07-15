import { PublicHeader } from "@/components/public-header";

export default function ChallengeLoading() {
  return (
    <>
      <PublicHeader active="labs" />
      <main className="section">
        <div className="container">
          <div className="challenge-layout">
            <article className="challenge-body reveal">
              <div className="challenge-meta">
                <span className="skeleton-pill" />
                <span className="skeleton-pill" />
                <span className="skeleton-pill small" />
              </div>
              <div className="skeleton-line title" />
              <div className="challenge-skeleton-copy">
                <span className="skeleton-line wide" />
                <span className="skeleton-line" />
                <span className="skeleton-line short" />
              </div>
              <aside className="hint">
                <strong className="skeleton-line inline" />
                <span className="skeleton-line tiny" />
              </aside>
              <section className="challenge-files">
                <h2 className="skeleton-line files-title" />
                <div className="file-list">
                  <div className="file-row skeleton-row" />
                  <div className="file-row skeleton-row" />
                </div>
              </section>
            </article>
            <aside className="challenge-submit card skeleton-submit">
              <span className="skeleton-line inline" />
              <h2 className="skeleton-line submit-title" />
              <div className="skeleton-line wide" />
              <div className="skeleton-line" />
              <div className="skeleton-line short" />
              <div className="skeleton-line button" />
            </aside>
          </div>
        </div>
      </main>
    </>
  );
}
