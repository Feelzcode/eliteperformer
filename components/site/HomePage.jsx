"use client";

import { useState } from "react";
import "./home.css";
import ScrollReveal from "./ScrollReveal";
import Ticker from "./Ticker";
import { extractYouTubeId, youtubeEmbedUrl } from "@/lib/youtube";
import { useToast } from "@/components/ui/Toast";

function parsePhone(countryCodeLabel, localNumber) {
  const codeMatch = countryCodeLabel.match(/\+(\d+)/);
  const digits = localNumber.replace(/\D/g, "");
  if (!digits) return undefined;
  return codeMatch ? `+${codeMatch[1]}${digits}` : digits;
}

function VideoBlock({ caption, type, url, fallbackBg }) {
  const ytId = type === "youtube" ? extractYouTubeId(url) : null;
  const isVideoFile = url && /\.(mp4|webm|mov)$/i.test(url);

  return (
    <div className="video-block reveal" style={{ background: !url ? fallbackBg : undefined }}>
      {type === "youtube" && ytId ? (
        <iframe
          src={youtubeEmbedUrl(ytId)}
          title={caption}
          allowFullScreen
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }}
        />
      ) : url ? (
        isVideoFile ? (
          <video
            src={url}
            autoPlay
            muted
            loop
            playsInline
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <img
            src={url}
            alt={caption}
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
          />
        )
      ) : null}
      <div className="enable-sound">🔇 Enable sound</div>
      <div className="video-caption">{caption}</div>
    </div>
  );
}

function TestimonialCard({ name, type, mediaUrl }) {
  const ytId = type === "youtube" ? extractYouTubeId(mediaUrl) : null;
  const imgSrc = type === "youtube" ? null : mediaUrl;

  return (
    <div className="testimonial-card">
      <div className="media-slot">
        {ytId ? (
          <iframe
            src={youtubeEmbedUrl(ytId)}
            title={name}
            allowFullScreen
            style={{ width: "100%", height: "100%", border: 0 }}
          />
        ) : imgSrc ? (
          <img src={imgSrc} alt={name} />
        ) : (
          <span className="play-icon"><span>▶</span></span>
        )}
      </div>
      <div className="stars">★★★★★</div>
      <div className="name">{name}</div>
    </div>
  );
}

const FAQ_ITEMS = [
  {
    q: "Do I need real estate experience?",
    a: "No. Most attendees have never owned or managed a rental before. The workshop starts from zero and focuses on the arbitrage model specifically, not traditional landlording.",
  },
  {
    q: "Is rental arbitrage actually legal?",
    a: "Yes, when it's structured correctly with the landlord's written permission to sublet — which is exactly what we cover in step two of the playbook. We'll also flag the situations where it isn't a fit.",
  },
  {
    q: "How much money do I actually need to start?",
    a: "The model is built around using none of your own capital for the property itself. You'll still want a small operating buffer for furnishing and setup — we cover realistic numbers live.",
  },
  {
    q: "What if I can't attend live?",
    a: "Register anyway — you'll get the replay link automatically, though live attendees get first access to Q&A and any live-only bonuses.",
  },
];

const SECRETS = [
  {
    tag: "Secret #1",
    title: "How To Find The Markets With The Biggest Upside Before Everyone Else Does",
    body: [
      "Most people pick a market based on gut feeling and regret.",
      "I'll reveal the exact data-driven framework I use to identify high-performing markets across the country.",
    ],
  },
  {
    tag: "Secret #2",
    title: "The Financing Blueprint That Doesn't Require Years Of Real Estate Experience",
    body: [
      "You don't need a real estate background to get approved and get started.",
      "I'll show you the exact approach my students use to fund their first property.",
    ],
  },
  {
    tag: "Secret #3",
    title: "The Design & Setup Playbook That Keeps Guests Booking Again And Again",
    body: [
      "Great design isn't about spending more — it's about spending smart.",
      "I'll walk through the exact checklist that keeps calendars full year-round.",
    ],
  },
  {
    tag: "Secret #4",
    title: "How To Reduce Or Eliminate Your Income Taxes Using Short-Term Rentals",
    body: [
      "Most W-2 earners overpay every single year without knowing it.",
      "I'll break down the strategy my students use to keep more of what they earn.",
    ],
  },
];

function CtaButton({ onClick, big, children }) {
  return (
    <button className={`btn-gold ${big ? "reveal" : ""}`} onClick={onClick}>
      {children}
    </button>
  );
}

