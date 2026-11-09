import './Footer.css';

export default function Footer() {
  return (
    <footer className="app-footer" role="contentinfo">
      <details className="seo-details">
        <summary className="seo-summary">
          <span className="summary-icon">✨</span>
          <span>About Roll the Night &amp; How It Works</span>
        </summary>
        <div className="seo-content">
          <p>
            <strong>Roll the Night</strong> is a playful lottery-style ball machine designed for
            couples to explore romantic intimacy together in a fun, low-pressure way.
          </p>

          <div className="seo-grid">
            <div className="seo-block">
              <h4 className="seo-heading">🌶️ 4 Spiciness Levels</h4>
              <p>
                Choose between <em>Mild (Play It Safe)</em> for gentle comfort,{' '}
                <em>Spicy (Daring &amp; Fun)</em> for new angles,{' '}
                <em>Wild (Adventurous)</em> for athletic thrill, or <em>All In</em> to draw across all 514
                positions.
              </p>
            </div>

            <div className="seo-block">
              <h4 className="seo-heading">🔮 10 Position Categories</h4>
              <p>
                From Classic and Face to Face, to Standing, Edge &amp; Furniture, Sitting, and Oral—every
                card includes safety guides, difficulty ratings, and style tags.
              </p>
            </div>

            <div className="seo-block">
              <h4 className="seo-heading">🔒 100% Private &amp; Client-Side</h4>
              <p>
                No accounts, no logins, and zero remote analytics or tracking. All lottery physics and card
                reveals run locally inside your browser.
              </p>
            </div>
          </div>
        </div>
      </details>

      <p className="footer-copyright">
        &copy; {new Date().getFullYear()} Roll the Night &middot; 18+ Adult Couples Game &middot; All rights reserved.
      </p>
    </footer>
  );
}

