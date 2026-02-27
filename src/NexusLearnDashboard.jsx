import { useState, useEffect, useRef } from "react";
import {
  fbCreateUser, fbSignIn, fbSignOut as firebaseSignOut, onAuth,
  saveUser, getUser, deleteUserDoc, getAllUsers,
} from "./firebase";

/* ─── Admin credentials ──────────────────────────────────────── */
const ADMIN_EMAIL = "admin@nexuslearn.ai";
const ADMIN_PASS = "nexus2024admin";

/* ─── Design tokens ──────────────────────────────────────────── */
// eslint-disable-next-line no-unused-vars
const T = {
  bg0: "#020408", bg1: "#060D14", bg2: "#0A1520", bg3: "#0F1E2E",
  teal: "#00D4C8", tealDim: "#00A89E", tealGlow: "rgba(0,212,200,0.15)",
  amber: "#F5A623", amberDim: "#C4841C", amberGlow: "rgba(245,166,35,0.15)",
  violet: "#7C3AED", violetDim: "#5B21B6",
  green: "#10F59E", red: "#FF4D6D",
  text0: "#F0F8FF", text1: "#9BB5CC", text2: "#5A7A90",
  border: "rgba(0,212,200,0.15)",
};
const SIG = {
  green: { bg: "rgba(16,245,158,0.08)", border: "rgba(16,245,158,0.3)", accent: "#10F59E", dot: "#10F59E", label: "Optimal", text: "#86EFAC" },
  amber: { bg: "rgba(245,166,35,0.08)", border: "rgba(245,166,35,0.3)", accent: "#F5A623", dot: "#FCD34D", label: "Moderate", text: "#FDE68A" },
  red: { bg: "rgba(255,77,109,0.08)", border: "rgba(255,77,109,0.3)", accent: "#FF4D6D", dot: "#FF4D6D", label: "Critical", text: "#FCA5A5" },
};
const RISK_COLOR = { low: "#10F59E", moderate: "#F5A623", high: "#FF4D6D", critical: "#C084FC" };
const STATE_LABEL = { peak: "Peak", engaged: "Engaged", fatigued: "Fatigued", saturated: "Saturated", recovering: "Recovering" };
const INTV_LABEL = {
  schedule_nudge: "Schedule Nudge", rest_recommendation: "Rest Break",
  advisor_alert: "Advisor Alert", pastoral_flag: "🚨 Pastoral Flag",
};

/* ─── Courses ─────────────────────────────────────────────────── */
const COURSES = [
  ["", "Select your programme…"],
  ["B.Tech Computer Science & Engineering", "B.Tech Computer Science & Engineering"],
  ["B.Tech Information Technology", "B.Tech Information Technology"],
  ["B.Tech Electronics & Communication Engg", "B.Tech Electronics & Communication Engg"],
  ["B.Tech Electrical Engineering", "B.Tech Electrical Engineering"],
  ["B.Tech Mechanical Engineering", "B.Tech Mechanical Engineering"],
  ["B.Tech Civil Engineering", "B.Tech Civil Engineering"],
  ["B.Tech Chemical Engineering", "B.Tech Chemical Engineering"],
  ["B.Tech Aerospace Engineering", "B.Tech Aerospace Engineering"],
  ["B.Tech Biomedical Engineering", "B.Tech Biomedical Engineering"],
  ["M.Tech Computer Science", "M.Tech Computer Science"],
  ["M.Tech Data Science & AI", "M.Tech Data Science & AI"],
  ["M.Tech VLSI Design", "M.Tech VLSI Design"],
  ["MSc Computer Science", "MSc Computer Science"],
  ["MSc Data Science", "MSc Data Science"],
  ["MSc Artificial Intelligence", "MSc Artificial Intelligence"],
  ["MSc Cybersecurity", "MSc Cybersecurity"],
  ["MBBS", "MBBS"], ["BDS (Bachelor of Dental Surgery)", "BDS (Bachelor of Dental Surgery)"],
  ["B.Pharm (Pharmacy)", "B.Pharm (Pharmacy)"], ["BSc Nursing", "BSc Nursing"],
  ["MD (Doctor of Medicine)", "MD (Doctor of Medicine)"],
  ["BSc Mathematics", "BSc Mathematics"], ["BSc Physics", "BSc Physics"],
  ["BSc Psychology", "BSc Psychology"], ["BSc Economics", "BSc Economics"],
  ["BCom (Commerce)", "BCom (Commerce)"], ["BBA (Business Administration)", "BBA (Business Administration)"],
  ["MBA Finance", "MBA Finance"], ["MBA Marketing", "MBA Marketing"],
  ["LLB (Law)", "LLB (Law)"], ["BEd (Education)", "BEd (Education)"],
  ["PhD Research (Any Discipline)", "PhD Research (Any Discipline)"],
];

/* ─── Demo students ──────────────────────────────────────────── */
const DEMO = [
  {
    id: "d001", name: "Eisha Singh", cohort: "B.Tech CS", risk: "low", base: 32,
    p: { sleepHours: "7.5", stressLevel: "4", studyHoursPerDay: "5", exercisePerWeek: "4", screenTimeHours: "5", caffeine: "1", lastRestDays: "1", hydration: "good", breakFrequency: "3", mentalHealthRating: "8", socialEngagement: "4", deadlineAnxiety: "low", workingStatus: "student", readingSpeed: "310", motivationLevel: "8", courseDifficulty: "3", missedDeadlines: "0", attendanceRate: "92", gpaLast: "3.6" }
  },
  {
    id: "d002", name: "Avinash Mishra", cohort: "B.Tech ECE", risk: "moderate", base: 58,
    p: { sleepHours: "6", stressLevel: "6", studyHoursPerDay: "6", exercisePerWeek: "2", screenTimeHours: "8", caffeine: "3", lastRestDays: "3", hydration: "moderate", breakFrequency: "2", mentalHealthRating: "6", socialEngagement: "3", deadlineAnxiety: "moderate", workingStatus: "part-time", readingSpeed: "220", motivationLevel: "6", courseDifficulty: "4", missedDeadlines: "2", attendanceRate: "78", gpaLast: "2.9" }
  },
  {
    id: "d003", name: "Riddhima Sharma", cohort: "B.Tech Mech", risk: "high", base: 72,
    p: { sleepHours: "5.5", stressLevel: "8", studyHoursPerDay: "8", exercisePerWeek: "1", screenTimeHours: "9", caffeine: "4", lastRestDays: "5", hydration: "poor", breakFrequency: "1", mentalHealthRating: "4", socialEngagement: "2", deadlineAnxiety: "high", workingStatus: "part-time", readingSpeed: "180", motivationLevel: "4", courseDifficulty: "5", missedDeadlines: "4", attendanceRate: "65", gpaLast: "2.4" }
  },
  {
    id: "d004", name: "Ritwik Jaiswal", cohort: "B.Tech Civil", risk: "critical", base: 86,
    p: { sleepHours: "4.5", stressLevel: "9", studyHoursPerDay: "10", exercisePerWeek: "0", screenTimeHours: "12", caffeine: "5", lastRestDays: "8", hydration: "poor", breakFrequency: "0", mentalHealthRating: "3", socialEngagement: "1", deadlineAnxiety: "high", workingStatus: "full-time", readingSpeed: "150", motivationLevel: "3", courseDifficulty: "5", missedDeadlines: "6", attendanceRate: "55", gpaLast: "2.1" }
  },
  {
    id: "d005", name: "Asmita Adhikary", cohort: "M.Tech Data Science", risk: "low", base: 28,
    p: { sleepHours: "8", stressLevel: "3", studyHoursPerDay: "4", exercisePerWeek: "5", screenTimeHours: "4", caffeine: "1", lastRestDays: "0", hydration: "good", breakFrequency: "4", mentalHealthRating: "9", socialEngagement: "5", deadlineAnxiety: "low", workingStatus: "student", readingSpeed: "360", motivationLevel: "9", courseDifficulty: "3", missedDeadlines: "0", attendanceRate: "96", gpaLast: "3.8" }
  },
];

/* ─── Digital twin computation ──────────────────────────────── */
function computeTwin(p) {
  const sl = +(p.sleepHours || 7), st = +(p.stressLevel || 5), sh = +(p.studyHoursPerDay || 4),
    ex = +(p.exercisePerWeek || 3), sc = +(p.screenTimeHours || 6), ca = +(p.caffeine || 2),
    lr = +(p.lastRestDays || 1), rs = +(p.readingSpeed || 250),
    md = +(p.missedDeadlines || 0), at = +(p.attendanceRate || 85), gp = +(p.gpaLast || 3),
    ml = +(p.motivationLevel || 5), mh = +(p.mentalHealthRating || 6),
    bf = +(p.breakFrequency || 2), se = +(p.socialEngagement || 3),
    da = p.deadlineAnxiety || "low", hyd = p.hydration || "moderate";
  let fat = 0;
  fat += Math.max(0, (8 - sl)) * 7; fat += st * 4.5; fat += Math.max(0, sh - 6) * 4;
  fat += Math.max(0, sc - 6) * 2.5; fat += ca * 2; fat -= ex * 3; fat += lr * 4.5;
  fat -= ml * 1.5; fat -= mh * 1.2;
  fat += (da === "high" ? 12 : da === "moderate" ? 6 : 0);
  fat -= (bf >= 3 ? 5 : bf >= 2 ? 2 : 0);
  fat -= (hyd === "good" ? 4 : hyd === "poor" ? -4 : 0);
  fat -= se; fat = Math.min(100, Math.max(0, Math.round(fat)));
  const sig = fat <= 30 ? "green" : fat <= 65 ? "amber" : "red";
  const si = fat < 25 ? 0 : fat < 45 ? 1 : fat < 65 ? 2 : fat < 80 ? 3 : 4;
  const states = ["peak", "engaged", "fatigued", "saturated", "recovering"];
  const intvs = [null, null, "schedule_nudge", "rest_recommendation", "advisor_alert", "pastoral_flag"];
  let risk = 0;
  risk += st * 0.035; risk += md * 0.07; risk += Math.max(0, 80 - at) * 0.005;
  risk -= (gp - 2) * 0.1; risk -= ex * 0.02; risk -= ml * 0.02; risk -= mh * 0.015;
  risk += (da === "high" ? 0.1 : da === "moderate" ? 0.04 : 0);
  risk += (p.workingStatus === "full-time" ? 0.08 : p.workingStatus === "part-time" ? 0.03 : 0);
  risk = Math.min(0.95, Math.max(0.03, risk));
  const riskT = risk < 0.25 ? "low" : risk < 0.5 ? "moderate" : risk < 0.75 ? "high" : "critical";
  const hi = fat > 65, mid = fat > 40, slow = rs < 220;
  return {
    fatigue: {
      score: fat, signal: sig, currentState: states[si],
      forecast: { next24h: fat <= 30 ? "green" : fat <= 55 ? "amber" : "red", next2448h: fat <= 40 ? "green" : fat <= 65 ? "amber" : "red", next4872h: fat <= 50 ? "green" : "amber" },
      deviation: +((fat - 45) / 20).toFixed(2), isAnomalous: fat > 80,
      intervention: intvs[Math.min(5, si + (fat > 70 ? 2 : 0))], carryOver: +(fat / 200).toFixed(2)
    },
    apollo: { riskScore: risk, risk: riskT, gpaLast: gp, attendanceRate: at, missedDeadlines: md },
    iris: {
      fontFamily: hi ? "'Georgia',serif" : "'Georgia','Times New Roman',serif",
      fontSize: hi ? "19px" : slow ? "18px" : "17px", fontWeight: hi ? "300" : "400",
      letterSpacing: hi ? "0.06em" : slow ? "0.05em" : "0.03em", wordSpacing: hi ? "0.15em" : "0.08em",
      lineHeight: hi ? "2.0" : slow ? "1.9" : "1.75", maxLineWidth: hi ? "55ch" : slow ? "58ch" : "68ch",
      backgroundColor: hi ? "#F5F0E8" : mid ? "#FDFAF4" : "#FAFCFF", textColor: hi ? "#2D2620" : "#1A1A2E",
      paragraphSpacing: hi ? "1.8em" : "1.4em", contrastRatio: hi ? "5.2" : "7.1",
      highlightColor: hi ? "rgba(255,214,0,0.35)" : "rgba(0,212,200,0.2)",
      policyVersion: 200 + Math.floor(fat / 3), sessionsTrained: 40 + Math.floor(fat * 1.2),
      rewardSignal: +((100 - fat) / 120 + 0.35).toFixed(3), cumulativeReward: +(fat * 0.8 + 12).toFixed(1)
    },
  };
}

/* ─── Recommendations engine ─────────────────────────────────── */
function generateRecommendations(profile, twin) {
  const { fatigue, apollo } = twin;
  const p = profile;
  const fat = fatigue.score, risk = apollo.riskScore;
  const sl = +(p.sleepHours || 7), st = +(p.stressLevel || 5), ex = +(p.exercisePerWeek || 3);
  const at = +(p.attendanceRate || 85), md = +(p.missedDeadlines || 0);
  const mh = +(p.mentalHealthRating || 6), da = p.deadlineAnxiety || "low", hyd = p.hydration || "moderate";
  const recs = [];
  if (sl < 6) recs.push({
    icon: "🌙", cat: "Sleep Recovery", priority: "critical",
    title: "Critical Sleep Deficit Detected",
    body: `You are averaging only ${sl} hours of sleep — far below the 7–9 hour requirement for healthy cognition. Sleep deprivation is the primary driver of your fatigue score of ${fat}. SENTINEL's HMM model shows your brain cannot consolidate memory or regulate stress hormones effectively.`,
    action: "Establish a fixed sleep schedule. Start sleeping 30 minutes earlier each night this week until you reach 7 hours. Avoid screens 60 minutes before bed. Consider a short 20-minute nap between 1–3 PM if your schedule allows."
  });
  else if (sl < 7) recs.push({
    icon: "🌙", cat: "Sleep Optimisation", priority: "high",
    title: "Improve Sleep Duration",
    body: `You sleep ${sl} hours, slightly below optimal. Even one additional hour can reduce your fatigue score by an estimated 12–18 points and improve cognitive recall by up to 40%.`,
    action: "Move your bedtime 30 minutes earlier. Keep weekends within 1 hour of your weekday sleep time to maintain your circadian rhythm."
  });
  if (st >= 8) recs.push({
    icon: "⚡", cat: "Stress Management", priority: "critical",
    title: "High Stress — Immediate Intervention Needed",
    body: `Your stress level of ${st}/10 is placing your prefrontal cortex under extreme load, directly impairing decision-making, memory, and emotional regulation. APOLLO attributes ${Math.round(st * 0.035 * 100)}% of your dropout probability to stress alone.`,
    action: "Practice 4-7-8 breathing (inhale 4s, hold 7s, exhale 8s) twice daily. Identify your top 3 stressors and write them down. Book a counsellor session this week."
  });
  else if (st >= 6) recs.push({
    icon: "⚡", cat: "Stress Management", priority: "moderate",
    title: "Manage Moderate Stress Before It Escalates",
    body: `Stress at ${st}/10 is manageable now but SENTINEL's 72-hour forecast shows it is likely to worsen. Chronic moderate stress is more damaging than acute high stress because it never allows full recovery.`,
    action: "Schedule 2 mandatory 30-minute breaks per day as non-negotiable. Try progressive muscle relaxation before bed. Reduce caffeine to 1–2 drinks per day."
  });
  if (ex === 0) recs.push({
    icon: "🏃", cat: "Physical Activity", priority: "critical",
    title: "Zero Exercise — Major Risk Factor",
    body: `No exercise this week. Physical activity reduces cortisol, increases BDNF (brain-derived neurotrophic factor), and directly lowers your dropout risk. APOLLO projects a ${Math.round(8)}% higher risk trajectory without it.`,
    action: "Start with 15-minute walks after dinner — no gym required. Aim for 3 sessions this week. Even gentle movement breaks every 2 hours of study significantly reduce fatigue accumulation."
  });
  else if (ex <= 2) recs.push({
    icon: "🏃", cat: "Physical Activity", priority: "moderate",
    title: "Increase Exercise Frequency",
    body: `You exercise ${ex} day(s)/week. Research shows 4+ days of moderate activity is the threshold for meaningful cognitive benefit and stress hormone regulation.`,
    action: "Add one more exercise day this week. A 30-minute morning walk sets your cortisol rhythm correctly for the rest of the day."
  });
  if (at < 60) recs.push({
    icon: "📚", cat: "Academic Engagement", priority: "critical",
    title: "Critically Low Attendance — Academic Risk",
    body: `Your attendance at ${at}% is below the minimum threshold. APOLLO's causal model shows every 10% drop in attendance increases dropout probability by approximately 8%. You are missing foundational knowledge that cannot be recovered through self-study alone.`,
    action: "Contact your academic advisor immediately. Create a priority list of classes to attend this week. Arrange with a classmate to share notes for missed sessions."
  });
  else if (at < 75) recs.push({
    icon: "📚", cat: "Academic Engagement", priority: "high",
    title: "Improve Attendance to Protect GPA",
    body: `At ${at}% attendance you are in a risk zone. Professors notice; you participate less and may miss critical pre-exam guidance.`,
    action: "Set phone alarms for every class. Attend at minimum 80% of sessions this week. Reach out to professors for any missed classes."
  });
  if (md >= 4) recs.push({
    icon: "⏰", cat: "Deadline Management", priority: "critical",
    title: "Multiple Missed Deadlines — Urgent Action Required",
    body: `You have missed ${md} deadlines this semester — the single strongest predictor of academic disengagement in APOLLO's XGBoost model. Late submissions signal a breakdown in academic rhythm.`,
    action: "List all outstanding work today. Contact professors to negotiate extensions. Use a physical calendar to mark all upcoming deadlines in red. Break each assignment into 3 sub-tasks and schedule each separately."
  });
  else if (md >= 2) recs.push({
    icon: "⏰", cat: "Deadline Management", priority: "moderate",
    title: "Prevent Further Missed Deadlines",
    body: `${md} missed deadlines is a warning sign. Without intervention, this typically escalates as the semester progresses and assignments compound.`,
    action: "Start every assignment the day it is given, even if it's just writing the title and reading the brief. If you can start something in 2 minutes, do it now."
  });
  if (mh <= 4) recs.push({
    icon: "💙", cat: "Mental Wellbeing", priority: "critical",
    title: "Low Mental Health — Please Seek Support",
    body: `Your mental health rating of ${mh}/10 indicates you may be struggling significantly. Mental wellbeing underpins every other metric — sleep, stress, motivation, and academic performance all collapse when it is compromised.`,
    action: "Please speak to someone today — your institution's counselling service, a trusted friend, or iCall (India): 9152987821. This is the most academically intelligent action you can take right now."
  });
  else if (mh <= 6) recs.push({
    icon: "💙", cat: "Mental Wellbeing", priority: "moderate",
    title: "Strengthen Your Mental Foundation",
    body: `A mental health score of ${mh}/10 leaves limited resilience buffer. When exams, deadlines, or personal issues arise, your coping capacity will be reduced.`,
    action: "Introduce one daily mindfulness practice: 5 minutes of morning journaling, a gratitude log, or guided meditation via Headspace or Calm. Plan one meaningful social activity this week."
  });
  if (hyd === "poor") recs.push({
    icon: "💧", cat: "Hydration & Nutrition", priority: "high",
    title: "Dehydration Impacting Cognitive Performance",
    body: `Even mild dehydration of 1–2% body weight reduces concentration, working memory, and reaction time. SENTINEL attributes 4 fatigue points directly to this factor.`,
    action: "Place a 1-litre water bottle on your desk and set a reminder to finish it by midday. Drink a glass of water before each study session."
  });
  if (da === "high") recs.push({
    icon: "🧠", cat: "Cognitive Strategy", priority: "moderate",
    title: "Overcome Deadline Anxiety with Structured Planning",
    body: `High deadline anxiety creates avoidance behaviour — which paradoxically causes the very missed deadlines you fear. SENTINEL detects elevated cognitive load during deadline periods that spikes your fatigue by an estimated 15–20 points.`,
    action: "Use 'implementation intentions' — instead of 'I will study', write 'I will study chapter 3 at 6 PM Tuesday in the library'. Specificity eliminates decision fatigue."
  });
  if (fat <= 30 && risk <= 0.25) recs.push({
    icon: "🌟", cat: "Performance Maintenance", priority: "positive",
    title: "Excellent — Maintain Your High-Performance State",
    body: `Peak cognitive performance detected. Fatigue at ${fat}/100 and dropout risk at ${Math.round(risk * 100)}% are both in excellent ranges. SENTINEL predicts you will remain in the optimal zone for the next 72 hours.`,
    action: "This is the ideal time to tackle your hardest academic challenges. Deep work sessions of 90 minutes followed by 20-minute breaks will maximise your output. Continue your current routines — they are working."
  });
  if (fat > 65) recs.push({
    icon: "🔋", cat: "Immediate Recovery", priority: "critical",
    title: "High Fatigue — Begin Recovery Protocol Today",
    body: `Fatigue index of ${fat}/100 indicates your brain is saturated. Intensive study now is counterproductive — you are encoding information inefficiently. IRIS has automatically adjusted your reading parameters.`,
    action: "Take a minimum 2-hour complete rest from all academic work today. A 20-minute walk in natural light resets cortisol and adenosine levels more effectively than caffeine."
  });
  return recs.slice(0, 6);
}

/* ─── Text analyser ──────────────────────────────────────────── */
function analyseText(text) {
  const words = text.trim().split(/\s+/), sents = text.split(/[.!?]+/).filter(s => s.trim().length > 3);
  const awl = words.reduce((a, w) => a + w.length, 0) / Math.max(1, words.length);
  const asl = words.length / Math.max(1, sents.length);
  const lex = new Set(words.map(w => w.toLowerCase())).size / Math.max(1, words.length);
  const lw = words.filter(w => w.length > 8).length / Math.max(1, words.length);
  const cx = Math.min(100, Math.round(awl * 5 + asl * 1.5 + lw * 40 + (1 - lex) * 20));
  return {
    wordCount: words.length, sentenceCount: sents.length, avgWordLength: awl.toFixed(1),
    avgSentenceLength: asl.toFixed(1), lexicalDensity: (lex * 100).toFixed(1) + "%",
    complexityScore: cx, readabilityScore: Math.max(0, 100 - cx),
    rFontSize: cx > 60 ? "19px" : cx > 35 ? "18px" : "17px", rLineHeight: cx > 60 ? "2.1" : cx > 35 ? "1.9" : "1.75",
    rLetterSpacing: cx > 60 ? "0.07em" : cx > 35 ? "0.05em" : "0.03em", rWordSpacing: cx > 60 ? "0.18em" : "0.08em",
    rMaxWidth: cx > 60 ? "52ch" : cx > 35 ? "60ch" : "70ch", rFontWeight: cx > 70 ? "300" : "400",
    rBackground: cx > 60 ? "#F5F0E8" : "#FAFCFF", rTextColor: cx > 60 ? "#2D2620" : "#1A1A2E",
    rContrast: cx > 60 ? "5.2" : "7.1", rParaSpacing: cx > 60 ? "2.0em" : "1.4em",
    reason: cx > 60 ? "High complexity — IRIS recommending wider spacing, reduced contrast, larger font."
      : cx > 35 ? "Moderate complexity — IRIS applying balanced optimisations."
        : "Low complexity — IRIS using standard high-performance layout."
  };
}

/* ─── Gemini AI Engine ───────────────────────────────────────── */
const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

