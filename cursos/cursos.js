"use strict";

const upcomingCoursesElement = document.querySelector("#upcoming-courses");
const pastCoursesElement = document.querySelector("#past-courses");

function localDate(dateString, endOfDay = false) {
  const [year, month, day] = dateString.split("-").map(Number);

  return new Date(
    year,
    month - 1,
    day,
    endOfDay ? 23 : 0,
    endOfDay ? 59 : 0,
    endOfDay ? 59 : 0,
    endOfDay ? 999 : 0
  );
}

function formatCourseDates(startDateString, endDateString) {
  const startDate = localDate(startDateString);
  const endDate = localDate(endDateString);
  const monthAndYear = new Intl.DateTimeFormat("es-ES", {
    month: "long",
    year: "numeric"
  });
  const fullDate = new Intl.DateTimeFormat("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });

  if (startDateString === endDateString) {
    return fullDate.format(startDate);
  }

  if (
    startDate.getFullYear() === endDate.getFullYear() &&
    startDate.getMonth() === endDate.getMonth()
  ) {
    return `${startDate.getDate()}–${endDate.getDate()} de ${monthAndYear.format(endDate)}`;
  }

  return `${fullDate.format(startDate)} – ${fullDate.format(endDate)}`;
}

function appendTextElement(parent, tagName, className, text) {
  const element = document.createElement(tagName);
  element.className = className;
  element.textContent = text;
  parent.append(element);
  return element;
}

function createUpcomingCourse(course) {
  const card = document.createElement("article");
  card.className = "event-card";

  const top = document.createElement("div");
  top.className = "event-card-top";
  appendTextElement(
    top,
    "span",
    "event-date",
    formatCourseDates(course.startDate, course.endDate)
  );
  appendTextElement(top, "span", "event-badge", "Inscripciones abiertas");
  card.append(top);

  appendTextElement(card, "h3", "", course.location);
  if (course.venue) {
    appendTextElement(card, "p", "event-venue", course.venue);
  }

  const contacts = document.createElement("div");
  contacts.className = "event-contacts";
  course.phones.forEach((phone) => {
    const link = document.createElement("a");
    link.href = `tel:${phone.value}`;
    link.textContent = phone.label;
    contacts.append(link);
  });
  card.append(contacts);

  const registrationLink = document.createElement("a");
  registrationLink.className = "button button-primary event-cta";
  registrationLink.href = "../#contacto";
  registrationLink.textContent = "Inscribirse";
  card.append(registrationLink);

  return card;
}

function createPastCourse(course) {
  const card = document.createElement("article");
  card.className = "past-event-card";

  appendTextElement(
    card,
    "p",
    "event-date",
    formatCourseDates(course.startDate, course.endDate)
  );
  appendTextElement(card, "h3", "", course.location);
  if (course.venue) {
    appendTextElement(card, "p", "past-event-venue", course.venue);
  }

  return card;
}

function showMessage(container, message) {
  container.replaceChildren();
  appendTextElement(container, "p", "events-message", message);
}

async function loadCourses() {
  if (!upcomingCoursesElement || !pastCoursesElement) {
    return;
  }

  try {
    const response = await fetch("./cursos.json");
    if (!response.ok) {
      throw new Error(`No se pudieron cargar los cursos (${response.status})`);
    }

    const courses = await response.json();
    const now = new Date();
    const upcomingCourses = courses
      .filter((course) => localDate(course.endDate, true) >= now)
      .sort((a, b) => localDate(a.startDate) - localDate(b.startDate));
    const pastCourses = courses
      .filter((course) => localDate(course.endDate, true) < now)
      .sort((a, b) => localDate(b.startDate) - localDate(a.startDate));

    upcomingCoursesElement.replaceChildren(
      ...upcomingCourses.map(createUpcomingCourse)
    );
    pastCoursesElement.replaceChildren(...pastCourses.map(createPastCourse));
    upcomingCoursesElement.dataset.count = String(upcomingCourses.length);
    pastCoursesElement.dataset.count = String(pastCourses.length);

    if (upcomingCourses.length === 0) {
      showMessage(
        upcomingCoursesElement,
        "No hay nuevas fechas publicadas. Vuelve pronto para consultar próximos cursos."
      );
    }

    if (pastCourses.length === 0) {
      showMessage(pastCoursesElement, "Todavía no hay cursos anteriores para mostrar.");
    }
  } catch (error) {
    console.error(error);
    showMessage(
      upcomingCoursesElement,
      "No se pudieron cargar las fechas. Inténtalo de nuevo más tarde."
    );
    showMessage(pastCoursesElement, "No se pudieron cargar los cursos anteriores.");
  }
}

loadCourses();
