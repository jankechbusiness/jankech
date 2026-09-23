const state = {
  posts: [],
  events: [],
  people: [],
  calendarDate: null,
};

const $ = (selector) => document.querySelector(selector);

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function parseDate(value) {
  return new Date(`${value}T12:00:00`);
}

function formatDate(value, options = {}) {
  return new Intl.DateTimeFormat("en-GB", {
    day: options.day || "numeric",
    month: options.month || "long",
    year: options.year || "numeric",
  }).format(parseDate(value));
}

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function initials(name = "") {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join("");
}

// Pages CMS normally stores an image field as the public path from .pages.yml,
// e.g. /office-impact/media/jane-doe.jpg. This resolver also accepts a few
// older/path variants so the site does not break if content was created before
// the folder was moved from /examples/office-impact/ to /office-impact/.
function assetUrl(value) {
  const raw = typeof value === "string"
    ? value.trim()
    : (value?.src || value?.url || value?.path || "").trim();

  if (!raw) return "";
  if (/^(https?:|data:|blob:)/i.test(raw)) return raw;

  if (raw.startsWith("public/office-impact/")) {
    return `/${raw.replace(/^public\//, "")}`;
  }

  if (raw.startsWith("/examples/office-impact/")) {
    return raw.replace("/examples/office-impact/", "/office-impact/");
  }

  if (raw.startsWith("examples/office-impact/")) {
    return `/${raw.replace("examples/office-impact/", "office-impact/")}`;
  }

  if (raw.startsWith("/office-impact/")) return raw;
  if (raw.startsWith("office-impact/")) return `/${raw}`;
  if (raw.startsWith("./")) return raw;
  if (raw.startsWith("media/")) return `./${raw}`;
  if (raw.startsWith("/")) return raw;

  return `./${raw}`;
}

async function loadJson(path) {
  const response = await fetch(path, { cache: "no-store" });
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
  return response.json();
}

async function init() {
  try {
    const [posts, events, people] = await Promise.all([
      loadJson("./content/posts.json"),
      loadJson("./content/events.json"),
      loadJson("./content/people.json"),
    ]);

    state.posts = posts.filter((item) => item.published !== false).sort((a, b) => parseDate(b.date) - parseDate(a.date));
    state.events = events.filter((item) => item.published !== false).sort((a, b) => parseDate(a.date) - parseDate(b.date));
    state.people = people.filter((item) => item.published !== false);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    state.calendarDate = startOfWeek(today);

    renderEvents();
    renderStories();
    renderPeople();
    renderCalendar();
  } catch (error) {
    console.error(error);
    showLoadErrors();
  }
}

function showLoadErrors() {
  const message = `<div class="error-box"><strong>Demo content could not be loaded.</strong><br />Serve this folder through a web server (not directly as a file) so the JSON content can be fetched.</div>`;
  $("#eventList").innerHTML = message;
  $("#storyGrid").innerHTML = message;
  $("#peopleGrid").innerHTML = message;
}

function renderEvents() {
  const container = $("#eventList");
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const upcoming = state.events.filter((event) => parseDate(event.date) >= today);
  $("#upcomingCount").textContent = `${upcoming.length} event${upcoming.length === 1 ? "" : "s"}`;

  if (!upcoming.length) {
    container.innerHTML = `<div class="event-item"><div class="event-info"><h3>No upcoming events yet</h3><p>Add one in Pages CMS and it will appear here automatically.</p></div></div>`;
    return;
  }

  container.innerHTML = upcoming.map((event) => {
    const date = parseDate(event.date);
    const day = date.getDate();
    const month = new Intl.DateTimeFormat("en-GB", { month: "short" }).format(date);
    const meta = [event.time, event.location].filter(Boolean).join(" · ");
    return `
      <article class="event-item">
        <div class="event-date"><strong>${day}</strong><span>${escapeHtml(month)}</span></div>
        <div class="event-info">
          <h3>${escapeHtml(event.title)}</h3>
          <p>${escapeHtml(meta)}</p>
          ${event.demo ? `<span class="badge">Prototype event</span>` : ""}
        </div>
        <button class="event-open" type="button" data-event="${escapeHtml(event.id)}" aria-label="Open ${escapeHtml(event.title)}">↗</button>
      </article>`;
  }).join("");

  container.querySelectorAll("[data-event]").forEach((button) => {
    button.addEventListener("click", () => openEvent(button.dataset.event));
  });
}

function startOfWeek(date) {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  const day = result.getDay();
  const mondayOffset = day === 0 ? -6 : 1 - day;
  result.setDate(result.getDate() + mondayOffset);
  return result;
}

function addDays(date, amount) {
  const result = new Date(date);
  result.setDate(result.getDate() + amount);
  return result;
}

function formatShortDate(date) {
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short" }).format(date);
}

function formatWeekRange(start, end) {
  const sameMonth = start.getMonth() === end.getMonth();
  const sameYear = start.getFullYear() === end.getFullYear();
  if (sameMonth) {
    return `${start.getDate()}–${end.getDate()} ${new Intl.DateTimeFormat("en-GB", { month: "short" }).format(end)}`;
  }
  if (sameYear) return `${formatShortDate(start)} – ${formatShortDate(end)}`;
  return `${formatShortDate(start)} ${start.getFullYear()} – ${formatShortDate(end)} ${end.getFullYear()}`;
}

