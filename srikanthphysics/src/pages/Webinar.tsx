import { useState } from "react";
import { submitWebinarLead } from "../services/demoService";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Inter', sans-serif; background: #0d0f1a; color: #e8eaf6; }
  .webinar-page { max-width: 900px; margin: 0 auto; padding: 0 20px 60px; }

  /* HERO */
  .hero {
    background: linear-gradient(135deg, #1a1f3c 0%, #0d1b2a 100%);
    border-bottom: 3px solid #f5a623;
    padding: 56px 40px 0;
    text-align: center;
  }
  .hero-eyebrow {
    display: inline-block;
    background: #f5a623;
    color: #0d0f1a;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    padding: 6px 16px;
    border-radius: 20px;
    margin-bottom: 24px;
  }
  .hero h1 {
    font-size: clamp(26px, 5vw, 42px);
    font-weight: 800;
    line-height: 1.2;
    color: #ffffff;
    margin-bottom: 20px;
    max-width: 700px;
    margin-left: auto;
    margin-right: auto;
  }
  .hero h1 span { color: #f5a623; }
  .hero-sub {
    font-size: 16px;
    color: #b0bec5;
    max-width: 580px;
    margin: 0 auto 32px;
    line-height: 1.7;
  }
  .hero-cta-btn {
    display: inline-block;
    background: #f5a623;
    color: #0d0f1a;
    font-size: 16px;
    font-weight: 800;
    padding: 16px 40px;
    border-radius: 10px;
    text-decoration: none;
    border: none;
    cursor: pointer;
    margin-bottom: 32px;
    transition: transform 0.15s, box-shadow 0.15s;
  }
  .hero-cta-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(245,166,35,0.35);
  }

  /* EVENT STRIP */
  .event-strip {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 12px;
    background: #f5a623;
    padding: 18px 40px;
    margin: 0 -40px;
  }
  .event-badge {
    display: flex;
    align-items: center;
    gap: 8px;
    background: #0d0f1a;
    color: #f5a623;
    font-size: 13px;
    font-weight: 600;
    padding: 8px 16px;
    border-radius: 8px;
  }

  /* SECTIONS */
  .section {
    background: #131729;
    border: 1px solid #1e2547;
    border-radius: 12px;
    padding: 32px 36px;
    margin-top: 20px;
  }
  .section-title {
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: #f5a623;
    margin-bottom: 20px;
  }

  /* WHY ATTEND */
  .reasons { list-style: none; }
  .reasons li {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 10px 0;
    border-bottom: 1px solid #1e2547;
    font-size: 15px;
    line-height: 1.6;
    color: #cfd8dc;
  }
  .reasons li:last-child { border-bottom: none; }
  .reasons li::before {
    content: "✓";
    color: #f5a623;
    font-weight: 700;
    font-size: 14px;
    margin-top: 2px;
    flex-shrink: 0;
  }

  /* WHO ATTENDS */
  .audience-tags { display: flex; flex-wrap: wrap; gap: 10px; }
  .audience-tag {
    background: #1a2040;
    border: 1px solid #2a3560;
    color: #b0bec5;
    font-size: 13px;
    font-weight: 500;
    padding: 8px 16px;
    border-radius: 20px;
  }

  /* AGENDA */
  .agenda { list-style: none; }
  .agenda-item {
    display: grid;
    grid-template-columns: 160px 1fr;
    gap: 16px;
    padding: 14px 0;
    border-bottom: 1px solid #1e2547;
    align-items: center;
  }
  .agenda-item:last-child { border-bottom: none; }
  .agenda-time {
    font-size: 12px;
    font-weight: 700;
    color: #f5a623;
    letter-spacing: 0.5px;
  }
  .agenda-topic { font-size: 14px; color: #cfd8dc; line-height: 1.5; }

  /* REGISTER FORM SECTION */
  .register-section {
    background: linear-gradient(135deg, #1a1f3c 0%, #0d1b2a 100%);
    border: 2px solid #f5a623;
    border-radius: 16px;
    padding: 40px 36px;
    margin-top: 20px;
    scroll-margin-top: 24px;
  }
  .register-section h2 {
    font-size: 22px;
    font-weight: 700;
    color: #ffffff;
    margin-bottom: 6px;
    text-align: center;
  }
  .register-section .reg-sub {
    font-size: 14px;
    color: #b0bec5;
    text-align: center;
    margin-bottom: 28px;
  }

  /* FORM */
  .reg-form { display: flex; flex-direction: column; gap: 16px; }
  .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .form-group { display: flex; flex-direction: column; gap: 6px; }
  .form-group label {
    font-size: 12px;
    font-weight: 600;
    color: #90a4ae;
    letter-spacing: 0.5px;
    text-transform: uppercase;
  }
  .form-group input,
  .form-group select {
    background: #0d0f1a;
    border: 1.5px solid #2a3560;
    border-radius: 8px;
    color: #e8eaf6;
    font-size: 14px;
    padding: 12px 14px;
    outline: none;
    transition: border-color 0.15s;
    font-family: 'Inter', sans-serif;
    width: 100%;
  }
  .form-group input:focus,
  .form-group select:focus { border-color: #f5a623; }
  .form-group select option { background: #131729; color: #e8eaf6; }
  .form-group select.placeholder-style { color: #546e7a; }

  .submit-btn {
    background: #f5a623;
    color: #0d0f1a;
    font-size: 16px;
    font-weight: 800;
    padding: 16px;
    border-radius: 10px;
    border: none;
    cursor: pointer;
    width: 100%;
    margin-top: 8px;
    transition: transform 0.15s, box-shadow 0.15s;
    font-family: 'Inter', sans-serif;
  }
  .submit-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(245,166,35,0.35);
  }
  .submit-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

  .whatsapp-alt {
    text-align: center;
    margin-top: 16px;
    font-size: 13px;
    color: #546e7a;
  }
  .whatsapp-alt a { color: #f5a623; text-decoration: none; font-weight: 600; }

  /* SUCCESS STATE */
  .success-box {
    text-align: center;
    padding: 20px;
  }
  .success-icon { font-size: 48px; margin-bottom: 16px; }
  .success-box h3 { font-size: 20px; font-weight: 700; color: #ffffff; margin-bottom: 8px; }
  .success-box p { font-size: 14px; color: #b0bec5; line-height: 1.6; }
  .success-box a { color: #f5a623; text-decoration: none; }

  /* COURSES STRIP */
  .courses-strip {
    margin-top: 32px;
    text-align: center;
    padding: 16px;
    border: 1px solid #1e2547;
    border-radius: 10px;
    font-size: 12px;
    color: #546e7a;
    letter-spacing: 0.3px;
    line-height: 1.8;
  }
  .courses-strip strong { color: #78909c; }

  /* RESPONSIVE */
  @media (max-width: 600px) {
    .hero { padding: 40px 20px 0; }
    .event-strip { margin: 0 -20px; padding: 14px 20px; }
    .section, .register-section { padding: 24px 20px; }
    .form-row { grid-template-columns: 1fr; }
    .agenda-item { grid-template-columns: 1fr; gap: 4px; }
  }
`;

const agenda = [
  { time: "6:00 – 6:10 PM", topic: "Why many students struggle even after years of coaching" },
  { time: "6:10 – 6:25 PM", topic: "IIT-JEE, NEET and career path clarity" },
  { time: "6:25 – 6:40 PM", topic: "Mistakes parents and students should avoid" },
  { time: "6:40 – 6:55 PM", topic: "Study planning and long-term strategy" },
  { time: "6:55 – 7:00 PM", topic: "Q&A and closing guidance" },
];

const reasons = [
  "Understand why long years of coaching still do not guarantee results",
  "Learn common mistakes students make in IIT-JEE and NEET preparation",
  "Know how to choose the right academic path based on strengths and goals",
  "Get clarity on preparation strategy from school level itself",
  "Interact directly and ask doubts live",
];

const audience = [
  "Parents of students in Classes 8–12",
  "IIT-JEE aspirants",
  "NEET aspirants",
  "Students confused about career direction",
  "Families looking for career counseling",
];

const courseOptions = [
  "IIT-JEE",
  "NEET",
  "Foundation (8th–10th)",
  "CBSE",
  "ICSE",
  "IGCSE",
  "IB",
  "AQA",
  "Advanced Placement",
  "IMAT",
];

const classOptions = ["8th", "9th", "10th", "11th", "12th"];

interface WebinarForm {
  name: string;
  phone: string;
  email: string;
  studentClass: string;
  city: string;
  course: string;
}

export function Webinar() {
  const [form, setForm] = useState<WebinarForm>({
    name: "",
    phone: "",
    email: "",
    studentClass: "",
    city: "",
    course: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const scrollToRegister = () => {
    document.getElementById("register")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.name || !form.phone || !form.email || !form.studentClass) {
      setError("Please fill in all required fields.");
      return;
    }
    setError("");
    setLoading(true);

    const result = await submitWebinarLead(form);
    if (result.success) {
      setSubmitted(true);
    } else {
      setError(result.error ?? "Something went wrong. Please WhatsApp us at +91 94929 37716.");
    }
    setLoading(false);
  };

  return (
    <>
      <style>{styles}</style>
      <div className="webinar-page">
        <div className="hero">
          <div className="hero-eyebrow">Free Live Webinar · 28 June 2026</div>
          <h1>
            Why <span>5 Years of Coaching</span> Still Fails in IIT-JEE &amp; NEET
          </h1>
          <p className="hero-sub">
            A free interactive session for parents and students in Classes 8–12 to
            understand the right strategy, the right path, and the most common mistakes
            in competitive exam preparation.
          </p>
          <button type="button" className="hero-cta-btn" onClick={scrollToRegister}>
            🎯 Reserve Your Free Seat
          </button>

          <div className="event-strip">
            <div className="event-badge">📅 Sunday, 28 June 2026</div>
            <div className="event-badge">🕕 6:00 PM – 7:00 PM IST</div>
            <div className="event-badge">💻 Online Live Webinar</div>
            <div className="event-badge">🎓 Srikanth Sir</div>
            <div className="event-badge">👨‍👩‍👧 Classes 8 to 12</div>
          </div>
        </div>

        <div className="section">
          <div className="section-title">Why Attend</div>
          <ul className="reasons">
            {reasons.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        </div>

        <div className="section">
          <div className="section-title">Who Should Attend</div>
          <div className="audience-tags">
            {audience.map((a, i) => (
              <span className="audience-tag" key={i}>
                {a}
              </span>
            ))}
          </div>
        </div>

        <div className="section">
          <div className="section-title">One-Hour Program Flow</div>
          <ul className="agenda">
            {agenda.map((item, i) => (
              <li className="agenda-item" key={i}>
                <span className="agenda-time">{item.time}</span>
                <span className="agenda-topic">{item.topic}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="register-section" id="register">
          {submitted ? (
            <div className="success-box">
              <div className="success-icon">✅</div>
              <h3>You&apos;re Registered!</h3>
              <p>
                Thank you, {form.name}! Srikanth Sir&apos;s team will reach out to confirm
                your seat.
                <br />
                <br />
                For any queries, WhatsApp us at{" "}
                <a href="https://wa.me/919492937716">+91 94929 37716</a>
              </p>
            </div>
          ) : (
            <>
              <h2>Register for the Free Webinar</h2>
              <p className="reg-sub">Fill in your details below — takes less than a minute</p>

              <div className="reg-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Name *</label>
                    <input
                      type="text"
                      name="name"
                      placeholder="Your full name"
                      value={form.name}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Phone Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="+91 XXXXX XXXXX"
                      value={form.phone}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Email *</label>
                    <input
                      type="email"
                      name="email"
                      placeholder="your@email.com"
                      value={form.email}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Student Class *</label>
                    <select
                      name="studentClass"
                      value={form.studentClass}
                      onChange={handleChange}
                      className={!form.studentClass ? "placeholder-style" : ""}
                    >
                      <option value="">Select class</option>
                      {classOptions.map((c) => (
                        <option key={c} value={c}>
                          {c} Grade
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>City</label>
                    <input
                      type="text"
                      name="city"
                      placeholder="Your city"
                      value={form.city}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Interested Course</label>
                    <select
                      name="course"
                      value={form.course}
                      onChange={handleChange}
                      className={!form.course ? "placeholder-style" : ""}
                    >
                      <option value="">Select course (optional)</option>
                      {courseOptions.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {error && (
                  <p style={{ color: "#ef5350", fontSize: 13, textAlign: "center" }}>
                    {error}
                  </p>
                )}

                <button
                  type="button"
                  className="submit-btn"
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading ? "Registering..." : "🎯 Confirm My Free Seat"}
                </button>

                <div className="whatsapp-alt">
                  Or register via WhatsApp:{" "}
                  <a
                    href="https://wa.me/919492937716?text=Hi%20Srikanth%20Sir%2C%20I%20want%20to%20register%20for%20the%20free%20webinar%20on%2028%20June%202026"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    +91 94929 37716
                  </a>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="courses-strip">
          <strong>From Srikanth&apos;s Academy — Academic &amp; Career Guidance Programs</strong>
          <br />
          Courses Offered: IITJEE · NEET · ICSE · IGCSE · IMAT · AQA · IB · Advanced Placement · CBSE
        </div>
      </div>
    </>
  );
}