async function callGemini(prompt, retries = 1) {
  if (!GEMINI_API_KEY) return null;
  try {
    const res = await fetch(GEMINI_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.35,
          maxOutputTokens: 8192,
        },
      }),
    });
    if (res.status === 429 && retries > 0) {
      // Read the actual retry delay from the response body
      let waitMs = 65000; // default 65s
      try {
        const errBody = await res.json();
        const retryDelay = errBody?.error?.details?.find(d => d["@type"]?.includes("RetryInfo"))?.retryDelay;
        if (retryDelay) {
          const secs = parseFloat(retryDelay.replace("s", ""));
          waitMs = Math.ceil(secs * 1000) + 2000; // add 2s buffer
        }
      } catch { }
      console.warn(`[Gemini] Rate limited — waiting ${Math.round(waitMs / 1000)}s before retry...`);
      await new Promise(r => setTimeout(r, waitMs));
      return callGemini(prompt, 0);
    }
    if (!res.ok) {
      console.error("[Gemini] HTTP error:", res.status, await res.text().catch(() => ""));
      return null;
    }
    const data = await res.json();
    const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!raw) return null;
    // Extract the outermost JSON object — handles markdown fences and leading prose
    const match = raw.match(/\{[\s\S]*\}/);
    if (!match) { console.error("[Gemini] no JSON object found in response"); return null; }
    return JSON.parse(match[0]);
  } catch (e) {
    console.error("[Gemini] error:", e);
    return null;
  }
}

/* ─── AI Twin computation (replaces computeTwin for logged-in student) ── */
async function computeTwinAI(p) {
  const base = computeTwin(p); // always compute formula baseline

  const profileStr = `sleep:${p.sleepHours}h,stress:${p.stressLevel}/10,study:${p.studyHoursPerDay}h/d,ex:${p.exercisePerWeek}d/wk,screen:${p.screenTimeHours}h,caf:${p.caffeine},rest_ago:${p.lastRestDays}d,mh:${p.mentalHealthRating}/10,social:${p.socialEngagement}/5,breaks:${p.breakFrequency},hydration:${p.hydration},work:${p.workingStatus},anxiety:${p.deadlineAnxiety},wpm:${p.readingSpeed},motivation:${p.motivationLevel}/10,difficulty:${p.courseDifficulty}/5,missed_ddl:${p.missedDeadlines},attend:${p.attendanceRate}%,gpa:${p.gpaLast}`;

  const prompt = `NEXUS LEARN AI: analyse student and return JSON only (no markdown).
PROFILE: ${profileStr}
{"sentinel":{"fatigueScore":int_0_100,"signal":"green|amber|red","currentState":"peak|engaged|fatigued|saturated|recovering","isAnomalous":bool,"anomalyReason":"1 sentence or empty","reasoning":"2-3 sentences WHY this fatigue score","forecast":{"next24h":"green|amber|red","next2448h":"green|amber|red","next4872h":"green|amber|red","narrative":"1-2 sentences"},"interventionType":"null|schedule_nudge|rest_recommendation|advisor_alert|pastoral_flag","interventionReason":"1 sentence or empty"},"iris":{"fontSize":"16-20px","fontWeight":"300|400","letterSpacing":"0.02-0.07em","wordSpacing":"0.06-0.18em","lineHeight":"1.65-2.1","maxLineWidth":"52-68ch","backgroundColor":"#F5F0E8|#FDFAF4|#FAFCFF","textColor":"#2D2620|#1A1A2E","paragraphSpacing":"1.4-2.0em","contrastRatio":"5.2|6.1|7.1","rationale":"2-3 sentences WHY typography matches state","contentSuggestion":"1 actionable study tip"},"apollo":{"riskScore":float_0_1,"risk":"low|moderate|high|critical","reasoning":"2-3 sentences WHY this risk","topFactors":[{"factor":"name","contribution":float,"direction":"risk|protective","explanation":"1 sent"},{"factor":"name","contribution":float,"direction":"risk|protective","explanation":"1 sent"},{"factor":"name","contribution":float,"direction":"risk|protective","explanation":"1 sent"},{"factor":"name","contribution":float,"direction":"risk|protective","explanation":"1 sent"},{"factor":"name","contribution":float,"direction":"risk|protective","explanation":"1 sent"}],"interventionWindow":"time before critical","similarStudentsOutcome":"1 sentence"}}`;

  const ai = await callGemini(prompt);
  if (!ai) return base; // graceful fallback

  const s = ai.sentinel;
  const irs = ai.iris;
  const ap = ai.apollo;

  const sig = s.signal || base.fatigue.signal;

  return {
    fatigue: {
      score: s.fatigueScore ?? base.fatigue.score,
      signal: sig,
      currentState: s.currentState || base.fatigue.currentState,
      isAnomalous: s.isAnomalous ?? base.fatigue.isAnomalous,
      anomalyReason: s.anomalyReason || "",
      reasoning: s.reasoning || "",
      forecast: {
        next24h: s.forecast?.next24h || base.fatigue.forecast.next24h,
        next2448h: s.forecast?.next2448h || base.fatigue.forecast.next2448h,
        next4872h: s.forecast?.next4872h || base.fatigue.forecast.next4872h,
        narrative: s.forecast?.narrative || "",
      },
      deviation: base.fatigue.deviation,
      intervention: s.interventionType ?? base.fatigue.intervention,
      interventionReason: s.interventionReason || "",
      carryOver: base.fatigue.carryOver,
    },
    apollo: {
      riskScore: ap.riskScore ?? base.apollo.riskScore,
      risk: ap.risk || base.apollo.risk,
      gpaLast: base.apollo.gpaLast,
      attendanceRate: base.apollo.attendanceRate,
      missedDeadlines: base.apollo.missedDeadlines,
      reasoning: ap.reasoning || "",
      topFactors: ap.topFactors || [],
      interventionWindow: ap.interventionWindow || "",
      similarStudentsOutcome: ap.similarStudentsOutcome || "",
    },
    iris: {
      ...base.iris,
      fontSize: irs.fontSize || base.iris.fontSize,
      fontWeight: irs.fontWeight || base.iris.fontWeight,
      letterSpacing: irs.letterSpacing || base.iris.letterSpacing,
      wordSpacing: irs.wordSpacing || base.iris.wordSpacing,
      lineHeight: irs.lineHeight || base.iris.lineHeight,
      maxLineWidth: irs.maxLineWidth || base.iris.maxLineWidth,
      backgroundColor: irs.backgroundColor || base.iris.backgroundColor,
      textColor: irs.textColor || base.iris.textColor,
      paragraphSpacing: irs.paragraphSpacing || base.iris.paragraphSpacing,
      contrastRatio: irs.contrastRatio || base.iris.contrastRatio,
      rationale: irs.rationale || "",
      contentSuggestion: irs.contentSuggestion || "",
    },
    aiPowered: true,
  };
}

/* ─── AI Recommendations (replaces generateRecommendations for logged-in student) ── */
async function generateRecommendationsAI(profile, twin) {
  const baseRecs = generateRecommendations(profile, twin);
  const fat = twin.fatigue.score;
  const risk = twin.apollo.riskScore;

  const prompt = `You are NEXUS LEARN's AI wellbeing advisor. A student's Digital Twin is live. Generate 5 highly personalised, actionable recommendations based on their exact situation.

PROFILE SNAPSHOT:
- Sleep: ${profile.sleepHours}h | Stress: ${profile.stressLevel}/10 | Study: ${profile.studyHoursPerDay}h/day
- Exercise: ${profile.exercisePerWeek}d/wk | Screen: ${profile.screenTimeHours}h | Caffeine: ${profile.caffeine}/day
- Rest days ago: ${profile.lastRestDays} | Mental health: ${profile.mentalHealthRating}/10
- Motivation: ${profile.motivationLevel}/10 | Hydration: ${profile.hydration} | Anxiety: ${profile.deadlineAnxiety}
- Attendance: ${profile.attendanceRate}% | Missed deadlines: ${profile.missedDeadlines} | GPA: ${profile.gpaLast}
- Working: ${profile.workingStatus} | Course difficulty: ${profile.courseDifficulty}/5

AI ENGINE OUTPUTS:
- SENTINEL Fatigue Index: ${fat}/100 (${twin.fatigue.currentState})
- APOLLO Dropout Risk: ${Math.round(risk * 100)}% (${twin.apollo.risk})
- IRIS has set reading environment to ${twin.iris.fontSize} font, ${twin.iris.lineHeight} line-height

Return ONLY this JSON array of exactly 5 recommendations:
[
  {
    "icon": <single emoji>,
    "cat": <category string, max 3 words>,
    "priority": <"critical"|"high"|"moderate"|"positive">,
    "title": <string, concise and specific to this student, max 10 words>,
    "body": <string, 3-4 sentences — personalised analysis using their specific numbers, explain WHY this matters for them specifically, reference the AI engine data where relevant>,
    "action": <string, 3-5 very specific, immediately actionable steps written in second person>
  }
]

Rules:
- Make each recommendation feel written for THIS specific student, not generic advice
- Reference their actual numbers (e.g. "Your ${profile.sleepHours} hours of sleep...")
- The most critical issues should have "critical" priority
- If they are doing well overall (fatigue < 30, risk < 0.25), include a "positive" priority item
- Actions must be concrete and schedulable, not vague
- Do NOT repeat the same category twice`;

  const ai = await callGemini(prompt);
  if (!ai || !Array.isArray(ai)) return baseRecs;

  // merge and validate
  return ai.slice(0, 5).map((r) => ({
    icon: r.icon || "💡",
    cat: r.cat || "Wellbeing",
    priority: r.priority || "moderate",
    title: r.title || "Recommendation",
    body: r.body || "",
    action: r.action || "",
  }));
}

/* ─── IRIS AI Q&A Engine ─────────────────────────────────────── */
async function askIrisAI(text, profile, twin) {
  const isQuestion = /\?$|^(what|how|why|when|where|who|which|explain|define|describe|compare|difference|meaning|tell me|can you|could you|does|do |is |are |was |were )/i.test(text.trim());
  const fatigue = twin?.fatigue?.score ?? 50;
  const course = profile?.cohort ?? "general studies";

  const prompt = `You are IRIS — NEXUS LEARN's adaptive learning AI. A student (${course}, fatigue ${fatigue}/100) has entered text into the IRIS analyser.

TEXT: """${text}"""

${isQuestion ? "This is a QUESTION. Provide a comprehensive, well-structured answer." : "This is TEXT/NOTES. Analyse it and provide an intelligent learning response."}

Return ONLY this JSON:
{"reformulated":"the question or topic restated more clearly and precisely (1-2 sentences)","answerTitle":"short answer heading (max 6 words)","answer":"comprehensive answer in 3-5 paragraphs, using clear language. Include relevant examples, explanations of key concepts, and practical applications. If it is a topic rather than a question, provide a helpful summary and key learning points.","keyPoints":["concise takeaway 1","concise takeaway 2","concise takeaway 3","concise takeaway 4","concise takeaway 5"],"studyTip":"1 sentence personalised study tip given their fatigue of ${fatigue}/100 and they study ${profile?.studyHoursPerDay ?? 4} hrs/day","difficulty":"beginner|intermediate|advanced","estimatedReadTime":"X min read"}`;

  const result = await callGemini(prompt);
  return result;
}


function hsh(s) { let h = 0; for (let i = 0; i < s.length; i++)h = (Math.imul(31, h) + s.charCodeAt(i)) | 0; return Math.abs(h); }
function ini(n) { return n.split(" ").map(p => p[0] || "").join("").toUpperCase().slice(0, 2); }
function avc(n) { const hue = hsh(n) % 360; return `linear-gradient(135deg,hsl(${hue},60%,22%),hsl(${(hue + 50) % 360},50%,32%))`; }
function getRemaining(lu) { if (!lu) return null; const r = 24 * 3600 * 1000 - (Date.now() - new Date(lu).getTime()); if (r <= 0) return null; return { h: Math.floor(r / 3600000), m: Math.floor((r % 3600000) / 60000), s: Math.floor((r % 60000) / 1000) }; }
function fmt(r) { if (!r) return null; return `${String(r.h).padStart(2, "0")}:${String(r.m).padStart(2, "0")}:${String(r.s).padStart(2, "0")}`; }