function renderCalendar() {
  const start = startOfWeek(state.calendarDate || new Date());
  const weekCount = 13;
  const end = addDays(start, weekCount * 7 - 1);
  const startLabel = new Intl.DateTimeFormat("en-GB", { month: "short", year: "numeric" }).format(start);
  const endLabel = new Intl.DateTimeFormat("en-GB", { month: "short", year: "numeric" }).format(end);
  $("#calendarLabel").textContent = `${weekCount} weeks · ${startLabel} – ${endLabel}`;

  const prev = $("#calendarPrev");
  const next = $("#calendarNext");
  prev.setAttribute("aria-label", "Previous 13 weeks");
  next.setAttribute("aria-label", "Next 13 weeks");
  prev.title = "Previous 13 weeks";
  next.title = "Next 13 weeks";

  const weeks = [];
  for (let index = 0; index < weekCount; index += 1) {
    const weekStart = addDays(start, index * 7);
    const weekEnd = addDays(weekStart, 6);
    weekEnd.setHours(23, 59, 59, 999);

    const events = state.events.filter((event) => {
      const eventDate = parseDate(event.date);
      return eventDate >= weekStart && eventDate <= weekEnd;
    });

    const eventMarkup = events.length
      ? events.map((event) => {
          const eventDate = parseDate(event.date);
          const weekday = new Intl.DateTimeFormat("en-GB", { weekday: "short" }).format(eventDate);
          const date = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short" }).format(eventDate);
          const meta = [event.time, event.location].filter(Boolean).join(" · ");
          return `
            <button class="week-event${event.demo ? " is-demo" : ""}" type="button" data-calendar-event="${escapeHtml(event.id)}">
              <span class="week-event__date">${escapeHtml(`${weekday} ${date}`)}</span>
              <strong>${escapeHtml(event.title)}</strong>
              ${meta ? `<span class="week-event__meta">${escapeHtml(meta)}</span>` : ""}
            </button>`;
        }).join("")
      : `<span class="week-empty">No events</span>`;

    weeks.push(`
      <div class="week-row${events.length ? " has-events" : ""}">
        <div class="week-label">
          <span>Week ${getIsoWeek(weekStart)}</span>
          <strong>${escapeHtml(formatWeekRange(weekStart, weekEnd))}</strong>
        </div>
        <div class="week-events">${eventMarkup}</div>
      </div>`);
  }

  $("#calendarGrid").innerHTML = weeks.join("");
  $("#calendarGrid").querySelectorAll("[data-calendar-event]").forEach((button) => {
    button.addEventListener("click", () => openEvent(button.dataset.calendarEvent));
  });
}

function getIsoWeek(date) {
  const working = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const day = working.getUTCDay() || 7;
  working.setUTCDate(working.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(working.getUTCFullYear(), 0, 1));
  return Math.ceil((((working - yearStart) / 86400000) + 1) / 7);
}

function renderStories() {
  const container = $("#storyGrid");
  if (!state.posts.length) {
    container.innerHTML = `<div class="error-box">No published stories yet.</div>`;
    return;
  }

  container.innerHTML = state.posts.slice(0, 6).map((post) => `
    <article class="story-card">
      <div class="story-card__meta"><span>${escapeHtml(post.category || "Update")}</span><span>${escapeHtml(formatDate(post.date, { day: "2-digit", month: "short", year: "numeric" }))}</span></div>
      <h3>${escapeHtml(post.title)}</h3>
      <p>${escapeHtml(post.excerpt || "")}</p>
      <div class="story-card__footer">
        <span>${post.source === "LinkedIn" ? "LinkedIn highlight" : "Community story"}</span>
        <button type="button" data-post="${escapeHtml(post.slug)}">Read →</button>
      </div>
    </article>
  `).join("");

  container.querySelectorAll("[data-post]").forEach((button) => {
    button.addEventListener("click", () => openPost(button.dataset.post));
  });
}

function renderPeople() {
  const container = $("#peopleGrid");
  if (!state.people.length) {
    container.innerHTML = `<div class="error-box">No people added yet.</div>`;
    return;
  }

  container.innerHTML = state.people.map((person, index) => {
    const image = assetUrl(person.image);
    return `
      <article class="person-card person-card--interactive" data-person-index="${index}" role="button" tabindex="0" aria-label="Open profile for ${escapeHtml(person.name)}">
        <div class="person-avatar">
          <span>${escapeHtml(initials(person.name))}</span>
          ${image ? `<img src="${escapeHtml(image)}" alt="${escapeHtml(person.name)}" loading="lazy" />` : ""}
        </div>
        <div class="person-copy">
          <h3>${escapeHtml(person.name)}</h3>
          <div class="role">${escapeHtml([person.role, person.organization].filter(Boolean).join(" · "))}</div>
          <p>${escapeHtml(person.bio || "")}</p>
          <div class="person-actions">
            <span class="profile-link">View profile →</span>
            ${person.linkedin_url ? `<a href="${escapeHtml(person.linkedin_url)}" target="_blank" rel="noreferrer">LinkedIn ↗</a>` : ""}
          </div>
        </div>
      </article>`;
  }).join("");

  container.querySelectorAll(".person-avatar img").forEach((img) => {
    img.addEventListener("error", () => {
      console.warn("Office Impact profile image could not be loaded:", img.getAttribute("src"));
      img.remove();
    });
  });

  container.querySelectorAll("[data-person-index]").forEach((card) => {
    const open = () => openPerson(Number(card.dataset.personIndex));
    card.addEventListener("click", (event) => {
      if (event.target.closest("a")) return;
      open();
    });
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        open();
      }
    });
  });
}

