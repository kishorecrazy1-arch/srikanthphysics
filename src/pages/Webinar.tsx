import { useState } from "react";
import {
  buildAdminNotificationHtml,
  buildAdminNotificationText,
  buildRegistrationDisplayFields,
} from "../lib/registrationPayload";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Inter', sans-serif; background: #0d0f1a; color: #e8eaf6; }
  .webinar-page { max-width: 960px; margin: 0 auto; padding: 0 20px 60px; }

  /* TAB SWITCHER */
  .tab-bar {
    display: flex;
    gap: 0;
    margin: 32px 0 0;
    border-radius: 12px 12px 0 0;
    overflow: hidden;
    border: 1.5px solid #1e2547;
    border-bottom: none;
  }
  .tab-btn {
    flex: 1;
    min-width: 0;
    padding: 16px 14px;
    background: #131729;
    border: none;
    color: #78909c;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    font-family: 'Inter', sans-serif;
    transition: all 0.2s;
    border-bottom: 3px solid transparent;
    text-align: center;
    line-height: 1.35;
  }
  .tab-btn:not(:last-child) { border-right: 1.5px solid #1e2547; }
  .tab-btn.active {
    background: #1a1f3c;
    color: #ffffff;
    border-bottom: 3px solid #f5a623;
  }
  .tab-btn .tab-label { display: block; font-size: 10px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 4px; }
  .tab-btn.active .tab-label { color: #f5a623; }
  .tab-btn .tab-title { display: block; }

  /* HERO */
  .hero {
    background: linear-gradient(135deg, #1a1f3c 0%, #0d1b2a 100%);
    border: 1.5px solid #1e2547;
    border-top: none;
    border-bottom: 3px solid #f5a623;
    padding: 48px 40px 0;
    text-align: center;
  }
  .hero-eyebrow {
    display: inline-block;
    background: #f5a623;
    color: #0d0f1a;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    padding: 5px 14px;
    border-radius: 20px;
    margin-bottom: 20px;
  }
  .hero h1 {
    font-size: clamp(24px, 4.5vw, 40px);
    font-weight: 800;
    line-height: 1.2;
    color: #ffffff;
    margin-bottom: 16px;
    max-width: 680px;
    margin-left: auto;
    margin-right: auto;
  }
  .hero h1 span { color: #f5a623; }
  .hero-sub {
    font-size: 15px;
    color: #b0bec5;
    max-width: 560px;
    margin: 0 auto 16px;
    line-height: 1.7;
  }
  .hero-desc {
    font-size: 14px;
    color: #78909c;
    max-width: 620px;
    margin: 0 auto 28px;
    line-height: 1.7;
  }
  .hero-cta-btn {
    display: inline-block;
    background: #f5a623;
    color: #0d0f1a;
    font-size: 15px;
    font-weight: 800;
    padding: 14px 36px;
    border-radius: 10px;
    border: none;
    cursor: pointer;
    margin-bottom: 28px;
    transition: transform 0.15s, box-shadow 0.15s;
    font-family: 'Inter', sans-serif;
  }
  .hero-cta-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(245,166,35,0.35); }

  /* EVENT STRIP */
  .event-strip {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 10px;
    background: #f5a623;
    padding: 16px 40px;
    margin: 0 -40px;
  }
  .event-badge {
    display: flex;
    align-items: center;
    gap: 7px;
    background: #0d0f1a;
    color: #f5a623;
    font-size: 12px;
    font-weight: 600;
    padding: 7px 14px;
    border-radius: 8px;
  }

  /* SECTIONS */
  .section {
    background: #131729;
    border: 1px solid #1e2547;
    border-radius: 12px;
    padding: 28px 32px;
    margin-top: 16px;
  }
  .section-title {
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: #f5a623;
    margin-bottom: 18px;
  }

  /* REASONS */
  .reasons { list-style: none; }
  .reasons li {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    padding: 9px 0;
    border-bottom: 1px solid #1e2547;
    font-size: 14px;
    line-height: 1.6;
    color: #cfd8dc;
  }
  .reasons li:last-child { border-bottom: none; }
  .reasons li::before { content: "✓"; color: #f5a623; font-weight: 700; font-size: 13px; margin-top: 2px; flex-shrink: 0; }

  /* AUDIENCE TAGS */
  .audience-tags { display: flex; flex-wrap: wrap; gap: 8px; }
  .audience-tag {
    background: #1a2040;
    border: 1px solid #2a3560;
    color: #b0bec5;
    font-size: 13px;
    font-weight: 500;
    padding: 7px 14px;
    border-radius: 20px;
  }

  /* AGENDA */
  .agenda { list-style: none; }
  .agenda-item {
    display: grid;
    grid-template-columns: 150px 1fr;
    gap: 14px;
    padding: 12px 0;
    border-bottom: 1px solid #1e2547;
    align-items: start;
  }
  .agenda-item:last-child { border-bottom: none; }
  .agenda-time { font-size: 11px; font-weight: 700; color: #f5a623; letter-spacing: 0.5px; padding-top: 2px; }
  .agenda-topic { display: block; font-size: 14px; color: #cfd8dc; line-height: 1.5; }
  .week-title { display: block; font-size: 14px; font-weight: 700; color: #cfd8dc; line-height: 1.5; }
  .week-description { display: block; font-size: 12px; color: #546e7a; line-height: 1.5; margin-top: 5px; }

  /* KEY TAKEAWAYS */
  .takeaways { display: flex; flex-wrap: wrap; gap: 10px; }
  .takeaway-tag {
    background: #0d2a1a;
    border: 1px solid #1b5e20;
    color: #81c784;
    font-size: 13px;
    font-weight: 500;
    padding: 8px 14px;
    border-radius: 8px;
  }

  /* REGISTER FORM */
  .register-section {
    background: linear-gradient(135deg, #1a1f3c 0%, #0d1b2a 100%);
    border: 2px solid #f5a623;
    border-radius: 16px;
    padding: 36px 32px;
    margin-top: 16px;
    scroll-margin-top: 24px;
  }
  .register-section h2 { font-size: 20px; font-weight: 700; color: #ffffff; margin-bottom: 6px; text-align: center; }
  .reg-sub { font-size: 13px; color: #b0bec5; text-align: center; margin-bottom: 24px; }
  .reg-form { display: flex; flex-direction: column; gap: 14px; }
  .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
  .form-group-full { grid-column: 1 / -1; }
  .form-group { display: flex; flex-direction: column; gap: 5px; }
  .form-group label { font-size: 11px; font-weight: 600; color: #90a4ae; letter-spacing: 0.5px; text-transform: uppercase; }
  .form-group input, .form-group select {
    background: #0d0f1a;
    border: 1.5px solid #2a3560;
    border-radius: 8px;
    color: #e8eaf6;
    font-size: 14px;
    padding: 11px 13px;
    outline: none;
    transition: border-color 0.15s;
    font-family: 'Inter', sans-serif;
    width: 100%;
  }
  .form-group input:focus, .form-group select:focus { border-color: #f5a623; }
  .form-group select option { background: #131729; color: #e8eaf6; }
  .placeholder-style { color: #546e7a; }
  .submit-btn {
    background: #f5a623;
    color: #0d0f1a;
    font-size: 15px;
    font-weight: 800;
    padding: 15px;
    border-radius: 10px;
    border: none;
    cursor: pointer;
    width: 100%;
    margin-top: 6px;
    transition: transform 0.15s, box-shadow 0.15s;
    font-family: 'Inter', sans-serif;
  }
  .submit-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(245,166,35,0.35); }
  .submit-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
  .whatsapp-alt { text-align: center; margin-top: 14px; font-size: 13px; color: #546e7a; }
  .whatsapp-alt a { color: #f5a623; text-decoration: none; font-weight: 600; }
  .error-msg { color: #ef5350; font-size: 13px; text-align: center; }

  /* SUCCESS */
  .success-box { text-align: center; padding: 20px; }
  .success-icon { font-size: 44px; margin-bottom: 14px; }
  .success-box h3 { font-size: 20px; font-weight: 700; color: #ffffff; margin-bottom: 8px; }
  .success-box p { font-size: 14px; color: #b0bec5; line-height: 1.6; }
  .success-box a { color: #f5a623; text-decoration: none; }

  /* COURSES STRIP */
  .courses-strip {
    margin-top: 28px;
    text-align: center;
    padding: 14px;
    border: 1px solid #1e2547;
    border-radius: 10px;
    font-size: 12px;
    color: #546e7a;
    line-height: 1.8;
  }
  .courses-strip strong { color: #78909c; }

  .callout-note {
    background: #1a2040;
    border-left: 3px solid #f5a623;
    padding: 14px 18px;
    font-size: 13px;
    color: #90a4ae;
    font-style: italic;
    line-height: 1.6;
    border-radius: 0 8px 8px 0;
  }

  @media (max-width: 600px) {
    .hero { padding: 32px 20px 0; }
    .event-strip { margin: 0 -20px; padding: 12px 20px; }
    .section, .register-section { padding: 20px 16px; }
    .form-row { grid-template-columns: 1fr; }
    .agenda-item { grid-template-columns: 1fr; gap: 3px; }
    .tab-btn { font-size: 11px; padding: 12px 8px; }
    .tab-btn .tab-label { font-size: 9px; letter-spacing: 0.6px; }
  }
`;

interface WebinarBadge {
  icon: string;
  text: string;
}

interface AgendaItem {
  time: string;
  topic: string;
  sub?: string;
}

interface WebinarData {
  eyebrow: string;
  heading: React.ReactNode;
  subheading: string;
  description?: string;
  event: string;
  badges: WebinarBadge[];
  whyAttend: string[] | null;
  audience: string[];
  agenda: AgendaItem[];
  agendaTitle?: string;
  takeaways: string[] | null;
  takeawaysTitle?: string;
  note?: string;
  showClassDropdown: boolean;
  academicLevelOptions: { value: string; label: string }[];
  courseOptions: string[];
  regSub?: string;
}

interface WebinarForm {
  name: string;
  phone: string;
  email: string;
  institution: string;
  academicLevel: string;
  city: string;
  country: string;
  course: string;
}

const webinar0: WebinarData = {
  eyebrow: "LIVE 8-WEEK PROGRAM · STARTS SUNDAY, 5 JULY 2026",
  heading: (
    <>
      8-Week <span>Quantum Circuits &amp; Computing</span> Foundation Program
    </>
  ),
  subheading:
    "A slow, structured live program that builds real understanding of quantum physics and quantum circuits — from qubits to QML — one hour every Sunday.",
  description:
    "This is a slow, structured 8-week webinar series (1 hour per week) that starts from zero and builds a strong foundation in quantum physics ideas (qubits, superposition, interference) and quantum circuits (gates, diagrams, basic algorithms).",
  event: "Quantum Circuits Foundation Program - Weekly Sunday",
  badges: [
    { icon: "📅", text: "Every Sunday" },
    { icon: "⏰", text: "11:00 AM – 12:00 PM IST" },
    { icon: "💻", text: "Online Live Program" },
    { icon: "👨‍🏫", text: "Srikanth Sir" },
    { icon: "🎓", text: "8 Weeks" },
  ],
  whyAttend: null,
  audience: [
    "B.Tech students (AI & ML, CSE, Data Science, IT, ECE, EEE, Mechanical, Civil, Mechatronics)",
    "M.Tech / MSc students in engineering and applied physics",
    "Software professionals, data scientists, quant engineers",
    "Corporate tech teams",
  ],
  agendaTitle: "Week-by-Week Agenda",
  agenda: [
    {
      time: "Week 1",
      topic: "Quantum states & qubits",
      sub: "Classical bits vs qubits, |0⟩ and |1⟩ notation, superposition, Bloch-sphere intuition, measurement (probabilities and collapse).",
    },
    {
      time: "Week 2",
      topic: "Single-qubit gates",
      sub: "H, X, Z, Rz gates; how they transform qubit states and move the Bloch-sphere arrow; simple circuits with measurement outcomes explained.",
    },
    {
      time: "Week 3",
      topic: "Superposition, phase & interference",
      sub: "How superposition and phase create constructive and destructive interference; intuitive examples of gates changing probabilities.",
    },
    {
      time: "Week 4",
      topic: "Two-qubit gates & entanglement",
      sub: "CNOT and controlled gates; building and reading 2-qubit circuits; Bell states and basic entanglement.",
    },
    {
      time: "Week 5",
      topic: "Quantum circuit flow & mini-algorithms",
      sub: "Initialise → gates → measurement as standard circuit flow; small example circuits showing step-by-step quantum logic.",
    },
    {
      time: "Week 6–8",
      topic: "Circuits to applications & QML bridge",
      sub: "How circuits become building blocks for optimisation, simulation, and quantum machine learning; conceptual examples in logistics, finance, and AI/ML feature maps.",
    },
  ],
  takeawaysTitle: "By the End of 8 Weeks",
  takeaways: [
    "Read and draw quantum circuit diagrams with single and two-qubit gates",
    "Explain qubits, superposition, interference, entanglement and measurement in plain language",
    "Understand how quantum circuits turn into algorithms and QML models",
  ],
  note:
    "No prior quantum background required. Basic familiarity with linear algebra and complex numbers is helpful but not mandatory.",
  showClassDropdown: true,
  academicLevelOptions: [
    { value: "8", label: "8th" },
    { value: "9", label: "9th" },
    { value: "10", label: "10th" },
    { value: "11", label: "11th" },
    { value: "12", label: "12th" },
    { value: "btech-1", label: "B.Tech 1" },
    { value: "btech-2", label: "B.Tech 2" },
    { value: "btech-3", label: "B.Tech 3" },
    { value: "btech-4", label: "B.Tech 4" },
    { value: "other", label: "Other" },
  ],
  courseOptions: [
    "Quantum Computing",
    "Physics",
    "Computer Science",
    "Data Science",
    "AI & ML",
    "Other",
  ],
  regSub: "One-time signup — you'll receive weekly session reminders every Sunday.",
};

const webinar1: WebinarData = {
  eyebrow: "Free Live Webinar · 28 June 2026 · 6:00 PM",
  heading: (
    <>
      Why <span>5 Years of Coaching</span> Still Fails in IIT-JEE &amp; NEET
    </>
  ),
  subheading:
    "A free interactive session for parents and students in Classes 8–12 to understand the right strategy, the right path, and the most common mistakes in competitive exam preparation.",
  event: "Free Webinar - IIT-JEE & NEET - 28 June 2026",
  badges: [
    { icon: "📅", text: "Sunday, 28 June 2026" },
    { icon: "🕕", text: "6:00 PM – 7:00 PM IST" },
    { icon: "💻", text: "Online Live Webinar" },
    { icon: "🎓", text: "Srikanth Sir" },
    { icon: "👨‍👩‍👧", text: "Classes 8 to 12" },
  ],
  whyAttend: [
    "Understand why long years of coaching still do not guarantee results",
    "Learn common mistakes students make in IIT-JEE and NEET preparation",
    "Know how to choose the right academic path based on strengths and goals",
    "Get clarity on preparation strategy from school level itself",
    "Interact directly and ask doubts live",
  ],
  audience: [
    "Parents of students in Classes 8–12",
    "IIT-JEE aspirants",
    "NEET aspirants",
    "Students confused about career direction",
    "Families looking for career counseling",
  ],
  agenda: [
    { time: "6:00 – 6:10 PM", topic: "Why many students struggle even after years of coaching" },
    { time: "6:10 – 6:25 PM", topic: "IIT-JEE, NEET and career path clarity" },
    { time: "6:25 – 6:40 PM", topic: "Mistakes parents and students should avoid" },
    { time: "6:40 – 6:55 PM", topic: "Study planning and long-term strategy" },
    { time: "6:55 – 7:00 PM", topic: "Q&A and closing guidance" },
  ],
  takeaways: null,
  showClassDropdown: true,
  academicLevelOptions: [
    { value: "8", label: "8th" },
    { value: "9", label: "9th" },
    { value: "10", label: "10th" },
    { value: "11", label: "11th" },
    { value: "12", label: "12th" },
  ],
  courseOptions: [
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
  ],
};

const webinar2: WebinarData = {
  eyebrow: "Free Live Webinar · 28 June 2026 · 11:00 AM",
  heading: (
    <>
      How <span>Superposition + Interference</span> Build Quantum Algorithms
    </>
  ),
  subheading:
    "Quantum Computing is one of the most exciting technologies shaping the future of computing. Very few truly understand the physics behind quantum algorithms. This session gives you that clarity.",
  event: "Free Webinar - Quantum Computing - 28 June 2026",
  badges: [
    { icon: "📅", text: "Sunday, 28 June 2026" },
    { icon: "🕙", text: "11:00 AM – 12:00 PM IST" },
    { icon: "💻", text: "Online Live Webinar" },
    { icon: "🎓", text: "Srikanth Sir" },
    { icon: "⏱", text: "60 Minutes" },
  ],
  whyAttend: [
    "Understand the two most fundamental principles behind Quantum Computing",
    "Learn how Superposition gives quantum computers their power",
    "Understand how Interference helps quantum algorithms find correct answers",
    "Build conceptual clarity on how quantum algorithms actually work",
    "Get career guidance and learning roadmap in Quantum Computing",
  ],
  audience: [
    "B.Tech Students (CSE / ECE / EEE / IT / Data Science)",
    "Engineering Graduates",
    "Working Professionals",
    "Quantum Computing Enthusiasts",
    "Anyone interested in next-generation computing",
  ],
  agenda: [
    {
      time: "0 – 10 mins",
      topic: "Introduction to Quantum Computing",
      sub: "Why it matters · Classical vs Quantum · Real-world applications",
    },
    {
      time: "10 – 25 mins",
      topic: "Understanding Superposition",
      sub: "Classical Bits vs Qubits · Mathematical intuition · Computational advantage",
    },
    {
      time: "25 – 40 mins",
      topic: "Understanding Interference",
      sub: "Constructive & Destructive Interference · Probability amplitudes · Identifying correct solutions",
    },
    {
      time: "40 – 55 mins",
      topic: "How Quantum Algorithms Work",
      sub: "Superposition + Interference combined · Grover's Algorithm conceptual walkthrough",
    },
    {
      time: "55 – 60 mins",
      topic: "Live Q&A + Career Guidance",
      sub: "Career opportunities · Learning roadmap for beginners",
    },
  ],
  takeaways: [
    "Strong foundation in Quantum Computing",
    "Clear understanding of Superposition",
    "Clear understanding of Interference",
    "Physics intuition behind Quantum Algorithms",
    "Career guidance in Quantum Computing",
  ],
  showClassDropdown: true,
  academicLevelOptions: [
    { value: "8", label: "8th" },
    { value: "9", label: "9th" },
    { value: "10", label: "10th" },
    { value: "11", label: "11th" },
    { value: "12", label: "12th" },
    { value: "btech-1", label: "B.Tech 1" },
    { value: "btech-2", label: "B.Tech 2" },
    { value: "btech-3", label: "B.Tech 3" },
    { value: "btech-4", label: "B.Tech 4" },
    { value: "other", label: "Other" },
  ],
  courseOptions: ["Quantum Computing", "Physics", "Computer Science", "Data Science", "Other"],
};

const WEBHOOK_URL = "https://manasapadavala.app.n8n.cloud/webhook/demo-booking";

function WebinarSection({ data }: { data: WebinarData }) {
  const [form, setForm] = useState<WebinarForm>({
    name: "",
    phone: "",
    email: "",
    institution: "",
    academicLevel: "",
    city: "",
    country: "",
    course: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const scrollToRegister = () => {
    document.getElementById(`register-${data.event}`)?.scrollIntoView({ behavior: "smooth" });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.name || !form.phone || !form.email) {
      setError("Please fill in Name, Phone and Email.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const timestamp = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
      const course = form.course.trim() || "General Interest";
      const display = buildRegistrationDisplayFields({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        course,
        grade: form.academicLevel,
        institution: form.institution.trim(),
        city: form.city.trim(),
        country: form.country.trim(),
        timestamp,
        referrer: "webinar-page",
        board: data.event,
        event: data.event,
      });

      await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: display.name,
          email: display.email,
          phone: display.phone,
          course: display.course,
          courses: display.course,
          batch: display.course,
          grade: display.grade,
          academicLevel: display.academicLevel,
          institution: display.institution,
          institutionAcademy: display.institutionAcademy,
          academy: display.institutionAcademy,
          college: display.institutionAcademy,
          collegeName: display.institutionAcademy,
          city: display.city,
          country: display.country,
          location: display.location,
          timestamp: display.timestamp,
          adminNotificationHtml: buildAdminNotificationHtml(display),
          adminNotificationText: buildAdminNotificationText(display),
          event: data.event,
          source: "webinar-page",
          referrer: "webinar-page",
        }),
      });
      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please WhatsApp us at +91 94929 37716.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="hero">
        <div className="hero-eyebrow">{data.eyebrow}</div>
        <h1>{data.heading}</h1>
        <p className="hero-sub">{data.subheading}</p>
        {data.description && <p className="hero-desc">{data.description}</p>}
        <button type="button" className="hero-cta-btn" onClick={scrollToRegister}>
          🎯 Reserve Your Free Seat
        </button>
        <div className="event-strip">
          {data.badges.map((b, i) => (
            <div className="event-badge" key={i}>
              {b.icon} {b.text}
            </div>
          ))}
        </div>
      </div>

      {data.whyAttend && data.whyAttend.length > 0 && (
        <div className="section">
          <div className="section-title">Why Attend</div>
          <ul className="reasons">
            {data.whyAttend.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="section">
        <div className="section-title">Who Should Attend</div>
        <div className="audience-tags">
          {data.audience.map((a, i) => (
            <span className="audience-tag" key={i}>
              {a}
            </span>
          ))}
        </div>
      </div>

      <div className="section">
        <div className="section-title">{data.agendaTitle ?? "Program Flow"}</div>
        <ul className="agenda">
          {data.agenda.map((item, i) => (
            <li className="agenda-item" key={i}>
              <span className="agenda-time">{item.time}</span>
              <div className="agenda-topic">
                {item.sub ? (
                  <>
                    <div className="week-title">{item.topic}</div>
                    <div className="week-description">{item.sub}</div>
                  </>
                ) : (
                  item.topic
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>

      {data.takeaways && (
        <div className="section">
          <div className="section-title">{data.takeawaysTitle ?? "Key Takeaways"}</div>
          <div className="takeaways">
            {data.takeaways.map((t, i) => (
              <span className="takeaway-tag" key={i}>
                ✔ {t}
              </span>
            ))}
          </div>
        </div>
      )}

      {data.note && (
        <div className="section">
          <p className="callout-note">{data.note}</p>
        </div>
      )}

      <div className="register-section" id={`register-${data.event}`}>
        {submitted ? (
          <div className="success-box">
            <div className="success-icon">✅</div>
            <h3>You&apos;re Registered!</h3>
            <p>
              Thank you, {form.name}! Srikanth Sir&apos;s team will reach out to confirm your seat.
              <br />
              <br />
              For queries: <a href="https://wa.me/919492937716">+91 94929 37716</a>
            </p>
          </div>
        ) : (
          <>
            <h2>Register for the Free Webinar</h2>
            <p className="reg-sub">{data.regSub ?? "Fill in your details below — takes less than a minute"}</p>
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
                <div className="form-group form-group-full">
                  <label>Email *</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="your@email.com"
                    value={form.email}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group form-group-full">
                  <label>Institute / Company</label>
                  <input
                    type="text"
                    name="institution"
                    placeholder="College, institute, or company name"
                    value={form.institution}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="form-row">
                {data.showClassDropdown && (
                  <div className="form-group form-group-full">
                    <label>Academic Level</label>
                    <select
                      name="academicLevel"
                      value={form.academicLevel}
                      onChange={handleChange}
                      className={!form.academicLevel ? "placeholder-style" : ""}
                    >
                      <option value="">Select academic level</option>
                      {data.academicLevelOptions.map((level) => (
                        <option key={level.value} value={level.value}>
                          {level.label}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
              <div className="form-row">
                <div className="form-group form-group-full">
                  <label>Courses</label>
                  <select
                    name="course"
                    value={form.course}
                    onChange={handleChange}
                    className={!form.course ? "placeholder-style" : ""}
                  >
                    <option value="">Select course (optional)</option>
                    {data.courseOptions.map((c) => (
                      <option key={c} value={c}>
                        {c}
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
                  <label>Country</label>
                  <input
                    type="text"
                    name="country"
                    placeholder="Your country"
                    value={form.country}
                    onChange={handleChange}
                  />
                </div>
              </div>
              {error && <p className="error-msg">{error}</p>}
              <button type="button" className="submit-btn" onClick={handleSubmit} disabled={loading}>
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
    </>
  );
}

export function Webinar() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <>
      <style>{styles}</style>
      <div className="webinar-page">
        <div className="tab-bar">
          <button
            type="button"
            className={`tab-btn ${activeTab === 0 ? "active" : ""}`}
            onClick={() => setActiveTab(0)}
          >
            <span className="tab-label">Program · Every Sunday, 11:00 AM</span>
            <span className="tab-title">Quantum Circuits &amp; Foundation</span>
          </button>
          <button
            type="button"
            className={`tab-btn ${activeTab === 1 ? "active" : ""}`}
            onClick={() => setActiveTab(1)}
          >
            <span className="tab-label">Webinar 1 · 6:00 PM</span>
            <span className="tab-title">IIT-JEE &amp; NEET Guidance</span>
          </button>
          <button
            type="button"
            className={`tab-btn ${activeTab === 2 ? "active" : ""}`}
            onClick={() => setActiveTab(2)}
          >
            <span className="tab-label">Webinar 2 · 11:00 AM</span>
            <span className="tab-title">Quantum Computing</span>
          </button>
        </div>

        {activeTab === 0 && <WebinarSection data={webinar0} />}
        {activeTab === 1 && <WebinarSection data={webinar1} />}
        {activeTab === 2 && <WebinarSection data={webinar2} />}

        <div className="courses-strip">
          <strong>From Srikanth&apos;s Academy — Academic &amp; Career Guidance Programs</strong>
          <br />
          Courses Offered: IITJEE · NEET · ICSE · IGCSE · IMAT · AQA · IB · Advanced Placement · CBSE
        </div>
      </div>
    </>
  );
}
