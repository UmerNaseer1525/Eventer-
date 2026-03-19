import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import style from "./landingPage.module.css";

export default function LandingPage() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const revealRefs = useRef([]);

  // scroll-reveal
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add(style.visible);
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    revealRefs.current.forEach((el) => el && obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const r = (el) => {
    if (el && !revealRefs.current.includes(el)) revealRefs.current.push(el);
  };

  // close mobile menu on outside click
  useEffect(() => {
    const handler = (e) => {
      if (!e.target.closest(`.${style.ham}`) && !e.target.closest(`.${style.mob}`))
        setMenuOpen(false);
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  const scrollTo = (id) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  /* ── DATA ── */
  const features = [
    { icon: "📊", title: "Analytics Dashboard",  desc: "Track revenue, attendees, and growth in real time. Make data-driven decisions with beautiful charts." },
    { icon: "🎟️", title: "Instant Booking",       desc: "One-click booking with secure payment processing. Instant confirmation for every attendee." },
    { icon: "🔔", title: "Smart Notifications",  desc: "Never miss an update. Get notified about confirmations, event changes, and upcoming events." },
    { icon: "👥", title: "Attendee Management",  desc: "Full attendee roster, check-in tools, and contact management — all in one place." },
    { icon: "🏷️", title: "Category System",       desc: "Organize events by music, tech, sports, art and more. Help attendees find what they love." },
    { icon: "📋", title: "Detailed Reports",      desc: "Export reports on payments, bookings, and performance. Full transparency for stakeholders." },
  ];

  const steps = [
    { num: "01", icon: "✍️", title: "Create Your Account", desc: "Sign up in seconds. Choose organizer or attendee — or both. No credit card required." },
    { num: "02", icon: "🎨", title: "Build Your Event",     desc: "Add cover images, set dates, pick a category, and configure ticket prices." },
    { num: "03", icon: "📢", title: "Go Live & Promote",    desc: "Publish and let attendees discover your event through search and category browsing." },
    { num: "04", icon: "💰", title: "Track & Earn",         desc: "Watch bookings roll in, manage attendees, and view your earnings from the dashboard." },
  ];

  const categories = [
    { emoji: "🎵", name: "Music",          count: 34, cls: style.c1 },
    { emoji: "💻", name: "Technology",     count: 22, cls: style.c2 },
    { emoji: "🏅", name: "Sports",         count: 18, cls: style.c3 },
    { emoji: "🎨", name: "Arts & Culture", count: 27, cls: style.c4 },
    { emoji: "🍽️", name: "Food & Drink",   count: 15, cls: style.c5 },
    { emoji: "📚", name: "Education",      count: 19, cls: style.c6 },
    { emoji: "🏕️", name: "Outdoor",        count: 11, cls: style.c7 },
    { emoji: "🤝", name: "Networking",     count: 14, cls: style.c8 },
  ];

  const testimonials = [
    {
      text: "EventX transformed how I run events. The dashboard is intuitive, bookings are seamless, and analytics give me insights I never had before.",
      name: "Sarah Johnson", role: "Event Organizer, NYC",
      initials: "SJ", bg: "linear-gradient(135deg, #1682b4, #0d4f7c)",
    },
    {
      text: "Booked three concerts this month. The process is instant, notifications keep me on track, and I never miss a thing.",
      name: "Marco K.", role: "Regular Attendee",
      initials: "MK", bg: "linear-gradient(135deg, #28a745, #1a6e30)",
    },
    {
      text: "Managing 50+ events used to be a nightmare. With EventX admin tools, I have full visibility and control from one clean screen.",
      name: "Aisha L.", role: "Platform Administrator",
      initials: "AL", bg: "linear-gradient(135deg, #1682b4, #28a745)",
    },
  ];

  const marqueeItems = [
    "Event Management", "Ticket Booking", "Analytics Dashboard",
    "Real-time Notifications", "Secure Payments", "Attendee Management",
    "Category Filtering", "Custom Reports",
  ];

  return (
    <div className={style.wrap}>

      {/* ══ NAV ══ */}
      <nav className={style.nav}>
        <button className={style.logo} onClick={() => navigate("/")}>
          Event<span className={style.logoAccent}>X</span>
          <span className={style.logoDot} />
        </button>

        <ul className={style.navLinks}>
          <li><button onClick={() => scrollTo("lp-features")}>Features</button></li>
          <li><button onClick={() => scrollTo("lp-hiw")}>How it Works</button></li>
          <li><button onClick={() => scrollTo("lp-categories")}>Categories</button></li>
          <li><button onClick={() => scrollTo("lp-reviews")}>Reviews</button></li>
          <li><button onClick={() => navigate("/login")}>Sign In</button></li>
          <li>
            <button className={style.navCta} onClick={() => navigate("/signup")}>
              Get Started
            </button>
          </li>
        </ul>

        <button
          className={`${style.ham}${menuOpen ? ` ${style.open}` : ""}`}
          onClick={(e) => { e.stopPropagation(); setMenuOpen((v) => !v); }}
          aria-label="Toggle menu"
        >
          <span /><span /><span />
        </button>
      </nav>

      {/* mobile menu */}
      <div className={`${style.mob}${menuOpen ? ` ${style.open}` : ""}`}>
        <button onClick={() => scrollTo("lp-features")}>Features</button>
        <button onClick={() => scrollTo("lp-hiw")}>How it Works</button>
        <button onClick={() => scrollTo("lp-categories")}>Categories</button>
        <button onClick={() => scrollTo("lp-reviews")}>Reviews</button>
        <button onClick={() => { setMenuOpen(false); navigate("/login"); }}>Sign In</button>
        <button
          className={style.mobCta}
          onClick={() => { setMenuOpen(false); navigate("/signup"); }}
        >
          Get Started Free →
        </button>
      </div>

      {/* ══ HERO ══ */}
      <section className={style.hero}>
        <div className={style.heroLeft}>
          <div className={style.heroTag}>
            <span className={style.logoDot} />
            125+ events live this month
          </div>

          <h1 className={style.heroTitle}>
            Discover &amp; Book<br />
            <span className={style.heroHighlight}>Unforgettable</span><br />
            Experiences
          </h1>

          <p className={style.heroSub}>
            EventX brings people together. Browse, create and manage events — from
            intimate workshops to large-scale festivals. One platform for every occasion.
          </p>

          <div className={style.heroActions}>
            <button className={style.btnPrimary} onClick={() => navigate("/signup")}>
              Start Exploring ↗
            </button>
            <button className={style.btnOutline} onClick={() => navigate("/login")}>
              Sign In <span className={style.arr}>→</span>
            </button>
          </div>

          <div className={style.heroStats}>
            <div>
              <div className={style.statVal}>1,893</div>
              <div className={style.statLbl}>Active Users</div>
            </div>
            <div>
              <div className={style.statVal}>125+</div>
              <div className={style.statLbl}>Live Events</div>
            </div>
            <div>
              <div className={style.statVal}>$45K</div>
              <div className={style.statLbl}>Revenue Tracked</div>
            </div>
          </div>
        </div>

        <div className={style.heroRight} aria-hidden="true">
          <div className={style.heroGrid} />
          <div className={style.heroGlow} />
          <div className={style.cardStack}>
            <div className={style.eCardBack}>
              <div className={style.eTitle}>Art Basel NYC</div>
            </div>
            <div className={style.eCardMid}>
              <div className={style.eTitle}>Tech Summit 2026</div>
              <div className={style.eMeta}>
                <span>🏙️ San Francisco</span>
                <span className={style.ePrice}>$199</span>
              </div>
            </div>
            <div className={`${style.eCard} ${style.eCardMain}`}>
              <div className={style.eCover}>
                <div className={style.eCoverIn}>🎵</div>
              </div>
              <div className={style.eTag}>Music</div>
              <div className={style.eTitle}>SoundFest 2026</div>
              <div className={style.eMeta}>
                <span>📍 New York City</span>
                <span className={style.ePrice}>$89</span>
              </div>
              <div className={style.eAtt}>
                <div className={style.avStack}>
                  <div className={`${style.av} ${style.av1}`}>AK</div>
                  <div className={`${style.av} ${style.av2}`}>BL</div>
                  <div className={`${style.av} ${style.av3}`}>CM</div>
                </div>
                <span className={style.attTxt}>+248 attending</span>
              </div>
            </div>

            <div className={`${style.badge} ${style.badge1}`}>
              <div className={style.badgeIco} style={{ background: "rgba(22,130,180,0.12)" }}>📅</div>
              <div>
                <div className={style.badgeSub}>Next event in</div>
                <div>2 days, 4 hours</div>
              </div>
            </div>
            <div className={`${style.badge} ${style.badge2}`}>
              <div className={style.badgeIco} style={{ background: "rgba(40,167,69,0.12)" }}>✅</div>
              <div>
                <div className={style.badgeSub}>Just booked</div>
                <div>Tech Summit 2026</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ MARQUEE ══ */}
      <div className={style.marqueeWrap} aria-hidden="true">
        <div className={style.marqueeTrack}>
          {[...marqueeItems, ...marqueeItems].map((item, i) => (
            <div className={style.marqueeItem} key={i}>
              <span className={style.marqueeDot} />
              {item}
            </div>
          ))}
        </div>
      </div>

      {/* ══ FEATURES ══ */}
      <section className={style.section} id="lp-features">
        <div ref={r} className={style.reveal}>
          <span className={style.sectionLabel}>Everything You Need</span>
        </div>
        <h2 ref={r} className={`${style.sectionTitle} ${style.reveal}`}>
          A platform built for<br />creators &amp; attendees
        </h2>
        <div ref={r} className={`${style.featuresGrid} ${style.reveal}`}>
          {features.map((f, i) => (
            <div className={style.featCard} key={i}>
              <div className={style.featIcon}>{f.icon}</div>
              <div className={style.featTitle}>{f.title}</div>
              <div className={style.featDesc}>{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ══ HOW IT WORKS ══ */}
      <section className={style.hiwSection} id="lp-hiw">
        <div className={style.hiwBg} />
        <div ref={r} className={style.reveal}>
          <span className={style.sectionLabel}>Simple Process</span>
        </div>
        <h2 ref={r} className={`${style.sectionTitle} ${style.reveal}`}>
          From idea to sold-out<br />in four steps
        </h2>
        <div className={style.stepsGrid}>
          {steps.map((s, i) => (
            <div ref={r} className={`${style.step} ${style.reveal}`} key={i}>
              <div className={style.stepNum}>{s.num}</div>
              <div className={style.stepIco}>{s.icon}</div>
              <div className={style.stepTitle}>{s.title}</div>
              <div className={style.stepDesc}>{s.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ══ CATEGORIES ══ */}
      <section className={style.section} id="lp-categories">
        <div className={style.catHeader}>
          <div>
            <div ref={r} className={style.reveal}>
              <span className={style.sectionLabel}>Browse by Type</span>
            </div>
            <h2 ref={r} className={`${style.sectionTitle} ${style.reveal}`}>
              Find your kind<br />of event
            </h2>
          </div>
          <button
            ref={r}
            className={`${style.btnGhost} ${style.reveal}`}
            onClick={() => navigate("/login")}
          >
            Browse events <span className={style.arr}>→</span>
          </button>
        </div>

        <div ref={r} className={`${style.catGrid} ${style.reveal}`}>
          {categories.map((c, i) => (
            <button
              key={i}
              className={`${style.catCard} ${c.cls}`}
              onClick={() => navigate("/login")}
            >
              <div className={style.catEmoji}>{c.emoji}</div>
              <div className={style.catName}>{c.name}</div>
              <div className={style.catCount}>{c.count} events</div>
            </button>
          ))}
        </div>
      </section>

      {/* ══ TESTIMONIALS ══ */}
      <section className={style.testiSection} id="lp-reviews">
        <div ref={r} className={style.reveal}>
          <span className={style.sectionLabel}>Real Stories</span>
        </div>
        <h2 ref={r} className={`${style.sectionTitle} ${style.reveal}`}>
          Loved by organizers<br />&amp; attendees alike
        </h2>
        <div className={style.testiGrid}>
          {testimonials.map((t, i) => (
            <div ref={r} className={`${style.testiCard} ${style.reveal}`} key={i}>
              <div className={style.stars}>★★★★★</div>
              <span className={style.quoteIcon}>"</span>
              <p className={style.testiText}>{t.text}</p>
              <div className={style.testiAuthor}>
                <div className={style.testiAv} style={{ background: t.bg }}>
                  {t.initials}
                </div>
                <div>
                  <div className={style.testiName}>{t.name}</div>
                  <div className={style.testiRole}>{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══ CTA / SIGN UP ══ */}
      <section className={style.ctaSection}>
        <div>
          <h2 ref={r} className={`${style.ctaTitle} ${style.reveal}`}>
            Ready to create something <em>extraordinary?</em>
          </h2>
          <p ref={r} className={`${style.ctaSub} ${style.reveal}`}>
            Join thousands of organizers and attendees on the platform built for
            memorable moments. Free to start.
          </p>
        </div>

        <div ref={r} className={`${style.ctaCard} ${style.reveal}`}>
          <div className={style.form}>
            <div className={style.formRow}>
              <div className={style.formGroup}>
                <label className={style.formLabel}>First Name</label>
                <input className={style.formInput} type="text" placeholder="Alex" />
              </div>
              <div className={style.formGroup}>
                <label className={style.formLabel}>Last Name</label>
                <input className={style.formInput} type="text" placeholder="Rivera" />
              </div>
            </div>
            <div className={style.formGroup}>
              <label className={style.formLabel}>Email</label>
              <input className={style.formInput} type="email" placeholder="alex@example.com" />
            </div>
            <div className={style.formGroup}>
              <label className={style.formLabel}>Password</label>
              <input className={style.formInput} type="password" placeholder="Create a strong password" />
            </div>
            <button
              className={`${style.btnPrimary} ${style.btnPrimaryFull}`}
              style={{ marginTop: 4 }}
              onClick={() => navigate("/signup")}
            >
              Create Free Account
            </button>
            <p className={style.formNote}>
              Already have an account?{" "}
              <button onClick={() => navigate("/login")}>Sign in →</button>
            </p>
          </div>
        </div>
      </section>

      {/* ══ FOOTER ══ */}
      <footer className={style.footer}>
        <div className={style.footerGrid}>
          <div>
            <button className={style.logo} onClick={() => navigate("/")}>
              Event<span className={style.logoAccent}>X</span>
              <span className={style.logoDot} />
            </button>
            <p className={style.footerTagline}>
              Where moments become memories. The all-in-one event management
              and booking platform.
            </p>
          </div>

          <div>
            <div className={style.footerColTitle}>Explore</div>
            <ul className={style.footerLinks}>
              <li><button onClick={() => navigate("/login")}>Browse Events</button></li>
              <li><button onClick={() => navigate("/login")}>My Events</button></li>
              <li><button onClick={() => navigate("/login")}>Categories</button></li>
              <li><button onClick={() => navigate("/login")}>My Bookings</button></li>
              <li><button onClick={() => navigate("/login")}>Payments</button></li>
              <li><button onClick={() => navigate("/login")}>Notifications</button></li>
            </ul>
          </div>

          <div>
            <div className={style.footerColTitle}>Account</div>
            <ul className={style.footerLinks}>
              <li><button onClick={() => navigate("/login")}>Sign In</button></li>
              <li><button onClick={() => navigate("/signup")}>Create Account</button></li>
              <li><button onClick={() => navigate("/login")}>Dashboard</button></li>
              <li><button onClick={() => navigate("/login")}>My Profile</button></li>
              <li><button onClick={() => navigate("/login")}>Analytics</button></li>
              <li><button onClick={() => navigate("/login")}>Settings</button></li>
            </ul>
          </div>

          <div>
            <div className={style.footerColTitle}>Admin</div>
            <ul className={style.footerLinks}>
              <li><button onClick={() => navigate("/login")}>Admin Dashboard</button></li>
              <li><button onClick={() => navigate("/login")}>Manage Events</button></li>
              <li><button onClick={() => navigate("/login")}>Manage Users</button></li>
              <li><button onClick={() => navigate("/login")}>Manage Bookings</button></li>
              <li><button onClick={() => navigate("/login")}>Manage Categories</button></li>
              <li><button onClick={() => navigate("/login")}>Reports</button></li>
            </ul>
          </div>
        </div>

        <div className={style.footerBottom}>
          <div className={style.footerCopy}>© 2026 EventX. All rights reserved.</div>
          <div className={style.footerSocials}>
            <button className={style.socialBtn} aria-label="X">𝕏</button>
            <button className={style.socialBtn} aria-label="LinkedIn">in</button>
            <button className={style.socialBtn} aria-label="Instagram">ig</button>
            <button className={style.socialBtn} aria-label="YouTube">▶</button>
          </div>
        </div>
      </footer>

    </div>
  );
}