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
    state.calendarDate = startOfMonth(today);

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

function startOfMonth(date) {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  result.setDate(1);
  return result;
}

function endOfMonth(date) {
  const result = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  result.setHours(23, 59, 59, 999);
  return result;
}

function addMonths(date, amount) {
  const result = new Date(date.getFullYear(), date.getMonth() + amount, 1);
  result.setHours(0, 0, 0, 0);
  return result;
}

function dateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
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
  const firstMonth = startOfMonth(state.calendarDate || new Date());
  const months = [firstMonth, addMonths(firstMonth, 1), addMonths(firstMonth, 2)];
  const lastMonth = months[2];

  const firstLabel = new Intl.DateTimeFormat("en-GB", { month: "short" }).format(firstMonth);
  const lastLabel = new Intl.DateTimeFormat("en-GB", { month: "short" }).format(lastMonth);
  const label = firstMonth.getFullYear() === lastMonth.getFullYear()
    ? `${firstLabel} — ${lastLabel} ${lastMonth.getFullYear()}`
    : `${firstLabel} ${firstMonth.getFullYear()} — ${lastLabel} ${lastMonth.getFullYear()}`;

  $("#calendarLabel").textContent = label;

  const prev = $("#calendarPrev");
  const next = $("#calendarNext");
  prev.setAttribute("aria-label", "Previous three months");
  next.setAttribute("aria-label", "Next three months");
  prev.title = "Previous three months";
  next.title = "Next three months";

  const monthRows = months.map((monthDate) => {
    const monthStart = startOfMonth(monthDate);
    const monthEnd = endOfMonth(monthDate);
    const monthName = new Intl.DateTimeFormat("en-GB", { month: "long" }).format(monthStart);
    const monthShort = new Intl.DateTimeFormat("en-GB", { month: "short" }).format(monthStart);

    const segments = [];
    let weekStart = startOfWeek(monthStart);

    while (weekStart <= monthEnd) {
      const weekEnd = addDays(weekStart, 6);
      weekEnd.setHours(23, 59, 59, 999);

      const segmentStart = weekStart < monthStart ? monthStart : weekStart;
      const segmentEnd = weekEnd > monthEnd ? monthEnd : weekEnd;
      const segmentEvents = state.events.filter((event) => {
        const eventDate = parseDate(event.date);
        return eventDate >= segmentStart && eventDate <= segmentEnd;
      });

      const rangeLabel = segmentStart.getDate() === segmentEnd.getDate()
        ? `${segmentStart.getDate()}`
        : `${segmentStart.getDate()}–${segmentEnd.getDate()}`;
      const fullRange = `${formatShortDate(segmentStart)} – ${formatShortDate(segmentEnd)}`;
      const countLabel = segmentEvents.length > 1 ? `${segmentEvents.length}` : "";
      const eventIds = segmentEvents.map((event) => event.id).join("|");

      const common = `class="month-week${segmentEvents.length ? " has-events" : ""}" aria-label="${escapeHtml(fullRange)}${segmentEvents.length ? `, ${segmentEvents.length} event${segmentEvents.length === 1 ? "" : "s"}` : ", no events"}"`;
      if (segmentEvents.length) {
        segments.push(`
          <button ${common} type="button" data-calendar-events="${escapeHtml(eventIds)}">
            <span class="month-week__range">${escapeHtml(rangeLabel)}</span>
            <span class="month-week__marker" aria-hidden="true"><i></i>${countLabel ? `<b>${countLabel}</b>` : ""}</span>
          </button>`);
      } else {
        segments.push(`
          <div ${common}>
            <span class="month-week__range">${escapeHtml(rangeLabel)}</span>
            <span class="month-week__marker month-week__marker--empty" aria-hidden="true"></span>
          </div>`);
      }

      weekStart = addDays(weekStart, 7);
    }

    return `
      <div class="month-row">
        <div class="month-row__label">
          <strong class="month-row__name month-row__name--full">${escapeHtml(monthName)}</strong>
          <strong class="month-row__name month-row__name--short">${escapeHtml(monthShort)}</strong>
          <span>${monthStart.getFullYear()}</span>
        </div>
        <div class="month-row__weeks" style="--week-count:${segments.length}">
          ${segments.join("")}
        </div>
      </div>`;
  });

  $("#calendarGrid").innerHTML = monthRows.join("");
  $("#calendarGrid").querySelectorAll("[data-calendar-events]").forEach((button) => {
    button.addEventListener("click", () => {
      const ids = (button.dataset.calendarEvents || "").split("|").filter(Boolean);
      if (ids.length === 1) openEvent(ids[0]);
      else if (ids.length > 1) openEventChoices(ids);
    });
  });
}

function openEventChoices(ids) {
  const events = ids
    .map((id) => state.events.find((event) => event.id === id))
    .filter(Boolean)
    .sort((a, b) => parseDate(a.date) - parseDate(b.date));

  if (!events.length) return;
  if (events.length === 1) {
    openEvent(events[0].id);
    return;
  }

  openDialog(`
    <div class="dialog-body">
      <span class="section-kicker">Events</span>
      <h2>${events.length} events this week</h2>
      <div class="dialog-event-list">
        ${events.map((event) => `
          <button class="dialog-event-choice" type="button" data-dialog-event="${escapeHtml(event.id)}">
            <span>${escapeHtml(formatDate(event.date, { day: "2-digit", month: "short", year: "numeric" }))}</span>
            <strong>${escapeHtml(event.title)}</strong>
            <small>${escapeHtml([event.time, event.location].filter(Boolean).join(" · "))}</small>
          </button>`).join("")}
      </div>
    </div>`);

  $("#dialogContent").querySelectorAll("[data-dialog-event]").forEach((button) => {
    button.addEventListener("click", () => openEvent(button.dataset.dialogEvent));
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
  state.calendarDate = addMonths(startOfMonth(state.calendarDate || new Date()), -3);
  renderCalendar();
});
$("#calendarNext").addEventListener("click", () => {
  state.calendarDate = addMonths(startOfMonth(state.calendarDate || new Date()), 3);
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