/* ─── Global CSS (injected via useEffect in root) ────────────── */
const GLOBAL_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:wght@300;400;500;600;700&family=Space+Mono:wght@400;700&display=swap');
*{box-sizing:border-box;margin:0;padding:0;}
html,body{background:#020408;color:#F0F8FF;}
input,select,textarea,button{font-family:'DM Sans',sans-serif;}
::-webkit-scrollbar{width:4px;height:4px;}
::-webkit-scrollbar-thumb{background:rgba(0,212,200,0.4);border-radius:4px;}
::-webkit-scrollbar-track{background:#0A1520;}
@keyframes pulseR{0%,100%{opacity:1}50%{opacity:0.25}}
@keyframes fadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
@keyframes popIn{from{opacity:0;transform:scale(0.86)}to{opacity:1;transform:scale(1)}}
@keyframes floatY{0%,100%{transform:translateY(0)}50%{transform:translateY(-14px)}}
@keyframes rotateSlow{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
@keyframes borderGlow{0%,100%{box-shadow:0 0 10px rgba(0,212,200,0.25)}50%{box-shadow:0 0 28px rgba(0,212,200,0.65)}}
@keyframes gradShift{0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}
@keyframes nodeFloat{0%,100%{transform:translate(0,0)}33%{transform:translate(5px,-8px)}66%{transform:translate(-4px,5px)}}
@keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
.nx-card{background:linear-gradient(135deg,rgba(15,30,46,0.92),rgba(6,13,20,0.96));border:1px solid rgba(0,212,200,0.14);border-radius:12px;backdrop-filter:blur(10px);transition:border-color 0.3s,box-shadow 0.3s;}
.nx-card:hover{border-color:rgba(0,212,200,0.32);box-shadow:0 4px 24px rgba(0,212,200,0.06);}
.nx-btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:11px 26px;border-radius:7px;border:none;cursor:pointer;font-family:'Syne',sans-serif;font-size:13px;font-weight:700;letter-spacing:0.06em;transition:all 0.22s;position:relative;overflow:hidden;}
.nx-btn::after{content:'';position:absolute;inset:0;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.1),transparent);transform:translateX(-110%);transition:transform 0.45s;}
.nx-btn:hover::after{transform:translateX(110%);}
.nx-btn-primary{background:linear-gradient(135deg,#00D4C8,#00A89E);color:#020408;}
.nx-btn-primary:hover{transform:translateY(-2px);box-shadow:0 8px 28px rgba(0,212,200,0.38);}
.nx-btn-amber{background:linear-gradient(135deg,#F5A623,#C4841C);color:#020408;}
.nx-btn-amber:hover{transform:translateY(-2px);box-shadow:0 8px 28px rgba(245,166,35,0.38);}
.nx-btn-ghost{background:transparent;border:1px solid rgba(0,212,200,0.35);color:#00D4C8;}
.nx-btn-ghost:hover{background:rgba(0,212,200,0.08);border-color:#00D4C8;}
.nx-btn-red{background:rgba(255,77,109,0.12);border:1px solid rgba(255,77,109,0.35);color:#FF4D6D;}
.nx-btn-red:hover{background:rgba(255,77,109,0.2);}
.nx-input{width:100%;padding:10px 13px;border-radius:8px;background:rgba(10,21,32,0.9);border:1px solid rgba(0,212,200,0.18);color:#F0F8FF;font-size:13px;outline:none;transition:border-color 0.2s,box-shadow 0.2s;}
.nx-input:focus{border-color:#00D4C8;box-shadow:0 0 0 3px rgba(0,212,200,0.1);}
.nx-input::placeholder{color:#5A7A90;}
.nx-label{display:block;font-size:10px;font-weight:700;color:#9BB5CC;font-family:'Space Mono',monospace;text-transform:uppercase;letter-spacing:0.09em;margin-bottom:5px;}
.tag{display:inline-flex;align-items:center;gap:4px;padding:2px 9px;border-radius:20px;font-size:10px;font-weight:700;font-family:'Space Mono',monospace;letter-spacing:0.04em;}
.tag-teal{background:rgba(0,212,200,0.1);color:#00D4C8;border:1px solid rgba(0,212,200,0.28);}
.tag-amber{background:rgba(245,166,35,0.1);color:#F5A623;border:1px solid rgba(245,166,35,0.28);}
.tag-red{background:rgba(255,77,109,0.1);color:#FF4D6D;border:1px solid rgba(255,77,109,0.28);}
.tag-green{background:rgba(16,245,158,0.1);color:#10F59E;border:1px solid rgba(16,245,158,0.28);}
.tag-violet{background:rgba(124,58,237,0.1);color:#A78BFA;border:1px solid rgba(124,58,237,0.28);}
.tr-hover{transition:background 0.15s;}
.tr-hover:hover{background:rgba(0,212,200,0.04)!important;}

/* ── RESPONSIVE ── */
@media(max-width:768px){
  .nx-btn{padding:10px 18px;font-size:12px;}
  .nx-responsive-hide{display:none!important;}
  .nx-mobile-stack{flex-direction:column!important;}
  .nx-mobile-full{width:100%!important;max-width:100%!important;}
  .nx-mobile-grid1{grid-template-columns:1fr!important;}
  .nx-mobile-grid2{grid-template-columns:1fr 1fr!important;}
  .nx-mobile-text-sm{font-size:12px!important;}
  .nx-mobile-pad{padding:12px!important;}
  .nx-mobile-gap{gap:8px!important;}
}
@media(max-width:480px){
  .nx-mobile-grid2{grid-template-columns:1fr!important;}
  .nx-mobile-xs-hide{display:none!important;}
}
`;

/* ─── Shared primitives ──────────────────────────────────────── */
function NxLogo({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="nlg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#00D4C8" />
          <stop offset="50%" stopColor="#7C3AED" />
          <stop offset="100%" stopColor="#F5A623" />
        </linearGradient>
        <filter id="nglow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="1.5" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <rect x="2" y="2" width="40" height="40" rx="11" fill="url(#nlg)" opacity="0.12" stroke="url(#nlg)" strokeWidth="1.2" />
      <path d="M11 33 L11 11 L33 33 L33 11" stroke="url(#nlg)" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" filter="url(#nglow)" fill="none" />
      <circle cx="11" cy="11" r="2.8" fill="#00D4C8" />
      <circle cx="33" cy="11" r="2.8" fill="#F5A623" />
      <circle cx="33" cy="33" r="2.8" fill="#7C3AED" />
    </svg>
  );
}

function Dot({ signal, size = 8, pulse }) {
  return <span style={{ display: "inline-block", width: size, height: size, borderRadius: "50%", backgroundColor: SIG[signal].dot, flexShrink: 0, animation: pulse ? "pulseR 2s infinite" : "none" }} />;
}

function Av({ name, size = 36 }) {
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", flexShrink: 0, background: avc(name), display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.33, fontWeight: 700, color: "white", fontFamily: "'Syne',sans-serif", border: "1.5px solid rgba(0,212,200,0.25)" }}>
      {ini(name)}
    </div>
  );
}

function FI({ label, name, type = "text", value, onChange, placeholder, required, min, max, step, hint, options }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <label className="nx-label">{label}{required && <span style={{ color: "#FF4D6D", marginLeft: 2 }}>*</span>}</label>
      {options
        ? <select name={name} value={value} onChange={onChange} required={required} className="nx-input" style={{ cursor: "pointer" }}>
          {options.map(([v, l]) => <option key={v} value={v} style={{ background: "#0A1520", color: "#F0F8FF" }}>{l}</option>)}
        </select>
        : <input type={type} name={name} value={value} onChange={onChange} placeholder={placeholder}
          min={min} max={max} step={step} required={required} className="nx-input" />
      }
      {hint && <span style={{ fontSize: 10, color: "#5A7A90" }}>{hint}</span>}
    </div>
  );
}

/* ════════════════════════════════════════
   AUTH BACKGROUND
════════════════════════════════════════ */
function AuthBg() {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 20% 50%,rgba(0,212,200,0.07) 0%,transparent 50%),radial-gradient(ellipse at 80% 20%,rgba(245,166,35,0.05) 0%,transparent 50%),radial-gradient(ellipse at 60% 80%,rgba(124,58,237,0.05) 0%,transparent 50%),#020408` }} />
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.035 }}>
        <defs><pattern id="agrid" width="52" height="52" patternUnits="userSpaceOnUse"><path d="M 52 0 L 0 0 0 52" fill="none" stroke="#00D4C8" strokeWidth="0.5" /></pattern></defs>
        <rect width="100%" height="100%" fill="url(#agrid)" />
      </svg>
      <div style={{ position: "absolute", top: "15%", left: "8%", width: 320, height: 320, background: "radial-gradient(circle,rgba(0,212,200,0.05) 0%,transparent 70%)", borderRadius: "50%", animation: "floatY 9s ease-in-out infinite" }} />
      <div style={{ position: "absolute", bottom: "10%", right: "10%", width: 420, height: 420, background: "radial-gradient(circle,rgba(245,166,35,0.04) 0%,transparent 70%)", borderRadius: "50%", animation: "floatY 11s ease-in-out infinite 2s" }} />
    </div>
  );
}

/* ════════════════════════════════════════
   TEAM PAGE
════════════════════════════════════════ */
const TEAM = [
  { id: "NXL-001", role: "HOLDER NAME // MENTORSHIP", name: "DEBDATTA PANDA", desig: "DEVELOPERS", dept: "Computer Science", desc: "COLLEGE : ITER, SOA UNIVERSITY\nYEAR : FIRST YEAR\nBATCH : 2025-2029", img: "/docs/images/Debdatta.jpeg" },
  { id: "NXL-002", role: "HOLDER NAME // MENTORSHIP", name: "RITISHA SAHOO", desig: "DEVELOPERS", dept: "Computer Science", desc: "COLLEGE : ITER, SOA UNIVERSITY\nYEAR : FIRST YEAR\nBATCH : 2025-2029", img: "/docs/images/Ritisha.jpeg" },
  { id: "NXL-003", role: "HOLDER NAME // LEADERSHIP", name: "SAHIL KUMAR SAHOO", desig: "DEVELOPERS", dept: "Computer Science", desc: "COLLEGE : ITER, SOA UNIVERSITY\nYEAR : FIRST YEAR\nBATCH : 2025-2029", img: "/docs/images/Sahil.jpeg" },
  { id: "NXL-004", role: "HOLDER NAME // INNOVATION", name: "SOUMYASHRI MOHAPATRA", desig: "DEVELOPERS", dept: "Computer Science", desc: "COLLEGE : ITER, SOA UNIVERSITY\nYEAR : FIRST YEAR\nBATCH : 2025-2029", img: "/docs/images/Soumya.jpeg" },
  { id: "NXL-005", role: "HOLDER NAME // MENTORSHIP", name: "ROHIT JAIN", desig: "DEVELOPERS", dept: "Computer Science", desc: "COLLEGE : ITER, SOA UNIVERSITY\nYEAR : FIRST YEAR\nBATCH : 2025-2029", img: "/docs/images/Rohit.jpeg" }
];

function TeamCard({ t }) {
  // Use a uniform primary color suite for all cards
  const c = "#F5A623";
  const rgb = "245,166,35";
  const dim = "#C4841C";

  return (
    <div
      className="nx-card-hover"
      style={{
        position: "relative", width: "100%", maxWidth: 460,
        background: "linear-gradient(180deg,rgba(20,15,5,0.9),rgba(5,5,5,0.95))",
        border: `1px solid rgba(${rgb},0.3)`, borderRadius: 16, overflow: "hidden",
        fontFamily: "'Space Mono',monospace", padding: 28, color: "#F0F8FF",
        transition: "all 0.3s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = `rgba(${rgb}, 0.8)`;
        e.currentTarget.style.boxShadow = `0 0 30px rgba(${rgb}, 0.4)`;
        e.currentTarget.style.transform = "translateY(-4px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = `rgba(${rgb}, 0.3)`;
        e.currentTarget.style.boxShadow = "none";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      <div style={{ position: "absolute", right: -25, top: "45%", fontSize: 75, fontWeight: 900, color: "rgba(255,255,255,0.02)", transform: "rotate(90deg)", fontFamily: "'Syne',sans-serif", pointerEvents: "none" }}>GFG</div>

      {/* Top Header */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 28 }}>
        <div>
          <div style={{ fontSize: 10, color: dim, letterSpacing: "0.08em" }}>NEXUS LEARN</div>
          <div style={{ fontSize: 13, color: c, fontWeight: 700, letterSpacing: "0.1em", marginTop: 2 }}>OFFICIAL ID</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <NxLogo size={36} />
        </div>
      </div>

      {/* Middle section */}
      <div style={{ display: "flex", gap: 20 }}>
        {/* Left icon box */}
        <div style={{ position: "relative", width: 120, height: 120, border: `1px solid rgba(${rgb},0.25)`, background: "#000", flexShrink: 0, overflow: "hidden", borderRadius: 4 }}>
          {/* Photo */}
          <img src={process.env.PUBLIC_URL + t.img} alt={t.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          {/* Corner accents */}
          <div style={{ position: "absolute", top: 0, left: 0, width: 8, height: 8, borderTop: `2px solid ${c}`, borderLeft: `2px solid ${c}`, zIndex: 2 }} />
          <div style={{ position: "absolute", top: 0, right: 0, width: 8, height: 8, borderTop: `2px solid ${c}`, borderRight: `2px solid ${c}`, zIndex: 2 }} />
          <div style={{ position: "absolute", bottom: 0, left: 0, width: 8, height: 8, borderBottom: `2px solid ${c}`, borderLeft: `2px solid ${c}`, zIndex: 2 }} />
          <div style={{ position: "absolute", bottom: 0, right: 0, width: 8, height: 8, borderBottom: `2px solid ${c}`, borderRight: `2px solid ${c}`, zIndex: 2 }} />
        </div>

        {/* Right details */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 9, color: dim, letterSpacing: "0.05em", marginBottom: 6 }}>{t.role}</div>
          <div style={{ fontSize: 19, fontFamily: "'Syne',sans-serif", fontWeight: 800, color: "#F0F8FF", lineHeight: 1.15, marginBottom: 14 }}>{t.name}</div>

          <div style={{ display: "flex", borderLeft: `2px solid rgba(${rgb},0.3)`, paddingLeft: 10, marginBottom: 16, gap: 14 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 9, color: "#9BB5CC", letterSpacing: "0.05em", marginBottom: 3 }}>DESIGNATION</div>
              <div style={{ fontSize: 11, color: "#F0F8FF", fontWeight: 700 }}>{t.desig}</div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 9, color: "#9BB5CC", letterSpacing: "0.05em", marginBottom: 3 }}>DEPARTMENT</div>
              <div style={{ fontSize: 11, color: "#F0F8FF", fontWeight: 700 }}>{t.dept}</div>
            </div>
          </div>

          <div style={{ fontSize: 9, color: "#9BB5CC", letterSpacing: "0.05em", marginBottom: 6 }}>PROFILE DATA</div>
          <div style={{ fontSize: 11, color: "#E2E8F0", lineHeight: 1.6 }}>
            {t.desc.split('\n').map((line, idx) => (
              <div key={idx}>{line}</div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginTop: 28, borderTop: `1px solid rgba(${rgb},0.15)`, paddingTop: 18 }}>
        <div style={{ width: "55%", height: 35, background: `repeating-linear-gradient(90deg, ${c}, ${c} 2px, transparent 2px, transparent 4px, ${c} 4px, ${c} 5px, transparent 5px, transparent 8px, ${c} 8px, ${c} 12px, transparent 12px, transparent 15px)`, opacity: 0.35 }} />
        <div style={{ textAlign: "right", display: "flex", alignItems: "center", gap: 12 }}>
          <div>
            <div style={{ fontSize: 9, color: dim, letterSpacing: "0.05em", marginBottom: 3 }}>ID NUMBER</div>
            <div style={{ fontSize: 13, color: c, fontWeight: 700 }}>{t.id}</div>
          </div>
          <div style={{ width: 28, height: 28, border: `1px solid rgba(${rgb},0.4)`, borderRadius: 4, display: "flex", flexWrap: "wrap", padding: 3, gap: 2 }}>
            <div style={{ width: 9, height: 9, background: c, borderRadius: 1 }} />
            <div style={{ width: 9, height: 9, background: c, borderRadius: 1 }} />
            <div style={{ width: 9, height: 9, background: c, borderRadius: 1 }} />
            <div style={{ width: 9, height: 9, background: c, borderRadius: 1 }} />
          </div>
        </div>
      </div>
    </div>
  );
}

function TeamPage({ onBack }) {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return (
    <div style={{ minHeight: "100vh", fontFamily: "'DM Sans',sans-serif", position: "relative", backgroundColor: "#020408" }}>
      <AuthBg />
      <button onClick={onBack} style={{ position: "fixed", top: 18, left: 20, zIndex: 50, display: "flex", alignItems: "center", gap: 6, background: "rgba(10,21,32,0.85)", border: "1px solid rgba(0,212,200,0.25)", color: "#9BB5CC", borderRadius: 8, padding: "7px 14px", fontSize: 12, fontWeight: 600, cursor: "pointer", backdropFilter: "blur(8px)", transition: "all 0.2s", fontFamily: "'Space Mono',monospace" }}
        onMouseEnter={e => { e.currentTarget.style.color = "#00D4C8"; e.currentTarget.style.borderColor = "rgba(0,212,200,0.6)"; }}
        onMouseLeave={e => { e.currentTarget.style.color = "#9BB5CC"; e.currentTarget.style.borderColor = "rgba(0,212,200,0.25)"; }}>
        ← Home
      </button>

      <div style={{ position: "relative", zIndex: 1, padding: isMobile ? "70px 16px 40px" : "80px 24px", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 60, animation: "fadeUp 0.6s ease" }}>
          <div style={{ display: "inline-flex", padding: "6px 18px", borderRadius: 24, border: "1px solid rgba(245,166,35,0.4)", color: "#F5A623", fontSize: 10, fontFamily: "'Space Mono',monospace", letterSpacing: "0.1em", marginBottom: 20, background: "rgba(245,166,35,0.05)" }}>
            ◈ INNOVATION HUB
          </div>
          <h1 style={{ fontFamily: "'Syne',sans-serif", fontSize: "clamp(32px,5vw,54px)", fontWeight: 800, color: "#F0F8FF", margin: 0, letterSpacing: "-0.01em" }}>
            SYSTEM <span style={{ color: "#F5A623", textShadow: "0 0 20px rgba(245,166,35,0.4)" }}>DEVELOPERS</span>
          </h1>
          <div style={{ fontSize: 16, color: "#9BB5CC", fontFamily: "'Space Mono',monospace", letterSpacing: "0.15em", marginTop: 12 }}>
            NEXUS LEARN DEPLOYMENT UNIT
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, marginTop: 16 }}>
            <div style={{ height: 1, width: 100, background: "linear-gradient(90deg,transparent,rgba(245,166,35,0.4))" }} />
            <svg width="18" height="20" viewBox="0 0 24 24" fill="none" stroke="#F5A623" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
            <div style={{ height: 1, width: 100, background: "linear-gradient(270deg,transparent,rgba(245,166,35,0.4))" }} />
          </div>
        </div>

        <div style={{ position: "relative", maxWidth: 1000, margin: "0 auto", paddingBottom: 60, animation: "fadeUp 0.6s ease 0.2s both" }}>
          {/* Vertical Center Line — hidden on mobile */}
          {!isMobile && <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: 1, background: "rgba(255,255,255,0.08)", transform: "translateX(-50%)" }} />}

          {TEAM.map((t, i) => {
            const isLeft = i % 2 === 0;
            const rgb = "245,166,35";
            const c = "#F5A623";

            if (isMobile) {
              return (
                <div key={t.id} style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
                  <TeamCard t={t} />
                </div>
              );
            }

            return (
              <div key={t.id} style={{ display: "flex", justifyContent: isLeft ? "flex-start" : "flex-end", alignItems: "center", position: "relative", marginBottom: i === TEAM.length - 1 ? 0 : 100, width: "100%" }}>
                {/* Center Node */}
                <div style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)", zIndex: 10 }}>
                  <div style={{ width: 44, height: 44, border: `1.5px solid ${c}`, borderRadius: 12, transform: "rotate(45deg)", display: "flex", alignItems: "center", justifyContent: "center", background: "#020408", boxShadow: `0 0 20px rgba(${rgb}, 0.2)` }}>
                    <div style={{ width: 10, height: 10, background: c, borderRadius: "2px", transform: "rotate(-45deg)" }} />
                  </div>
                </div>

                {/* Large Background Number */}
                <div style={{ position: "absolute", top: "50%", [isLeft ? "left" : "right"]: "55%", transform: "translateY(-50%)", opacity: 0.03, pointerEvents: "none", zIndex: 0 }}>
                  <div style={{ fontSize: 160, fontWeight: 900, fontFamily: "'Syne', sans-serif", color: c, whiteSpace: "nowrap" }}>0{i + 1}</div>
                </div>

                {/* Tech Info on Empty Side */}
                <div style={{ position: "absolute", top: "50%", [isLeft ? "left" : "right"]: "calc(50% + 60px)", transform: "translateY(-50%)", zIndex: 1, display: "flex", flexDirection: "column", gap: 16, alignItems: isLeft ? "flex-start" : "flex-end", textAlign: isLeft ? "left" : "right", width: "calc(50% - 80px)" }}>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: isLeft ? "flex-start" : "flex-end" }}>
                    {t.dept.split(" ").concat(t.desig.split(" ")).slice(0, 3).map((w, j) => (
                      <span key={j} style={{ padding: "4px 12px", borderRadius: 20, border: `1px solid rgba(${rgb},0.3)`, fontSize: 9, color: c, fontFamily: "'Space Mono',monospace", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                        {w}
                      </span>
                    ))}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <div style={{ fontSize: 9, color: "#5A7A90", fontFamily: "'Space Mono',monospace", letterSpacing: "0.08em", textTransform: "uppercase" }}>SYSTEM_STATUS: <span style={{ color: "#F0F8FF" }}>ACTIVE</span></div>
                    <div style={{ fontSize: 9, color: "#5A7A90", fontFamily: "'Space Mono',monospace", letterSpacing: "0.08em", textTransform: "uppercase" }}>NETWORK_SYNC: <span style={{ color: "#F0F8FF" }}>COMPLETED</span></div>
                  </div>
                  <div style={{ position: "absolute", top: "100%", [isLeft ? "left" : "right"]: 0, marginTop: 40, width: 80, height: 80, border: `1px solid rgba(${rgb},0.08)`, borderRadius: 20, transform: "rotate(45deg)", pointerEvents: "none" }} />
                </div>

                {/* Card Container */}
                <div style={{ width: "calc(50% - 60px)", display: "flex", justifyContent: isLeft ? "flex-end" : "flex-start", zIndex: 1 }}>
                  <TeamCard t={t} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════
   LANDING PAGE
════════════════════════════════════════ */
function LandingPage({ onConnect, onMeetTeam }) {
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    {
      icon: "◈", name: "SENTINEL", color: "#00D4C8",
      desc: "Real-time Cognitive Load Guardian",
      detail: "HMM latent state estimation combined with LSTM Autoencoder anomaly detection tracks your mental fatigue every second. Multi-armed bandit algorithms deploy personalised micro-interventions before burnout occurs."
    },
    {
      icon: "◎", name: "IRIS", color: "#A78BFA",
      desc: "Adaptive Reading Environment",
      detail: "Proximal Policy Optimisation reinforcement learning continuously adjusts 12 typographic CSS parameters — font, spacing, contrast, line-width — to match your real-time cognitive state. Reading becomes effortless."
    },
    {
      icon: "◆", name: "APOLLO", color: "#F5A623",
      desc: "Institutional Control Room",
      detail: "XGBoost dropout risk modelling with SHAP explainability, Prophet time-series forecasting, and DoWhy causal inference give institutions unprecedented insight into student trajectories — weeks before crisis hits."
    },
  ];

  const stats = [
    { n: "94%", label: "Prediction Accuracy" }, { n: "3×", label: "Earlier Intervention" },
    { n: "12", label: "CSS Params Adapted" }, { n: "72h", label: "Forecast Window" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#020408", fontFamily: "'DM Sans',sans-serif", overflowX: "hidden" }}>
      {/* Background */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.04 }}>
          <defs><pattern id="lgrid" width="60" height="60" patternUnits="userSpaceOnUse"><path d="M 60 0 L 0 0 0 60" fill="none" stroke="#00D4C8" strokeWidth="0.5" /></pattern></defs>
          <rect width="100%" height="100%" fill="url(#lgrid)" />
        </svg>
        <div style={{ position: "absolute", top: "8%", left: "3%", width: 500, height: 500, background: "radial-gradient(circle,rgba(0,212,200,0.06) 0%,transparent 65%)", borderRadius: "50%", animation: "floatY 10s ease-in-out infinite" }} />
        <div style={{ position: "absolute", bottom: "10%", right: "5%", width: 600, height: 600, background: "radial-gradient(circle,rgba(245,166,35,0.04) 0%,transparent 65%)", borderRadius: "50%", animation: "floatY 13s ease-in-out infinite 3s" }} />
        <div style={{ position: "absolute", top: "40%", left: "45%", width: 700, height: 700, background: "radial-gradient(circle,rgba(124,58,237,0.03) 0%,transparent 60%)", borderRadius: "50%", transform: "translate(-50%,-50%)" }} />
        {[{ x: "18%", y: "28%", c: "#00D4C8" }, { x: "72%", y: "18%", c: "#F5A623" }, { x: "88%", y: "62%", c: "#A78BFA" }, { x: "12%", y: "72%", c: "#00D4C8" }, { x: "55%", y: "85%", c: "#F5A623" }].map((n, i) => (
          <div key={i} style={{ position: "absolute", left: n.x, top: n.y, width: 7, height: 7, borderRadius: "50%", background: n.c, boxShadow: `0 0 14px ${n.c}`, animation: `nodeFloat ${4 + i}s ease-in-out infinite ${i * 0.6}s` }} />
        ))}
      </div>

      {/* Nav */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, padding: "0 16px", borderBottom: "1px solid rgba(0,212,200,0.1)", background: "rgba(2,4,8,0.88)", backdropFilter: "blur(20px)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", height: 60, gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <NxLogo size={34} />
            <div>
              <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 15, fontWeight: 800, color: "#F0F8FF", letterSpacing: "-0.01em", lineHeight: 1 }}>NEXUS LEARN</div>
              <div style={{ fontSize: 8, color: "#00D4C8", fontFamily: "'Space Mono',monospace", letterSpacing: "0.1em" }}>COGNITIVE AI PLATFORM</div>
            </div>
          </div>
          <div style={{ flex: 1 }} />
          {["Platform", "Research", "About"].map(l => (
            <span key={l} className="nx-mobile-xs-hide" style={{ fontSize: 13, color: "#9BB5CC", cursor: "pointer", fontWeight: 500, padding: "4px 10px", borderRadius: 5, transition: "color 0.2s" }}
              onMouseEnter={e => e.target.style.color = "#00D4C8"} onMouseLeave={e => e.target.style.color = "#9BB5CC"}>{l}</span>
          ))}
          <button className="nx-btn nx-btn-primary" onClick={onConnect} style={{ padding: "8px 16px", fontSize: 11 }}>Connect →</button>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "100px 16px 60px", position: "relative", zIndex: 1 }}>
        <div style={{ maxWidth: 920, textAlign: "center", width: "100%" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 16px", borderRadius: 24, background: "rgba(0,212,200,0.08)", border: "1px solid rgba(0,212,200,0.24)", marginBottom: 28, animation: "fadeUp 0.6s ease" }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#00D4C8", animation: "pulseR 2s infinite", flexShrink: 0 }} />
            <span style={{ fontSize: 10, color: "#00D4C8", fontFamily: "'Space Mono',monospace", letterSpacing: "0.08em" }}>LIVE COGNITIVE INTELLIGENCE SYSTEM</span>
          </div>
          <h1 style={{ fontFamily: "'Syne',sans-serif", fontSize: "clamp(32px,7vw,82px)", fontWeight: 800, lineHeight: 1.04, marginBottom: 24, animation: "fadeUp 0.6s ease 0.1s both", background: "linear-gradient(135deg,#F0F8FF 0%,#00D4C8 45%,#F5A623 85%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
            The AI Brain Behind<br />Every Student's Success
          </h1>
          <p style={{ fontSize: "clamp(13px,2vw,18px)", color: "#9BB5CC", lineHeight: 1.8, maxWidth: 680, margin: "0 auto 36px", animation: "fadeUp 0.6s ease 0.2s both" }}>
            NEXUS LEARN deploys three adaptive AI engines — <span style={{ color: "#00D4C8", fontWeight: 600 }}>SENTINEL</span>, <span style={{ color: "#A78BFA", fontWeight: 600 }}>IRIS</span>, and <span style={{ color: "#F5A623", fontWeight: 600 }}>APOLLO</span> — to build a real-time Digital Twin of every learner, predicting and preventing academic failure before it happens.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "center", animation: "fadeUp 0.6s ease 0.3s both", marginBottom: 60 }}>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <button className="nx-btn nx-btn-primary" onClick={onConnect} style={{ fontSize: 14, padding: "13px 28px" }}>🚀 Get Your Digital Twin</button>
              <button className="nx-btn nx-btn-ghost" style={{ fontSize: 14, padding: "13px 28px" }}>Watch Demo ↗</button>
            </div>
            <button className="nx-btn" onClick={onMeetTeam} style={{ fontSize: 13, padding: "11px 28px", background: "linear-gradient(135deg,rgba(0,212,200,0.1),rgba(124,58,237,0.1))", color: "#00D4C8", border: "1px solid rgba(0,212,200,0.3)", cursor: "pointer", borderRadius: 8 }}>
              Meet Our Team
            </button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 1, background: "rgba(0,212,200,0.08)", border: "1px solid rgba(0,212,200,0.16)", borderRadius: 14, overflow: "hidden", animation: "fadeUp 0.6s ease 0.4s both" }}>
            {stats.map(({ n, label }, i) => (
              <div key={i} style={{ padding: "22px 12px", textAlign: "center", borderRight: i % 2 === 0 ? "1px solid rgba(0,212,200,0.1)" : "none", borderBottom: i < 2 ? "1px solid rgba(0,212,200,0.1)" : "none" }}>
                <div style={{ fontFamily: "'Syne',sans-serif", fontSize: "clamp(24px,4vw,40px)", fontWeight: 800, color: "#00D4C8", letterSpacing: "-0.02em" }}>{n}</div>
                <div style={{ fontSize: 10, color: "#5A7A90", fontFamily: "'Space Mono',monospace", marginTop: 4, letterSpacing: "0.05em" }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Three engines */}
      <section style={{ padding: "80px 16px", position: "relative", zIndex: 1 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <span className="tag tag-teal" style={{ marginBottom: 14, display: "inline-flex" }}>HOW IT WORKS</span>
            <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: "clamp(24px,4vw,50px)", fontWeight: 800, color: "#F0F8FF", marginTop: 12 }}>Three Engines. One Digital Twin.</h2>
            <p style={{ fontSize: 14, color: "#9BB5CC", marginTop: 12, maxWidth: 540, margin: "12px auto 0" }}>Your real-time cognitive profile is continuously modelled, predicted, and adapted.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 12 }}>
            {features.map((f, i) => (
              <div key={i} className="nx-card" onClick={() => setActiveFeature(i)}
                style={{ padding: "28px 24px", cursor: "pointer", borderColor: activeFeature === i ? f.color + "55" : "rgba(0,212,200,0.12)", background: activeFeature === i ? "linear-gradient(135deg,rgba(15,30,46,0.97),rgba(6,13,20,0.99))" : undefined }}>
                <div style={{ fontSize: 30, marginBottom: 14, color: f.color }}>{f.icon}</div>
                <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, fontWeight: 700, color: f.color, letterSpacing: "0.1em", marginBottom: 8 }}>{f.name}</div>
                <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 16, fontWeight: 700, color: "#F0F8FF", marginBottom: 12 }}>{f.desc}</div>
                <p style={{ fontSize: 13, color: "#9BB5CC", lineHeight: 1.75 }}>{f.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Digital Twin visual */}
      <section style={{ padding: "60px 16px", position: "relative", zIndex: 1 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 48, alignItems: "center" }}>
            <div>
              <span className="tag tag-amber" style={{ marginBottom: 18, display: "inline-flex" }}>YOUR DIGITAL TWIN</span>
              <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: "clamp(26px,3.5vw,44px)", fontWeight: 800, color: "#F0F8FF", lineHeight: 1.1, marginBottom: 22, marginTop: 12 }}>A Living Model of Your Cognitive State</h2>
              <p style={{ fontSize: 14, color: "#9BB5CC", lineHeight: 1.85, marginBottom: 28 }}>
                Unlike static LMS dashboards, NEXUS LEARN builds a continuously updated model of <em>you</em> — integrating sleep, stress, reading behaviour, academic performance, and wellbeing into a unified Cognitive Load Index that drives personalised interventions in real time.
              </p>
              {["Fatigue Index updated every 6 seconds", "IRIS adapts your reading environment automatically", "APOLLO predicts dropout 3–6 weeks in advance", "72-hour cognitive weather forecast always visible"].map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 11, marginBottom: 11 }}>
                  <span style={{ width: 20, height: 20, borderRadius: "50%", background: "rgba(0,212,200,0.12)", border: "1px solid rgba(0,212,200,0.35)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "#00D4C8", flexShrink: 0 }}>✓</span>
                  <span style={{ fontSize: 13, color: "#9BB5CC" }}>{item}</span>
                </div>
              ))}
              <button className="nx-btn nx-btn-primary" onClick={onConnect} style={{ marginTop: 34, fontSize: 13, padding: "13px 30px" }}>Create My Digital Twin</button>
            </div>
            <div style={{ position: "relative", height: 400, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ position: "absolute", width: 290, height: 290, borderRadius: "50%", border: "1px solid rgba(0,212,200,0.18)", animation: "rotateSlow 22s linear infinite" }} />
              <div style={{ position: "absolute", width: 200, height: 200, borderRadius: "50%", border: "1px dashed rgba(245,166,35,0.18)", animation: "rotateSlow 16s linear infinite reverse" }} />
              <div style={{ width: 120, height: 120, borderRadius: "50%", background: "radial-gradient(circle,rgba(0,212,200,0.18),rgba(124,58,237,0.1))", border: "2px solid rgba(0,212,200,0.4)", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 5, boxShadow: "0 0 44px rgba(0,212,200,0.18)", animation: "borderGlow 3s ease-in-out infinite" }}>
                <NxLogo size={42} />
                <div style={{ fontSize: 8, color: "#00D4C8", fontFamily: "'Space Mono',monospace", letterSpacing: "0.05em" }}>CORE AI</div>
              </div>
              {[{ label: "SENTINEL", color: "#00D4C8", angle: -90, r: 145 }, { label: "IRIS", color: "#A78BFA", angle: 30, r: 145 }, { label: "APOLLO", color: "#F5A623", angle: 150, r: 145 }].map(({ label, color, angle, r }) => {
                const rad = angle * Math.PI / 180;
                return (
                  <div key={label} style={{ position: "absolute", left: `calc(50% + ${Math.cos(rad) * r}px - 36px)`, top: `calc(50% + ${Math.sin(rad) * r}px - 18px)`, padding: "6px 13px", borderRadius: 8, background: "rgba(10,21,32,0.97)", border: `1px solid ${color}44`, fontSize: 11, fontWeight: 700, color, fontFamily: "'Space Mono',monospace", letterSpacing: "0.05em", whiteSpace: "nowrap" }}>
                    {label}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "60px 16px", position: "relative", zIndex: 1, textAlign: "center" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <div style={{ padding: "48px 24px", borderRadius: 22, background: "linear-gradient(135deg,rgba(0,212,200,0.07),rgba(124,58,237,0.07))", border: "1px solid rgba(0,212,200,0.2)" }}>
            <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: "clamp(26px,4vw,44px)", fontWeight: 800, color: "#F0F8FF", marginBottom: 18 }}>Ready to Meet Your Digital Twin?</h2>
            <p style={{ fontSize: 14, color: "#9BB5CC", lineHeight: 1.8, marginBottom: 36 }}>Join students who have transformed their academic performance with AI-powered cognitive intelligence. Sign up in 4 minutes — your personalised analysis is ready instantly.</p>
            <button className="nx-btn nx-btn-amber" onClick={onConnect} style={{ fontSize: 16, padding: "16px 48px" }}>Connect with Us →</button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: "32px", borderTop: "1px solid rgba(0,212,200,0.08)", textAlign: "center", position: "relative", zIndex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 8 }}>
          <NxLogo size={24} /><span style={{ fontFamily: "'Syne',sans-serif", fontSize: 13, fontWeight: 700, color: "#9BB5CC" }}>NEXUS LEARN</span>
        </div>
        <p style={{ fontSize: 11, color: "#5A7A90", fontFamily: "'Space Mono',monospace" }}>© 2026 NEXUS LEARN · Cognitive AI Platform · All rights reserved</p>
      </footer>
    </div>
  );
}

/* ════════════════════════════════════════
   WELCOME POPUP
════════════════════════════════════════ */
function WelcomePopup({ name, isNew, onClose }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(2,4,8,0.88)", zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, backdropFilter: "blur(10px)" }}>
      <div className="nx-card" style={{ padding: "40px 32px", maxWidth: 420, width: "100%", textAlign: "center", animation: "popIn 0.4s cubic-bezier(0.34,1.56,0.64,1)" }}>
        <div style={{ width: 64, height: 64, borderRadius: "50%", margin: "0 auto 16px", background: "linear-gradient(135deg,rgba(0,212,200,0.2),rgba(124,58,237,0.2))", border: "1px solid rgba(0,212,200,0.4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28 }}>
          {isNew ? "🎉" : "⚡"}
        </div>
        <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 22, fontWeight: 800, color: "#F0F8FF", marginBottom: 10 }}>{isNew ? "Welcome to NEXUS LEARN!" : "Welcome back!"}</div>
        <p style={{ fontSize: 13, color: "#9BB5CC", lineHeight: 1.7, marginBottom: isNew ? 8 : 20 }}>
          {isNew ? `Hi ${name.split(" ")[0]}! Your Cognitive Profile is live. SENTINEL, IRIS, and APOLLO have completed your Digital Twin analysis.` : `Hi ${name.split(" ")[0]}! Your Digital Twin has been refreshed.`}
        </p>
        {isNew && <p style={{ fontSize: 10, color: "#5A7A90", fontFamily: "'Space Mono',monospace", marginBottom: 24, letterSpacing: "0.04em" }}>UPDATE YOUR PROFILE EVERY 24H FOR FRESH ANALYSIS</p>}
        <button className="nx-btn nx-btn-primary" onClick={onClose} style={{ width: "100%", fontSize: 13, padding: "12px" }}>{isNew ? "Explore My Dashboard →" : "View My Analysis →"}</button>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════
   SIGN UP
════════════════════════════════════════ */
const EMPTY_FORM = {
  fullName: "", email: "", password: "", confirmPassword: "", cohort: "", studentId: "", institution: "", yearOfStudy: "",
  sleepHours: "7", stressLevel: "5", studyHoursPerDay: "4", exercisePerWeek: "3", screenTimeHours: "6", caffeine: "2", lastRestDays: "1",
  hydration: "moderate", breakFrequency: "2", mentalHealthRating: "6", socialEngagement: "3", deadlineAnxiety: "moderate", workingStatus: "student",
  readingSpeed: "250", motivationLevel: "7", courseDifficulty: "3", missedDeadlines: "0", attendanceRate: "85", gpaLast: "3.0",
};

function SignUpScreen({ onDone, onBack }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [err, setErr] = useState(""), [loading, setLoading] = useState(false), [step, setStep] = useState(1);
  const h = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));
  const validate = () => {
    if (step === 1) {
      if (!form.fullName.trim() || !form.email.trim() || !form.password || !form.cohort || !form.yearOfStudy) { setErr("Please fill all required fields."); return false; }
      if (form.password !== form.confirmPassword) { setErr("Passwords do not match."); return false; }
      if (form.password.length < 6) { setErr("Password must be at least 6 characters."); return false; }
    }
    return true;
  };
  const next = () => { if (validate()) { setErr(""); setStep(s => s + 1); } };
  const submit = async () => {
    setLoading(true); setErr("");
    try {
      await fbCreateUser(form.email.toLowerCase(), form.password);
      const now = new Date().toISOString(), uid = `u_${Date.now()}`;
      const profile = { sleepHours: form.sleepHours, stressLevel: form.stressLevel, studyHoursPerDay: form.studyHoursPerDay, exercisePerWeek: form.exercisePerWeek, screenTimeHours: form.screenTimeHours, caffeine: form.caffeine, lastRestDays: form.lastRestDays, hydration: form.hydration, breakFrequency: form.breakFrequency, mentalHealthRating: form.mentalHealthRating, socialEngagement: form.socialEngagement, deadlineAnxiety: form.deadlineAnxiety, workingStatus: form.workingStatus, readingSpeed: form.readingSpeed, motivationLevel: form.motivationLevel, courseDifficulty: form.courseDifficulty, missedDeadlines: form.missedDeadlines, attendanceRate: form.attendanceRate, gpaLast: form.gpaLast };
      const u = { uid, email: form.email.toLowerCase(), fullName: form.fullName, cohort: form.cohort, studentId: form.studentId || uid.slice(-6).toUpperCase(), institution: form.institution || "", yearOfStudy: form.yearOfStudy, profile, createdAt: now, lastUpdated: now, loginHistory: [now] };
      await saveUser(u);
      setLoading(false); onDone(u, true);
    } catch (e) {
      const msg = e.code === "auth/email-already-in-use" ? "An account with this email already exists."
        : e.code === "auth/weak-password" ? "Password must be at least 6 characters."
          : e.message || "Sign-up failed. Please try again.";
      setErr(msg); setLoading(false);
    }
  };
  const STEPS = ["Identity", "Wellbeing", "Learning", "Academic"];
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 480);
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth <= 480);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  const g2 = { display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 12 };
  return (
    <div style={{ minHeight: "100vh", fontFamily: "'DM Sans',sans-serif", position: "relative" }}>
      <AuthBg />
      {/* Back button — top left */}
      <button onClick={onBack} style={{ position: "fixed", top: 18, left: 20, zIndex: 50, display: "flex", alignItems: "center", gap: 6, background: "rgba(10,21,32,0.85)", border: "1px solid rgba(0,212,200,0.25)", color: "#9BB5CC", borderRadius: 8, padding: "7px 14px", fontSize: 12, fontWeight: 600, cursor: "pointer", backdropFilter: "blur(8px)", transition: "all 0.2s", fontFamily: "'Space Mono',monospace" }}
        onMouseEnter={e => { e.currentTarget.style.color = "#00D4C8"; e.currentTarget.style.borderColor = "rgba(0,212,200,0.6)"; }}
        onMouseLeave={e => { e.currentTarget.style.color = "#9BB5CC"; e.currentTarget.style.borderColor = "rgba(0,212,200,0.25)"; }}>
        ← Sign In
      </button>
      <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", padding: "24px 16px" }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <NxLogo size={40} />
            <div style={{ textAlign: "left" }}>
              <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 18, fontWeight: 800, color: "#F0F8FF" }}>NEXUS LEARN</div>
              <div style={{ fontSize: 9, color: "#00D4C8", fontFamily: "'Space Mono',monospace", letterSpacing: "0.1em" }}>CREATE YOUR COGNITIVE PROFILE</div>
            </div>
          </div>
        </div>
        {/* Step bar */}
        <div style={{ display: "flex", alignItems: "center", marginBottom: 20, width: "100%", maxWidth: 560 }}>
          {STEPS.map((lbl, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", flex: 1 }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, flex: 1 }}>
                <div style={{ width: 26, height: 26, borderRadius: "50%", background: step >= i + 1 ? "linear-gradient(135deg,#00D4C8,#7C3AED)" : "rgba(10,21,32,0.9)", border: `1px solid ${step >= i + 1 ? "rgba(0,212,200,0.8)" : "rgba(0,212,200,0.18)"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: step >= i + 1 ? "#020408" : "#5A7A90", fontFamily: "'Space Mono',monospace", transition: "all 0.3s" }}>{step > i + 1 ? "✓" : i + 1}</div>
                <span style={{ fontSize: 9, color: step >= i + 1 ? "#00D4C8" : "#5A7A90", fontFamily: "'Space Mono',monospace", letterSpacing: "0.04em" }}>{lbl}</span>
              </div>
              {i < 3 && <div style={{ height: 1, flex: 1, background: step > i + 1 ? "rgba(0,212,200,0.55)" : "rgba(0,212,200,0.1)", margin: "0 3px 16px", transition: "background 0.3s" }} />}
            </div>
          ))}
        </div>
        <div className="nx-card" style={{ width: "100%", maxWidth: 560, padding: "24px", animation: "fadeUp 0.4s ease" }} key={step}>
          {step === 1 && <>
            <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 16, fontWeight: 700, color: "#F0F8FF", marginBottom: 3 }}>Account & Identity</div>
            <p style={{ fontSize: 11, color: "#5A7A90", marginBottom: 18, fontFamily: "'Space Mono',monospace" }}>Basic information and programme details</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <FI label="Full Name" name="fullName" value={form.fullName} onChange={h} placeholder="e.g. Priya Sharma" required />
              <FI label="Email Address" name="email" type="email" value={form.email} onChange={h} placeholder="you@university.ac.in" required />
              <div style={g2}>
                <FI label="Password" name="password" type="password" value={form.password} onChange={h} placeholder="Min 6 chars" required />
                <FI label="Confirm Password" name="confirmPassword" type="password" value={form.confirmPassword} onChange={h} placeholder="Repeat" required />
              </div>
              <FI label="Programme / Course" name="cohort" value={form.cohort} onChange={h} required options={COURSES} />
              <div style={g2}>
                <FI label="Year of Study" name="yearOfStudy" value={form.yearOfStudy} onChange={h} required options={[["", "Select…"], ["1", "Year 1"], ["2", "Year 2"], ["3", "Year 3"], ["4", "Year 4"], ["5", "Year 5"], ["PG1", "PG Year 1"], ["PG2", "PG Year 2"], ["PhD", "PhD"]]} />
                <FI label="Institution (optional)" name="institution" value={form.institution} onChange={h} placeholder="University name" />
              </div>
              <FI label="Student ID (optional)" name="studentId" value={form.studentId} onChange={h} placeholder="Auto-generated if blank" />
            </div>
          </>}
          {step === 2 && <>
            <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 16, fontWeight: 700, color: "#00D4C8", marginBottom: 3 }}>◈ Wellbeing & Lifestyle</div>
            <p style={{ fontSize: 11, color: "#5A7A90", marginBottom: 5, fontFamily: "'Space Mono',monospace" }}>SENTINEL uses this to model your Cognitive Load Index</p>
            <div style={{ padding: "7px 10px", borderRadius: 7, background: "rgba(0,212,200,0.06)", border: "1px solid rgba(0,212,200,0.18)", fontSize: 11, color: "#00D4C8", marginBottom: 14, lineHeight: 1.5 }}>💡 Answer for a typical weekday this semester</div>
            <div style={g2}>
              <FI label="Sleep hrs/night" name="sleepHours" type="number" value={form.sleepHours} onChange={h} min="2" max="12" step="0.5" required hint="Rec: 7–9 hrs" />
              <FI label="Stress level 1–10" name="stressLevel" type="number" value={form.stressLevel} onChange={h} min="1" max="10" required hint="1=calm, 10=overwhelmed" />
              <FI label="Study hrs/day" name="studyHoursPerDay" type="number" value={form.studyHoursPerDay} onChange={h} min="0" max="18" step="0.5" required />
              <FI label="Exercise days/wk" name="exercisePerWeek" type="number" value={form.exercisePerWeek} onChange={h} min="0" max="7" required />
              <FI label="Screen time hrs/day" name="screenTimeHours" type="number" value={form.screenTimeHours} onChange={h} min="0" max="24" step="0.5" required />
              <FI label="Caffeine drinks/day" name="caffeine" type="number" value={form.caffeine} onChange={h} min="0" max="10" required hint="Coffee, tea, energy drinks" />
              <FI label="Days since last rest" name="lastRestDays" type="number" value={form.lastRestDays} onChange={h} min="0" max="30" required hint="Full day off studying" />
              <FI label="Mental health 1–10" name="mentalHealthRating" type="number" value={form.mentalHealthRating} onChange={h} min="1" max="10" required />
              <FI label="Social engagement 1–5" name="socialEngagement" type="number" value={form.socialEngagement} onChange={h} min="1" max="5" required hint="1=isolated, 5=very social" />
              <FI label="Breaks per study session" name="breakFrequency" type="number" value={form.breakFrequency} onChange={h} min="0" max="10" required />
              <FI label="Hydration level" name="hydration" value={form.hydration} onChange={h} required options={[["good", "Good (8+ glasses/day)"], ["moderate", "Moderate (4–7 glasses)"], ["poor", "Poor (<4 glasses)"]]} />
              <FI label="Working status" name="workingStatus" value={form.workingStatus} onChange={h} required options={[["student", "Full-time Student"], ["part-time", "Part-time Job"], ["full-time", "Full-time Job"]]} />
              <FI label="Deadline anxiety" name="deadlineAnxiety" value={form.deadlineAnxiety} onChange={h} required options={[["low", "Low"], ["moderate", "Moderate"], ["high", "High"]]} />
            </div>
          </>}
          {step === 3 && <>
            <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 16, fontWeight: 700, color: "#A78BFA", marginBottom: 3 }}>◎ Learning & Reading</div>
            <p style={{ fontSize: 11, color: "#5A7A90", marginBottom: 18, fontFamily: "'Space Mono',monospace" }}>IRIS uses this to personalise your reading environment</p>
            <div style={g2}>
              <FI label="Reading speed (wpm)" name="readingSpeed" type="number" value={form.readingSpeed} onChange={h} min="50" max="800" required hint="Average: 200–300 wpm" />
              <FI label="Motivation level 1–10" name="motivationLevel" type="number" value={form.motivationLevel} onChange={h} min="1" max="10" required />
            </div>
          </>}
          {step === 4 && <>
            <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 16, fontWeight: 700, color: "#F5A623", marginBottom: 3 }}>◆ Academic Performance</div>
            <p style={{ fontSize: 11, color: "#5A7A90", marginBottom: 18, fontFamily: "'Space Mono',monospace" }}>APOLLO uses this for dropout risk modelling</p>
            <div style={g2}>
              <FI label="Course difficulty 1–5" name="courseDifficulty" type="number" value={form.courseDifficulty} onChange={h} min="1" max="5" required hint="5=extremely demanding" />
              <FI label="Missed deadlines" name="missedDeadlines" type="number" value={form.missedDeadlines} onChange={h} min="0" max="20" required />
              <FI label="Attendance rate %" name="attendanceRate" type="number" value={form.attendanceRate} onChange={h} min="0" max="100" required />
              <FI label="Last semester GPA" name="gpaLast" type="number" value={form.gpaLast} onChange={h} min="0" max="4" step="0.1" required hint="Scale 0.0–4.0" />
            </div>
          </>}
          {err && <div style={{ marginTop: 14, padding: "10px 14px", borderRadius: 8, background: "rgba(255,77,109,0.1)", border: "1px solid rgba(255,77,109,0.38)", fontSize: 12, color: "#FF4D6D" }}>{err}</div>}
          <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
            {step > 1 && <button className="nx-btn nx-btn-ghost" onClick={() => { setErr(""); setStep(s => s - 1); }} style={{ flex: 1 }}>← Back</button>}
            {step < 4 && <button className="nx-btn nx-btn-primary" onClick={next} style={{ flex: 2 }}>Continue →</button>}
            {step === 4 && <button className="nx-btn nx-btn-amber" onClick={submit} disabled={loading} style={{ flex: 2, opacity: loading ? 0.6 : 1 }}>{loading ? "Creating Profile…" : "🚀 Create My Digital Twin"}</button>}
          </div>
        </div>
        <p style={{ textAlign: "center", marginTop: 16, fontSize: 12, color: "#5A7A90", fontFamily: "'Space Mono',monospace" }}>
          Already have an account?{" "}
          <button onClick={() => onDone(null, "signin")} style={{ background: "none", border: "none", color: "#00D4C8", cursor: "pointer", fontSize: 12, fontWeight: 600, fontFamily: "'Space Mono',monospace" }}>Sign In</button>
        </p>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════
   SIGN IN
════════════════════════════════════════ */
function SignInScreen({ onDone, goSignUp, onBack }) {
  const [email, setEmail] = useState(""), [pw, setPw] = useState("");
  const [err, setErr] = useState(""), [loading, setLoading] = useState(false);
  const submit = async () => {
    if (!email || !pw) { setErr("Please enter email and password."); return; }
    setLoading(true); setErr("");
    // Admin shortcut (not a Firebase user)
    if (email.toLowerCase() === ADMIN_EMAIL && pw === ADMIN_PASS) { setLoading(false); onDone({ isAdmin: true, email: ADMIN_EMAIL, fullName: "Admin" }, false); return; }
    try {
      // ── Normal Firebase sign-in ────────────────────────────────────────────
      await fbSignIn(email.toLowerCase(), pw);
      const raw = await getUser(email.toLowerCase());
      if (!raw) { setErr("Account authenticated but profile not found. Please contact support."); setLoading(false); return; }
      const updated = { ...raw, loginHistory: [...(raw.loginHistory || []), new Date().toISOString()] };
      await saveUser(updated);
      setLoading(false); onDone(updated, false);
    } catch (e) {
      // ── Lazy migration: try to migrate old localStorage account on first login
      const isNoAccount = e.code === "auth/user-not-found" || e.code === "auth/invalid-credential";
      if (isNoAccount) {
        try {
          const NS = "nx_";
          const raw = (() => { try { const r = localStorage.getItem(NS + `user:${email.toLowerCase()}`); return r ? JSON.parse(r) : null; } catch { return null; } })();
          if (raw && raw.password === pw) {
            // Create Firebase Auth account with their old password
            await fbCreateUser(email.toLowerCase(), pw);
            const { password: _omit, ...safeUser } = raw; // strip plaintext password
            await saveUser({ ...safeUser, lastUpdated: safeUser.lastUpdated || new Date().toISOString() });
            setLoading(false); onDone(safeUser, false);
            return;
          }
        } catch (migErr) {
          if (migErr.code === "auth/email-already-in-use") {
            // Auth account exists but Firestore doc is missing — try reading localStorage and saving
            try {
              const NS = "nx_";
              const raw = (() => { try { const r = localStorage.getItem(NS + `user:${email.toLowerCase()}`); return r ? JSON.parse(r) : null; } catch { return null; } })();
              if (raw) { const { password: _p, ...safeUser } = raw; await saveUser(safeUser); setLoading(false); onDone(safeUser, false); return; }
            } catch { }
          }
        }
      }
      const msg = isNoAccount ? "No account found with this email or password."
        : e.code === "auth/wrong-password" ? "Incorrect password."
          : e.code === "auth/invalid-email" ? "Invalid email address."
            : e.code === "auth/too-many-requests" ? "Too many attempts. Please wait a moment and try again."
              : e.message || "Sign-in failed. Please try again.";
      setErr(msg); setLoading(false);
    }
  };
  return (
    <div style={{ minHeight: "100vh", fontFamily: "'DM Sans',sans-serif", position: "relative" }}>
      <AuthBg />
      {/* Back button — top left */}
      <button onClick={onBack} style={{ position: "fixed", top: 18, left: 20, zIndex: 50, display: "flex", alignItems: "center", gap: 6, background: "rgba(10,21,32,0.85)", border: "1px solid rgba(0,212,200,0.25)", color: "#9BB5CC", borderRadius: 8, padding: "7px 14px", fontSize: 12, fontWeight: 600, cursor: "pointer", backdropFilter: "blur(8px)", transition: "all 0.2s", fontFamily: "'Space Mono',monospace" }}
        onMouseEnter={e => { e.currentTarget.style.color = "#00D4C8"; e.currentTarget.style.borderColor = "rgba(0,212,200,0.6)"; }}
        onMouseLeave={e => { e.currentTarget.style.color = "#9BB5CC"; e.currentTarget.style.borderColor = "rgba(0,212,200,0.25)"; }}>
        ← Home
      </button>
      <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", padding: "24px 16px" }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <NxLogo size={40} />
            <div style={{ textAlign: "left" }}>
              <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 18, fontWeight: 800, color: "#F0F8FF" }}>NEXUS LEARN</div>
              <div style={{ fontSize: 9, color: "#00D4C8", fontFamily: "'Space Mono',monospace", letterSpacing: "0.1em" }}>COGNITIVE AI PLATFORM</div>
            </div>
          </div>
        </div>
        <div className="nx-card" style={{ width: "100%", maxWidth: 420, padding: "28px", animation: "fadeUp 0.4s ease" }}>
          <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 18, fontWeight: 700, color: "#F0F8FF", marginBottom: 4 }}>Sign In</div>
          <p style={{ fontSize: 10, color: "#5A7A90", marginBottom: 22, fontFamily: "'Space Mono',monospace", letterSpacing: "0.05em" }}>ACCESS YOUR COGNITIVE DASHBOARD</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 13, marginBottom: 8 }}>
            <FI label="Email Address" name="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@university.ac.in" required />
            <FI label="Password" name="pw" type="password" value={pw} onChange={e => setPw(e.target.value)} placeholder="Your password" required />
          </div>
          {err && <div style={{ marginBottom: 13, padding: "10px 14px", borderRadius: 8, background: "rgba(255,77,109,0.1)", border: "1px solid rgba(255,77,109,0.38)", fontSize: 12, color: "#FF4D6D" }}>{err}</div>}
          <button className="nx-btn nx-btn-primary" onClick={submit} disabled={loading} style={{ width: "100%", marginTop: 10, fontSize: 14, padding: "13px", opacity: loading ? 0.6 : 1 }}>{loading ? "Signing in…" : "Sign In →"}</button>
          <div style={{ marginTop: 16, padding: "9px 12px", borderRadius: 7, background: "rgba(0,212,200,0.04)", border: "1px solid rgba(0,212,200,0.1)", fontSize: 10, color: "#5A7A90", fontFamily: "'Space Mono',monospace", textAlign: "center" }}>
            ADMIN ACCESS: admin@nexuslearn.ai / nexus2024admin
          </div>
        </div>
        <p style={{ textAlign: "center", marginTop: 16, fontSize: 12, color: "#5A7A90", fontFamily: "'Space Mono',monospace" }}>
          No account?{" "}
          <button onClick={goSignUp} style={{ background: "none", border: "none", color: "#00D4C8", cursor: "pointer", fontSize: 12, fontWeight: 600, fontFamily: "'Space Mono',monospace" }}>Create Profile</button>
        </p>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════
   RECOMMENDATIONS SECTION
════════════════════════════════════════ */
function RecommendationsSection({ profile, twin }) {
  const [recs, setRecs] = useState(null);
  const [aiLoading, setAiLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    setAiLoading(true); setRecs(null); setExpanded(null);
    if (twin?.aiPowered) {
      generateRecommendationsAI(profile, twin).then(r => { setRecs(r); setAiLoading(false); });
    } else {
      setRecs(generateRecommendations(profile, twin)); setAiLoading(false);
    }
  }, [profile, twin]);
  const pStyle = {
    critical: { bg: "rgba(255,77,109,0.07)", border: "rgba(255,77,109,0.28)", badge: "tag-red", label: "CRITICAL" },
    high: { bg: "rgba(245,166,35,0.07)", border: "rgba(245,166,35,0.28)", badge: "tag-amber", label: "HIGH" },
    moderate: { bg: "rgba(0,212,200,0.05)", border: "rgba(0,212,200,0.2)", badge: "tag-teal", label: "MODERATE" },
    positive: { bg: "rgba(16,245,158,0.05)", border: "rgba(16,245,158,0.22)", badge: "tag-green", label: "OPTIMAL" },
  };
  return (
    <div style={{ padding: "20px", borderRadius: 14, background: "linear-gradient(135deg,rgba(15,30,46,0.9),rgba(6,13,20,0.95))", border: "1px solid rgba(0,212,200,0.14)", marginTop: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 11, marginBottom: 6 }}>
        <span style={{ fontSize: 22 }}>🧠</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 14, fontWeight: 800, color: "#00D4C8", letterSpacing: "0.03em" }}>ADVICE & RECOMMENDATIONS FROM NEXUS LEARN</div>
          <div style={{ fontSize: 10, color: "#5A7A90", fontFamily: "'Space Mono',monospace", marginTop: 2, letterSpacing: "0.05em" }}>
            {twin?.aiPowered ? "⚡ NEXUS AI · FULLY PERSONALISED · BASED ON YOUR LIVE DIGITAL TWIN" : "AI-GENERATED · BASED ON YOUR CURRENT COGNITIVE PROFILE & DIGITAL TWIN ANALYSIS"}
          </div>
        </div>
        {twin?.aiPowered && !aiLoading && <span className="tag tag-violet" style={{ fontSize: 9 }}>✨ AI</span>}
      </div>
      <div style={{ height: 1, background: "rgba(0,212,200,0.1)", margin: "14px 0" }} />

      {/* Loading skeleton */}
      {aiLoading && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[1, 2, 3].map(i => (
            <div key={i} style={{ borderRadius: 10, background: "rgba(0,212,200,0.04)", border: "1px solid rgba(0,212,200,0.12)", padding: "16px", display: "flex", gap: 12, alignItems: "flex-start" }}>
              <div style={{ width: 24, height: 24, borderRadius: "50%", background: "rgba(0,212,200,0.08)", animation: "pulseR 1.5s infinite", flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ height: 13, borderRadius: 4, background: `linear-gradient(90deg,rgba(0,212,200,0.08),rgba(0,212,200,0.15),rgba(0,212,200,0.08))`, backgroundSize: "200% 100%", animation: "shimmer 1.5s infinite", marginBottom: 8, width: "60%" }} />
                <div style={{ height: 10, borderRadius: 4, background: "rgba(0,212,200,0.06)", backgroundSize: "200% 100%", animation: "shimmer 1.5s infinite 0.2s", width: "85%" }} />
              </div>
            </div>
          ))}
          <div style={{ textAlign: "center", padding: "8px", fontSize: 11, color: "#5A7A90", fontFamily: "'Space Mono',monospace", letterSpacing: "0.04em" }}>
            ◈ NEXUS AI IS ANALYSING YOUR DIGITAL TWIN…
          </div>
        </div>
      )}

      {/* Recommendations */}
      {!aiLoading && recs && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {recs.map((r, i) => {
            const ps = pStyle[r.priority] || pStyle.moderate;
            const isOpen = expanded === i;
            return (
              <div key={i} style={{ borderRadius: 10, background: ps.bg, border: `1px solid ${ps.border}`, overflow: "hidden", transition: "all 0.28s" }}>
                <div style={{ padding: "14px 16px", cursor: "pointer", display: "flex", alignItems: "flex-start", gap: 12 }} onClick={() => setExpanded(isOpen ? null : i)}>
                  <span style={{ fontSize: 20, flexShrink: 0, marginTop: 1 }}>{r.icon}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: "#F0F8FF", fontFamily: "'Syne',sans-serif" }}>{r.title}</span>
                      <span className={`tag ${ps.badge}`}>{ps.label}</span>
                      <span style={{ fontSize: 10, color: "#5A7A90", fontFamily: "'Space Mono',monospace" }}>{r.cat}</span>
                    </div>
                    {!isOpen && <p style={{ fontSize: 12, color: "#9BB5CC", lineHeight: 1.5 }}>{r.body.slice(0, 110)}…</p>}
                  </div>
                  <span style={{ color: "#00D4C8", fontSize: 13, flexShrink: 0, transition: "transform 0.28s", transform: isOpen ? "rotate(180deg)" : "none", marginTop: 2 }}>▾</span>
                </div>
                {isOpen && (
                  <div style={{ padding: "0 16px 16px 52px" }}>
                    <p style={{ fontSize: 13, color: "#9BB5CC", lineHeight: 1.85, marginBottom: 14 }}>{r.body}</p>
                    <div style={{ padding: "12px 15px", borderRadius: 9, background: "rgba(0,212,200,0.06)", border: "1px solid rgba(0,212,200,0.2)" }}>
                      <div style={{ fontSize: 10, color: "#00D4C8", fontFamily: "'Space Mono',monospace", fontWeight: 700, letterSpacing: "0.08em", marginBottom: 7 }}>◈ ACTION PLAN</div>
                      <p style={{ fontSize: 12, color: "#F0F8FF", lineHeight: 1.75 }}>{r.action}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ════════════════════════════════════════
   OVERVIEW TAB
════════════════════════════════════════ */
function OverviewTab({ profile, twin }) {
  const { fatigue, apollo, iris } = twin; const c = SIG[fatigue.signal];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 12 }}>
        <div className="nx-card" style={{ padding: "18px" }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "#00D4C8", letterSpacing: "0.1em", fontFamily: "'Space Mono',monospace", marginBottom: 12 }}>◈ SENTINEL</div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <svg width={60} height={60} viewBox="0 0 60 60" style={{ flexShrink: 0 }}>
              <circle cx={30} cy={30} r={24} fill="none" stroke="rgba(0,212,200,0.1)" strokeWidth={5} />
              <circle cx={30} cy={30} r={24} fill="none" stroke={c.accent} strokeWidth={5} strokeDasharray={`${2 * Math.PI * 24 * (fatigue.score / 100)} ${2 * Math.PI * 24 * (1 - fatigue.score / 100)}`} strokeLinecap="round" transform="rotate(-90 30 30)" style={{ transition: "stroke-dasharray 1.2s ease" }} />
              <text x={30} y={34} textAnchor="middle" fontSize={14} fontWeight={700} fill={c.accent} fontFamily="'Space Mono',monospace">{fatigue.score}</text>
            </svg>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: c.accent, fontFamily: "'Syne',sans-serif" }}>{c.label}</div>
              <div style={{ fontSize: 11, color: "#5A7A90", marginTop: 2, fontFamily: "'Space Mono',monospace" }}>{STATE_LABEL[fatigue.currentState]}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 5 }}>
                <Dot signal={fatigue.signal} size={6} pulse={fatigue.signal === "red"} />
                <span style={{ fontSize: 10, color: SIG[fatigue.signal].text }}>72h: {SIG[fatigue.forecast.next24h].label}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="nx-card" style={{ padding: "18px" }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "#F5A623", letterSpacing: "0.1em", fontFamily: "'Space Mono',monospace", marginBottom: 12 }}>◆ APOLLO</div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ fontSize: 30, fontWeight: 800, fontFamily: "'Syne',sans-serif", color: RISK_COLOR[apollo.risk] }}>{(apollo.riskScore * 100).toFixed(0)}<span style={{ fontSize: 14 }}>%</span></div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: RISK_COLOR[apollo.risk], textTransform: "uppercase", letterSpacing: "0.06em", fontFamily: "'Space Mono',monospace" }}>{apollo.risk} risk</div>
              <div style={{ fontSize: 10, color: "#5A7A90", marginTop: 3 }}>GPA {apollo.gpaLast.toFixed(1)} · {apollo.attendanceRate}% att</div>
            </div>
          </div>
        </div>
        <div className="nx-card" style={{ padding: "18px" }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "#A78BFA", letterSpacing: "0.1em", fontFamily: "'Space Mono',monospace", marginBottom: 12 }}>◎ IRIS · v{iris.policyVersion}</div>
          {[["Font Size", iris.fontSize], ["Line Height", iris.lineHeight], ["Background", iris.backgroundColor], ["Reward", iris.rewardSignal]].map(([k, v]) => (
            <div key={k} style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 5 }}>
              <span style={{ color: "#5A7A90" }}>{k}</span>
              <span style={{ fontFamily: "'Space Mono',monospace", color: "#00D4C8", fontSize: 10 }}>{v}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="nx-card" style={{ padding: "16px" }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: "#A78BFA", letterSpacing: "0.1em", fontFamily: "'Space Mono',monospace", marginBottom: 12 }}>⬡ NEXUS CORE BRAIN — UNIFIED LEARNER MODEL FLAGS</div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {[{ l: "dense_text_allowed", v: fatigue.score < 50 }, { l: "high_complexity_allowed", v: fatigue.score < 66 }, { l: "next_assessment_cleared", v: fatigue.score < 66 }, { l: "iris_fatigue_mode", v: fatigue.score >= 50 }, { l: "pastoral_care_flag", v: fatigue.isAnomalous }].map(({ l, v }) => (
            <div key={l} style={{ display: "flex", alignItems: "center", gap: 5, padding: "4px 10px", borderRadius: 6, background: v ? "rgba(16,245,158,0.06)" : "rgba(255,77,109,0.06)", border: `1px solid ${v ? "rgba(16,245,158,0.22)" : "rgba(255,77,109,0.22)"}` }}>
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: v ? "#10F59E" : "#FF4D6D" }} />
              <span style={{ fontSize: 10, fontFamily: "'Space Mono',monospace", color: v ? "#10F59E" : "#FF4D6D" }}>{l}={v ? "true" : "false"}</span>
            </div>
          ))}
        </div>
      </div>
      {fatigue.intervention && (
        <div style={{ padding: "14px 18px", borderRadius: 10, background: "rgba(245,166,35,0.06)", border: "1px solid rgba(245,166,35,0.28)", display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 20 }}>🔔</span>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#F5A623", fontFamily: "'Syne',sans-serif" }}>Active Intervention Recommendation</div>
            <div style={{ fontSize: 11, color: "#5A7A90", fontFamily: "'Space Mono',monospace", marginTop: 2 }}>{INTV_LABEL[fatigue.intervention]} · bandit-selected</div>
          </div>
        </div>
      )}
      <RecommendationsSection profile={profile} twin={twin} />
    </div>
  );
}

/* ════════════════════════════════════════
   SENTINEL TAB
════════════════════════════════════════ */
function SentinelTab({ profile, twin }) {
  const { fatigue } = twin; const c = SIG[fatigue.signal]; const p = profile;
  return (
    <div className="nx-card" style={{ padding: "20px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
        <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 11, fontWeight: 700, color: "#00D4C8", letterSpacing: "0.1em" }}>◈ SENTINEL — COGNITIVE LOAD GUARDIAN</div>
        {twin.aiPowered && <span className="tag tag-violet" style={{ fontSize: 9 }}>✨ NEXUS AI</span>}
      </div>
      <div style={{ fontSize: 10, color: "#5A7A90", fontFamily: "'Space Mono',monospace", marginBottom: 18, letterSpacing: "0.04em" }}>HMM STATE ESTIMATION · LSTM ANOMALY DETECTION · MULTI-ARMED BANDIT INTERVENTIONS</div>
      <div style={{ display: "flex", gap: 20, flexWrap: "wrap", marginBottom: 18 }}>
        <svg width={90} height={90} viewBox="0 0 90 90" style={{ flexShrink: 0 }}>
          <circle cx={45} cy={45} r={37} fill="none" stroke="rgba(0,212,200,0.1)" strokeWidth={7} />
          <circle cx={45} cy={45} r={37} fill="none" stroke={c.accent} strokeWidth={7} strokeDasharray={`${2 * Math.PI * 37 * (fatigue.score / 100)} ${2 * Math.PI * 37 * (1 - fatigue.score / 100)}`} strokeLinecap="round" transform="rotate(-90 45 45)" style={{ transition: "stroke-dasharray 1.2s ease" }} />
          <text x={45} y={41} textAnchor="middle" fontSize={20} fontWeight={700} fill={c.accent} fontFamily="'Space Mono',monospace">{fatigue.score}</text>
          <text x={45} y={54} textAnchor="middle" fontSize={9} fill="#5A7A90" fontFamily="'Space Mono',monospace">/100</text>
        </svg>
        <div style={{ flex: 1, minWidth: 180 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: c.accent, marginBottom: 6, fontFamily: "'Syne',sans-serif" }}>
            {c.label} · {STATE_LABEL[fatigue.currentState]}
            {fatigue.isAnomalous && <span className="tag tag-red" style={{ marginLeft: 10, fontSize: 10 }}>⚠ Anomaly</span>}
          </div>
          <div style={{ display: "flex", gap: 16, fontSize: 11, color: "#5A7A90", marginBottom: 12, flexWrap: "wrap", fontFamily: "'Space Mono',monospace" }}>
            <span>σ <span style={{ color: fatigue.deviation > 1 ? "#FF4D6D" : "#10F59E" }}>{fatigue.deviation > 0 ? "+" : ""}{fatigue.deviation}</span></span>
            <span>Carry-over <span style={{ color: "#F5A623" }}>{Math.round(fatigue.carryOver * 100)}%</span></span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(105px,1fr))", gap: 7 }}>
            {[{ l: "Sleep", v: p.sleepHours + " hrs", c2: "#00D4C8" }, { l: "Stress", v: p.stressLevel + "/10", c2: "#FF4D6D" }, { l: "Study/Day", v: p.studyHoursPerDay + " h", c2: "#A78BFA" }, { l: "Exercise", v: p.exercisePerWeek + " d/wk", c2: "#10F59E" }, { l: "Screen", v: p.screenTimeHours + " h", c2: "#F5A623" }, { l: "Caffeine", v: p.caffeine + " drinks", c2: "#F59E0B" }, { l: "Rest", v: p.lastRestDays + " d ago", c2: "#5A7A90" }, { l: "Mental H.", v: (p.mentalHealthRating || "?") + "/10", c2: "#10F59E" }, { l: "Hydration", v: String(p.hydration || "?"), c2: "#00D4C8" }, { l: "Anxiety", v: String(p.deadlineAnxiety || "?"), c2: p.deadlineAnxiety === "high" ? "#FF4D6D" : "#F5A623" }].map(({ l, v, c2 }) => (
              <div key={l} style={{ padding: "7px 10px", borderRadius: 8, background: "rgba(10,21,32,0.9)", border: "1px solid rgba(0,212,200,0.12)" }}>
                <div style={{ fontSize: 9, color: "#5A7A90", fontFamily: "'Space Mono',monospace", textTransform: "uppercase", marginBottom: 2 }}>{l}</div>
                <div style={{ fontSize: 12, fontWeight: 600, color: c2 }}>{v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 10, color: "#5A7A90", fontFamily: "'Space Mono',monospace", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>72-HOUR COGNITIVE WEATHER FORECAST</div>
        <div style={{ display: "flex", gap: 8 }}>
          {[["Now→24h", fatigue.forecast.next24h], ["24h→48h", fatigue.forecast.next2448h], ["48h→72h", fatigue.forecast.next4872h]].map(([label, signal]) => (
            <div key={label} style={{ flex: 1, padding: "10px 6px", borderRadius: 8, background: SIG[signal].bg, border: `1px solid ${SIG[signal].border}`, display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
              <span style={{ fontSize: 9, color: "#5A7A90", fontFamily: "'Space Mono',monospace", textTransform: "uppercase", letterSpacing: "0.04em" }}>{label}</span>
              <Dot signal={signal} size={11} />
              <span style={{ fontSize: 11, fontWeight: 600, color: SIG[signal].text }}>{SIG[signal].label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* AI reasoning panel */}
      {twin.aiPowered && fatigue.reasoning && (
        <div style={{ padding: "14px 16px", borderRadius: 10, background: "rgba(0,212,200,0.05)", border: "1px solid rgba(0,212,200,0.22)", marginBottom: 14 }}>
          <div style={{ fontSize: 10, color: "#00D4C8", fontFamily: "'Space Mono',monospace", fontWeight: 700, letterSpacing: "0.08em", marginBottom: 8 }}>◈ SENTINEL AI ANALYSIS</div>
          <p style={{ fontSize: 13, color: "#9BB5CC", lineHeight: 1.8, margin: 0 }}>{fatigue.reasoning}</p>
          {fatigue.isAnomalous && fatigue.anomalyReason && (
            <div style={{ marginTop: 10, padding: "8px 12px", borderRadius: 7, background: "rgba(255,77,109,0.08)", border: "1px solid rgba(255,77,109,0.3)", fontSize: 12, color: "#FCA5A5" }}>
              ⚠ <strong>Anomaly Detected:</strong> {fatigue.anomalyReason}
            </div>
          )}
        </div>
      )}

      {/* 72h forecast */}
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 10, color: "#5A7A90", fontFamily: "'Space Mono',monospace", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>72-HOUR COGNITIVE WEATHER FORECAST</div>
        <div style={{ display: "flex", gap: 8 }}>
          {[["Now→24h", fatigue.forecast.next24h], ["24h→48h", fatigue.forecast.next2448h], ["48h→72h", fatigue.forecast.next4872h]].map(([label, signal]) => (
            <div key={label} style={{ flex: 1, padding: "10px 6px", borderRadius: 8, background: SIG[signal].bg, border: `1px solid ${SIG[signal].border}`, display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
              <span style={{ fontSize: 9, color: "#5A7A90", fontFamily: "'Space Mono',monospace", textTransform: "uppercase", letterSpacing: "0.04em" }}>{label}</span>
              <Dot signal={signal} size={11} />
              <span style={{ fontSize: 11, fontWeight: 600, color: SIG[signal].text }}>{SIG[signal].label}</span>
            </div>
          ))}
        </div>
        {twin.aiPowered && fatigue.forecast?.narrative && (
          <div style={{ marginTop: 10, padding: "10px 14px", borderRadius: 8, background: "rgba(10,21,32,0.9)", border: "1px solid rgba(0,212,200,0.14)", fontSize: 12, color: "#9BB5CC", lineHeight: 1.7 }}>
            💬 {fatigue.forecast.narrative}
          </div>
        )}
      </div>

      {fatigue.intervention && (
        <div style={{ padding: "10px 14px", borderRadius: 8, background: "rgba(245,166,35,0.06)", border: "1px solid rgba(245,166,35,0.28)", fontSize: 12, color: "#F5A623" }}>
          🔔 <strong>Bandit Recommendation:</strong> {INTV_LABEL[fatigue.intervention]}
          {twin.aiPowered && fatigue.interventionReason && (
            <span style={{ display: "block", fontSize: 11, color: "#FDE68A", marginTop: 4, fontStyle: "italic" }}>{fatigue.interventionReason}</span>
          )}
        </div>
      )}
    </div>
  );
}

/* ════════════════════════════════════════
   IRIS TAB
════════════════════════════════════════ */
function IrisTab({ twin, fatigueScore, profile }) {
  const { iris } = twin;
  const [txt, setTxt] = useState(""), [analysis, setAnalysis] = useState(null), [analysing, setAnalysing] = useState(false);
  const [aiAnswer, setAiAnswer] = useState(null), [aiLoading, setAiLoading] = useState(false);

  const run = async () => {
    if (!txt.trim()) return;
    setAnalysing(true);
    setAiAnswer(null);
    // Always run formula analysis immediately
    setAnalysis(analyseText(txt));
    setAnalysing(false);
    // Then call Gemini for AI Q&A in background
    setAiLoading(true);
    const ans = await askIrisAI(txt, profile, twin);
    setAiAnswer(ans);
    setAiLoading(false);
  };

  const d = analysis ? { ...iris, fontSize: analysis.rFontSize, fontWeight: analysis.rFontWeight, letterSpacing: analysis.rLetterSpacing, wordSpacing: analysis.rWordSpacing, lineHeight: analysis.rLineHeight, maxLineWidth: analysis.rMaxWidth, backgroundColor: analysis.rBackground, textColor: analysis.rTextColor } : iris;
  const diffColor = { beginner: "#10F59E", intermediate: "#F5A623", advanced: "#FF4D6D" };

  return (
    <div className="nx-card" style={{ padding: "20px" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 11, fontWeight: 700, color: "#A78BFA", letterSpacing: "0.1em" }}>◎ IRIS — ADAPTIVE READING ENGINE</div>
          <div style={{ fontSize: 10, color: "#5A7A90", fontFamily: "'Space Mono',monospace", marginTop: 2 }}>PPO RL · POLICY v{iris.policyVersion} · {iris.sessionsTrained} SESSIONS TRAINED</div>
          {twin.aiPowered && <span className="tag tag-violet" style={{ fontSize: 9 }}>✨ IRIS AI</span>}
        </div>
        <div style={{ fontSize: 11, padding: "4px 10px", borderRadius: 6, background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.28)", color: "#A78BFA", fontFamily: "'Space Mono',monospace" }}>reward={iris.rewardSignal}</div>
      </div>

      {/* ── Text Input ── */}
      <div style={{ padding: "14px", borderRadius: 10, background: "rgba(6,13,20,0.9)", border: "1px solid rgba(124,58,237,0.2)", marginBottom: 14 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#A78BFA", letterSpacing: "0.06em", marginBottom: 8, fontFamily: "'Syne',sans-serif" }}>✍ IRIS TEXT ANALYSER</div>
        <textarea value={txt} onChange={e => setTxt(e.target.value)} placeholder="Ask a question or paste study notes… IRIS will give you a comprehensive AI answer, reformat your question, and optimise your reading environment."
          style={{ width: "100%", minHeight: 100, padding: "10px 12px", borderRadius: 8, background: "rgba(10,21,32,0.9)", border: "1px solid rgba(124,58,237,0.22)", color: "#F0F8FF", fontSize: 13, lineHeight: 1.6, resize: "vertical", fontFamily: "'DM Sans',sans-serif", outline: "none", boxSizing: "border-box" }}
          onFocus={e => e.target.style.borderColor = "#A78BFA"} onBlur={e => e.target.style.borderColor = "rgba(124,58,237,0.22)"}
          onKeyDown={e => { if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) run(); }} />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 8, gap: 8, flexWrap: "wrap" }}>
          <span style={{ fontSize: 11, color: "#5A7A90", fontFamily: "'Space Mono',monospace" }}>{txt.trim().split(/\s+/).filter(Boolean).length} words · Ctrl+Enter to analyse</span>
          <div style={{ display: "flex", gap: 8 }}>
            {(analysis || aiAnswer) && <button className="nx-btn nx-btn-ghost" onClick={() => { setAnalysis(null); setAiAnswer(null); setTxt(""); }} style={{ padding: "5px 12px", fontSize: 11 }}>Clear</button>}
            <button onClick={run} disabled={!txt.trim() || analysing || aiLoading}
              style={{ padding: "6px 16px", borderRadius: 7, fontSize: 12, fontWeight: 700, border: "none", cursor: txt.trim() ? "pointer" : "not-allowed", background: txt.trim() ? "linear-gradient(135deg,#5B21B6,#A78BFA)" : "rgba(10,21,32,0.8)", color: "white", opacity: !txt.trim() || analysing ? 0.5 : 1 }}>
              {analysing ? "Analysing…" : aiLoading ? "⚡ AI Thinking…" : "Analyse →"}
            </button>
          </div>
        </div>
      </div>

      {/* ── AI Loading skeleton ── */}
      {aiLoading && !aiAnswer && (
        <div style={{ padding: "20px", borderRadius: 10, background: "rgba(124,58,237,0.06)", border: "1px solid rgba(124,58,237,0.28)", marginBottom: 14 }}>
          <div style={{ fontSize: 10, color: "#A78BFA", fontFamily: "'Space Mono',monospace", marginBottom: 14 }}>⚡ IRIS · GENERATING COMPREHENSIVE ANSWER…</div>
          {[100, 80, 90, 60, 75].map((w, i) => (
            <div key={i} style={{ height: 12, borderRadius: 6, background: "linear-gradient(90deg,rgba(124,58,237,0.1) 25%,rgba(167,139,250,0.2) 50%,rgba(124,58,237,0.1) 75%)", backgroundSize: "200% 100%", animation: "shimmer 1.6s infinite", marginBottom: 8, width: `${w}%` }} />
          ))}
        </div>
      )}

      {/* ── AI Answer Panel ── */}
      {aiAnswer && (
        <div style={{ padding: "18px 20px", borderRadius: 10, background: "rgba(124,58,237,0.05)", border: "1px solid rgba(124,58,237,0.35)", marginBottom: 14 }}>
          {/* Header row */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8, marginBottom: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 10, color: "#A78BFA", fontFamily: "'Space Mono',monospace", fontWeight: 700, letterSpacing: "0.08em" }}>◎ IRIS AI ANSWER</span>
              <span className="tag tag-violet" style={{ fontSize: 9 }}>✨ NEXUS AI</span>
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              {aiAnswer.difficulty && (
                <span style={{ fontSize: 9, padding: "2px 8px", borderRadius: 4, background: `${diffColor[aiAnswer.difficulty] ?? "#A78BFA"}18`, border: `1px solid ${diffColor[aiAnswer.difficulty] ?? "#A78BFA"}44`, color: diffColor[aiAnswer.difficulty] ?? "#A78BFA", fontFamily: "'Space Mono',monospace", textTransform: "uppercase" }}>{aiAnswer.difficulty}</span>
              )}
              {aiAnswer.estimatedReadTime && (
                <span style={{ fontSize: 9, padding: "2px 8px", borderRadius: 4, background: "rgba(0,212,200,0.08)", border: "1px solid rgba(0,212,200,0.22)", color: "#00D4C8", fontFamily: "'Space Mono',monospace" }}>{aiAnswer.estimatedReadTime}</span>
              )}
            </div>
          </div>

          {/* Reformulated question */}
          {aiAnswer.reformulated && (
            <div style={{ padding: "10px 14px", borderRadius: 8, background: "rgba(124,58,237,0.09)", border: "1px solid rgba(124,58,237,0.25)", marginBottom: 14 }}>
              <div style={{ fontSize: 9, color: "#A78BFA", fontFamily: "'Space Mono',monospace", letterSpacing: "0.07em", marginBottom: 5 }}>REFINED QUESTION</div>
              <p style={{ fontSize: 13, color: "#C4B5FD", lineHeight: 1.7, margin: 0, fontStyle: "italic" }}>"{aiAnswer.reformulated}"</p>
            </div>
          )}

          {/* Answer title + body */}
          {aiAnswer.answerTitle && (
            <div style={{ fontSize: 14, fontWeight: 700, color: "#F0F8FF", fontFamily: "'Syne',sans-serif", marginBottom: 10 }}>{aiAnswer.answerTitle}</div>
          )}
          {aiAnswer.answer && (
            <div style={{ fontSize: 13, color: "#9BB5CC", lineHeight: 1.85, marginBottom: 16 }}>
              {aiAnswer.answer.split("\n").map((para, i) => para.trim() ? <p key={i} style={{ margin: "0 0 12px 0" }}>{para}</p> : null)}
            </div>
          )}

          {/* Key points */}
          {aiAnswer.keyPoints && aiAnswer.keyPoints.length > 0 && (
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 10, color: "#00D4C8", fontFamily: "'Space Mono',monospace", letterSpacing: "0.07em", marginBottom: 8 }}>KEY TAKEAWAYS</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                {aiAnswer.keyPoints.map((pt, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <span style={{ width: 18, height: 18, borderRadius: "50%", background: "rgba(0,212,200,0.12)", border: "1px solid rgba(0,212,200,0.35)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, color: "#00D4C8", flexShrink: 0, fontFamily: "'Space Mono',monospace", fontWeight: 700, marginTop: 1 }}>{i + 1}</span>
                    <span style={{ fontSize: 13, color: "#C8D9E8", lineHeight: 1.65 }}>{pt}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Personalised study tip */}
          {aiAnswer.studyTip && (
            <div style={{ padding: "9px 13px", borderRadius: 8, background: "rgba(245,166,35,0.07)", border: "1px solid rgba(245,166,35,0.28)", fontSize: 12, color: "#F5A623", lineHeight: 1.6 }}>
              💡 <strong>Personalised Study Tip:</strong> {aiAnswer.studyTip}
            </div>
          )}
        </div>
      )}

      {/* ── Text Complexity Analysis (fallback / supplemental) ── */}
      {analysis && (
        <div style={{ padding: "14px", borderRadius: 10, background: "rgba(0,212,200,0.04)", border: "1px solid rgba(0,212,200,0.18)", marginBottom: 14 }}>
          <div style={{ fontSize: 11, color: "#00D4C8", fontWeight: 700, letterSpacing: "0.06em", marginBottom: 10, fontFamily: "'Syne',sans-serif" }}>📊 TEXT COMPLEXITY ANALYSIS</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(115px,1fr))", gap: 7, marginBottom: 10 }}>
            {[{ l: "Words", v: analysis.wordCount, c: "#F0F8FF" }, { l: "Sentences", v: analysis.sentenceCount, c: "#F0F8FF" }, { l: "Avg Word", v: analysis.avgWordLength + " ch", c: "#A78BFA" }, { l: "Avg Sent", v: analysis.avgSentenceLength + " w", c: "#A78BFA" }, { l: "Lex Density", v: analysis.lexicalDensity, c: "#00D4C8" }, { l: "Complexity", v: analysis.complexityScore + "/100", c: analysis.complexityScore > 60 ? "#FF4D6D" : analysis.complexityScore > 35 ? "#F5A623" : "#10F59E" }, { l: "Readability", v: analysis.readabilityScore + "/100", c: analysis.readabilityScore > 65 ? "#10F59E" : "#F5A623" }].map(({ l, v, c }) => (
              <div key={l} style={{ padding: "7px 9px", borderRadius: 7, background: "rgba(10,21,32,0.9)", border: "1px solid rgba(0,212,200,0.12)" }}>
                <div style={{ fontSize: 9, color: "#5A7A90", fontFamily: "'Space Mono',monospace", textTransform: "uppercase", marginBottom: 2 }}>{l}</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: c, fontFamily: "'Space Mono',monospace" }}>{v}</div>
              </div>
            ))}
          </div>
          <div style={{ padding: "8px 10px", borderRadius: 7, background: "rgba(0,212,200,0.06)", border: "1px solid rgba(0,212,200,0.18)", fontSize: 11, color: "#00D4C8", lineHeight: 1.5 }}>💡 {analysis.reason}</div>
        </div>
      )}

      {/* AI IRIS rationale panel */}
      {twin.aiPowered && iris.rationale && (
        <div style={{ padding: "14px 16px", borderRadius: 10, background: "rgba(124,58,237,0.06)", border: "1px solid rgba(124,58,237,0.28)", marginBottom: 14 }}>
          <div style={{ fontSize: 10, color: "#A78BFA", fontFamily: "'Space Mono',monospace", fontWeight: 700, letterSpacing: "0.08em", marginBottom: 8 }}>◎ IRIS AI TYPOGRAPHY RATIONALE</div>
          <p style={{ fontSize: 13, color: "#9BB5CC", lineHeight: 1.8, margin: "0 0 10px 0" }}>{iris.rationale}</p>
          {iris.contentSuggestion && (
            <div style={{ padding: "8px 12px", borderRadius: 7, background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.22)", fontSize: 12, color: "#C4B5FD" }}>
              💡 <strong>Study Tip:</strong> {iris.contentSuggestion}
            </div>
          )}
        </div>
      )}

      <div style={{ padding: "12px", borderRadius: 10, background: "rgba(2,4,8,0.9)", border: "1px solid rgba(0,212,200,0.1)", marginBottom: 14, fontFamily: "'Space Mono',monospace" }}>
        <div style={{ fontSize: 10, color: "#5A7A90", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>{analysis ? "CSS Variables — Text-Analysis Optimised" : "CSS Variables — Profile-Based Policy"}</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: "5px 18px" }}>
          {[["font-family", d.fontFamily], ["font-size", d.fontSize], ["font-weight", d.fontWeight], ["letter-spacing", d.letterSpacing], ["word-spacing", d.wordSpacing], ["line-height", d.lineHeight], ["max-line-width", d.maxLineWidth], ["background-color", d.backgroundColor], ["text-color", d.textColor], ["paragraph-spacing", d.paragraphSpacing], ["contrast-ratio", (analysis?.rContrast || iris.contrastRatio) + " (WCAG AA)"], ["highlight-color", iris.highlightColor]].map(([k, v]) => (
            <div key={k} style={{ fontSize: 11 }}>
              <span style={{ color: "#7C3AED" }}>--iris-</span><span style={{ color: "#00D4C8" }}>{k}</span>
              <span style={{ color: "#5A7A90" }}>: </span><span style={{ color: "#10F59E" }}>{v}</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(110px,1fr))", gap: 7, marginBottom: 14 }}>
        {[{ l: "Policy", v: `v${iris.policyVersion}`, c: "#A78BFA" }, { l: "Sessions", v: `${iris.sessionsTrained}`, c: "#00D4C8" }, { l: "Reward", v: `${iris.rewardSignal}`, c: "#10F59E" }, { l: "Cumulative", v: `${iris.cumulativeReward}`, c: "#F5A623" }].map(({ l, v, c }) => (
          <div key={l} style={{ padding: "8px 10px", borderRadius: 8, background: "rgba(10,21,32,0.9)", border: "1px solid rgba(0,212,200,0.12)" }}>
            <div style={{ fontSize: 9, color: "#5A7A90", fontFamily: "'Space Mono',monospace", textTransform: "uppercase", marginBottom: 2 }}>{l}</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: c, fontFamily: "'Syne',sans-serif" }}>{v}</div>
          </div>
        ))}
      </div>
      <div style={{ fontSize: 10, color: "#5A7A90", fontFamily: "'Space Mono',monospace", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>
        LIVE READING PREVIEW{aiAnswer ? " — IRIS-OPTIMISED AI ANSWER" : ""}
      </div>
      <div style={{ padding: "24px 28px", borderRadius: 10, backgroundColor: d.backgroundColor, border: "1px solid rgba(0,212,200,0.1)", transition: "all 0.6s ease" }}>
        {aiAnswer ? (
          <div style={{ maxWidth: d.maxLineWidth }}>
            {/* Refined question as heading */}
            <div style={{ fontFamily: d.fontFamily, fontSize: `calc(${d.fontSize} + 2px)`, fontWeight: 700, letterSpacing: d.letterSpacing, lineHeight: 1.4, color: d.textColor, opacity: 0.7, marginBottom: "0.5em", fontStyle: "italic", borderLeft: `3px solid rgba(124,58,237,0.6)`, paddingLeft: "0.8em" }}>
              {aiAnswer.reformulated || txt.trim()}
            </div>
            {/* Divider */}
            <div style={{ height: 1, background: "rgba(0,212,200,0.15)", margin: "12px 0" }} />
            {/* Answer body */}
            {aiAnswer.answer && aiAnswer.answer.split("\n").map((para, i) =>
              para.trim() ? (
                <p key={i} style={{ fontFamily: d.fontFamily, fontSize: d.fontSize, fontWeight: d.fontWeight, letterSpacing: d.letterSpacing, wordSpacing: d.wordSpacing, lineHeight: d.lineHeight, color: d.textColor, margin: `0 0 ${d.paragraphSpacing || "1.4em"} 0` }}>
                  {para}
                </p>
              ) : null
            )}
          </div>
        ) : (
          <p style={{ fontFamily: d.fontFamily, fontSize: d.fontSize, fontWeight: d.fontWeight, letterSpacing: d.letterSpacing, wordSpacing: d.wordSpacing, lineHeight: d.lineHeight, maxWidth: d.maxLineWidth, color: d.textColor, margin: 0 }}>
            {txt.trim() || "Your text will appear here with IRIS-optimised parameters applied. Paste any content above and click Analyse to see the transformation in real time."}
          </p>
        )}
      </div>
      {fatigueScore > 50 && <div style={{ marginTop: 10, padding: "8px 12px", borderRadius: 7, background: "rgba(245,166,35,0.06)", border: "1px solid rgba(245,166,35,0.28)", fontSize: 11, color: "#F5A623", fontFamily: "'Space Mono',monospace" }}>⚡ FATIGUE={fatigueScore} → SENTINEL OVERRIDE: IRIS USING LOW-LOAD PARAMETERS</div>}
    </div>
  );
}



/* ════════════════════════════════════════
   APOLLO TAB
════════════════════════════════════════ */
function ApolloTab({ profile, twin }) {
  const { apollo, fatigue } = twin; const p = profile;
  // Use AI topFactors if available, else fallback to formula-derived shap
  const hasAiFactors = twin.aiPowered && apollo.topFactors && apollo.topFactors.length > 0;
  const shap = hasAiFactors
    ? apollo.topFactors
    : [{ f: "session_frequency_7d", v: +(0.31 * (0.5 + apollo.riskScore)).toFixed(2), pos: true },
    { f: "days_since_last_rest", v: +(0.24 * (0.5 + apollo.riskScore)).toFixed(2), pos: false },
    { f: "content_difficulty_avg", v: +(0.19 * (0.5 + apollo.riskScore)).toFixed(2), pos: false },
    { f: "quiz_delta_30d", v: +(0.14 * (0.5 + apollo.riskScore)).toFixed(2), pos: true },
    { f: "engagement_trend_7d", v: +(0.10 * (0.5 + apollo.riskScore)).toFixed(2), pos: true },
    { f: "missed_deadlines_30d", v: +(0.08 * (0.5 + apollo.riskScore)).toFixed(2), pos: false }];
  return (
    <div className="nx-card" style={{ padding: "20px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
        <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 11, fontWeight: 700, color: "#F5A623", letterSpacing: "0.1em" }}>◆ APOLLO — INSTITUTIONAL CONTROL ROOM</div>
        {twin.aiPowered && <span className="tag tag-violet" style={{ fontSize: 9 }}>✨ NEXUS AI</span>}
      </div>
      <div style={{ fontSize: 10, color: "#5A7A90", fontFamily: "'Space Mono',monospace", marginBottom: 18, letterSpacing: "0.04em" }}>XGBOOST RISK · PROPHET FORECASTING · DOWHY CAUSAL INFERENCE · SHAP EXPLAINABILITY</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(95px,1fr))", gap: 8, marginBottom: 18 }}>
        {[{ l: "Dropout Risk", v: `${(apollo.riskScore * 100).toFixed(0)}%`, c: RISK_COLOR[apollo.risk] }, { l: "Risk Tier", v: apollo.risk.toUpperCase(), c: RISK_COLOR[apollo.risk] }, { l: "GPA", v: apollo.gpaLast.toFixed(1), c: apollo.gpaLast >= 3 ? "#10F59E" : "#FF4D6D" }, { l: "Attendance", v: `${apollo.attendanceRate}%`, c: apollo.attendanceRate >= 75 ? "#10F59E" : "#FF4D6D" }, { l: "Missed DDL", v: `${apollo.missedDeadlines}`, c: apollo.missedDeadlines <= 1 ? "#10F59E" : "#FF4D6D" }, { l: "Stress", v: `${p.stressLevel}/10`, c: Number(p.stressLevel) <= 5 ? "#10F59E" : "#FF4D6D" }].map(({ l, v, c }) => (
          <div key={l} style={{ padding: "8px 10px", borderRadius: 8, background: "rgba(10,21,32,0.9)", border: "1px solid rgba(245,166,35,0.1)" }}>
            <div style={{ fontSize: 9, color: "#5A7A90", fontFamily: "'Space Mono',monospace", textTransform: "uppercase", marginBottom: 2 }}>{l}</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: c, fontFamily: "'Syne',sans-serif" }}>{v}</div>
          </div>
        ))}
      </div>
      {/* AI APOLLO reasoning */}
      {twin.aiPowered && apollo.reasoning && (
        <div style={{ padding: "14px 16px", borderRadius: 10, background: "rgba(245,166,35,0.05)", border: "1px solid rgba(245,166,35,0.25)", marginBottom: 14 }}>
          <div style={{ fontSize: 10, color: "#F5A623", fontFamily: "'Space Mono',monospace", fontWeight: 700, letterSpacing: "0.08em", marginBottom: 8 }}>◆ APOLLO AI RISK ANALYSIS</div>
          <p style={{ fontSize: 13, color: "#9BB5CC", lineHeight: 1.8, margin: 0 }}>{apollo.reasoning}</p>
        </div>
      )}
      <div style={{ padding: "14px", borderRadius: 10, background: "rgba(2,4,8,0.9)", border: "1px solid rgba(245,166,35,0.1)", marginBottom: 14 }}>
        <div style={{ fontSize: 10, color: "#5A7A90", fontFamily: "'Space Mono',monospace", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 12 }}>
          {hasAiFactors ? "APOLLO AI — TOP RISK FACTORS" : "SHAP TOP FEATURES"}
        </div>
        {hasAiFactors
          ? shap.map((factor, i) => {
            const isRisk = factor.direction === "risk";
            const pct = Math.min(factor.contribution * 100, 100);
            return (
              <div key={i} style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                  <span style={{ fontSize: 10, color: "#5A7A90", fontFamily: "'Space Mono',monospace", width: 160, flexShrink: 0 }}>{factor.factor}</span>
                  <div style={{ flex: 1, height: 7, borderRadius: 4, background: "rgba(10,21,32,0.9)", overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${pct}%`, borderRadius: 4, background: isRisk ? "linear-gradient(90deg,#7f1d1d,#FF4D6D)" : "linear-gradient(90deg,#065f46,#10F59E)", transition: "width 1s ease" }} />
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 700, fontFamily: "'Space Mono',monospace", color: isRisk ? "#FF4D6D" : "#10F59E", width: 36, textAlign: "right", flexShrink: 0 }}>{isRisk ? "-" : "+"}{Math.round(pct)}</span>
                </div>
                {factor.explanation && <p style={{ fontSize: 11, color: "#5A7A90", lineHeight: 1.5, margin: "0 0 0 0", paddingLeft: 170 }}>{factor.explanation}</p>}
              </div>
            );
          })
          : shap.map(({ f, v, pos }) => (
            <div key={f} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 9 }}>
              <span style={{ fontSize: 10, color: "#5A7A90", fontFamily: "'Space Mono',monospace", width: 185, flexShrink: 0 }}>{f}</span>
              <div style={{ flex: 1, height: 7, borderRadius: 4, background: "rgba(10,21,32,0.9)", overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${Math.min(v * 220, 100)}%`, borderRadius: 4, background: pos ? "linear-gradient(90deg,#065f46,#10F59E)" : "linear-gradient(90deg,#7f1d1d,#FF4D6D)", transition: "width 1s ease" }} />
              </div>
              <span style={{ fontSize: 12, fontWeight: 700, fontFamily: "'Space Mono',monospace", color: pos ? "#10F59E" : "#FF4D6D", width: 34, textAlign: "right", flexShrink: 0 }}>{pos ? "+" : "-"}{Math.round(v * 100)}</span>
            </div>
          ))
        }
      </div>
      <div style={{ padding: "12px", borderRadius: 10, background: "rgba(2,4,8,0.9)", border: "1px solid rgba(245,166,35,0.1)", marginBottom: 12 }}>
        <div style={{ fontSize: 10, color: "#5A7A90", fontFamily: "'Space Mono',monospace", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>EXAM READINESS WINDOW</div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {[{ exam: "Midterm A", days: 5, ready: fatigue.score < 50 }, { exam: "Quiz #3", days: 12, ready: true }, { exam: "Final", days: 34, ready: fatigue.score < 66 }].map(({ exam, days, ready }) => (
            <div key={exam} style={{ flex: 1, minWidth: 75, padding: "9px 10px", borderRadius: 8, background: ready ? "rgba(16,245,158,0.05)" : "rgba(255,77,109,0.05)", border: `1px solid ${ready ? "rgba(16,245,158,0.22)" : "rgba(255,77,109,0.22)"}` }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: ready ? "#10F59E" : "#FF4D6D", fontFamily: "'Syne',sans-serif" }}>{exam}</div>
              <div style={{ fontSize: 10, color: "#5A7A90", marginTop: 1, fontFamily: "'Space Mono',monospace" }}>in {days} days</div>
              <div style={{ fontSize: 10, fontWeight: 600, color: ready ? "#10F59E" : "#FF4D6D", marginTop: 2 }}>{ready ? "✓ Cleared" : "✗ Delayed"}</div>
            </div>
          ))}
        </div>
      </div>
      {/* AI context panels */}
      {twin.aiPowered && (apollo.interventionWindow || apollo.similarStudentsOutcome) && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
          {apollo.interventionWindow && (
            <div style={{ padding: "10px 12px", borderRadius: 9, background: "rgba(245,166,35,0.05)", border: "1px solid rgba(245,166,35,0.2)" }}>
              <div style={{ fontSize: 9, color: "#F5A623", fontFamily: "'Space Mono',monospace", fontWeight: 700, letterSpacing: "0.07em", marginBottom: 5 }}>⏱ INTERVENTION WINDOW</div>
              <p style={{ fontSize: 12, color: "#FDE68A", lineHeight: 1.6, margin: 0 }}>{apollo.interventionWindow}</p>
            </div>
          )}
          {apollo.similarStudentsOutcome && (
            <div style={{ padding: "10px 12px", borderRadius: 9, background: "rgba(16,245,158,0.04)", border: "1px solid rgba(16,245,158,0.18)" }}>
              <div style={{ fontSize: 9, color: "#10F59E", fontFamily: "'Space Mono',monospace", fontWeight: 700, letterSpacing: "0.07em", marginBottom: 5 }}>◈ SIMILAR COHORT OUTCOME</div>
              <p style={{ fontSize: 12, color: "#86EFAC", lineHeight: 1.6, margin: 0 }}>{apollo.similarStudentsOutcome}</p>
            </div>
          )}
        </div>
      )}
      <div style={{ padding: "12px", borderRadius: 10, background: "rgba(16,245,158,0.04)", border: "1px solid rgba(16,245,158,0.18)", fontSize: 12, color: "#10F59E", lineHeight: 1.7 }}>
        ⚡ <strong>Causal Match:</strong> Based on {Math.round(30 + apollo.riskScore * 40)} similar students — a 1-on-1 advisor check-in within <strong>{Math.round(3 + (1 - apollo.riskScore) * 5)} days</strong> has a <strong>{Math.round(50 + (1 - apollo.riskScore) * 30)}%</strong> probability of reversing this trajectory.
      </div>
    </div>
  );
}

/* ════════════════════════════════════════
   UPDATE MODAL
════════════════════════════════════════ */
function UpdateModal({ user, onSave, onCancel }) {
  const [form, setForm] = useState({ ...user.profile }); const [saving, setSaving] = useState(false);
  const h = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));
  const save = async () => {
    setSaving(true);
    const updated = { ...user, profile: form, lastUpdated: new Date().toISOString(), loginHistory: [...(user.loginHistory || []), new Date().toISOString()] };
    await saveUser(updated); setSaving(false); onSave(updated);
  };
  const g2 = { display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(160px,1fr))", gap: 10 };
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(2,4,8,0.88)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 16, backdropFilter: "blur(10px)" }}>
      <div className="nx-card" style={{ padding: "20px", width: "100%", maxWidth: 480, maxHeight: "88vh", overflowY: "auto" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <div><div style={{ fontFamily: "'Syne',sans-serif", fontSize: 15, fontWeight: 700, color: "#F0F8FF" }}>Update Your Profile</div>
            <div style={{ fontSize: 10, color: "#5A7A90", fontFamily: "'Space Mono',monospace", marginTop: 2 }}>ANALYSIS REFRESHES IMMEDIATELY AFTER SAVING</div></div>
          <button onClick={onCancel} style={{ background: "transparent", border: "1px solid rgba(0,212,200,0.2)", color: "#5A7A90", borderRadius: 6, padding: "4px 9px", cursor: "pointer", fontSize: 13 }}>✕</button>
        </div>
        <div style={{ fontSize: 10, fontWeight: 700, color: "#00D4C8", fontFamily: "'Space Mono',monospace", marginBottom: 8 }}>◈ SENTINEL SIGNALS</div>
        <div style={{ ...g2, marginBottom: 14 }}>
          <FI label="Sleep hrs" name="sleepHours" type="number" value={form.sleepHours} onChange={h} min="2" max="12" step="0.5" />
          <FI label="Stress 1–10" name="stressLevel" type="number" value={form.stressLevel} onChange={h} min="1" max="10" />
          <FI label="Study hrs/day" name="studyHoursPerDay" type="number" value={form.studyHoursPerDay} onChange={h} min="0" max="18" step="0.5" />
          <FI label="Exercise days/wk" name="exercisePerWeek" type="number" value={form.exercisePerWeek} onChange={h} min="0" max="7" />
          <FI label="Screen time hrs" name="screenTimeHours" type="number" value={form.screenTimeHours} onChange={h} min="0" max="24" step="0.5" />
          <FI label="Caffeine drinks" name="caffeine" type="number" value={form.caffeine} onChange={h} min="0" max="10" />
          <FI label="Days since rest" name="lastRestDays" type="number" value={form.lastRestDays} onChange={h} min="0" max="30" />
          <FI label="Mental health 1–10" name="mentalHealthRating" type="number" value={form.mentalHealthRating} onChange={h} min="1" max="10" />
          <FI label="Deadline anxiety" name="deadlineAnxiety" value={form.deadlineAnxiety} onChange={h} options={[["low", "Low"], ["moderate", "Moderate"], ["high", "High"]]} />
          <FI label="Hydration" name="hydration" value={form.hydration} onChange={h} options={[["good", "Good"], ["moderate", "Moderate"], ["poor", "Poor"]]} />
        </div>
        <div style={{ fontSize: 10, fontWeight: 700, color: "#A78BFA", fontFamily: "'Space Mono',monospace", marginBottom: 8 }}>◎ IRIS + ◆ APOLLO</div>
        <div style={{ ...g2, marginBottom: 18 }}>
          <FI label="Reading speed wpm" name="readingSpeed" type="number" value={form.readingSpeed} onChange={h} min="50" max="800" />
          <FI label="Motivation 1–10" name="motivationLevel" type="number" value={form.motivationLevel} onChange={h} min="1" max="10" />
          <FI label="Course difficulty 1–5" name="courseDifficulty" type="number" value={form.courseDifficulty} onChange={h} min="1" max="5" />
          <FI label="Missed deadlines" name="missedDeadlines" type="number" value={form.missedDeadlines} onChange={h} min="0" max="20" />
          <FI label="Attendance %" name="attendanceRate" type="number" value={form.attendanceRate} onChange={h} min="0" max="100" />
          <FI label="Current GPA" name="gpaLast" type="number" value={form.gpaLast} onChange={h} min="0" max="4" step="0.1" />
        </div>
        <button className="nx-btn nx-btn-primary" onClick={save} disabled={saving} style={{ width: "100%", opacity: saving ? 0.6 : 1 }}>{saving ? "Saving…" : "✓ Save & Refresh Analysis"}</button>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════
   STUDENT DETAIL
════════════════════════════════════════ */
function StudentDetail({ name, cohort, studentId, profile, twin, lastUpdated, isMine, onUpdateProfile }) {
  const [tab, setTab] = useState("OVERVIEW");
  const [rem, setRem] = useState(getRemaining(lastUpdated));
  const prevId = useRef(studentId);
  useEffect(() => { if (prevId.current !== studentId) { setTab("OVERVIEW"); setRem(getRemaining(lastUpdated)); prevId.current = studentId; } }, [studentId, lastUpdated]);
  useEffect(() => { const t = setInterval(() => setRem(getRemaining(lastUpdated)), 1000); return () => clearInterval(t); }, [lastUpdated]);
  const { fatigue, iris } = twin;
  const TABS = isMine ? ["OVERVIEW", "SENTINEL", "IRIS", "APOLLO"] : ["OVERVIEW"];
  return (
    <div>
      <div className="nx-card" style={{ padding: "16px 20px", marginBottom: 16, display: "flex", alignItems: "flex-start", gap: 14, flexWrap: "wrap" }}>
        <Av name={name} size={48} />
        <div style={{ flex: 1, minWidth: 140 }}>
          <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 20, fontWeight: 800, color: "#F0F8FF", marginBottom: 2 }}>{name}</div>
          <div style={{ fontSize: 12, color: "#5A7A90", fontFamily: "'Space Mono',monospace" }}>{cohort}</div>
          <div style={{ fontSize: 10, color: "#5A7A90", marginTop: 2, fontFamily: "'Space Mono',monospace", opacity: 0.6 }}>ID: {studentId}</div>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
          {isMine && [{ l: "SENTINEL", v: "Active", c: "#00D4C8" }, { l: "IRIS", v: `v${iris.policyVersion}`, c: "#A78BFA" }, { l: "APOLLO", v: "Daily", c: "#F5A623" }].map(({ l, v, c }) => (
            <div key={l} style={{ padding: "6px 14px", borderRadius: 8, background: "rgba(10,21,32,0.9)", border: `1px solid ${c}22`, textAlign: "center", minWidth: 72 }}>
              <div style={{ fontSize: 10, fontWeight: 700, fontFamily: "'Space Mono',monospace", letterSpacing: "0.06em", color: c }}>{l}</div>
              <div style={{ fontSize: 11, color: "#9BB5CC", marginTop: 2 }}>{v}</div>
            </div>
          ))}
          {isMine && (rem
            ? <div style={{ padding: "6px 14px", borderRadius: 8, background: "rgba(10,21,32,0.9)", border: "1px solid rgba(245,166,35,0.2)", textAlign: "center", minWidth: 90 }}>
              <div style={{ fontSize: 9, color: "#5A7A90", fontFamily: "'Space Mono',monospace", letterSpacing: "0.05em" }}>NEXT UPDATE</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#F5A623", fontFamily: "'Space Mono',monospace", marginTop: 1 }}>{fmt(rem)}</div>
            </div>
            : <button className="nx-btn nx-btn-primary" onClick={onUpdateProfile} style={{ padding: "8px 16px", fontSize: 12 }}>📝 Update</button>
          )}
        </div>
      </div>
      <div style={{ display: "flex", gap: 2, background: "rgba(6,13,20,0.9)", borderRadius: 10, padding: 4, marginBottom: 16, border: "1px solid rgba(0,212,200,0.1)", overflowX: "auto" }}>
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ flex: 1, padding: "8px 4px", borderRadius: 7, border: "none", cursor: "pointer", fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", whiteSpace: "nowrap", fontFamily: "'Space Mono',monospace", background: tab === t ? "linear-gradient(135deg,rgba(0,212,200,0.14),rgba(124,58,237,0.08))" : "transparent", color: tab === t ? "#00D4C8" : "#5A7A90", borderBottom: tab === t ? "2px solid #00D4C8" : "2px solid transparent", transition: "all 0.2s" }}>{t}</button>
        ))}
      </div>
      {tab === "OVERVIEW" && <OverviewTab profile={profile} twin={twin} />}
      {tab === "SENTINEL" && <SentinelTab profile={profile} twin={twin} />}
      {tab === "IRIS" && <IrisTab twin={twin} fatigueScore={fatigue.score} profile={profile} />}
      {tab === "APOLLO" && <ApolloTab profile={profile} twin={twin} />}
    </div>
  );
}

/* ════════════════════════════════════════
   INSTITUTIONAL VIEW
════════════════════════════════════════ */
function InstitutionalView({ loggedInUser, onSelectSelf, onSelectDemo }) {
  const [tick, setTick] = useState(0);
  const [peers, setPeers] = useState([]);
  const [loadingPeers, setLoadingPeers] = useState(true);

  useEffect(() => { const i = setInterval(() => setTick(t => t + 1), 6000); return () => clearInterval(i); }, []);

  useEffect(() => {
    getAllUsers().then(all => {
      setPeers(all.filter(u => !u.isAdmin && u.email !== loggedInUser?.email));
    }).catch(() => { }).finally(() => setLoadingPeers(false));
  }, [loggedInUser?.email]); // eslint-disable-line react-hooks/exhaustive-deps

  const dF = (s, t) => { const sc = Math.min(100, Math.max(0, Math.round(s.base + Math.sin(t * 0.7 + s.id.charCodeAt(3)) * 6))); const si = sc <= 30 ? "green" : sc <= 65 ? "amber" : "red"; const idx = sc < 25 ? 0 : sc < 45 ? 1 : sc < 65 ? 2 : sc < 80 ? 3 : 4; const intvs = [null, null, "schedule_nudge", "rest_recommendation", "advisor_alert", "pastoral_flag"]; return { score: sc, signal: si, intervention: intvs[Math.min(5, idx + (sc > 70 ? 2 : 0))] }; };
  const uTwin = loggedInUser ? computeTwin(loggedInUser.profile) : null;
  const uF = uTwin?.fatigue, uRisk = uTwin?.apollo?.risk || "low";

  const peerRows = peers.map(u => {
    const tw = computeTwin(u.profile);
    return { id: u.uid || u.email, name: u.fullName, cohort: u.cohort, risk: tw.apollo.risk, fatigue: tw.fatigue, isMe: false, isDemo: false, ref: { id: u.uid || u.email, name: u.fullName, cohort: u.cohort, p: u.profile } };
  });

  const showDemo = !loadingPeers && peerRows.length < 3;
  const demoRows = showDemo ? DEMO.map(s => ({ id: s.id, name: s.name, cohort: s.cohort, risk: s.risk, fatigue: dF(s, tick), isMe: false, isDemo: true, ref: s })) : [];

  const rows = [
    ...(loggedInUser && uF ? [{ id: loggedInUser.uid, name: loggedInUser.fullName, cohort: loggedInUser.cohort, risk: uRisk, fatigue: uF, isMe: true, isDemo: false, ref: null }] : []),
    ...peerRows,
    ...demoRows,
  ];

  const counts = { green: 0, amber: 0, red: 0 }; rows.forEach(r => counts[r.fatigue.signal]++);
  const atRisk = rows.filter(r => r.risk === "high" || r.risk === "critical").length;

  return (
    <div style={{ animation: "fadeUp 0.4s ease" }}>
      <div style={{ display: "flex", gap: 10, padding: "10px 14px", background: "rgba(6,13,20,0.9)", borderRadius: 10, border: "1px solid rgba(0,212,200,0.12)", alignItems: "center", flexWrap: "wrap", marginBottom: 16, rowGap: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}><div style={{ width: 7, height: 7, borderRadius: "50%", background: "#00D4C8", animation: "pulseR 2s infinite", flexShrink: 0 }} /><span style={{ fontSize: 11, color: "#00D4C8", fontFamily: "'Space Mono',monospace", letterSpacing: "0.06em" }}>LIVE · {rows.length} STUDENTS</span></div>
        <div style={{ width: 1, height: 14, background: "rgba(0,212,200,0.15)", flexShrink: 0 }} />
        {[["green", counts.green, "Optimal"], ["amber", counts.amber, "Moderate"], ["red", counts.red, "Critical"]].map(([sig, n, label]) => (
          <div key={sig} style={{ display: "flex", alignItems: "center", gap: 5 }}><Dot signal={sig} size={7} pulse={sig === "red"} /><span style={{ fontSize: 12, fontWeight: 700, color: SIG[sig].accent, fontFamily: "'Space Mono',monospace" }}>{n}</span><span style={{ fontSize: 11, color: "#5A7A90" }}>{label}</span></div>
        ))}
        <div style={{ width: 1, height: 14, background: "rgba(0,212,200,0.15)", flexShrink: 0 }} />
        <span style={{ fontSize: 11, color: "#C084FC" }}>⚠ {atRisk} at elevated risk</span>
        <div style={{ marginLeft: "auto", fontSize: 10, color: "#5A7A90", fontFamily: "'Space Mono',monospace" }}>APOLLO</div>
      </div>
      <div style={{ borderRadius: 12, background: "rgba(6,13,20,0.9)", border: "1px solid rgba(0,212,200,0.12)", overflow: "hidden" }}>
        <div style={{ padding: "14px 18px", borderBottom: "1px solid rgba(0,212,200,0.07)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
          <div>
            <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 15, fontWeight: 700, color: "#F0F8FF" }}>Institutional Command Console</div>
            <div style={{ fontSize: 11, color: "#5A7A90", marginTop: 2, fontFamily: "'Space Mono',monospace" }}>CLICK ANY ROW TO OPEN THE FULL DIGITAL TWIN PROFILE · PEER DATA IS READ-ONLY</div>
          </div>
          {peerRows.length > 0 && <span style={{ fontSize: 9, color: "#5A7A90", fontFamily: "'Space Mono',monospace", background: "rgba(0,212,200,0.06)", border: "1px solid rgba(0,212,200,0.15)", borderRadius: 5, padding: "3px 8px" }}>👁 {peerRows.length} REAL PEER{peerRows.length !== 1 ? "S" : ""} ONLINE</span>}
        </div>
        <div style={{ overflowX: "auto" }}>
          <div style={{ minWidth: 520 }}>
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1.8fr 55px 90px 90px 120px", padding: "8px 18px", borderBottom: "1px solid rgba(0,212,200,0.06)", fontSize: 10, color: "#5A7A90", fontFamily: "'Space Mono',monospace", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              <span>Student</span><span>Programme</span><span>Score</span><span>Signal</span><span>Risk</span><span>Intervention</span>
            </div>
            {loadingPeers && (
              [1, 2, 3].map(i => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "2fr 1.8fr 55px 90px 90px 120px", padding: "14px 18px", borderBottom: "1px solid rgba(0,212,200,0.04)", alignItems: "center" }}>
                  {[120, 90, 28, 55, 45, 70].map((w, j) => <div key={j} style={{ height: 9, width: w, background: "rgba(0,212,200,0.07)", borderRadius: 4, animation: `pulseR 1.5s ease-in-out infinite ${j * 0.1}s` }} />)}
                </div>
              ))
            )}
            {rows.map(row => (
              <div key={row.id} className="tr-hover" onClick={() => row.isMe ? onSelectSelf() : onSelectDemo(row.ref)}
                style={{ display: "grid", gridTemplateColumns: "2fr 1.8fr 55px 90px 90px 120px", padding: "12px 18px", cursor: "pointer", alignItems: "center", background: row.isMe ? "rgba(0,212,200,0.04)" : "transparent", borderBottom: "1px solid rgba(0,212,200,0.04)", borderLeft: row.isMe ? "3px solid #00D4C8" : row.isDemo ? "3px solid transparent" : "3px solid rgba(167,139,250,0.3)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
                  <Av name={row.name} size={28} />
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: row.isMe ? 700 : 500, color: row.isMe ? "#F0F8FF" : "#9BB5CC", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{row.name}</div>
                    <div style={{ display: "flex", gap: 4, marginTop: 1 }}>
                      {row.isMe && <span className="tag tag-teal" style={{ fontSize: 9, padding: "1px 5px" }}>YOU</span>}
                      {!row.isMe && !row.isDemo && <span style={{ fontSize: 9, color: "#A78BFA", fontFamily: "'Space Mono',monospace", letterSpacing: "0.03em" }}>👁 VIEW ONLY</span>}
                      {row.isDemo && <span style={{ fontSize: 9, color: "#3A5068", fontFamily: "'Space Mono',monospace" }}>DEMO</span>}
                    </div>
                  </div>
                </div>
                <span style={{ fontSize: 10, color: "#5A7A90", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", paddingRight: 8, fontFamily: "'Space Mono',monospace" }}>{row.cohort}</span>
                <span style={{ fontSize: 14, fontWeight: 700, fontFamily: "'Syne',sans-serif", color: SIG[row.fatigue.signal].accent }}>{row.fatigue.score}</span>
                <div style={{ display: "flex", alignItems: "center", gap: 5 }}><Dot signal={row.fatigue.signal} size={7} pulse={row.fatigue.signal === "red"} /><span style={{ fontSize: 10, color: SIG[row.fatigue.signal].text, fontFamily: "'Space Mono',monospace" }}>{SIG[row.fatigue.signal].label}</span></div>
                <span style={{ fontSize: 10, fontWeight: 700, color: RISK_COLOR[row.risk], textTransform: "uppercase", letterSpacing: "0.04em", fontFamily: "'Space Mono',monospace" }}>{row.risk}</span>
                {row.fatigue.intervention ? <span className="tag tag-amber" style={{ fontSize: 9 }}>{INTV_LABEL[row.fatigue.intervention]}</span> : <span style={{ fontSize: 11, color: "rgba(0,212,200,0.2)" }}>—</span>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}



/* ════════════════════════════════════════
   ADMIN PANEL
════════════════════════════════════════ */
function AdminPanel({ onSignOut }) {
  const [adminView, setAdminView] = useState("dashboard");
  const [selectedUser, setSelectedUser] = useState(null);
  const [editUser, setEditUser] = useState(null);
  const [searchQ, setSearchQ] = useState("");
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const refresh = async () => {
    setLoadingUsers(true);
    try { const all = await getAllUsers(); setUsers(all.filter(u => !u.isAdmin)); } catch { }
    finally { setLoadingUsers(false); }
  };
  useEffect(() => { refresh(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const deleteUser = async (email) => { await deleteUserDoc(email); refresh(); if (selectedUser?.email === email) setSelectedUser(null); };
  const saveEdit = async (u) => { await saveUser(u); refresh(); setEditUser(null); if (selectedUser?.email === u.email) setSelectedUser(u); };
  const filtered = users.filter(u => u.fullName.toLowerCase().includes(searchQ.toLowerCase()) || u.email.toLowerCase().includes(searchQ.toLowerCase()) || u.cohort.toLowerCase().includes(searchQ.toLowerCase()));
  const criticalCount = users.filter(u => computeTwin(u.profile).fatigue.signal === "red").length;
  const highRiskCount = users.filter(u => { const r = computeTwin(u.profile).apollo.risk; return r === "high" || r === "critical"; }).length;
  const avgFatigue = users.length ? Math.round(users.reduce((a, u) => a + computeTwin(u.profile).fatigue.score, 0) / users.length) : 0;

  return (
    <div style={{ minHeight: "100vh", background: "#020408", fontFamily: "'DM Sans',sans-serif" }}>
      <div style={{ position: "sticky", top: 0, zIndex: 100, background: "rgba(2,4,8,0.97)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(245,166,35,0.18)" }}>
        <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 16px", display: "flex", alignItems: "center", height: 54, gap: 10, flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}><NxLogo size={28} />
            <div><div style={{ fontFamily: "'Syne',sans-serif", fontSize: 12, fontWeight: 800, color: "#F5A623" }}>NEXUS LEARN · ADMIN</div>
              <div style={{ fontSize: 8, color: "#5A7A90", fontFamily: "'Space Mono',monospace", letterSpacing: "0.08em" }}>CONTROL PANEL</div></div>
          </div>
          <div style={{ flex: 1 }} />
          <div style={{ display: "flex", gap: 2, background: "rgba(10,21,32,0.9)", borderRadius: 8, padding: 3 }}>
            {[{ id: "dashboard", label: "Dashboard" }, { id: "users", label: "Users" }, { id: "activity", label: "Activity" }].map(({ id, label }) => (
              <button key={id} onClick={() => { setAdminView(id); setSelectedUser(null); setEditUser(null); }} style={{ padding: "5px 10px", borderRadius: 6, border: "none", cursor: "pointer", fontSize: 11, fontWeight: 700, fontFamily: "'Space Mono',monospace", letterSpacing: "0.04em", background: adminView === id ? "rgba(245,166,35,0.14)" : "transparent", color: adminView === id ? "#F5A623" : "#5A7A90", transition: "all 0.2s", whiteSpace: "nowrap" }}>{label}</button>
            ))}
          </div>
          <button className="nx-btn nx-btn-ghost" onClick={onSignOut} style={{ padding: "5px 12px", fontSize: 10, whiteSpace: "nowrap" }}>← Exit</button>
        </div>
      </div>
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "16px" }}>

        {adminView === "dashboard" && (
          <div style={{ animation: "fadeUp 0.4s ease" }}>
            <div style={{ marginBottom: 20 }}><div style={{ fontFamily: "'Syne',sans-serif", fontSize: 22, fontWeight: 800, color: "#F0F8FF", marginBottom: 4 }}>Admin Dashboard</div><div style={{ fontSize: 11, color: "#5A7A90", fontFamily: "'Space Mono',monospace" }}>REAL-TIME PLATFORM OVERVIEW · {new Date().toLocaleString()}</div></div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 14, marginBottom: 24 }}>
              {[{ label: "Total Students", value: users.length, icon: "👥", color: "#00D4C8" }, { label: "Critical Fatigue", value: criticalCount, icon: "⚡", color: "#FF4D6D" }, { label: "High Dropout Risk", value: highRiskCount, icon: "⚠", color: "#F5A623" }, { label: "Avg Fatigue Index", value: avgFatigue + "/100", icon: "📊", color: "#A78BFA" }].map(({ label, value, icon, color }) => (
                <div key={label} className="nx-card" style={{ padding: "22px", textAlign: "center" }}><div style={{ fontSize: 28, marginBottom: 8 }}>{icon}</div><div style={{ fontFamily: "'Syne',sans-serif", fontSize: 32, fontWeight: 800, color }}>{value}</div><div style={{ fontSize: 11, color: "#5A7A90", fontFamily: "'Space Mono',monospace", marginTop: 4, letterSpacing: "0.04em" }}>{label}</div></div>
              ))}
            </div>
            {loadingUsers ? (
              <div className="nx-card" style={{ padding: "44px", textAlign: "center" }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
                  <div style={{ display: "flex", gap: 8 }}>
                    {[0, 1, 2].map(i => <div key={i} style={{ width: 10, height: 10, borderRadius: "50%", background: "#00D4C8", animation: `pulseR 1.2s ease-in-out infinite ${i * 0.2}s` }} />)}
                  </div>
                  <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 11, color: "#5A7A90", letterSpacing: "0.06em" }}>LOADING STUDENT DATA…</div>
                  {[180, 130, 160].map((w, i) => <div key={i} style={{ height: 9, width: w, background: "rgba(0,212,200,0.07)", borderRadius: 4, animation: `pulseR 1.5s ease-in-out infinite ${i * 0.15}s` }} />)}
                </div>
              </div>
            ) : users.length === 0 ? (
              <div className="nx-card" style={{ padding: "44px", textAlign: "center" }}>
                <div style={{ fontSize: 36, marginBottom: 14, opacity: 0.4 }}>👤</div>
                <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 15, color: "#9BB5CC", marginBottom: 8 }}>No Students Yet</div>
                <div style={{ fontSize: 11, color: "#5A7A90", fontFamily: "'Space Mono',monospace", lineHeight: 1.7 }}>New sign-ups will appear here automatically.<br />Share the platform link to onboard students.</div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 7, marginTop: 20 }}>
                  <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#00D4C8", animation: "pulseR 2s infinite" }} />
                  <span style={{ fontSize: 10, color: "#00D4C8", fontFamily: "'Space Mono',monospace", letterSpacing: "0.06em" }}>LISTENING FOR NEW SIGN-UPS</span>
                </div>
              </div>
            ) : (
              <div className="nx-card" style={{ padding: "20px" }}>
                <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 14, fontWeight: 700, color: "#F0F8FF", marginBottom: 14 }}>Recent Student Activity</div>
                {users.slice(0, 8).map(u => {
                  const tw = computeTwin(u.profile); return (
                    <div key={u.uid} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: "1px solid rgba(0,212,200,0.06)", cursor: "pointer" }} onClick={() => { setSelectedUser(u); setAdminView("users"); }}>
                      <Av name={u.fullName} size={32} />
                      <div style={{ flex: 1 }}><div style={{ fontSize: 13, fontWeight: 600, color: "#F0F8FF" }}>{u.fullName}</div><div style={{ fontSize: 10, color: "#5A7A90", fontFamily: "'Space Mono',monospace" }}>{u.cohort}</div></div>
                      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        <span style={{ fontSize: 14, fontWeight: 700, color: SIG[tw.fatigue.signal].accent, fontFamily: "'Syne',sans-serif" }}>{tw.fatigue.score}</span>
                        <Dot signal={tw.fatigue.signal} size={7} pulse={tw.fatigue.signal === "red"} />
                        <span style={{ fontSize: 10, fontWeight: 700, color: RISK_COLOR[tw.apollo.risk], fontFamily: "'Space Mono',monospace", textTransform: "uppercase" }}>{tw.apollo.risk}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {adminView === "users" && !selectedUser && !editUser && (
          <div style={{ animation: "fadeUp 0.4s ease" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
              <div><div style={{ fontFamily: "'Syne',sans-serif", fontSize: 20, fontWeight: 800, color: "#F0F8FF", marginBottom: 2 }}>Student Management</div><div style={{ fontSize: 11, color: "#5A7A90", fontFamily: "'Space Mono',monospace" }}>{filtered.length} OF {users.length} STUDENTS</div></div>
              <input className="nx-input" value={searchQ} onChange={e => setSearchQ(e.target.value)} placeholder="🔍 Search by name, email or course…" style={{ maxWidth: 320 }} />
            </div>
            {filtered.length === 0 ? (
              <div className="nx-card" style={{ padding: "40px", textAlign: "center" }}><div style={{ fontSize: 11, color: "#5A7A90", fontFamily: "'Space Mono',monospace" }}>NO STUDENTS FOUND · SIGN-UP VIA THE MAIN PLATFORM TO SEE USERS HERE</div></div>
            ) : (
              <div className="nx-card" style={{ overflow: "hidden" }}>
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 700 }}>
                    <thead><tr style={{ borderBottom: "1px solid rgba(0,212,200,0.1)" }}>{["Student", "Email", "Programme", "Fatigue", "Risk", "GPA", "Last Login", "Actions"].map(h => (
                      <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontSize: 10, color: "#5A7A90", fontFamily: "'Space Mono',monospace", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 700 }}>{h}</th>
                    ))}</tr></thead>
                    <tbody>{filtered.map(u => {
                      const tw = computeTwin(u.profile); const lastLogin = u.loginHistory?.[u.loginHistory.length - 1]; return (
                        <tr key={u.uid} className="tr-hover" style={{ borderBottom: "1px solid rgba(0,212,200,0.05)" }}>
                          <td style={{ padding: "11px 14px" }}><div style={{ display: "flex", alignItems: "center", gap: 8 }}><Av name={u.fullName} size={28} /><div><div style={{ fontSize: 13, fontWeight: 600, color: "#F0F8FF" }}>{u.fullName}</div><div style={{ fontSize: 9, color: "#5A7A90", fontFamily: "'Space Mono',monospace" }}>{u.studentId}</div></div></div></td>
                          <td style={{ padding: "11px 14px", fontSize: 11, color: "#5A7A90", fontFamily: "'Space Mono',monospace" }}>{u.email}</td>
                          <td style={{ padding: "11px 14px", fontSize: 11, color: "#9BB5CC" }}>{u.cohort}</td>
                          <td style={{ padding: "11px 14px" }}><span style={{ fontSize: 14, fontWeight: 700, color: SIG[tw.fatigue.signal].accent, fontFamily: "'Syne',sans-serif" }}>{tw.fatigue.score}</span></td>
                          <td style={{ padding: "11px 14px" }}><span style={{ fontSize: 11, fontWeight: 700, color: RISK_COLOR[tw.apollo.risk], fontFamily: "'Space Mono',monospace", textTransform: "uppercase" }}>{tw.apollo.risk}</span></td>
                          <td style={{ padding: "11px 14px", fontSize: 12, color: tw.apollo.gpaLast >= 3 ? "#10F59E" : "#F5A623", fontFamily: "'Space Mono',monospace", fontWeight: 700 }}>{tw.apollo.gpaLast.toFixed(1)}</td>
                          <td style={{ padding: "11px 14px", fontSize: 10, color: "#5A7A90", fontFamily: "'Space Mono',monospace" }}>{lastLogin ? new Date(lastLogin).toLocaleDateString() : "—"}</td>
                          <td style={{ padding: "11px 14px" }}><div style={{ display: "flex", gap: 6 }}>
                            <button className="nx-btn nx-btn-ghost" onClick={() => setSelectedUser(u)} style={{ padding: "4px 10px", fontSize: 10 }}>View</button>
                            <button className="nx-btn" onClick={() => setEditUser({ ...u })} style={{ padding: "4px 10px", fontSize: 10, background: "rgba(245,166,35,0.1)", border: "1px solid rgba(245,166,35,0.3)", color: "#F5A623", borderRadius: 6 }}>Edit</button>
                            <button className="nx-btn nx-btn-red" onClick={() => { if (window.confirm(`Delete ${u.fullName}?`)) deleteUser(u.email); }} style={{ padding: "4px 10px", fontSize: 10 }}>Del</button>
                          </div></td>
                        </tr>
                      );
                    })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {adminView === "users" && selectedUser && !editUser && (
          <div style={{ animation: "fadeUp 0.4s ease" }}>
            <div style={{ display: "flex", gap: 10, marginBottom: 16, alignItems: "center" }}>
              <button className="nx-btn nx-btn-ghost" onClick={() => setSelectedUser(null)} style={{ padding: "6px 14px", fontSize: 11 }}>← Back to Users</button>
              <span className="tag tag-amber">VIEWING STUDENT PROFILE</span>
            </div>
            <StudentDetail name={selectedUser.fullName} cohort={selectedUser.cohort} studentId={selectedUser.studentId} profile={selectedUser.profile} twin={computeTwin(selectedUser.profile)} lastUpdated={selectedUser.lastUpdated} isMine={false} />
          </div>
        )}

        {editUser && (
          <div style={{ animation: "fadeUp 0.4s ease" }}>
            <div style={{ display: "flex", gap: 10, marginBottom: 16, alignItems: "center" }}>
              <button className="nx-btn nx-btn-ghost" onClick={() => setEditUser(null)} style={{ padding: "6px 14px", fontSize: 11 }}>← Cancel</button>
              <span className="tag tag-amber">EDITING: {editUser.fullName}</span>
            </div>
            <div className="nx-card" style={{ padding: "24px" }}>
              <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 16, fontWeight: 700, color: "#F0F8FF", marginBottom: 16 }}>Edit Student Profile</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 16 }}>
                <FI label="Full Name" name="fn" value={editUser.fullName} onChange={e => setEditUser(p => ({ ...p, fullName: e.target.value }))} />
                <FI label="Institution" name="inst" value={editUser.institution || ""} onChange={e => setEditUser(p => ({ ...p, institution: e.target.value }))} />
                <FI label="Cohort" name="cohort" value={editUser.cohort} onChange={e => setEditUser(p => ({ ...p, cohort: e.target.value }))} options={COURSES} />
                <FI label="Year of Study" name="yos" value={editUser.yearOfStudy || ""} onChange={e => setEditUser(p => ({ ...p, yearOfStudy: e.target.value }))} options={[["1", "Year 1"], ["2", "Year 2"], ["3", "Year 3"], ["4", "Year 4"], ["5", "Year 5"], ["PG1", "PG Year 1"], ["PG2", "PG Year 2"], ["PhD", "PhD"]]} />
              </div>
              <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 13, fontWeight: 700, color: "#00D4C8", marginBottom: 12 }}>Profile Data</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: 12, marginBottom: 20 }}>
                {["sleepHours", "stressLevel", "studyHoursPerDay", "exercisePerWeek", "screenTimeHours", "caffeine", "lastRestDays", "mentalHealthRating", "missedDeadlines", "attendanceRate", "gpaLast", "readingSpeed"].map(k => (
                  <FI key={k} label={k} name={k} value={editUser.profile[k] || ""} onChange={e => setEditUser(p => ({ ...p, profile: { ...p.profile, [k]: e.target.value } }))} />
                ))}
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <button className="nx-btn nx-btn-primary" onClick={() => saveEdit(editUser)} style={{ flex: 1 }}>✓ Save Changes</button>
                <button className="nx-btn nx-btn-ghost" onClick={() => setEditUser(null)} style={{ flex: 1 }}>Cancel</button>
              </div>
            </div>
          </div>
        )}

        {adminView === "activity" && (
          <div style={{ animation: "fadeUp 0.4s ease" }}>
            <div style={{ marginBottom: 20 }}><div style={{ fontFamily: "'Syne',sans-serif", fontSize: 20, fontWeight: 800, color: "#F0F8FF", marginBottom: 4 }}>Activity Log</div><div style={{ fontSize: 11, color: "#5A7A90", fontFamily: "'Space Mono',monospace" }}>LOGIN HISTORY ACROSS ALL REGISTERED STUDENTS</div></div>
            {users.length === 0 ? (
              <div className="nx-card" style={{ padding: "40px", textAlign: "center" }}><div style={{ fontSize: 11, color: "#5A7A90", fontFamily: "'Space Mono',monospace" }}>NO ACTIVITY YET — STUDENTS WILL APPEAR AFTER SIGNING UP</div></div>
            ) : (
              <div className="nx-card" style={{ padding: "20px" }}>
                {users.flatMap(u => (u.loginHistory || []).map(ts => ({ name: u.fullName, email: u.email, ts }))).sort((a, b) => new Date(b.ts) - new Date(a.ts)).slice(0, 40).map((ev, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "9px 0", borderBottom: "1px solid rgba(0,212,200,0.05)" }}>
                    <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#00D4C8", flexShrink: 0, animation: "pulseR 2s infinite" }} />
                    <span style={{ fontSize: 12, color: "#F0F8FF", flex: 1 }}><strong style={{ color: "#00D4C8" }}>{ev.name}</strong> <span style={{ color: "#5A7A90" }}>({ev.email})</span> logged in</span>
                    <span style={{ fontSize: 10, color: "#5A7A90", fontFamily: "'Space Mono',monospace", flexShrink: 0 }}>{new Date(ev.ts).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════
   DASH NAV
════════════════════════════════════════ */
function DashNav({ currentUser, view, navRem, onViewChange, onUpdate, onSignOut, lastTick }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  return (
    <div style={{ position: "sticky", top: 0, zIndex: 100, background: "rgba(2,4,8,0.95)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(0,212,200,0.1)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 16px", display: "flex", alignItems: "center", height: 52, gap: 10 }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          <NxLogo size={30} />
          <div>
            <span style={{ fontFamily: "'Syne',sans-serif", fontSize: 13, fontWeight: 800, color: "#F0F8FF", letterSpacing: "-0.01em", display: "block", lineHeight: 1 }}>NEXUS LEARN</span>
            <span style={{ fontSize: 8, color: "#00D4C8", fontFamily: "'Space Mono',monospace", letterSpacing: "0.08em" }}>COGNITIVE AI</span>
          </div>
        </div>

        {/* Desktop: view switcher + timer */}
        {!isMobile && <>
          <div style={{ display: "flex", gap: 2, background: "rgba(6,13,20,0.9)", borderRadius: 8, padding: 3, flexShrink: 0, border: "1px solid rgba(0,212,200,0.1)" }}>
            {[{ id: "institutional", label: "Cohort" }, { id: "student", label: "My Profile" }].map(({ id, label }) => (
              <button key={id} onClick={() => onViewChange(id)} style={{ padding: "5px 12px", borderRadius: 6, border: "none", cursor: "pointer", fontSize: 11, fontWeight: 700, fontFamily: "'Space Mono',monospace", letterSpacing: "0.04em", background: ((view === id && id === "institutional") || (view === "student" && id === "student")) ? "rgba(0,212,200,0.12)" : "transparent", color: ((view === id && id === "institutional") || (view === "student" && id === "student")) ? "#00D4C8" : "#5A7A90", transition: "all 0.2s", whiteSpace: "nowrap" }}>{label}</button>
            ))}
          </div>
          {view === "student" && (navRem
            ? <div style={{ padding: "4px 10px", borderRadius: 6, background: "rgba(245,166,35,0.08)", border: "1px solid rgba(245,166,35,0.24)", fontSize: 10, color: "#F5A623", fontFamily: "'Space Mono',monospace", whiteSpace: "nowrap", flexShrink: 0 }}>{fmt(navRem)}</div>
            : <button className="nx-btn nx-btn-primary" onClick={onUpdate} style={{ padding: "5px 14px", fontSize: 11, flexShrink: 0 }}>📝 Update</button>
          )}
        </>}

        <div style={{ flex: 1 }} />

        {/* Desktop: user */}
        {!isMobile && <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7 }}><Av name={currentUser.fullName} size={26} /><span style={{ fontSize: 11, color: "#9BB5CC", whiteSpace: "nowrap", maxWidth: 80, overflow: "hidden", textOverflow: "ellipsis" }}>{currentUser.fullName.split(" ")[0]}</span></div>
          <button className="nx-btn nx-btn-ghost" onClick={onSignOut} style={{ padding: "5px 12px", fontSize: 10 }}>Sign Out</button>
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <span style={{ fontSize: 9, color: "#5A7A90", fontFamily: "'Space Mono',monospace" }}>{lastTick.toLocaleTimeString()}</span>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#00D4C8", animation: "pulseR 2s infinite" }} />
          </div>
        </div>}

        {/* Mobile: avatar + hamburger */}
        {isMobile && <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Av name={currentUser.fullName} size={26} />
          <button onClick={() => setMenuOpen(o => !o)} style={{ background: "rgba(6,13,20,0.9)", border: "1px solid rgba(0,212,200,0.25)", borderRadius: 6, padding: "5px 9px", cursor: "pointer", color: "#00D4C8", fontSize: 15, lineHeight: 1 }}>
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>}
      </div>

      {/* Mobile dropdown */}
      {isMobile && menuOpen && (
        <div style={{ background: "rgba(6,13,20,0.98)", borderTop: "1px solid rgba(0,212,200,0.1)", padding: "14px 16px", display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ display: "flex", gap: 6 }}>
            {[{ id: "institutional", label: "Cohort" }, { id: "student", label: "My Profile" }].map(({ id, label }) => (
              <button key={id} onClick={() => { onViewChange(id); setMenuOpen(false); }} style={{ flex: 1, padding: "9px", borderRadius: 7, border: "1px solid rgba(0,212,200,0.2)", cursor: "pointer", fontSize: 12, fontWeight: 700, fontFamily: "'Space Mono',monospace", background: ((view === id && id === "institutional") || (view === "student" && id === "student")) ? "rgba(0,212,200,0.14)" : "transparent", color: ((view === id && id === "institutional") || (view === "student" && id === "student")) ? "#00D4C8" : "#5A7A90" }}>{label}</button>
            ))}
          </div>
          {view === "student" && !navRem && (
            <button className="nx-btn nx-btn-primary" onClick={() => { onUpdate(); setMenuOpen(false); }} style={{ width: "100%", fontSize: 12 }}>📝 Update Profile</button>
          )}
          {view === "student" && navRem && (
            <div style={{ padding: "8px 12px", borderRadius: 6, background: "rgba(245,166,35,0.08)", border: "1px solid rgba(245,166,35,0.24)", fontSize: 11, color: "#F5A623", fontFamily: "'Space Mono',monospace", textAlign: "center" }}>Next update: {fmt(navRem)}</div>
          )}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 4, borderTop: "1px solid rgba(0,212,200,0.06)" }}>
            <span style={{ fontSize: 12, color: "#9BB5CC" }}>{currentUser.fullName}</span>
            <button className="nx-btn nx-btn-ghost" onClick={() => { onSignOut(); setMenuOpen(false); }} style={{ padding: "6px 14px", fontSize: 11 }}>Sign Out</button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ════════════════════════════════════════
   ROOT APP — all hooks at top, conditional renders below
════════════════════════════════════════ */
export default function NexusLearnApp() {
  const [screen, setScreen] = useState("landing");
  const [view, setView] = useState("institutional");
  const [currentUser, setCurrentUser] = useState(null);
  const [twin, setTwin] = useState(null);
  const [twinLoading, setTwinLoading] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);
  const [welcome, setWelcome] = useState(null);
  const [demoStu, setDemoStu] = useState(null);
  const [lastTick, setLastTick] = useState(new Date());
  const [navRem, setNavRem] = useState(null);
  const [authReady, setAuthReady] = useState(false); // true once Firebase resolves the session
  const cssRef = useRef(null);

  useEffect(() => {
    const el = document.createElement("style");
    el.textContent = GLOBAL_CSS;
    document.head.appendChild(el);
    cssRef.current = el;
    return () => { if (cssRef.current) document.head.removeChild(cssRef.current); };
  }, []);

  // Restore session via Firebase Auth state (persists across refreshes + devices)
  useEffect(() => {
    const unsub = onAuth(async (firebaseUser) => {
      // No user signed in via Firebase Auth
      if (!firebaseUser) {
        // Admin uses a localStorage flag (bypasses Firebase Auth)
        if (localStorage.getItem("nx_admin_session") === "1") {
          setCurrentUser({ fullName: "Admin", email: ADMIN_EMAIL, isAdmin: true });
          setScreen("admin");
          setAuthReady(true);
          return;
        }
        setScreen(prev => prev === "app" ? "landing" : prev); setAuthReady(true); return;
      }
      // Admin who somehow has a Firebase session too
      if (firebaseUser.email === ADMIN_EMAIL) {
        setCurrentUser({ fullName: "Admin", email: ADMIN_EMAIL, isAdmin: true });
        setScreen("admin"); setAuthReady(true); return;
      }
      try {
        const u = await getUser(firebaseUser.email);
        if (u) {
          const baseTwin = computeTwin(u.profile);
          setCurrentUser(u); setTwin(baseTwin); setScreen("app"); setView("institutional");
          setNavRem(getRemaining(u.lastUpdated));
          setTwinLoading(true);
          computeTwinAI(u.profile).then(aiTwin => { setTwin(aiTwin); setTwinLoading(false); });
        }
        // Mark ready AFTER screen is set — splash hides only when the app is fully ready
        setAuthReady(true);
      } catch (e) { console.warn("Session restore error:", e); setAuthReady(true); }
    });
    return () => unsub();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { const i = setInterval(() => setLastTick(new Date()), 6000); return () => clearInterval(i); }, []);
  useEffect(() => { const t = setInterval(() => setNavRem(getRemaining(currentUser?.lastUpdated || null)), 1000); return () => clearInterval(t); }, [currentUser]);

  const login = (u, isNew) => {
    if (u?.isAdmin) {
      localStorage.setItem("nx_admin_session", "1"); // persist so refresh restores admin
      setCurrentUser(u); setScreen("admin"); return;
    }
    // Session is managed by Firebase Auth — no localStorage needed
    const baseTwin = computeTwin(u.profile);
    setCurrentUser(u); setTwin(baseTwin);
    setView("institutional"); setScreen("app");
    setWelcome({ name: u.fullName, isNew });
    setNavRem(getRemaining(u.lastUpdated));
    setTwinLoading(true);
    computeTwinAI(u.profile).then(aiTwin => { setTwin(aiTwin); setTwinLoading(false); });
  };
  const updateSave = async (u) => {
    await saveUser(u); // persist updated profile to Firestore
    const baseTwin = computeTwin(u.profile);
    setCurrentUser(u); setTwin(baseTwin); setShowUpdate(false); setNavRem(getRemaining(u.lastUpdated));
    setTwinLoading(true);
    computeTwinAI(u.profile).then(aiTwin => { setTwin(aiTwin); setTwinLoading(false); });
  };
  const signOut = async () => { localStorage.removeItem("nx_admin_session"); await firebaseSignOut(); setCurrentUser(null); setTwin(null); setTwinLoading(false); setScreen("landing"); setNavRem(null); setWelcome(null); setDemoStu(null); };
  const changeView = (v) => { setView(v); if (v === "institutional") setDemoStu(null); };
  const selectDemo = (ref) => { setDemoStu(ref); setView("demo"); };

  // Show branded splash while Firebase resolves the session (prevents flash to landing on refresh)
  if (!authReady) return (
    <div style={{ minHeight: "100vh", background: "#020408", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20 }}>
      <NxLogo size={54} />
      <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 20, fontWeight: 800, color: "#F0F8FF", letterSpacing: "-0.01em" }}>NEXUS LEARN</div>
      <div style={{ display: "flex", gap: 7 }}>
        {[0, 1, 2].map(i => <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: "#00D4C8", animation: `pulseR 1.2s ease-in-out infinite ${i * 0.2}s`, opacity: 0.7 }} />)}
      </div>
    </div>
  );

  if (screen === "landing") return <LandingPage onConnect={() => setScreen("signin")} onMeetTeam={() => setScreen("team")} />;
  if (screen === "team") return <TeamPage onBack={() => setScreen("landing")} />;
  if (screen === "signup") return <SignUpScreen onDone={(u, flag) => { if (!u || flag === "signin") { setScreen("signin"); return; } login(u, true); }} onBack={() => setScreen("signin")} />;
  if (screen === "signin") return <SignInScreen onDone={login} goSignUp={() => setScreen("signup")} onBack={() => setScreen("landing")} />;
  if (screen === "admin") return <AdminPanel onSignOut={signOut} />;

  const demoTwin = demoStu ? computeTwin(demoStu.p) : null;
  return (
    <div style={{ minHeight: "100vh", background: "#020408", color: "#F0F8FF", fontFamily: "'DM Sans',sans-serif", paddingBottom: 80 }}>
      {welcome && <WelcomePopup name={welcome.name} isNew={welcome.isNew} onClose={() => setWelcome(null)} />}
      {showUpdate && currentUser && <UpdateModal user={currentUser} onSave={updateSave} onCancel={() => setShowUpdate(false)} />}
      <DashNav currentUser={currentUser} view={view} navRem={navRem} lastTick={lastTick} onViewChange={changeView} onUpdate={() => setShowUpdate(true)} onSignOut={signOut} />
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "20px 16px" }}>
        {view === "institutional" && <InstitutionalView loggedInUser={currentUser} onSelectSelf={() => changeView("student")} onSelectDemo={selectDemo} />}
        {view === "student" && currentUser && twin && (
          <div style={{ animation: "fadeUp 0.4s ease" }}>
            <button className="nx-btn nx-btn-ghost" onClick={() => changeView("institutional")} style={{ padding: "5px 14px", fontSize: 11, marginBottom: 16 }}>← Cohort View</button>
            {/* AI computing overlay banner */}
            {twinLoading && (
              <div style={{ marginBottom: 14, padding: "10px 16px", borderRadius: 10, background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.3)", display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#A78BFA", animation: "pulseR 1s infinite", flexShrink: 0 }} />
                <span style={{ fontSize: 11, color: "#A78BFA", fontFamily: "'Space Mono',monospace", letterSpacing: "0.04em" }}>⚡ NEXUS AI IS COMPUTING YOUR DIGITAL TWIN — ENGINES UPGRADING…</span>
              </div>
            )}
            <StudentDetail name={currentUser.fullName} cohort={currentUser.cohort} studentId={currentUser.studentId} profile={currentUser.profile} twin={twin} lastUpdated={currentUser.lastUpdated} isMine={true} onUpdateProfile={() => setShowUpdate(true)} />
          </div>
        )}
        {view === "demo" && demoStu && demoTwin && (
          <div style={{ animation: "fadeUp 0.4s ease" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <button className="nx-btn nx-btn-ghost" onClick={() => { changeView("institutional"); setDemoStu(null); }} style={{ padding: "5px 14px", fontSize: 11 }}>← Cohort View</button>
              <span className="tag tag-teal">YOUR COHORT PARTNER</span>
            </div>
            <StudentDetail name={demoStu.name} cohort={demoStu.cohort} studentId={demoStu.id} profile={demoStu.p} twin={demoTwin} lastUpdated={null} isMine={false} />
          </div>
        )}
      </div>
    </div>
  );
}