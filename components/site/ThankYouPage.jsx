"use client";

import { useState } from "react";
import "./thankyou.css";
import ScrollReveal from "./ScrollReveal";
import { useToast } from "@/components/ui/Toast";

const FAQ_VIDEOS = [
  { cap: "What if I live in a city that has Airbnb restrictions?", time: "2:46", pct: 8 },
  { cap: "How long will it take me to get my first Airbnb after joining?", time: "2:59", pct: 5 },
  { cap: "What happens if the landlord says no to subletting?", time: "2:14", pct: 5 },
  { cap: "What if I don't think the landlord will say \"Yes\"?", time: "2:39", pct: 5 },
];

const TESTIMONIAL_VIDEOS = [
  { time: "0:37", pct: 10 },
  { time: "1:45", pct: 6 },
  { time: "0:58", pct: 8 },
];

export default function ThankYouPage({ defaultEmail = "" }) {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [calOpen, setCalOpen] = useState(false);
  const toast = useToast();

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    const form = e.target;
    const payload = {
      email: form.email.value,
      creditScore: form.creditScore.value,
      hasCapital: form.capital.value,
      timeline: form.timeline.value,
      strExperience: form.invested.value,
      learningGoal: form.learningGoal.value,
    };
    try {
      const res = await fetch("/api/pre-intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error();
      setSubmitted(true);
    } catch {
      toast.error("Could not save your answers — please try again");
    } finally {
      setSubmitting(false);
    }
  }

  function downloadIcs() {
    const ics = [
      "BEGIN:VCALENDAR", "VERSION:2.0", "BEGIN:VEVENT",
      "DTSTART:20260708T230000Z", "DTEND:20260709T003000Z",
      "SUMMARY:Elite Performers Circle \u2014 Free Live Workshop",
      "DESCRIPTION:Join Ekene for the free live Airbnb rental arbitrage workshop.",
      "END:VEVENT", "END:VCALENDAR",
    ].join("\r\n");
    const blob = new Blob([ics], { type: "text/calendar" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "elite-performers-workshop.ics";
    link.click();
  }

  return (
    <div className="page">
      <ScrollReveal />

      <div className="logo-bar">
        <img
          src="/logo-elite-performers.png"
          alt="Elite Performers Circle LLC"
          className="site-logo"
        />
      </div>

      <div className="hero reveal">
        <h1 className="serif">Welcome!</h1>
        <p><b>Please fill out the pre-intake form below this video...</b></p>
      </div>

      <div className="video-wrap reveal">
        <div className="video-block">
          <div className="sound-btn">🔊</div>
          <div className="play-center">▶</div>
          <div className="timebar">
            <span>1:40</span>
            <div className="track"><span /></div>
            <span>⋯</span>
          </div>
        </div>
      </div>

      <div className="cal-wrap reveal" style={{ position: "relative" }}>
        <button className="cal-btn" onClick={() => setCalOpen((o) => !o)}>
          📅 Add to Calendar <span style={{ fontSize: 11 }}>▾</span>
        </button>
        {calOpen && (
          <div className="cal-menu open">
            <a
              href="https://calendar.google.com/calendar/render?action=TEMPLATE&text=Elite%20Performers%20Circle%20%E2%80%94%20Free%20Live%20Workshop&dates=20260708T230000Z/20260709T003000Z&details=Join%20Ekene%20for%20the%20free%20live%20Airbnb%20rental%20arbitrage%20workshop."
              target="_blank" rel="noopener noreferrer"
            >
              📅 Google Calendar
            </a>
            <a href="#" onClick={(e) => { e.preventDefault(); downloadIcs(); }}>🍎 Apple Calendar</a>
            <a
              href="https://outlook.live.com/calendar/0/action/compose?subject=Elite%20Performers%20Circle%20%E2%80%94%20Free%20Live%20Workshop&startdt=2026-07-08T19:00:00-05:00&enddt=2026-07-08T20:30:00-05:00"
              target="_blank" rel="noopener noreferrer"
            >
              📧 Outlook
            </a>
            <a
              href="https://calendar.yahoo.com/?v=60&title=Elite%20Performers%20Circle%20%E2%80%94%20Free%20Live%20Workshop&st=20260708T230000Z&dur=0130"
              target="_blank" rel="noopener noreferrer"
            >
              📆 Yahoo Calendar
            </a>
          </div>
        )}
      </div>

      <div className="form-card reveal">
        <div className="form-inner">
          {submitted ? (
            <div style={{ textAlign: "center", padding: "10px 0" }}>
              <h3 className="serif">Got it — thank you!</h3>
              <p style={{ fontSize: 13.5, color: "var(--muted-dark)" }}>
                Your answers help Ekene tailor Wednesday&apos;s session to you. See you live.
              </p>
            </div>
          ) : (
            <>
              <h3 className="serif">High Performance Hosts Pre-Webinar Intake</h3>
              <p className="intro">
                Thank you for registering! In order for me to give you the MOST value and free
                resources, please fill out this form!
              </p>

              <form onSubmit={handleSubmit}>
                <div className="f-group">
                  <label className="f-label">Email *</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="The same email you used to sign up"
                    defaultValue={defaultEmail}
                    required
                  />
                </div>

                <div className="f-group">
                  <label className="f-label">What is your credit score?</label>
                  <select name="creditScore" defaultValue="">
                    <option value="">Select one</option>
                    <option>Below 600</option>
                    <option>600 – 699</option>
                    <option>700 – 749</option>
                    <option>750+</option>
                  </select>
                </div>

                <div className="f-group">
                  <label className="f-label">Do you have at least $3k-$10k to invest into this venture? *</label>
                  <div className="radio-row"><input type="radio" name="capital" value="Yes" required /><span>Yes</span></div>
                  <div className="radio-row"><input type="radio" name="capital" value="No, but +700 credit score looking to leverage OPM" /><span>No, but I have +700 credit score looking to leverage OPM</span></div>
                  <div className="radio-row"><input type="radio" name="capital" value="No, below 700 credit score" /><span>No, and I have below 700 credit score</span></div>
                </div>

                <div className="f-group">
                  <label className="f-label">How soon are you looking to get started? *</label>
                  <select name="timeline" required defaultValue="">
                    <option value="">Select one</option>
                    <option>Immediately</option>
                    <option>Within 30 days</option>
                    <option>1 – 3 months</option>
                    <option>3+ months / just exploring</option>
                  </select>
                </div>

                <div className="f-group">
                  <label className="f-label">Have you invested in Airbnb/STR&apos;s before?</label>
                  <div className="radio-row"><input type="radio" name="invested" value="Yes" /><span>Yes</span></div>
                  <div className="radio-row"><input type="radio" name="invested" value="No" /><span>No</span></div>
                  <div className="radio-row"><input type="radio" name="invested" value="No, but I own other real estate investment properties" /><span>No, but I own other real estate investment properties</span></div>
                </div>

                <div className="f-group">
                  <label className="f-label">What are you looking to learn the most from this webinar?</label>
                  <textarea name="learningGoal" placeholder="Tell us a bit about what you're hoping to get out of this..." />
                </div>

                <button type="submit" className="submit-btn" disabled={submitting}>
                  {submitting ? "Submitting..." : "Submit"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>

      <div className="divider"><hr /></div>

      <div className="checklist">
        <h2 className="serif reveal">Pre Class Checklist:</h2>

        <div className="check-item reveal">
          <div className="check-num mono">01</div>
          <div className="check-copy">
            <div className="num-title">Zoom Just Emailed You a Join Link 📩</div>
            <p>Check your inbox now and click &quot;Add to Calendar&quot; so you&apos;re locked in. Your inbox is where I&apos;ll be sending all the details about the event.</p>

            <div className="callout">Press this &quot;I know sender&quot; button in your email you just received from us!</div>

            <div className="mock-email">
              <div className="subj">Unknown sender not added to Calendar yet</div>
              <div className="btns">
                <span className="highlight">I know the sender</span>
                <span>Report spam</span>
              </div>
            </div>
            <p className="arrow-note">↑ Make sure to check your spam or promotions folder if you don&apos;t see my email in your primary inbox.</p>
          </div>
        </div>

        <div className="check-item reveal">
          <div className="check-num mono">02</div>
          <div className="check-copy">
            <div className="num-title">Set a Reminder ⏰</div>
            <p>Add an alarm or phone alert for 10 minutes before the start time so you don&apos;t miss a second.</p>
          </div>
        </div>

        <div className="check-item reveal">
          <div className="check-num mono">03</div>
          <div className="check-copy">
            <div className="num-title">Bring a Notebook 📝</div>
            <p>You&apos;ll want to capture strategies, numbers, and action steps as Ekene breaks them down.</p>
          </div>
        </div>
      </div>

      <div className="faq-section">
        <h2 className="serif reveal">Have Questions? Watch The Videos Below To Get The Answers You Need Directly From Ekene</h2>

        {FAQ_VIDEOS.map((v) => (
          <div className="faq-video" key={v.cap}>
            <div className="play-center">▶</div>
            <div className="cap">{v.cap}</div>
            <div className="timebar">
              <span>{v.time}</span>
              <div className="track"><span style={{ width: `${v.pct}%` }} /></div>
              <span>⋯</span>
            </div>
          </div>
        ))}
      </div>

      <div className="testi-section">
        <h2 className="serif reveal">This is what others are saying about our community...</h2>

        {TESTIMONIAL_VIDEOS.map((v, i) => (
          <div className="testi-video" key={i}>
            <div className="sound-btn">🔊</div>
            <div className="play-center">▶</div>
            <div className="timebar">
              <span>{v.time}</span>
              <div className="track"><span style={{ width: `${v.pct}%` }} /></div>
              <span>⋯</span>
            </div>
          </div>
        ))}
      </div>

      <div className="footer-strip">© 2026 Ekene. All rights reserved.</div>
    </div>
  );
}
