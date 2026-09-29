"use client";

import { useEffect, useState } from "react";
import "./home.css";
import ScrollReveal from "./ScrollReveal";
// import Ticker from "./Ticker";
import { extractYouTubeId, youtubeEmbedUrl } from "@/lib/youtube";
import { COUNTRY_DIAL_CODES, countryDialOptionValue } from "@/lib/country-dial-codes";
import { useToast } from "@/components/ui/Toast";

const DEFAULT_COUNTRY_CODE = countryDialOptionValue(COUNTRY_DIAL_CODES[0]);

function StepIcon({ children }) {
  return (
    <div className="step-check" aria-hidden>
      {children}
    </div>
  );
}

function IconMapPin() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s7-7.2 7-12a7 7 0 1 0-14 0c0 4.8 7 12 7 12z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

function IconCreditCard() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <path d="M2 10h20" />
      <path d="M6 15h4" />
    </svg>
  );
}

function IconGear() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v2.5M12 19.5V22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M2 12h2.5M19.5 12H22M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8" />
    </svg>
  );
}

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

function TestimonialCard({ name, type, mediaUrl, onZoom }) {
  const ytId = type === "youtube" ? extractYouTubeId(mediaUrl) : null;
  const imgSrc = type === "youtube" ? null : mediaUrl;

  return (
    <div className="testimonial-card">
      {imgSrc ? (
        <button
          type="button"
          className="media-slot media-slot--shot"
          onClick={() => onZoom({ src: imgSrc, alt: name })}
          aria-label={`View ${name}'s testimonial full size`}
        >
          <img src={imgSrc} alt={name} loading="lazy" />
          <span className="shot-hint">Tap to enlarge</span>
        </button>
      ) : (
        <div className="media-slot">
          {ytId ? (
            <iframe
              src={youtubeEmbedUrl(ytId)}
              title={name}
              allowFullScreen
              style={{ width: "100%", height: "100%", border: 0 }}
            />
          ) : (
            <span className="play-icon"><span>▶</span></span>
          )}
        </div>
      )}
      <div className="name">{name}</div>
    </div>
  );
}

/* Reserved for the commented-out "4 Secrets" homepage section — uncomment with that block.
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
*/

function CtaButton({ onClick, big, children }) {
  return (
    <button className={`btn-gold ${big ? "reveal" : ""}`} onClick={onClick}>
      {children}
    </button>
  );
}