function openPerson(index) {
  const person = state.people[index];
  if (!person) return;

  const image = assetUrl(person.image);
  const role = [person.role, person.organization].filter(Boolean).join(" · ");
  const linkedin = person.linkedin_url
    ? `<a class="dialog-source" href="${escapeHtml(person.linkedin_url)}" target="_blank" rel="noreferrer">View LinkedIn profile ↗</a>`
    : "";

  openDialog(`
    <div class="dialog-body person-dialog">
      <div class="person-dialog__header">
        <div class="person-dialog__avatar">
          <span>${escapeHtml(initials(person.name))}</span>
          ${image ? `<img src="${escapeHtml(image)}" alt="${escapeHtml(person.name)}" />` : ""}
        </div>
        <div>
          <span class="section-kicker">Community profile</span>
          <h2>${escapeHtml(person.name)}</h2>
          ${role ? `<div class="dialog-meta"><span>${escapeHtml(role)}</span></div>` : ""}
        </div>
      </div>
      <div class="dialog-copy">${person.bio ? `<p>${escapeHtml(person.bio)}</p>` : `<p>Profile details will be added soon.</p>`}</div>
      ${linkedin}
    </div>`);

  const dialogImage = $("#dialogContent .person-dialog__avatar img");
  if (dialogImage) {
    dialogImage.addEventListener("error", () => dialogImage.remove());
  }
}

function openPost(slug) {
  const post = state.posts.find((item) => item.slug === slug);
  if (!post) return;
  const sourceLink = post.source_url
    ? `<a class="dialog-source" href="${escapeHtml(post.source_url)}" target="_blank" rel="noreferrer">View original ${escapeHtml(post.source || "source")} ↗</a>`
    : "";
  openDialog(`
    <div class="dialog-body">
      <span class="section-kicker">${escapeHtml(post.category || "Story")}</span>
      <h2>${escapeHtml(post.title)}</h2>
      <div class="dialog-meta"><span>${escapeHtml(formatDate(post.date))}</span>${post.source ? `<span>· ${escapeHtml(post.source)}</span>` : ""}</div>
      <div class="dialog-copy">${post.body || `<p>${escapeHtml(post.excerpt || "")}</p>`}</div>
      ${sourceLink}
    </div>`);
}

function openEvent(id) {
  const event = state.events.find((item) => item.id === id);
  if (!event) return;
  const register = event.registration_url
    ? `<a class="dialog-source" href="${escapeHtml(event.registration_url)}" target="_blank" rel="noreferrer">${event.demo ? "Demo registration link" : "Event details / registration"} ↗</a>`
    : "";
  openDialog(`
    <div class="dialog-body">
      <span class="section-kicker">${escapeHtml(event.type || "Community event")}${event.demo ? " · prototype" : ""}</span>
      <h2>${escapeHtml(event.title)}</h2>
      <div class="dialog-meta"><span>${escapeHtml(formatDate(event.date))}</span><span>· ${escapeHtml([event.time, event.location].filter(Boolean).join(" · "))}</span></div>
      <div class="dialog-copy">${event.body || `<p>${escapeHtml(event.summary || "")}</p>`}</div>
      ${register}
    </div>`);
}

function openDialog(html) {
  $("#dialogContent").innerHTML = html;
  const dialog = $("#contentDialog");
  if (typeof dialog.showModal === "function") dialog.showModal();
}

$("#dialogClose").addEventListener("click", () => $("#contentDialog").close());
$("#contentDialog").addEventListener("click", (event) => {
  if (event.target === $("#contentDialog")) $("#contentDialog").close();
});

$("#calendarPrev").addEventListener("click", () => {
  state.calendarDate = addDays(startOfWeek(state.calendarDate || new Date()), -13 * 7);
  renderCalendar();
});
$("#calendarNext").addEventListener("click", () => {
  state.calendarDate = addDays(startOfWeek(state.calendarDate || new Date()), 13 * 7);
  renderCalendar();
});

$(".menu-button").addEventListener("click", () => {
  const header = $(".site-header");
  const isOpen = header.classList.toggle("is-open");
  $(".menu-button").setAttribute("aria-expanded", String(isOpen));
});

document.querySelectorAll(".main-nav a").forEach((link) => {
  link.addEventListener("click", () => $(".site-header").classList.remove("is-open"));
});

init();
