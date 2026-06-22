const supabaseConfig = {
  url: "",
  anonKey: "",
};

const state = {
  habits: [
    { id: 1, title: "Read 20 minutes", category: "Growth", done: true, streak: 12, completion: 86 },
    { id: 2, title: "Exercise", category: "Health", done: true, streak: 7, completion: 74 },
    { id: 3, title: "Learn English", category: "Study", done: true, streak: 21, completion: 91 },
    { id: 4, title: "Drink water", category: "Health", done: false, streak: 3, completion: 63 },
    { id: 5, title: "Meditate", category: "Mind", done: false, streak: 5, completion: 58 },
  ],
  notes: [
    { id: 1, title: "IELTS writing ideas", category: "Study", pinned: true, body: "Practice Task 2 structures and collect examples for education, technology, and health topics." },
    { id: 2, title: "Startup backlog", category: "Work", pinned: false, body: "Polish onboarding, add calendar sync, improve analytics empty states." },
    { id: 3, title: "Books to read", category: "Personal", pinned: false, body: "Atomic Habits, Deep Work, The Psychology of Money, Same as Ever." },
  ],
  goals: [
    { id: 1, title: "Prepare for IELTS", deadline: "Aug 30", progress: 64, description: "Reach band 7.0 with weekly speaking and writing practice." },
    { id: 2, title: "Finish LifeOS project", deadline: "Jul 12", progress: 42, description: "Build dashboard, auth, Supabase database, and Vercel deployment." },
    { id: 3, title: "Read 10 books", deadline: "Dec 31", progress: 30, description: "Read consistently and save notes after every book." },
  ],
  tasks: [
    { id: 1, title: "Review English vocabulary", priority: "High", done: false, due: "Today" },
    { id: 2, title: "Design analytics cards", priority: "Medium", done: true, due: "Today" },
    { id: 3, title: "Workout 30 minutes", priority: "High", done: false, due: "Today" },
    { id: 4, title: "Plan weekly goals", priority: "Low", done: false, due: "Today" },
  ],
};

const pages = document.querySelectorAll(".page");
const navItems = document.querySelectorAll(".nav-item");
const pageTitle = document.getElementById("pageTitle");
const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modalTitle");
const modalFields = document.getElementById("modalFields");

