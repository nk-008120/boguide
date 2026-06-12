import { useState } from 'react'
import './App.css'
import MacrophageGame from './components/MacrophageGame'

function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const faqs = [
    {
      q: "How often do you post new content?",
      a: "We post new reels regularly on Instagram to keep our followers engaged with fresh biology content!"
    },
    {
      q: "Can I use your content for studying?",
      a: "Absolutely! Our content is designed to help students understand complex biology concepts. Feel free to use it for exam prep!"
    },
    {
      q: "What topics do you cover?",
      a: "We cover neuroscience, cell biology, lab techniques, biotech, plant biology, molecular biology, and more!"
    },
    {
      q: "Are your team members qualified?",
      a: "Yes! Our team includes biology olympiad medalists, coaches, tutors, and scientific reviewers."
    },
    {
      q: "Can I request a specific topic?",
      a: "Absolutely! Contact us on Instagram and we'll consider your suggestions for future content."
    },
    {
      q: "Is the science accurate?",
      a: "Yes! Our content is reviewed by scientific experts to ensure accuracy and credibility."
    }
  ]

  return (
    <section className="faq-section">
      <h2>Frequently Asked Questions</h2>
      <div className="faq-container">
        {faqs.map((faq, index) => (
          <div key={index} className="faq-item">
            <button
              className="faq-question"
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            >
              <span>{faq.q}</span>
              <span className={`chevron ${openIndex === index ? 'open' : ''}`}>▼</span>
            </button>
            {openIndex === index && (
              <div className="faq-answer">
                <p>{faq.a}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}

function App() {
  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <div className="logo-section">
            <h1 className="logo">🧬 BioNuggets</h1>
            <p className="tagline">Complex Biology Made Simple</p>
          </div>
          <a href="https://instagram.com/bionuggets2009" target="_blank" rel="noopener noreferrer" className="instagram-link">
            📱 Follow
          </a>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="hero">
          <div className="hero-overlay"></div>
          <div className="hero-content">
            <h2 className="hero-title">Complex Biology<br /><span className="highlight">Made Simple</span></h2>
            <p className="hero-subtitle">Discover the fascinating world of science through bite-sized, engaging educational content. Nugget by nugget. 🧬</p>
            <div className="cta-buttons">
              <a href="https://instagram.com/bionuggets2009" target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                Follow on Instagram
              </a>
              <a href="#about" className="btn btn-secondary">
                Learn More ↓
              </a>
            </div>
            <div className="hero-stats">
              <div className="stat-item">
                <h3>736+</h3>
                <p>Followers</p>
              </div>
              <div className="stat-item">
                <h3>2.5K+</h3>
                <p>Total Likes</p>
              </div>
            </div>
          </div>
        </section>

        {/* Why BioNuggets Works */}
        <section className="why-section">
          <h2>Why BioNuggets Works</h2>
          <div className="why-grid">
            <div className="why-card">
              <span className="why-icon">📚</span>
              <h3>Bite-Sized Learning</h3>
              <p>Complex concepts broken into digestible nuggets</p>
            </div>
            <div className="why-card">
              <span className="why-icon">🎬</span>
              <h3>Engaging Reels</h3>
              <p>Visual storytelling that makes science fun</p>
            </div>
            <div className="why-card">
              <span className="why-icon">🏆</span>
              <h3>Expert Team</h3>
              <p>Olympiad medalists and certified educators</p>
            </div>
            <div className="why-card">
              <span className="why-icon">⏰</span>
              <h3>Always Available</h3>
              <p>Learn at your own pace, anytime</p>
            </div>
            <div className="why-card">
              <span className="why-icon">✓</span>
              <h3>Scientifically Accurate</h3>
              <p>Reviewed by scientific experts</p>
            </div>
            <div className="why-card">
              <span className="why-icon">👥</span>
              <h3>Community First</h3>
              <p>Built by students, for students</p>
            </div>
          </div>
        </section>

        {/* Game Section */}
        <section className="game-section">
          <h2>🎮 Play & Learn</h2>
          <p className="game-subtitle">Control the macrophage and eat bacteria! Use arrow keys or touch controls on mobile.</p>
          <MacrophageGame />
        </section>

        {/* Founders Section */}
        <section id="about" className="founders-section">
          <h2>Meet the Founders</h2>
          <div className="founders-grid">
            <div className="founder-card">
              <div className="founder-header">
                <h3>Zain Azar Alzaher</h3>
                <p className="role">Founder, Presenter & Graphic Designer</p>
              </div>
              <ul className="achievements">
                <li>🥉 Bronze International Biology Olympiad (IBO) Medalist</li>
                <li>🎓 International and National Bio Team</li>
                <li>🏆 Senior and Junior Bio Olympiad</li>
                <li>🎤 National Debates Team</li>
                <li>📚 Biology Coach & Tutor</li>
                <li>📖 SYE Prep Student</li>
                <li>🔬 Scientific Reviewer in Frontiers for Young Minds</li>
                <li>♟️ Chess & 🎸 Guitar</li>
              </ul>
            </div>

            <div className="founder-card">
              <div className="founder-header">
                <h3>Reta Sharara</h3>
                <p className="role">Co-founder</p>
              </div>
              <ul className="achievements">
                <li>🥇 National Gold Medal - Syrian Biology Olympiad</li>
                <li>🎨 Graphic Design & Content Writing</li>
                <li>📱 Social Media Management</li>
                <li>🎬 Video Editing</li>
                <li>🔬 Scientific Communication</li>
              </ul>
              <a href="https://instagram.com/reta_sharara" target="_blank" rel="noopener noreferrer" className="social-link">
                Follow Reta →
              </a>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="team-section">
          <h2>Our Amazing Team</h2>
          <div className="team-grid">
            <div className="team-member">
              <h4>Mohammad Hyder</h4>
              <p>Presenter & Scientific Reviewer</p>
            </div>
            <div className="team-member">
              <h4>Khaled Kunbarji</h4>
              <p>Presenter</p>
            </div>
            <div className="team-member">
              <h4>Muhsen Saleh</h4>
              <p>Presenter</p>
            </div>
            <div className="team-member">
              <h4>Asmaa Tayara</h4>
              <p>Presenter</p>
            </div>
            <div className="team-member">
              <h4>Zain Shams Aldeen</h4>
              <p>Presenter</p>
            </div>
            <div className="team-member">
              <h4>Hala Alrifaie</h4>
              <p>Presenter</p>
            </div>
            <div className="team-member">
              <h4>Ghena Awad</h4>
              <p>Presenter</p>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <FAQ />

        {/* Contact Section */}
        <section className="contact-section">
          <h2>Get in Touch</h2>
          <div className="contact-grid">
            <a href="https://instagram.com/bionuggets2009" target="_blank" rel="noopener noreferrer" className="contact-card">
              <span className="contact-icon">📱</span>
              <h3>Follow on Instagram</h3>
              <p>@bionuggets2009</p>
            </a>
            <a href="https://wa.me/963980162900" target="_blank" rel="noopener noreferrer" className="contact-card">
              <span className="contact-icon">💬</span>
              <h3>Message Us</h3>
              <p>+963 980 162 900</p>
            </a>
          </div>
        </section>

        {/* Articles Section */}
        <section className="articles-section">
          <h2>📚 Articles Coming Soon</h2>
          <p>Deep-dive articles explaining the science behind our reels. Stay tuned for in-depth explorations of biology concepts!</p>
        </section>
      </main>

      <footer className="footer">
        <p>&copy; 2026 BioNuggets. Complex Biology Made Simple. 🧬</p>
      </footer>
    </div>
  )
}

export default App
