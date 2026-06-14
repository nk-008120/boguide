import { useState, useEffect } from 'react'
import './App.css'
import MacrophageGame from './components/MacrophageGame'

// Featured Reels Component
function FeaturedReels() {
  const reels = [
    {
      id: 'DXpJuExDKKl',
      title: 'Neurons Playing Pong',
      description: 'A clump of neurons learned to play Pong. Not AI. Not code. Biology.',
      likes: 201,
      comments: 190,
      url: 'https://www.instagram.com/reel/DXpJuExDKKl/'
    },
    {
      id: 'DVtqvBHDXyl',
      title: 'Why Your Voice Sounds Weird',
      description: 'Ever wondered why your voice sounds weird in a voice note? The science behind bone conduction.',
      likes: 329,
      comments: 210,
      url: 'https://www.instagram.com/reel/DVtqvBHDXyl/'
    },
    {
      id: 'DUtniwwDIlS',
      title: 'Centrifuge Chaos',
      description: 'POV: when you forget to balance your tubes in the centrifuge 💀',
      likes: 770,
      comments: 106,
      url: 'https://www.instagram.com/reel/DUtniwwDIlS/'
    }
  ]

  return (
    <section className="featured-reels-section">
      <h2>Featured Reels</h2>
      <p className="section-subtitle">Check out some of our most popular educational content from Instagram</p>
      <div className="reels-grid">
        {reels.map((reel) => (
          <a key={reel.id} href={reel.url} target="_blank" rel="noopener noreferrer" className="reel-card">
            <div className="reel-header">
              <span className="reel-icon">🎬</span>
              <h3>{reel.title}</h3>
            </div>
            <p className="reel-description">{reel.description}</p>
            <div className="reel-stats">
              <span className="reel-stat">❤️ {reel.likes}</span>
              <span className="reel-stat">💬 {reel.comments}</span>
            </div>
            <div className="reel-link">View on Instagram →</div>
          </a>
        ))}
      </div>
    </section>
  )
}

// Topics Section
function TopicsSection() {
  const topics = [
    { icon: '🧠', title: 'Neuroscience', desc: 'Brain, neurons, and cognitive science' },
    { icon: '🧬', title: 'Cell Biology', desc: 'Cellular structures and functions' },
    { 
      icon: '🧪', 
      title: 'Biochemistry', 
      desc: 'The amazing combination of biology and chemistry', 
      url: 'https://biounified-v1.vercel.app/resources/1-cell-molecular/biochemistry/' 
    },
    { icon: '⚗️', title: 'Biotech', desc: 'Biotechnology and genetic engineering' },
    { icon: '🌿', title: 'Plant Biology', desc: 'Botany and plant physiology' },
    { icon: '🔬', title: 'Molecular Biology', desc: 'Molecular mechanisms of life' }
  ]

  return (
    <section className="topics-section">
      <h2>What We Cover</h2>
      <p className="section-subtitle">Explore the diverse range of biological topics we, and our dedicated partners, <a href="https://biounified-v1.vercel.app/">BiOGuide</a>, break down into digestible nuggets of knowledge</p>
      <div className="topics-grid">
        {topics.map((topic, idx) => {
          const cardContent = (
            <>
              <span className="topic-icon">{topic.icon}</span>
              <h3>{topic.title}</h3>
              <p>{topic.desc}</p>
            </>
          );

          // If there's a URL, wrap card in <a> (external link)
          if (topic.url) {
            return (
              <a
                key={idx}
                href={topic.url}
                target="_blank"
                rel="noopener noreferrer"
                className="topic-card"
              >
                {cardContent}
              </a>
            );
          }

          // Otherwise render as non-clickable div
          return (
            <div key={idx} className="topic-card">
              {cardContent}
            </div>
          );
        })}
      </div>
    </section>
  )
}