export default function HomePage({ content, testimonials }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitLabel, setSubmitLabel] = useState("Claim Your Spot");
  const [openFaq, setOpenFaq] = useState(0);
  const toast = useToast();

  function openModal() {
    if (submitting) return;
    setModalOpen(true);
  }
  function closeModal() {
    if (submitting) return;
    setModalOpen(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setSubmitLabel("Submitting…");
    const form = e.target;
    const email = form.email.value.trim();
    const payload = {
      fullName: form.fullName.value.trim(),
      email,
      phone: parsePhone(form.countryCode.value, form.phone.value),
      whatsappConsent: form.consentBox.checked,
    };

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        toast.error(data.error || "Registration failed — please try again");
        setSubmitting(false);
        setSubmitLabel("Claim Your Spot");
        return;
      }

      // Keep modal + button busy until navigation completes so success is visible.
      setSubmitLabel("You're in — redirecting…");
      window.location.assign(`/thank-you?email=${encodeURIComponent(email)}`);
    } catch {
      toast.error("Could not reach the server — check your connection");
      setSubmitting(false);
      setSubmitLabel("Claim Your Spot");
    }
  }

  return (
    <>
      <ScrollReveal />

      <div className="logo-bar">
        <img
          src="/logo-elite-performers.png"
          alt="Elite Performers Circle LLC"
          className="site-logo"
        />
      </div>

      <Ticker />

      <div className="hero">
        <div className="eyebrow">Free Live Workshop · Wed, July 8 · 7PM EST</div>
        <h1 className="serif reveal">
          <em>Learn</em> how to <em>build a $10K–$20K/month Airbnb business</em> without owning a
          single property or investing your personal money.
        </h1>
        <p className="hero-sub reveal">
          A 2 hour live webinar on How I Built a 6-Figure Airbnb Business Without Owning Property or
          Using My Own Money.
        </p>
        <CtaButton onClick={openModal} big>
          <span className="l1">Save My Free Seat</span>
          <span className="l2">Wednesday, July 8th · 7:00 PM EST</span>
        </CtaButton>
        <p className="social-line reveal">
          Limited to 300 live seats — <b>214</b> already reserved
        </p>
      </div>

      <div className="section">
        <div className="host reveal">
          <div className="host-photo">
            {content.profilePhoto ? (
              <img src={content.profilePhoto} alt="Ekene" />
            ) : (
              "Photo"
            )}
          </div>
          <div className="host-copy">
            <div className="label">Your host</div>
            <h3 className="serif">Ekene</h3>
            <p>
              I came to the U.S. as an international student with big dreams and limited resources.
              After college, I worked in medical transportation while driving Uber and Lyft to make
              ends meet. I discovered Airbnb rental arbitrage, built a 6-figure portfolio without
              owning real estate or using my own capital, and now I&apos;m scaling toward 7 figures
              while helping others do the same.
            </p>
          </div>
        </div>
      </div>

      <div className="section section-dark">
        <div className="wrap">
          <div className="section-head reveal">
            <div className="label">The Playbook</div>
            <h2 className="serif">Three moves, in order</h2>
            <p>Skip any one of these and the model breaks. Here&apos;s the sequence, previewed free.</p>
          </div>
          <div className="steps">
            <div className="step reveal">
              <div className="num mono">01</div>
              <h4>Find the deal</h4>
              <p>How to identify high-margin arbitrage units in your area before anyone else does — even in a &quot;saturated&quot; market.</p>
            </div>
            <div className="step reveal">
              <div className="num mono">02</div>
              <h4>Secure the unit</h4>
              <p>Structure a 0%-interest agreement with the landlord so you control the property using none of your own money.</p>
            </div>
            <div className="step reveal">
              <div className="num mono">03</div>
              <h4>Automate the income</h4>
              <p>Set up systems so the unit runs itself and the rental income lands passively, month after month.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="why-banner reveal">
        <h2 className="serif">Here&apos;s Why This Workshop Matters In 2026</h2>
        <div className="sound-cta">🔊 Click Turn Sound On</div>
      </div>

      <VideoBlock
        caption={content.video1Caption}
        type={content.video1Type}
        url={content.video1Url}
        fallbackBg="linear-gradient(160deg,#242028,#0A0A0D)"
      />
      <div className="cta-mid reveal">
        <CtaButton onClick={openModal}>
          <span className="l1">Yes! Claim My Free Seat</span>
          <span className="l2">Join Ekene This Wednesday At 7 PM EST</span>
        </CtaButton>
      </div>

      <VideoBlock
        caption={content.video2Caption}
        type={content.video2Type}
        url={content.video2Url}
        fallbackBg="linear-gradient(160deg,#2a1d24,#0A0A0D)"
      />
      <div className="cta-mid reveal">
        <CtaButton onClick={openModal}>
          <span className="l1">Yes! Claim My Free Seat</span>
          <span className="l2">Join Ekene This Wednesday At 7 PM EST</span>
        </CtaButton>
      </div>

      <div className="press">
        <p className="reveal">As Seen On...</p>
        <div className="press-logos reveal">
          <span>Forbes</span>
          <span>BiggerPockets</span>
          <span>Business Insider</span>
          <span>Rental Scale-Up</span>
          <span>Skift</span>
        </div>
      </div>

      <div className="section">
        <div className="section-head section-head--center reveal">
          <div className="label">Proof</div>
          <h2 className="serif">Results from people who attended</h2>
        </div>
        <div className="testimonial-grid reveal">
          {testimonials.map((t) => (
            <TestimonialCard key={t.id} {...t} />
          ))}
        </div>
        <p className="disclaimer">
          <b>Disclaimer:</b> Individual results vary. Results depend on effort, commitment, market
          conditions, and other factors. Testimonials are not a guarantee of future performance.
        </p>
        <div className="cta-mid reveal">
          <CtaButton onClick={openModal}>
            <span className="l1">Yes! Claim My Free Seat</span>
            <span className="l2">Join Ekene This Wednesday At 7 PM EST</span>
          </CtaButton>
        </div>
      </div>

      <div className="secrets">
        <div className="section-head reveal">
          <div className="label">Revealed Live On This Free Workshop</div>
          <h2 className="serif">
            The 4 Secrets That Turn Years Of Wondering <em>&quot;What If&quot;</em> Into Your First
            Cash-Flowing Airbnb In 2026
          </h2>
        </div>

        {SECRETS.map((s) => (
          <div className="secret-card reveal" key={s.tag}>
            <span className="secret-tag">{s.tag}</span>
            <h3>{s.title}</h3>
            {s.body.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        ))}

        <div className="cta-mid reveal">
          <CtaButton onClick={openModal}>
            <span className="l1">Yes! Claim My Free Seat</span>
            <span className="l2">Join Ekene This Wednesday At 7 PM EST</span>
          </CtaButton>
        </div>
      </div>

      <div className="section section-dark">
        <div className="section-head section-head--center reveal">
          <div className="label">Before You Ask</div>
          <h2 className="serif">Common questions</h2>
        </div>
        <div className="faq reveal">
          {FAQ_ITEMS.map((item, i) => (
            <div className={`faq-item ${openFaq === i ? "open" : ""}`} key={item.q}>
              <button className="faq-q" onClick={() => setOpenFaq(openFaq === i ? -1 : i)}>
                {item.q} <span className="plus">+</span>
              </button>
              <div className="faq-a">
                <p>{item.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="closing">
        <h2 className="serif reveal">Will you be joining them?</h2>
        <CtaButton onClick={openModal} big>
          <span className="l1">Save My Free Seat</span>
          <span className="l2">Wednesday, July 8th · 7:00 PM EST</span>
        </CtaButton>
      </div>

      <div className="footer-strip" style={{ borderTop: "1px solid var(--paper-line)" }}>
        <p style={{ maxWidth: 640, margin: "0 auto 14px", fontSize: 11, lineHeight: 1.6, color: "var(--muted)" }}>
          Note: Tax strategy information is shared for educational purposes only. Always consult a
          qualified CPA or tax advisor regarding your individual situation before taking action.
        </p>
        © 2026 Ekene. All rights reserved.
      </div>

      <div className="sticky-cta">
        <span>214 seats reserved</span>
        <button onClick={openModal}>Save My Seat</button>
      </div>

      <div className={`overlay ${modalOpen ? "show" : ""}`} onClick={(e) => e.target === e.currentTarget && closeModal()}>
        <div className="modal">
          <button className="modal-close" onClick={closeModal} aria-label="Close">✕</button>

          <div>
            <h3 className="serif">Register Your Spot</h3>
            <p className="sub3">Takes less than 20 seconds.</p>
            <hr />
            <form onSubmit={handleSubmit}>
              <div className="field-row"><input type="text" name="fullName" placeholder="Full name" required /></div>
              <div className="field-row"><input type="email" name="email" placeholder="Email" required /></div>
              <div className="field-row phone-row">
                <select name="countryCode">
                  <option>🇳🇬 +234</option>
                  <option>🇺🇸 +1</option>
                  <option>🇬🇧 +44</option>
                  <option>🇨🇦 +1</option>
                </select>
                <input type="tel" name="phone" placeholder="Phone number" required />
              </div>
              <div className="consent">
                <input type="checkbox" id="consentBox" required />
                <label htmlFor="consentBox">
                  By checking this box, I consent to receive transactional messages related to my
                  account, orders, or services I have requested. These messages may include appointment
                  reminders, order confirmations, and account notifications among others. Message &amp;
                  data rates may apply. Reply HELP for help or STOP to opt-out.
                </label>
              </div>
              <button type="submit" className="claim-btn" disabled={submitting}>
                {submitLabel}
              </button>
            </form>
            <p className="legal-links"><a href="#">Privacy Policy</a> · <a href="#">Terms of Service</a></p>
          </div>
        </div>
      </div>
    </>
  );
}
