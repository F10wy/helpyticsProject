import React, { useEffect } from 'react';
import './assets/styles.css';

const Admin = () => {
  useEffect(() => {
    document.body.dataset.page = "admin";

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
    }

    const getUsers = () => load(STORAGE_KEYS.users, []);
    const getRequests = () => load(STORAGE_KEYS.requests, []);

    function renderAdmin() {
      const users = getUsers();
      const requests = getRequests();
      const table = qs("[data-admin-table]");
      const metrics = qs("[data-admin-metrics]");
      
      if (table) {
        table.innerHTML = requests.map((request) => {
          const requester = users.find((user) => user.id === request.requesterId);
          return `
            <tr>
              <td><strong>${request.title}</strong></td>
              <td><span class="tag">${request.category}</span></td>
              <td><span class="tag ${['High', 'Critical'].includes(request.urgency) ? 'urgent' : ''}">${request.urgency}</span></td>
              <td><span class="tag ${request.status === 'Solved' ? 'success' : ''}">${request.status}</span></td>
              <td>${requester?.name || "Unknown"}</td>
              <td>
                <div class="row" style="gap:10px">
                  <a href="/request-detail?id=${request.id}" class="btn btn-secondary btn-sm">View</a>
                  <button class="btn btn-primary btn-sm" onclick="window.adminDeleteRequest('${request.id}')">Delete</button>
                </div>
              </td>
            </tr>`;
        }).join("");
      }

      if (metrics) {
        metrics.innerHTML = `
          <div class="stat-card">
            <p class="eyebrow">Total Users</p>
            <div class="stat-value">${users.length}</div>
          </div>
          <div class="stat-card">
            <p class="eyebrow">Active Requests</p>
            <div class="stat-value">${requests.length}</div>
          </div>
          <div class="stat-card">
            <p class="eyebrow">Solved Issues</p>
            <div class="stat-value">${requests.filter(r => r.status === "Solved").length}</div>
          </div>
          <div class="stat-card">
            <p class="eyebrow">Avg. Trust</p>
            <div class="stat-value">${Math.round(users.reduce((s, u) => s + u.trustScore, 0) / users.length)}%</div>
          </div>
        `;
      }
    }

    // Global action for the admin
    window.adminDeleteRequest = (id) => {
      if (!confirm("Are you sure you want to delete this request?")) return;
      const requests = getRequests().filter(r => r.id !== id);
      save(STORAGE_KEYS.requests, requests);
      renderAdmin();
      showToast("Request deleted by admin.");
    };

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

    seedData();
    renderAdmin();

    return () => {
      delete document.body.dataset.page;
      delete window.adminDeleteRequest;
    };
  }, []);

  return (
    <section className="admin-module">
      <header className="topbar">
        <div className="container nav">
          <a className="brand" href="/">
            <span className="brand-badge">H</span>
            <span>HelpHub Admin</span>
          </a>
          <nav className="nav-links">
            <a href="/dashboard">Dashboard</a>
            <a href="/explore">Explore Feed</a>
          </nav>
        </div>
      </header>
      <main className="container">
        <section className="page-hero">
          <div className="panel">
            <p className="eyebrow">Administrative Control</p>
            <h1 style={{ fontSize: "clamp(2.2rem, 4vw, 4rem)" }}>Community Management</h1>
            <p>Monitor all activities, manage help requests, and oversee user reputation scores.</p>
          </div>
        </section>

        <section className="mini-grid section" data-admin-metrics=""></section>

        <section className="section">
          <div className="panel">
            <div className="section-head">
              <div>
                <p className="section-kicker">Database</p>
                <h2>All Community Requests</h2>
              </div>
            </div>
            <div style={{ overflowX: 'auto', marginTop: '20px' }}>
              <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ textAlign: 'left', borderBottom: '2px solid #eee' }}>
                    <th style={{ padding: '12px' }}>Title</th>
                    <th style={{ padding: '12px' }}>Category</th>
                    <th style={{ padding: '12px' }}>Urgency</th>
                    <th style={{ padding: '12px' }}>Status</th>
                    <th style={{ padding: '12px' }}>Requester</th>
                    <th style={{ padding: '12px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody data-admin-table=""></tbody>
              </table>
            </div>
          </div>
        </section>
      </main>
    </section>
  );
};

export default Admin;