// FAQ Component
function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const faqs = [
    {
      q: "How often do you post new biology content?",
      a: "We post new reels regularly on Instagram to keep our followers engaged with fresh biology content! Check our Instagram for the latest uploads."
    },
    {
      q: "Can I use your content for studying or exams?",
      a: "Absolutely! Our content is designed to help students understand complex biology concepts. Feel free to use it for exam prep and study sessions!"
    },
    {
      q: "What topics do you cover?",
      a: "We cover neuroscience, cell biology, lab techniques, biotech, plant biology, molecular biology, and more! Each topic is broken down into bite-sized nuggets."
    },
    {
      q: "Who are the presenters?",
      a: "Our team includes biology olympiad medalists, coaches, tutors, and scientific reviewers. All presenters have extensive expertise in their respective fields."
    },
    {
      q: "Can I request specific biology topics?",
      a: "Absolutely! Contact us on Instagram and we'll consider your suggestions for future content. We love hearing from our community!"
    },
    {
      q: "Is the content scientifically accurate?",
      a: "Yes! Our content is reviewed by scientific experts to ensure accuracy and credibility. We prioritize scientific integrity in all our materials."
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
              aria-expanded={openIndex === index}
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

// Contact Section
function ContactSection() {
  return (
    <section className="contact-section">
      <h2>Let's Connect</h2>
      <p className="section-subtitle">Have questions or ready to collaborate? We're here to help.</p>
      <div className="contact-grid">
        <a href="https://instagram.com/bionuggets2009" target="_blank" rel="noopener noreferrer" className="contact-card">
          <span className="contact-icon">📱</span>
          <h3>Follow Us</h3>
          <p>@bionuggets2009</p>
          <div className="contact-meta">Quick Response - Usually within 24 hours</div>
        </a>
        <a href="tel:+963980162900" className="contact-card">
          <span className="contact-icon">☎️</span>
          <h3>Call Us</h3>
          <p>+963 980 162 900</p>
          <div className="contact-meta">Monday - Sunday, 9 AM - 10 PM (GMT+3)</div>
        </a>
        <a href="https://instagram.com/bionuggets2009" target="_blank" rel="noopener noreferrer" className="contact-card">
          <span className="contact-icon">💬</span>
          <h3>Message Us</h3>
          <p>Direct Message on Instagram</p>
          <div className="contact-meta">Available for inquiries and collaboration</div>
        </a>
      </div>
    </section>
  )
}

// About Section
function AboutSection() {
  return (
    <section id="about" className="about-section">
      <h2>About BioNuggets</h2>
      <div className="about-content">
        <div className="about-text">
          <p>
            BioNuggets is dedicated to making complex biology accessible and engaging. We believe that science shouldn't be intimidating—it should be exciting, entertaining, and easy to understand.
          </p>
          <p>
            Our mission is to transform how people learn about biology by breaking down complex concepts into bite-sized "nuggets" of knowledge that inspire curiosity and foster a love for science.
          </p>
          <p>
            Whether you're preparing for biology olympiads, studying for exams, or simply curious about the natural world, BioNuggets has something for everyone.
          </p>
        </div>
        <div className="about-stats">
          <div className="stat-box">
            <h4>736+</h4>
            <p>Community Members</p>
          </div>
          <div className="stat-box">
            <h4>2.5K+</h4>
            <p>Total Engagement</p>
          </div>
          <div className="stat-box">
            <h4>50+</h4>
            <p>Educational Reels</p>
          </div>
        </div>
      </div>
    </section>
  )
}

// Team Section
function TeamSection() {
  const team = [
    { name: 'Zain Azar Alzaher', role: 'Founder, Presenter & Graphic Designer', emoji: '🧬', achievements: ['🥉 IBO Bronze Medalist', '🏆 Senior and Junior Bio Olympiad Participant', '🎤 National Debates Team', '👨‍🏫 Biology Coach & Tutor', '📚 SVE Prep Student', '♟️ Chess Enthusiast', '🎸 Guitar Musician'] },
    { name: 'Reta Sharara', role: 'Co-founder', emoji: '🥇', achievements: ['🥇 National Gold Medal', '🎨 Graphic Designer', '📱 Social Media Manager'] },
    { name: 'Mohammad Hyder', role: 'Presenter & Scientific Reviewer', emoji: '🎤', achievements: ['🔬 Scientific Expert', '👨‍🏫 Educator', '📚 Content Reviewer'] },
    { name: 'Khaled Kunbarji', role: 'Presenter', emoji: '🎤', achievements: ['🧠 Neuroscience Expert', '🎬 Content Creator', '👥 Community Manager'] },
    { name: 'Muhsen Saleh', role: 'Presenter', emoji: '🎤', achievements: ['🧬 Molecular Biology', '🔬 Lab Techniques', '📖 Educational Content'] },
    { name: 'Asmaa Tayara', role: 'Presenter', emoji: '🎤', achievements: ['🌿 Plant Biology', '🧪 Lab Methods', '📚 Study Materials'] },
    { name: 'Zain Shams Aldeen', role: 'Presenter', emoji: '🎤', achievements: ['🧠 Neuroscience', '🎬 Video Content', '👨‍🏫 Tutoring'] },
    { name: 'Hala Alrifaie', role: 'Presenter', emoji: '🎤', achievements: ['🔬 Research', '📱 Social Content', '🎨 Design'] },
    { name: 'Ghena Awad', role: 'Presenter', emoji: '🎤', achievements: ['🧬 Genetics', '🎬 Production', '📚 Curriculum'] }
  ]

  return (
    <section className="team-section">
      <h2>Our Amazing Team</h2>
      <p className="section-subtitle">Meet the passionate presenters and educators behind BioNuggets</p>
      <div className="team-grid">
        {team.map((member, idx) => (
          <div key={idx} className="team-card">
            <div className="team-avatar">{member.emoji}</div>
            <h3>{member.name}</h3>
            <p className="team-role">{member.role}</p>
            <ul className="team-achievements">
              {member.achievements.map((achievement, i) => (
                <li key={i}>{achievement}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}

// Main App Component
function App() {
  const [scrolled, setScrolled] = useState(false)
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  return (
    <div className="app">
      {/* Header */}
<header className={`header ${scrolled ? 'scrolled' : ''}`}>
  <div className="header-content">
    <div className="logo-section">
      <h1 className="logo">🧬 BioNuggets</h1>
      <p className="tagline">Complex Biology Made Simple</p>
    </div>

    <div className="header-actions">
      {/* Dark Mode Toggle */}
      <button 
        className="dark-mode-toggle" 
        onClick={() => setDarkMode(!darkMode)}
        aria-label="Toggle dark mode"
      >
        {darkMode ? '☀️' : '🌙'}
      </button>

      {/* Proper Instagram Icon */}
      <a 
        href="https://www.instagram.com/bionuggets2009" 
        target="_blank" 
        rel="noopener noreferrer"
        className="instagram-icon"
        title="Follow us on Instagram"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.849.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 5.838c-3.403 0-6.162 2.76-6.162 6.162s2.76 6.162 6.162 6.162 6.162-2.76 6.162-6.162S15.403 5.838 12 5.838zm0 10.162c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44 1.44-.645 1.44-1.44-.644-1.44-1.44-1.44z"/>
        </svg>
      </a>

      {/* Explore BoGuide Button */}
      <a 
        href="https://biounified-v1.vercel.app/" 
        target="_blank" 
        rel="noopener noreferrer"
        className="explore-btn"
      >
        Explore BoGuide
      </a>
    </div>
  </div>
</header>

      <main>
      {/* Hero Section */}
<section className="hero">
  <div className="hero-content">
    <h2 className="hero-title">
      Complex Biology<br />
      <span className="highlight">Made Simple</span>
    </h2>
    <p className="hero-subtitle">
      Discover the fascinating world of science through bite-sized, 
      engaging educational content. Nugget by nugget. 🧬
    </p>
    
    <div className="cta-buttons">
      <a href="https://instagram.com/bionuggets2009" 
         target="_blank" 
         rel="noopener noreferrer" 
         className="btn btn-primary">
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

        {/* Topics Section */}
        <TopicsSection />

        {/* Featured Reels */}
        <FeaturedReels />

        {/* Why BioNuggets Works */}
        <section className="why-section">
          <h2>Why BioNuggets Works</h2>
          <div className="why-grid">
            <div className="why-card">
              <span className="why-icon">🎯</span>
              <h3>Bite-Sized Learning</h3>
              <p>Complex concepts broken into digestible nuggets. Perfect for busy students who want to learn without overwhelming themselves.</p>
            </div>
            <div className="why-card">
              <span className="why-icon">🎬</span>
              <h3>Engaging Reels</h3>
              <p>Short, entertaining videos that make biology fun. Science doesn't have to be boring—it's actually fascinating!</p>
            </div>
            <div className="why-card">
              <span className="why-icon">👨‍🏫</span>
              <h3>Expert Team</h3>
              <p>Taught by accomplished biologists and educators with real competition experience and proven teaching methods.</p>
            </div>
            <div className="why-card">
              <span className="why-icon">📱</span>
              <h3>Always Available</h3>
              <p>Access content anytime, anywhere on Instagram. Learn at your own pace, whenever inspiration strikes.</p>
            </div>
            <div className="why-card">
              <span className="why-icon">🔬</span>
              <h3>Scientifically Accurate</h3>
              <p>Every reel is reviewed by scientific experts. We don't compromise on accuracy while keeping it entertaining.</p>
            </div>
            <div className="why-card">
              <span className="why-icon">🤝</span>
              <h3>Community First</h3>
              <p>Built by students, for students. Your feedback shapes our content and helps us improve every day.</p>
            </div>
          </div>
        </section>

        {/* Game Section */}
        <section className="game-section">
          <h2>🎮 Play & Learn</h2>
          <p className="game-subtitle">Control the macrophage and eat bacteria! Use arrow keys or WASD to move.</p>
          <MacrophageGame />
        </section>

        {/* Team Section */}
        <TeamSection />

        {/* About Section */}
        <section id="about">
          <AboutSection />
        </section>

        {/* FAQ Section */}
        <FAQ />

        {/* Contact Section */}
        <ContactSection />

        {/* Articles Section */}
        <section className="articles-section">
          <h2>📚 Articles</h2>
          <p className="articles-subtitle">Coming Soon</p>
          <p className="articles-description">Knowledge is growing. Discovery never stops. Stay tuned for in-depth articles that dive deeper into the science behind our reels.</p>
          <p className="articles-eta">Coming Q3 2026</p>
        </section>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h4>BioNuggets</h4>
            <p>Complex Biology Made Simple</p>
          </div>
          <div className="footer-section">
            <h4>Follow Us</h4>
            <a href="https://instagram.com/bionuggets2009" target="_blank" rel="noopener noreferrer">Instagram</a>
            <a href="tel:+963980162900">Call Us</a>
          </div>
          <div className="footer-section">
            <h4>Quick Links</h4>
            <a href="#about">About</a>
            <a href="#faq">FAQ</a>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2026 BioNuggets. Complex Biology Made Simple. 🧬</p>
          <p className="made-with">Made with Manus</p>
        </div>
      </footer>
    </div>
  )
}

export default App