export default function HomePage({ content, testimonials, schedule }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitLabel, setSubmitLabel] = useState("Claim Your Spot");
  const [zoomed, setZoomed] = useState(null);
  const toast = useToast();

  useEffect(() => {
    if (!zoomed) return;
    const onKey = (e) => e.key === "Escape" && setZoomed(null);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [zoomed]);

  const heroWhen = schedule?.labelLong || "Save your free seat";
  const midWhen =
    schedule?.mode === "register" && schedule?.labelShort
      ? `Join Ekene · ${schedule.labelShort}`
      : schedule?.labelLong || "Join Ekene live";

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
      fullName: `${form.firstName.value.trim()} ${form.lastName.value.trim()}`.trim(),
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

      {/* TODO(later): countdown is hardcoded to 8 Jul 2026 in Ticker.jsx — re-enable once it reads the EngageFoyer open-event date. */}
      {/* <Ticker /> */}

      <div className="hero">
        <h1 className="serif reveal">
          <em>Learn</em> how to <em>build a $10K–$20K/month Airbnb business</em> without owning a
          single property or investing your personal money.
        </h1>
        <CtaButton onClick={openModal} big>
          <span className="l1">Save My Free Seat</span>
          <span className="l2">{heroWhen}</span>
        </CtaButton>
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
            <h2 className="serif">
              The Step-by-Step Strategy to Build Real Estate Cash Flow Without Buying Property
            </h2>
            <p>(Here&apos;s A Preview Of What You&apos;ll Learn For FREE)</p>
          </div>
          <div className="steps">
            <div className="step reveal">
              <StepIcon>
                <IconMapPin />
              </StepIcon>
              <h4>How to Locate High-Cash-Flow Deals in Your Area</h4>
            </div>
            <div className="step reveal">
              <StepIcon>
                <IconCreditCard />
              </StepIcon>
              <h4>
                Learn how to secure 0% interest business credit cards to fund these deals without
                using your own money.
              </h4>
            </div>
            <div className="step reveal">
              <StepIcon>
                <IconGear />
              </StepIcon>
              <h4>
                Streamline your Airbnb business using my recommended AI tools to create consistent
                monthly cash flow.
              </h4>
            </div>
          </div>
        </div>
      </div>

      <div className="why-banner reveal">
        <h2 className="serif">Frequently Asked Questions</h2>
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
          <span className="l2">{midWhen}</span>
        </CtaButton>
      </div>

      {/* Second video block — hidden for now; re-enable when a second VSL is ready.
      <VideoBlock
        caption={content.video2Caption}
        type={content.video2Type}
        url={content.video2Url}
        fallbackBg="linear-gradient(160deg,#2a1d24,#0A0A0D)"
      />
      <div className="cta-mid reveal">
        <CtaButton onClick={openModal}>
          <span className="l1">Yes! Claim My Free Seat</span>
          <span className="l2">{midWhen}</span>
        </CtaButton>
      </div>
      */}

      <div className="section">
        <div className="section-head section-head--center reveal">
          <div className="label">Proof by Students</div>
        </div>
        <div className="testimonial-grid reveal">
          {testimonials.map((t) => (
            <TestimonialCard key={t.id} {...t} onZoom={setZoomed} />
          ))}
        </div>
        <div className="section-head section-head--center reveal" style={{ marginTop: 40 }}>
          <h2 className="serif">Will you be Joining?</h2>
        </div>
        <p className="disclaimer">
          <b>Disclaimer:</b> Individual results vary. Results depend on effort, commitment, market
          conditions, and other factors. Testimonials are not a guarantee of future performance.
        </p>
        <div className="cta-mid reveal">
          <CtaButton onClick={openModal}>
            <span className="l1">Yes! Claim My Free Seat</span>
            <span className="l2">{midWhen}</span>
          </CtaButton>
        </div>
      </div>

      {/* "4 Secrets" section — commented out; keep for future homepage use.
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
            <span className="l2">{midWhen}</span>
          </CtaButton>
        </div>
      </div>
      */}

      <div className="footer-strip" style={{ borderTop: "1px solid var(--paper-line)" }}>
        <p style={{ maxWidth: 640, margin: "0 auto", fontSize: 11, lineHeight: 1.6, color: "var(--muted)" }}>
          Note: Tax strategy information is shared for educational purposes only. Always consult a
          qualified CPA or tax advisor regarding your individual situation before taking action.
        </p>
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
              <div className="field-row name-row">
                <input type="text" name="firstName" placeholder="First name" autoComplete="given-name" required />
                <input type="text" name="lastName" placeholder="Last name" autoComplete="family-name" required />
              </div>
              <div className="field-row"><input type="email" name="email" placeholder="Email" required /></div>
              <div className="field-row phone-row">
                <select name="countryCode" defaultValue={DEFAULT_COUNTRY_CODE} aria-label="Country dial code">
                  {COUNTRY_DIAL_CODES.map((country) => {
                    const value = countryDialOptionValue(country);
                    return (
                      <option key={`${country.name}-${country.dial}`} value={value}>
                        {country.flag} {country.dial}
                      </option>
                    );
                  })}
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

      {zoomed && (
        <div
          className="shot-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={zoomed.alt}
          onClick={() => setZoomed(null)}
        >
          <button type="button" className="shot-lightbox-close" aria-label="Close" onClick={() => setZoomed(null)}>
            ×
          </button>
          <img src={zoomed.src} alt={zoomed.alt} onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </>
  );
}