const chartValues = [62, 78, 71, 86, 73, 91, 84];
const sleepValues = [7.1, 6.8, 7.4, 8.0, 7.2, 7.8, 7.6];
const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function showPage(pageId) {
  pages.forEach((page) => page.classList.toggle("active", page.id === pageId));
  navItems.forEach((item) => item.classList.toggle("active", item.dataset.page === pageId));
  pageTitle.textContent = pageId.charAt(0).toUpperCase() + pageId.slice(1);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function renderHabits() {
  const completed = state.habits.filter((habit) => habit.done).length;
  document.getElementById("habitSummary").textContent = `${completed} / ${state.habits.length}`;
  document.getElementById("dashboardHabits").innerHTML = state.habits.slice(0, 5).map(habitRow).join("");
  document.getElementById("habitManager").innerHTML = state.habits.map(habitRow).join("");
  document.querySelectorAll("[data-toggle-habit]").forEach((button) => {
    button.addEventListener("click", () => {
      const habit = state.habits.find((item) => item.id === Number(button.dataset.toggleHabit));
      habit.done = !habit.done;
      renderAll();
    });
  });
}

function habitRow(habit) {
  return `
    <div class="habit-row">
      <div class="habit-title">
        <button class="check ${habit.done ? "done" : ""}" data-toggle-habit="${habit.id}" aria-label="Toggle ${habit.title}">
          ${habit.done ? "✓" : ""}
        </button>
        <div>
          <strong>${habit.title}</strong>
          <p>${habit.category} · ${habit.streak} day streak</p>
        </div>
      </div>
      <span class="pill">${habit.completion}%</span>
    </div>
  `;
}

function renderGoals() {
  const goalMarkup = state.goals.map(goalCard).join("");
  document.getElementById("goalsGrid").innerHTML = goalMarkup;
  document.getElementById("dashboardGoals").innerHTML = state.goals.slice(0, 3).map(goalMini).join("");
  document.getElementById("analyticsGoals").innerHTML = state.goals.map(goalMini).join("");
}

function goalCard(goal) {
  return `
    <article class="goal-card">
      <span class="pill">${goal.deadline}</span>
      <h3>${goal.title}</h3>
      <p>${goal.description}</p>
      <div class="progress"><span style="width: ${goal.progress}%"></span></div>
      <p>${goal.progress}% complete</p>
      <div class="card-actions">
        <button class="secondary-button">Milestones</button>
        <button class="text-button" data-delete-goal="${goal.id}">Delete</button>
      </div>
    </article>
  `;
}

function goalMini(goal) {
  return `
    <div class="goal-mini">
      <strong>${goal.title}</strong>
      <div class="progress"><span style="width: ${goal.progress}%"></span></div>
      <p>${goal.progress}% · deadline ${goal.deadline}</p>
    </div>
  `;
}

function renderNotes() {
  const query = document.getElementById("globalSearch").value.trim().toLowerCase();
  const notes = state.notes.filter((note) =>
    [note.title, note.category, note.body].join(" ").toLowerCase().includes(query)
  );
  document.getElementById("notesGrid").innerHTML = notes.map(noteCard).join("");
  document.getElementById("dashboardNotes").innerHTML = state.notes.slice(0, 3).map((note) => `
    <div class="task-row">
      <div>
        <strong>${note.title}</strong>
        <p>${note.category}</p>
      </div>
      ${note.pinned ? '<span class="pill">Pinned</span>' : ""}
    </div>
  `).join("");
}

function noteCard(note) {
  return `
    <article class="note-card ${note.pinned ? "pinned" : ""}">
      <span class="pill">${note.category}</span>
      <h3>${note.title}</h3>
      <p>${note.body}</p>
      <div class="card-actions">
        <button class="secondary-button">Edit</button>
        <button class="text-button" data-pin-note="${note.id}">${note.pinned ? "Unpin" : "Pin"}</button>
      </div>
    </article>
  `;
}

function renderTasks() {
  const taskMarkup = state.tasks.map(taskRow).join("");
  document.getElementById("dashboardTasks").innerHTML = taskMarkup;
  document.getElementById("plannerTasks").innerHTML = taskMarkup;
  document.getElementById("taskSummary").textContent = state.tasks.filter((task) => !task.done).length;
  document.querySelectorAll("[data-toggle-task]").forEach((button) => {
    button.addEventListener("click", () => {
      const task = state.tasks.find((item) => item.id === Number(button.dataset.toggleTask));
      task.done = !task.done;
      renderAll();
    });
  });
}

function taskRow(task) {
  return `
    <div class="task-row">
      <div class="task-title">
        <button class="check ${task.done ? "done" : ""}" data-toggle-task="${task.id}" aria-label="Toggle ${task.title}">
          ${task.done ? "✓" : ""}
        </button>
        <div>
          <strong>${task.title}</strong>
          <p>${task.due} · ${task.priority} priority</p>
        </div>
      </div>
      <span class="pill">${task.done ? "Done" : "Open"}</span>
    </div>
  `;
}

function renderCharts() {
  const chartMarkup = chartValues.map((value, index) => `
    <div class="bar" style="height: ${value}%"><span>${days[index]}</span></div>
  `).join("");
  document.getElementById("weeklyChart").innerHTML = chartMarkup;
  document.getElementById("analyticsHabits").innerHTML = chartMarkup;

  const line = lineChartSvg(sleepValues);
  document.getElementById("sleepChart").innerHTML = line;
  document.getElementById("analyticsSleep").innerHTML = line;

  document.getElementById("habitHeatmap").innerHTML = Array.from({ length: 70 }, (_, index) => {
    const level = (index * 7 + 3) % 5;
    const opacity = 0.12 + level * 0.18;
    return `<span class="heat-cell" style="background: rgba(113, 246, 177, ${opacity})"></span>`;
  }).join("");

  document.getElementById("weekGrid").innerHTML = days.map((day, index) => `
    <div class="day-column">
      <strong>${day}</strong>
      <div class="event-chip">${index % 2 === 0 ? "Deep work" : "Review goals"}</div>
    </div>
  `).join("");
}

function lineChartSvg(values) {
  const min = Math.min(...values) - 0.4;
  const max = Math.max(...values) + 0.4;
  const points = values.map((value, index) => {
    const x = 24 + index * (252 / (values.length - 1));
    const y = 180 - ((value - min) / (max - min)) * 130;
    return `${x},${y}`;
  }).join(" ");

  return `
    <svg viewBox="0 0 300 220" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id="lineFill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stop-color="#71f6b1" stop-opacity="0.32" />
          <stop offset="100%" stop-color="#71f6b1" stop-opacity="0" />
        </linearGradient>
      </defs>
      <polyline points="24,190 ${points} 276,190" fill="url(#lineFill)" stroke="none"></polyline>
      <polyline points="${points}" fill="none" stroke="#71f6b1" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"></polyline>
    </svg>
  `;
}

function openModal(type) {
  const fields = {
    habit: ["Habit title", "Category"],
    note: ["Note title", "Category", "Body"],
    goal: ["Goal title", "Deadline", "Description"],
    task: ["Task title", "Priority", "Due date"],
  };
  modalTitle.textContent = `Create ${type}`;
  modalFields.innerHTML = fields[type].map((field) => {
    const id = field.toLowerCase().replaceAll(" ", "-");
    return field === "Body" || field === "Description"
      ? `<label>${field}<textarea id="${id}" rows="4"></textarea></label>`
      : `<label>${field}<input id="${id}" type="text" /></label>`;
  }).join("");
  modal.dataset.type = type;
  modal.showModal();
}

function saveFromModal(event) {
  event.preventDefault();
  const type = modal.dataset.type;
  const inputs = [...modalFields.querySelectorAll("input, textarea")].map((input) => input.value.trim());

  if (type === "habit" && inputs[0]) {
    state.habits.push({ id: Date.now(), title: inputs[0], category: inputs[1] || "Personal", done: false, streak: 0, completion: 0 });
  }
  if (type === "note" && inputs[0]) {
    state.notes.unshift({ id: Date.now(), title: inputs[0], category: inputs[1] || "General", pinned: false, body: inputs[2] || "New note" });
  }
  if (type === "goal" && inputs[0]) {
    state.goals.unshift({ id: Date.now(), title: inputs[0], deadline: inputs[1] || "No deadline", progress: 10, description: inputs[2] || "New goal" });
  }
  if (type === "task" && inputs[0]) {
    state.tasks.unshift({ id: Date.now(), title: inputs[0], priority: inputs[1] || "Medium", done: false, due: inputs[2] || "Today" });
  }

  modal.close();
  renderAll();
}

function calculateSleep(event) {
  event.preventDefault();
  const bedtime = document.getElementById("bedtime").value.split(":").map(Number);
  const wakeup = document.getElementById("wakeup").value.split(":").map(Number);
  const bedMinutes = bedtime[0] * 60 + bedtime[1];
  let wakeMinutes = wakeup[0] * 60 + wakeup[1];
  if (wakeMinutes <= bedMinutes) wakeMinutes += 24 * 60;
  const total = wakeMinutes - bedMinutes;
  const hours = Math.floor(total / 60);
  const minutes = total % 60;
  document.getElementById("sleepResult").textContent = `${hours}h ${minutes}m total sleep`;
  document.getElementById("sleepSummary").textContent = `${hours}h ${minutes}m`;
}

function renderAll() {
  renderHabits();
  renderGoals();
  renderNotes();
  renderTasks();
  renderCharts();
}

navItems.forEach((item) => {
  item.addEventListener("click", () => showPage(item.dataset.page));
});

document.querySelectorAll("[data-page-link]").forEach((button) => {
  button.addEventListener("click", () => showPage(button.dataset.pageLink));
});

document.querySelectorAll("[data-open-modal]").forEach((button) => {
  button.addEventListener("click", () => openModal(button.dataset.openModal));
});

document.getElementById("modalClose").addEventListener("click", () => modal.close());
document.getElementById("modalForm").addEventListener("submit", saveFromModal);
document.getElementById("sleepForm").addEventListener("submit", calculateSleep);
document.getElementById("globalSearch").addEventListener("input", renderNotes);

document.getElementById("themeToggle").addEventListener("click", () => {
  document.body.classList.toggle("light");
  document.getElementById("themeToggle").textContent = document.body.classList.contains("light") ? "☀" : "☾";
});

document.getElementById("backupButton").addEventListener("click", () => {
  const data = JSON.stringify({ ...state, supabaseReady: Boolean(supabaseConfig.url && supabaseConfig.anonKey) }, null, 2);
  const blob = new Blob([data], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "lifeos-backup.json";
  link.click();
});

document.addEventListener("click", (event) => {
  const pinButton = event.target.closest("[data-pin-note]");
  if (pinButton) {
    const note = state.notes.find((item) => item.id === Number(pinButton.dataset.pinNote));
    note.pinned = !note.pinned;
    renderAll();
  }
});

renderAll();
