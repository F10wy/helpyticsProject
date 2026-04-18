import React, { useEffect } from 'react';
import './assets/styles.css';

const RequestDetail = () => {
  useEffect(() => {
   const STORAGE_KEYS = {
  users: "helphub_users",
  requests: "helphub_requests",
  notifications: "helphub_notifications",
  messages: "helphub_messages",
  currentUser: "helphub_current_user"
};

const SKILLS = [
  "JavaScript", "HTML/CSS", "React", "Node.js", "Python", "UI/UX", "Graphic Design",
  "Content Writing", "Public Speaking", "Data Analysis", "Math Tutoring", "Career Guidance",
  "Git/GitHub", "Figma", "Firebase", "Interview Prep"
];

const CATEGORIES = {
  "Web Development": ["website", "frontend", "javascript", "html", "css", "react", "bug", "responsive"],
  "Design": ["design", "figma", "ui", "ux", "poster", "brand"],
  "Career": ["resume", "career", "job", "interview", "linkedin", "portfolio"],
  "Academics": ["math", "assignment", "physics", "chemistry", "study", "exam", "tutor"],
  "Content": ["writing", "content", "script", "copy", "blog"],
  "Community": ["event", "volunteer", "community", "coordination", "mentor"]
};

const URGENCY = [
  { level: "Critical", words: ["asap", "urgent", "deadline", "today", "stuck", "production"] },
  { level: "High", words: ["soon", "issue", "blocked", "tomorrow", "important"] },
  { level: "Medium", words: ["guidance", "improve", "help", "review"] }
];

const qs = (selector) => document.querySelector(selector);
const qsa = (selector) => [...document.querySelectorAll(selector)];
const load = (key, fallback) => {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
};
const save = (key, value) => localStorage.setItem(key, JSON.stringify(value));
const makeId = (prefix) => `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
const initials = (name = "U") => name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase();

function seedData() {
  if (!load(STORAGE_KEYS.users, null)) {
    save(STORAGE_KEYS.users, [
      { id: "user-1", name: "Ayesha Khan", role: "Both", location: "Karachi", interests: ["Hackathons", "UI/UX", "Community Building"], skills: ["Figma", "UI/UX", "HTML/CSS", "Career Guidance"], trustScore: 92, badges: ["Design Ally", "Fast Responder", "Top Mentor"], contributions: 31 },
      { id: "user-2", name: "Hassan Ali", role: "Can Help", location: "Lahore", interests: ["Web Apps", "Teaching", "Open Source"], skills: ["JavaScript", "React", "Git/GitHub", "Node.js"], trustScore: 88, badges: ["Code Rescuer", "Bug Hunter"], contributions: 24 },
      { id: "user-3", name: "Sara Noor", role: "Need Help", location: "Islamabad", interests: ["Learning", "Data", "Public Speaking"], skills: ["Python", "Data Analysis"], trustScore: 74, badges: ["Community Voice"], contributions: 11 }
    ]);
    save(STORAGE_KEYS.currentUser, "user-1");
  }

  if (!load(STORAGE_KEYS.requests, null)) {
    save(STORAGE_KEYS.requests, [
      { id: "req-1", title: "Need help making my portfolio responsive before demo day", description: "My HTML/CSS portfolio breaks on tablets and I need layout guidance before tomorrow evening.", tags: ["HTML/CSS", "Responsive", "Portfolio"], category: "Web Development", urgency: "High", location: "Karachi", requesterId: "user-3", helperIds: ["user-1"], status: "Open", createdAt: "2026-04-17T10:00:00", aiSummary: "Responsive layout issue with a short deadline. Best helpers are frontend mentors comfortable with CSS grids and media queries." },
      { id: "req-2", title: "Looking for Figma feedback on a volunteer event poster", description: "I have a draft poster for a campus community event and want sharper hierarchy, spacing, and CTA copy.", tags: ["Figma", "Poster", "Design Review"], category: "Design", urgency: "Medium", location: "Lahore", requesterId: "user-1", helperIds: ["user-2"], status: "Open", createdAt: "2026-04-16T15:30:00", aiSummary: "A visual design critique request where feedback on hierarchy, spacing, and messaging would create the most value." },
      { id: "req-3", title: "Need mock interview support for internship applications", description: "Applying to frontend internships and need someone to practice behavioral and technical interview questions with me.", tags: ["Interview Prep", "Career", "Frontend"], category: "Career", urgency: "Low", location: "Remote", requesterId: "user-3", helperIds: ["user-1", "user-2"], status: "Solved", createdAt: "2026-04-14T09:15:00", aiSummary: "Career coaching request focused on confidence-building, behavioral answers, and entry-level frontend interviews." }
    ]);
  }

  if (!load(STORAGE_KEYS.notifications, null)) {
    save(STORAGE_KEYS.notifications, [
      { id: "note-1", title: "New helper matched to your responsive portfolio request", type: "Match", status: "Unread", time: "12 min ago" },
      { id: "note-2", title: "Your trust score increased after a solved request", type: "Reputation", status: "Unread", time: "1 hr ago" },
      { id: "note-3", title: "AI Center detected rising demand for interview prep", type: "Insight", status: "Read", time: "Today" }
    ]);
  }

  if (!load(STORAGE_KEYS.messages, null)) {
    save(STORAGE_KEYS.messages, [
      { id: "msg-1", from: "Ayesha Khan", to: "Sara Noor", text: "I checked your portfolio request. Share the breakpoint screenshots and I can suggest fixes.", time: "09:45 AM" },
      { id: "msg-2", from: "Hassan Ali", to: "Ayesha Khan", text: "Your event poster concept is solid. I would tighten the CTA and reduce the background texture.", time: "11:10 AM" }
    ]);
  }
}

const getUsers = () => load(STORAGE_KEYS.users, []);
const getRequests = () => load(STORAGE_KEYS.requests, []);
const getNotifications = () => load(STORAGE_KEYS.notifications, []);
const getMessages = () => load(STORAGE_KEYS.messages, []);
function getCurrentUser() {
  const users = getUsers();
  const id = load(STORAGE_KEYS.currentUser, users[0]?.id);
  return users.find((user) => user.id === id) || users[0];
}

function setCurrentUser(id) { save(STORAGE_KEYS.currentUser, id); }
function getTopCategory(requests) {
  const counts = requests.reduce((acc, request) => ({ ...acc, [request.category]: (acc[request.category] || 0) + 1 }), {});
  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || "Community";
}

function suggestCategory(text) {
  const normalized = text.toLowerCase();
  let best = { category: "Community", score: 0 };
  Object.entries(CATEGORIES).forEach(([category, words]) => {
    const score = words.reduce((sum, word) => sum + Number(normalized.includes(word)), 0);
    if (score > best.score) best = { category, score };
  });
  return best.category;
}

function detectUrgency(text) {
  const normalized = text.toLowerCase();
  for (const rule of URGENCY) if (rule.words.some((word) => normalized.includes(word))) return rule.level;
  return "Low";
}

function suggestTags(text) {
  const normalized = text.toLowerCase();
  const tags = SKILLS.filter((skill) => normalized.includes(skill.toLowerCase()) || normalized.includes(skill.toLowerCase().replace("/", ""))).slice(0, 4);
  if (normalized.includes("portfolio")) tags.push("Portfolio");
  if (normalized.includes("responsive")) tags.push("Responsive");
  if (normalized.includes("interview")) tags.push("Interview Prep");
  if (normalized.includes("design")) tags.push("Design Review");
  return [...new Set(tags)].slice(0, 5);
}

function rewriteDescription(text) {
  const trimmed = text.trim();
  if (!trimmed) return "";
  return `I need focused support with ${trimmed.charAt(0).toLowerCase() + trimmed.slice(1)}. A helper who can provide practical next steps, examples, and a quick review would be ideal.`;
}

function deriveSkillSuggestions(interests = [], skills = []) {
  const joined = [...interests, ...skills].join(" ").toLowerCase();
  const helpWith = SKILLS.filter((item) => joined.includes(item.toLowerCase()) || item.split(" ").some((part) => joined.includes(part.toLowerCase()))).slice(0, 4);
  const needHelp = SKILLS.filter((item) => !skills.includes(item) && !helpWith.includes(item)).slice(0, 4);
  return {
    helpWith: helpWith.length ? helpWith : ["UI/UX", "Career Guidance", "Public Speaking"],
    needHelp: needHelp.length ? needHelp : ["Git/GitHub", "Interview Prep", "React"]
  };
}

function showToast(message) {
  let wrap = qs(".toast-wrap");
  if (!wrap) {
    wrap = document.createElement("div");
    wrap.className = "toast-wrap";
    document.body.appendChild(wrap);
  }
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  wrap.appendChild(toast);
  setTimeout(() => toast.remove(), 2800);
}

function renderNav() {
  const page = document.body.dataset.page;
  qsa("[data-nav]").forEach((item) => item.dataset.nav === page && item.classList.add("active"));
}

function requestCard(request, users) {
  const requester = users.find((user) => user.id === request.requesterId);
  return `
    <article class="request-card fade-in">
      <div class="card-meta">
        <span class="tag">${request.category}</span>
        <span class="tag ${["Critical", "High"].includes(request.urgency) ? "urgent" : ""}">${request.urgency}</span>
        <span class="tag ${request.status === "Solved" ? "success" : ""}">${request.status}</span>
      </div>
      <h3>${request.title}</h3>
      <p>${request.description}</p>
      <div class="tag-row">${request.tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}</div>
      <div class="list-item" style="padding-bottom:0;border-bottom:0;">
        <div>
          <strong>${requester?.name || "Unknown user"}</strong>
          <p>${request.location} • ${request.helperIds.length} helper${request.helperIds.length === 1 ? "" : "s"} interested</p>
        </div>
        <a class="btn btn-secondary" href="/request-detail?id=${request.id}">Open details</a>
      </div>
    </article>
  `;
}

function renderLanding() {
  const users = getUsers();
  const requests = getRequests();
  const solved = requests.filter((request) => request.status === "Solved").length;
  qs("[data-stat-members]").textContent = `${users.length * 128}+`;
  qs("[data-stat-requests]").textContent = `${requests.length * 18}+`;
  qs("[data-stat-solved]").textContent = `${solved * 23}+`;
  qs("[data-top-score]").textContent = `${Math.max(...users.map((user) => user.trustScore))}%`;
  qs("[data-featured-requests]").innerHTML = requests.slice(0, 3).map((request) => requestCard(request, users)).join("");
}

function renderDashboard() {
  const currentUser = getCurrentUser();
  const users = getUsers();
  const requests = getRequests();
  const notifications = getNotifications();
  qs("[data-dashboard-name]").textContent = currentUser.name;
  qs("[data-stat-trust]").textContent = `${currentUser.trustScore}%`;
  qs("[data-stat-helping]").textContent = requests.filter((request) => request.helperIds.includes(currentUser.id)).length;
  qs("[data-stat-open]").textContent = requests.filter((request) => request.status === "Open").length;
  qs("[data-stat-insights]").textContent = `${requests.filter((request) => request.category === "Career").length} trends`;
  qs("[data-dashboard-requests]").innerHTML = requests.slice(0, 3).map((request) => requestCard(request, users)).join("");
  qs("[data-dashboard-notes]").innerHTML = notifications.slice(0, 3).map((note) => `
    <div class="notif-item"><div><strong>${note.title}</strong><p>${note.type} • ${note.time}</p></div><span class="tag ${note.status === "Unread" ? "urgent" : ""}">${note.status}</span></div>
  `).join("");
  qs("[data-dashboard-ai]").innerHTML = `
    <div class="metric"><span>Most requested category</span><strong>${getTopCategory(requests)}</strong></div>
    <div class="metric"><span>Your strongest trust driver</span><strong>${currentUser.badges[0]}</strong></div>
    <div class="metric"><span>AI says you can mentor in</span><strong>${deriveSkillSuggestions(currentUser.interests, currentUser.skills).helpWith.join(", ")}</strong></div>
    <div class="metric"><span>Your active requests</span><strong>${requests.filter((request) => request.requesterId === currentUser.id).length}</strong></div>
  `;
}

function renderExplore() {
  const users = getUsers();
  const requests = getRequests();
  const form = qs("[data-filter-form]");
  const output = qs("[data-feed-results]");
  const paint = () => {
    const fd = new FormData(form);
    const category = fd.get("category");
    const urgency = fd.get("urgency");
    const skill = String(fd.get("skill") || "").toLowerCase();
    const location = String(fd.get("location") || "").toLowerCase();
    const filtered = requests.filter((request) =>
      (!category || request.category === category) &&
      (!urgency || request.urgency === urgency) &&
      (!skill || request.tags.join(" ").toLowerCase().includes(skill)) &&
      (!location || request.location.toLowerCase().includes(location))
    );
    output.innerHTML = filtered.length ? filtered.map((request) => requestCard(request, users)).join("") : `<div class="panel"><h3>No requests found</h3><p>Try broadening the filters to surface more matches.</p></div>`;
  };
  form.addEventListener("input", paint);
  paint();
}

function renderCreateRequest() {
  const title = qs("#request-title");
  const description = qs("#request-description");
  const category = qs("#request-category");
  const urgency = qs("#request-urgency");
  const tags = qs("#request-tags");
  const insightBox = qs("[data-ai-request-insights]");

  const updateSuggestions = () => {
    const text = `${title.value} ${description.value}`;
    const suggestedTags = suggestTags(text);
    insightBox.innerHTML = `
      <div class="metric"><span>Suggested category</span><strong>${suggestCategory(text)}</strong></div>
      <div class="metric"><span>Detected urgency</span><strong>${detectUrgency(text)}</strong></div>
      <div class="metric"><span>Suggested tags</span><strong>${suggestedTags.join(", ") || "Add more detail for smarter tags"}</strong></div>
      <div class="metric"><span>Rewrite suggestion</span><strong>${rewriteDescription(description.value) || "Start describing the challenge to generate a stronger version."}</strong></div>
    `;
  };

  [title, description].forEach((element) => element.addEventListener("input", updateSuggestions));

  qs("[data-fill-ai]").addEventListener("click", () => {
    const combined = `${title.value} ${description.value}`;
    category.value = suggestCategory(combined);
    urgency.value = detectUrgency(combined);
    tags.value = suggestTags(combined).join(", ");
    if (description.value.trim()) description.value = rewriteDescription(description.value);
    updateSuggestions();
    showToast("AI suggestions applied to the request form.");
  });

  qs("[data-create-form]").addEventListener("submit", (event) => {
    event.preventDefault();
    const currentUser = getCurrentUser();
    const requests = getRequests();
    const notifications = getNotifications();
    const request = {
      id: makeId("req"),
      title: title.value.trim(),
      description: description.value.trim(),
      tags: tags.value.split(",").map((item) => item.trim()).filter(Boolean),
      category: category.value,
      urgency: urgency.value,
      location: currentUser.location,
      requesterId: currentUser.id,
      helperIds: [],
      status: "Open",
      createdAt: new Date().toISOString(),
      aiSummary: `AI summary: ${category.value} request with ${urgency.value.toLowerCase()} urgency. Best suited for members with ${tags.value || "relevant"} expertise.`
    };
    requests.unshift(request);
    notifications.unshift({ id: makeId("note"), title: `Your request "${request.title}" is now live in the community feed`, type: "Request", status: "Unread", time: "Just now" });
    save(STORAGE_KEYS.requests, requests);
    save(STORAGE_KEYS.notifications, notifications);
    showToast("Request created successfully.");
    window.location.href = `request-detail.html?id=${request.id}`;
  });
  updateSuggestions();
}

function renderRequestDetail() {
  const params = new URLSearchParams(window.location.search);
  const requests = getRequests();
  const users = getUsers();
  const currentUser = getCurrentUser();
  const request = requests.find((item) => item.id === params.get("id")) || requests[0];
  if (!request) return;
  const requester = users.find((user) => user.id === request.requesterId);
  const helpers = users.filter((user) => request.helperIds.includes(user.id));

  qs("[data-request-title]").textContent = request.title;
  qs("[data-request-meta]").innerHTML = `
    <span class="tag">${request.category}</span>
    <span class="tag ${["Critical", "High"].includes(request.urgency) ? "urgent" : ""}">${request.urgency}</span>
    <span class="tag ${request.status === "Solved" ? "success" : ""}">${request.status}</span>
  `;
  qs("[data-request-description]").textContent = request.description;
  qs("[data-request-summary]").textContent = request.aiSummary;
  qs("[data-request-tags]").innerHTML = request.tags.map((tag) => `<span class="tag">${tag}</span>`).join("");
  qs("[data-request-requester]").innerHTML = `
    <div class="user-line"><div class="avatar teal">${initials(requester?.name)}</div><div><strong>${requester?.name || "Unknown user"}</strong><p>${request.location} • Trust ${requester?.trustScore || 0}%</p></div></div>
  `;
  qs("[data-helper-list]").innerHTML = helpers.length ? helpers.map((helper) => `
    <div class="helper-item"><div class="user-line"><div class="avatar">${initials(helper.name)}</div><div><strong>${helper.name}</strong><p>${helper.skills.slice(0, 3).join(", ")}</p></div></div><span class="tag">Trust ${helper.trustScore}%</span></div>
  `).join("") : `<p class="muted">No helpers have joined yet. Be the first to support this request.</p>`;

  qs("[data-cta-help]").onclick = () => {
    if (request.helperIds.includes(currentUser.id)) return showToast("You’re already listed as a helper.");
    request.helperIds.push(currentUser.id);
    const notifications = getNotifications();
    notifications.unshift({ id: makeId("note"), title: `${currentUser.name} offered help on "${request.title}"`, type: "Match", status: "Unread", time: "Just now" });
    save(STORAGE_KEYS.requests, requests);
    save(STORAGE_KEYS.notifications, notifications);
    showToast("You’ve been added to the helper list.");
    renderRequestDetail();
  };

  qs("[data-cta-solved]").onclick = () => {
    request.status = "Solved";
    const userIndex = users.findIndex((user) => user.id === currentUser.id);
    if (userIndex >= 0) {
      users[userIndex].trustScore = Math.min(100, users[userIndex].trustScore + 3);
      users[userIndex].contributions += 1;
    }
    const notifications = getNotifications();
    notifications.unshift({ id: makeId("note"), title: `"${request.title}" was marked as solved`, type: "Status", status: "Unread", time: "Just now" });
    save(STORAGE_KEYS.users, users);
    save(STORAGE_KEYS.requests, requests);
    save(STORAGE_KEYS.notifications, notifications);
    showToast("Request marked as solved and trust score updated.");
    renderRequestDetail();
  };
}

function renderMessages() {
  const messages = getMessages();
  const list = qs("[data-message-list]");
  const paint = () => { list.innerHTML = messages.map((message) => `<div class="message-item"><div><strong>${message.from} → ${message.to}</strong><p>${message.text}</p></div><span class="tag">${message.time}</span></div>`).join(""); };
  qs("[data-message-form]").addEventListener("submit", (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const currentUser = getCurrentUser();
    const text = form.querySelector("[name='text']").value.trim();
    if (!text) return;
    messages.unshift({ id: makeId("msg"), from: currentUser.name, to: form.querySelector("[name='to']").value, text, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) });
    save(STORAGE_KEYS.messages, messages);
    form.reset();
    paint();
    showToast("Message sent.");
  });
  paint();
}

function renderLeaderboard() {
  const users = [...getUsers()].sort((a, b) => b.trustScore - a.trustScore || b.contributions - a.contributions);
  qs("[data-rank-list]").innerHTML = users.map((user, index) => `
    <div class="rank-item"><div class="user-line"><div class="avatar ${index === 0 ? "teal" : index === 1 ? "dark" : ""}">${initials(user.name)}</div><div><strong>#${index + 1} ${user.name}</strong><p>${user.skills.slice(0, 3).join(", ")}</p></div></div><div class="center"><strong>${user.trustScore}%</strong><p>${user.contributions} contributions</p></div></div>
  `).join("");
  qs("[data-badge-showcase]").innerHTML = users.slice(0, 3).map((user) => `
    <div class="badge-card"><h3>${user.name}</h3><p>${user.badges.join(" • ")}</p><div class="progress"><span style="width:${user.trustScore}%"></span></div></div>
  `).join("");
}

function renderAiCenter() {
  const requests = getRequests();
  const users = getUsers();
  qs("[data-ai-summary]").innerHTML = `
    <div class="stat-card"><p class="eyebrow">Trend pulse</p><div class="stat-value">${getTopCategory(requests)}</div><p>Most common support area based on active community requests.</p></div>
    <div class="stat-card"><p class="eyebrow">Urgency watch</p><div class="stat-value">${requests.filter((request) => ["High", "Critical"].includes(request.urgency)).length}</div><p>Requests currently flagged high priority by the urgency detector.</p></div>
    <div class="stat-card"><p class="eyebrow">Mentor pool</p><div class="stat-value">${users.filter((user) => user.trustScore >= 85).length}</div><p>Trusted helpers with strong response history and contribution signals.</p></div>
  `;
  qs("[data-ai-recommendations]").innerHTML = requests.slice(0, 4).map((request) => `
    <div class="timeline-item"><strong>${request.title}</strong><p>${request.aiSummary}</p><div class="tag-row"><span class="tag">${request.category}</span><span class="tag">${request.urgency}</span></div></div>
  `).join("");
}

function renderNotifications() {
  const notifications = getNotifications();
  const list = qs("[data-notif-list]");
  const paint = () => {
    list.innerHTML = notifications.map((note) => `
      <div class="notif-item"><div><strong>${note.title}</strong><p>${note.type} • ${note.time}</p></div><button class="btn btn-secondary" data-note="${note.id}">${note.status}</button></div>
    `).join("");
    qsa("[data-note]").forEach((button) => button.onclick = () => {
      const note = notifications.find((item) => item.id === button.dataset.note);
      if (!note) return;
      note.status = "Read";
      save(STORAGE_KEYS.notifications, notifications);
      paint();
    });
  };
  paint();
}

function renderProfile() {
  const currentUser = getCurrentUser();
  qs("[data-profile-name]").textContent = currentUser.name;
  qs("[data-profile-role]").textContent = currentUser.role;
  qs("[data-profile-location]").textContent = currentUser.location;
  qs("[data-profile-skills]").innerHTML = currentUser.skills.map((skill) => `<span class="tag">${skill}</span>`).join("");
  qs("[data-profile-badges]").innerHTML = currentUser.badges.map((badge) => `<span class="tag">${badge}</span>`).join("");
  qs("[data-profile-trust]").textContent = `${currentUser.trustScore}%`;
  qs("[data-profile-contributions]").textContent = currentUser.contributions;
  const form = qs("[data-profile-form]");
  form.querySelector("[name='name']").value = currentUser.name;
  form.querySelector("[name='location']").value = currentUser.location;
  form.querySelector("[name='skills']").value = currentUser.skills.join(", ");
  form.querySelector("[name='interests']").value = currentUser.interests.join(", ");
  form.onsubmit = (event) => {
    event.preventDefault();
    const users = getUsers();
    const index = users.findIndex((user) => user.id === currentUser.id);
    users[index] = { ...users[index], name: form.querySelector("[name='name']").value.trim(), location: form.querySelector("[name='location']").value.trim(), skills: form.querySelector("[name='skills']").value.split(",").map((item) => item.trim()).filter(Boolean), interests: form.querySelector("[name='interests']").value.split(",").map((item) => item.trim()).filter(Boolean) };
    save(STORAGE_KEYS.users, users);
    showToast("Profile updated.");
    renderProfile();
  };
}

function renderAdmin() {
  const users = getUsers();
  const requests = getRequests();
  qs("[data-admin-table]").innerHTML = requests.map((request) => {
    const requester = users.find((user) => user.id === request.requesterId);
    return `<tr><td>${request.title}</td><td>${request.category}</td><td>${request.urgency}</td><td>${request.status}</td><td>${requester?.name || "Unknown"}</td></tr>`;
  }).join("");
  qs("[data-admin-metrics]").innerHTML = `
    <div class="metric"><span>Total users</span><strong>${users.length}</strong></div>
    <div class="metric"><span>Total requests</span><strong>${requests.length}</strong></div>
    <div class="metric"><span>Solved requests</span><strong>${requests.filter((request) => request.status === "Solved").length}</strong></div>
    <div class="metric"><span>Average trust score</span><strong>${Math.round(users.reduce((sum, user) => sum + user.trustScore, 0) / users.length)}%</strong></div>
  `;
}

function renderOnboarding() {
  const form = qs("[data-onboarding-form]");
  const output = qs("[data-onboarding-ai]");
  const userSwitch = qs("[data-user-switch]");
  const users = getUsers();
  userSwitch.innerHTML = users.map((user) => `<option value="${user.id}">${user.name}</option>`).join("");
  userSwitch.value = getCurrentUser().id;
  const currentUser = getCurrentUser();
  form.querySelector("[name='name']").value = currentUser.name;
  form.querySelector("[name='location']").value = currentUser.location;
  form.querySelector("[name='skills']").value = currentUser.skills.join(", ");
  form.querySelector("[name='interests']").value = currentUser.interests.join(", ");

  const paint = () => {
    const interests = form.querySelector("[name='interests']").value.split(",").map((item) => item.trim()).filter(Boolean);
    const skills = form.querySelector("[name='skills']").value.split(",").map((item) => item.trim()).filter(Boolean);
    const suggestions = deriveSkillSuggestions(interests, skills);
    output.innerHTML = `
      <div class="metric"><span>You can likely help with</span><strong>${suggestions.helpWith.join(", ")}</strong></div>
      <div class="metric"><span>You may want support in</span><strong>${suggestions.needHelp.join(", ")}</strong></div>
      <div class="metric"><span>Suggested role fit</span><strong>${skills.length > 2 ? "Both" : "Need Help"}</strong></div>
    `;
  };

  userSwitch.onchange = () => { setCurrentUser(userSwitch.value); window.location.reload(); };
  form.oninput = paint;
  form.onsubmit = (event) => {
    event.preventDefault();
    const allUsers = getUsers();
    const index = allUsers.findIndex((user) => user.id === getCurrentUser().id);
    allUsers[index] = { ...allUsers[index], name: form.querySelector("[name='name']").value.trim(), location: form.querySelector("[name='location']").value.trim(), skills: form.querySelector("[name='skills']").value.split(",").map((item) => item.trim()).filter(Boolean), interests: form.querySelector("[name='interests']").value.split(",").map((item) => item.trim()).filter(Boolean) };
    save(STORAGE_KEYS.users, allUsers);
    showToast("Onboarding details saved.");
    paint();
  };
  paint();
}

function bindAuth() {
  const form = qs("[data-auth-form]");
  const userSelect = qs("[data-auth-user]");
  const roleSelect = qs("[data-auth-role]");
  const users = getUsers();
  userSelect.innerHTML = users.map((user) => `<option value="${user.id}">${user.name}</option>`).join("");
  userSelect.value = getCurrentUser().id;
  roleSelect.value = getCurrentUser().role;
  userSelect.onchange = () => { roleSelect.value = users.find((item) => item.id === userSelect.value)?.role || "Both"; };
  form.onsubmit = (event) => {
    event.preventDefault();
    const allUsers = getUsers();
    const index = allUsers.findIndex((user) => user.id === userSelect.value);
    if (index >= 0) {
      allUsers[index].role = roleSelect.value;
      save(STORAGE_KEYS.users, allUsers);
      setCurrentUser(userSelect.value);
    }
    showToast("Authentication simulated. Redirecting to dashboard.");
    setTimeout(() => { window.location.href = "dashboard.html"; }, 600);
  };
}

function initPage() {
  seedData();
  renderNav();
  ({
    landing: renderLanding,
    auth: bindAuth,
    onboarding: renderOnboarding,
    dashboard: renderDashboard,
    explore: renderExplore,
    create: renderCreateRequest,
    detail: renderRequestDetail,
    messages: renderMessages,
    leaderboard: renderLeaderboard,
    ai: renderAiCenter,
    notifications: renderNotifications,
    profile: renderProfile,
    admin: renderAdmin
  })[document.body.dataset.page]?.();
}

    document.body.dataset.page = "detail";

    // Call initPage directly. In React, the DOM is ready when useEffect runs.
    initPage();

    // Cleanup function to remove the dataset.page when the component unmounts
    return () => {
      delete document.body.dataset.page;
    };
  }, []);

  return (
    <section className="explore-module">
      <>
 <>
  <header className="topbar">
    <div className="container nav">
      <a className="brand" href="/">
        <span className="brand-badge">H</span>
        <span>HelpHub AI</span>
      </a>
      <nav className="nav-links">
        <a href="/dashboard">Dashboard</a>
        <a href="/explore">Explore</a>
        <a href="/messages">Messages</a>
      </nav>
    </div>
  </header>
  <main className="container">
    <section className="page-hero">
      <div className="panel">
        <p className="eyebrow">Request detail</p>
        <div data-request-meta="" className="tag-row" />
        <h1
          data-request-title=""
          style={{ fontSize: "clamp(2.1rem, 4vw, 3.8rem)" }}
        />
        <p data-request-description="" />
      </div>
    </section>
    <section className="detail-grid section">
      <div className="stack">
        <div className="panel">
          <p className="section-kicker">AI summary</p>
          <h3>What this request needs</h3>
          <p data-request-summary="" />
          <div className="tag-row" data-request-tags="" />
        </div>
        <div className="panel">
          <p className="section-kicker">Actions</p>
          <div className="row">
            <button className="btn btn-primary" data-cta-help="">
              I can help
            </button>
            <button className="btn btn-secondary" data-cta-solved="">
              Mark as solved
            </button>
          </div>
        </div>
      </div>
      <aside className="stack">
        <div className="panel">
          <p className="section-kicker">Requester</p>
          <div data-request-requester="" />
        </div>
        <div className="panel">
          <p className="section-kicker">Helpers</p>
          <h3>People ready to support</h3>
          <div className="helper-list" data-helper-list="" />
        </div>
      </aside>
    </section>
  </main>
</>

      </>
    </section>
  );
};

export default RequestDetail;