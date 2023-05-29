// Объявление переменных, которые используются в коде и получают значения элементов из HTML документа
const calendar = document.querySelector(".calendar"),
  date = document.querySelector(".date"),
  daysContainer = document.querySelector(".days"),
  prev = document.querySelector(".prev"),
  next = document.querySelector(".next"),
  todayBtn = document.querySelector(".today-btn"),
  gotoBtn = document.querySelector(".goto-btn"),
  dateInput = document.querySelector(".date-input"),
  addEventBtn = document.querySelector(".add-event"),
  addEventWrapper = document.querySelector(".add-event-wrapper"),
  editEventWrapper = document.querySelector(".edit-event-wrapper"),
  addEventCloseBtn = document.querySelector(".close"),
  editEventCloseBtn = document.querySelector(".edit-close"),
  addEventTitle = document.querySelector(".event-name"),
  addEventFrom = document.querySelector(".event-time-from"),
  addEventTo = document.querySelector(".event-time-to"),
  eventDay = document.querySelector(".event-day"),
  eventDate = document.querySelector(".event-date"),
  eventsContainer = document.querySelector(".events"),
  addEventSubmit = document.querySelector(".add-event-btn"),
  editEventSubmit = document.querySelector(".edit-event-btn");

// Переменные хранят информацию о текущей дате, месяце и выбранном дне
let today = new Date();
let activeDay;
let month = today.getMonth();
let year = today.getFullYear();

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

let eventsArr = [];

getEvents();

// Функция, которая заполняет дни в календаре в зависимости от выбранного месяца
function Calendar() {
  // Получаем данные о первом и последнем дне месяца, предыдущем месяце и количестве дней в месяце
  const firstDay = new Date(year, month, 0);
  const lastDay = new Date(year, month + 1, 0);
  const prevLastDay = new Date(year, month, 0);
  const prevDays = prevLastDay.getDate();
  const lastDate = lastDay.getDate();
  const day = firstDay.getDay();
  const nextDays = 7 - lastDay.getDay();

  // Отображаем название месяца и год на календаре
  date.innerHTML = months[month] + " " + year;

  let days = "";

  // Добавляем дни предыдущего месяца перед первым днем текущего месяца
  for (let x = day; x > 0; x--) {
    days += `<div class="day prev-date">${prevDays - x + 1}</div>`;
  }

  // Добавляем дни текущего месяца
  for (let i = 1; i <= lastDate; i++) {

    // Проверяем, присутствует ли событие в текущий день
    let event = false;
    eventsArr.forEach((eventObj) => {
      if (
        eventObj.day == i &&
        eventObj.month == month + 1 &&
        eventObj.year == year
      ) {
        event = true;
      }
    })

    // Если текущий день является сегодняшним днем, то добавляем класс today
    if (i == new Date().getDate() &&
      year == new Date().getFullYear() &&
      month == new Date().getMonth()
    ) {
      activeDay = i;
      getActiveDay(i)
      updateEvents(i);
      // Если событие найдено, также добавляем класс события
      // добавляем active на сегодня при запуске
      if (event) {
        days += `<div class="day today active event">${i}</div>`;
      }
      else {
        days += `<div class="day today active">${i}</div>`;
      }
    }
    else {
      if (event) {
        days += `<div class="day event">${i}</div>`;
      }
      else {
        days += `<div class="day">${i}</div>`;
      }
    }
  }

  // Добавляем дни следующего месяца после последнего дня текущего месяца
  for (let j = 1; j <= nextDays; j++) {
    days += `<div class="day next-date">${j}</div>`;
  }

  // Вставляем загруженные дни в контейнер дней на странице
  daysContainer.innerHTML = days;
  addListner();
}

// Функция для переключения на предыдущий месяц
function prevMonth() {
  month--;
  if (month < 0) {
    month = 11;
    year--;
  }
  Calendar();
}

// Функция для переключения на следующий месяц
function nextMonth() {
  month++;
  if (month > 11) {
    month = 0;
    year++;
  }
  Calendar();
}

// Добавляем обработчики событий на кнопки предыдущего и следующего месяца
prev.addEventListener("click", prevMonth);
next.addEventListener("click", nextMonth);
Calendar();

// Вызываем функцию заполнения календаря при нажатии на кнопку сегодня
todayBtn.addEventListener("click", () => {
  today = new Date();
  month = today.getMonth();
  year = today.getFullYear();
  Calendar();
});

// Добавляем обработчик события на поле ввода даты для проверки правильности ввода
dateInput.addEventListener("input", (e) => {
  dateInput.value = dateInput.value.replace(/[^0-9/]/g, "");
  if (dateInput.value.length == 2) {
    dateInput.value += "/";
  }
  if (dateInput.value.length > 7) {
    dateInput.value = dateInput.value.slice(0, 7);
  }
  if (e.inputType == "deleteContentBackward") {
    if (dateInput.value.length == 3) {
      dateInput.value = dateInput.value.slice(0, 2);
    }
  }
});

// Обработчик события на кнопку перехода на выбранную дату
gotoBtn.addEventListener("click", gotoDate);

// Функция используется для установки заданной даты в календаре
function gotoDate() {
  const dateArr = dateInput.value.split("/");
  // Если введены корректные данные, то меняем отображаемый месяц и год на введенные в поле
  if (dateArr.length == 2) {
    if (dateArr[0] > 0 && dateArr[0] < 13 && dateArr[1].length == 4) {
      month = dateArr[0] - 1;
      year = dateArr[1];
      Calendar();
      return;
    }
  }
  alert("Invalid Date");
}

// Обработчики событий на добавление или удаление элемента
addEventBtn.addEventListener("click", () => {
  addEventWrapper.classList.toggle("active");
});

addEventCloseBtn.addEventListener("click", () => {
  addEventWrapper.classList.remove("active");
});

let currentTitle = "";
eventsContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("event-edit")) {
    // Находим родительский элемент с классом "event"
    const eventEl = e.target.closest(".event");
    // Находим заголовок и время выбранного события
    const titleEl = eventEl.querySelector(".event-title");
    const timeEl = eventEl.querySelector(".event-time");
    const timeArr = timeEl.textContent.split(" - ");
    const timeFrom = timeArr[0].trim();
    const timeTo = timeArr[1].trim();
    // Заполняем поля формы данными из выбранного события
    editEventWrapper.querySelector(".event-name").value = titleEl.textContent;
    editEventWrapper.querySelector(".event-time-from").value = timeFrom;
    editEventWrapper.querySelector(".event-time-to").value = timeTo;
    // Сохраняем заголовок выбранного события в глобальной переменной
    currentTitle = titleEl.textContent;
    editEventWrapper.classList.toggle("active");
  }
});

editEventCloseBtn.addEventListener("click", () => {
  editEventWrapper.classList.remove("active");
});

// Данная функция используется для скрытия элемента при клике вне этого элемента или его дочерних элементов
document.addEventListener("click", (e) => {
  if (e.target != addEventBtn && !addEventWrapper.contains(e.target)) {
    addEventWrapper.classList.remove("active");
  }
});

// Обработчик событий на поле ввода. Пользователь не сможет ввести более 50 символов
addEventTitle.addEventListener("input", (e) => {
  addEventTitle.value = addEventTitle.value.slice(0, 50);
});

// Функции работают как ограничитель, чтобы пользователь не мог ввести что-то отличное от времени в формате ЧЧ:ММ в поле ввода
addEventFrom.addEventListener("input", (e) => {
  addEventFrom.value = addEventFrom.value.replace(/[^0-9:]/g, "");
  if (addEventFrom.value.length == 2) {
    addEventFrom.value += ":";
  }
  if (addEventFrom.value.length > 5) {
    addEventFrom.value = addEventFrom.value.slice(0, 5);
  }
  if (e.inputType == "deleteContentBackward") {
    if (addEventFrom.value.length == 3) {
      addEventFrom.value = addEventFrom.value.slice(0, 2);
    }
  }
});

addEventTo.addEventListener("input", (e) => {
  addEventTo.value = addEventTo.value.replace(/[^0-9:]/g, "");
  if (addEventTo.value.length == 2) {
    addEventTo.value += ":";
  }
  if (addEventTo.value.length > 5) {
    addEventTo.value = addEventTo.value.slice(0, 5);
  }
  if (e.inputType == "deleteContentBackward") {
    if (addEventTo.value.length == 3) {
      addEventTo.value = addEventTo.value.slice(0, 2);
    }
  }
});

// Функция добавляет обработчик кликов на элементы с классом "day", которые представляют дни в календаре
function addListner() {
  const days = document.querySelectorAll(".day");
  days.forEach((day) => {
    day.addEventListener("click", (e) => { // Добавляем обработчик клика на элемент
      activeDay = Number(e.target.innerHTML);
      getActiveDay(e.target.innerHTML);
      updateEvents(Number(e.target.innerHTML));

      // Удаляем у всех элементов класс "active"
      days.forEach((day) => {
        day.classList.remove("active");
      });

      // Проверяем, есть ли у элемента класс "prev-date"
      if (e.target.classList.contains("prev-date")) {
        // Если есть, то вызываем функцию prevMonth для переключения на предыдущий месяц
        prevMonth();
        // Добавляем active к нажатому дню после смены месяца
        setTimeout(() => {
          //добавляем active, если нет предыдущей или следующей даты
          const days = document.querySelectorAll(".day");
          days.forEach((day) => {
            if (
              !day.classList.contains("prev-date") && // проверяем, нет ли у элемента класса "prev-date"
              day.innerHTML == e.target.innerHTML // и равен ли текст в элементе, на который был клик, тексту в текущем элементе цикла
            ) {
              day.classList.add("active");  // добавляем класс "active" на элемент
            }
          });
        }, 100);
      }
      // проверяем, есть ли у элемента класс "next-date" 
      else if (e.target.classList.contains("next-date")) {
        nextMonth(); // если есть, то вызываем функцию nextMonth для переключения на следующий месяц
        //добавляем active к нажатому дню после изменения месяца
        setTimeout(() => {
          const days = document.querySelectorAll(".day");
          days.forEach((day) => {
            if (
              !day.classList.contains("next-date") && // проверяем, нет ли у элемента класса "next-date"
              day.innerHTML == e.target.innerHTML // и равен ли текст в элементе, на который был клик, тексту в текущем элементе цикла
            ) {
              day.classList.add("active"); // добавляем класс "active" на элемент
            }
          });
        }, 100);
      } else { // если не был кликнут элемент с классом "prev-date" или "next-date"
        e.target.classList.add("active"); // добавляем класс "active" на элемент, на который был клик
      }
    });
  });
}

// Данная функция используется для получения дня недели и форматирования текущей даты
function getActiveDay(date) {
  const day = new Date(year, month, date);
  const dayName = day.toString().split(" ")[0];
  eventDay.innerHTML = dayName;
  eventDate.innerHTML = date + " " + months[month] + " " + year;
}

// Функция используется для обновления событий на странице
function updateEvents(date) {
  let events = "";
  eventsArr.forEach((event) => {
    // совпадает ли значение date с полем day объекта event, и совпадают ли значения месяца и года текущей даты (month и year) с соответствующими полями объекта event
    if (
      date == event.day &&
      month + 1 == event.month &&
      year == event.year
    ) {
      event.events.forEach((event) => {
        events += `
        <div class="event">
            <div class="event-delete"></div>
            <div class="event-edit"></div>
            <div class="title">
              <i class="fas fa-circle"></i>
              <h2 class="event-title">${event.title}</h2>
            </div>
            <div class="event-time">
              <span class="event-time">${event.time}</span>
            </div>
        </div>`;
      });
    }
  });
  if (events == "") {
    events = `<div class="no-event">
            <h2>Нет событий</h2>
        </div>`;
  }
  eventsContainer.innerHTML = events;
  saveEvents();
}

// Функция для добавления события в eventsArr
addEventSubmit.addEventListener("click", () => {
  const eventTitle = addEventTitle.value;
  const eventTimeFrom = addEventFrom.value;
  const eventTimeTo = addEventTo.value;
  if (eventTitle == "" || eventTimeFrom == "" || eventTimeTo == "") {
    alert("Пожалуйста, заполните все поля");
    return;
  }

  // проверка правильного формата времени 24 часа
  const timeFromArr = eventTimeFrom.split(":");
  const timeToArr = eventTimeTo.split(":");
  if (
    timeFromArr.length != 2 ||
    timeToArr.length != 2 ||
    timeFromArr[0] > 23 ||
    timeFromArr[1] > 59 ||
    timeToArr[0] > 23 ||
    timeToArr[1] > 59
  ) {
    alert("Неверный формат времени");
    return;
  }

  // Проверка, что конечное время больше начального
  if (eventTimeFrom >= eventTimeTo) {
    alert("Конечное время должно быть больше начального");
    return;
  }

  const timeFrom = eventTimeFrom;
  const timeTo = eventTimeTo;

  // проверка, добавлено ли событие
  let eventExist = false;
  eventsArr.forEach((event) => {
    if (
      event.day == activeDay &&
      event.month == month + 1 &&
      event.year == year
    ) {
      event.events.forEach((event) => {
        if (event.title == eventTitle) {
          eventExist = true;
        }
      });
    }
  });
  if (eventExist) {
    alert("Событие уже добавлено");
    return;
  }
  // Если все проверки пройдены успешно, создается объект newEvent, содержащий информацию 
  // о новом событии (заголовок и время), и производится поиск в массиве eventsArr 
  // элемента с соответствующей датой. Если такой элемент найден, новое событие добавляется 
  // в его массив events, если нет - создается новый элемент с массивом из одного нового события.
  const newEvent = {
    title: eventTitle,
    time: timeFrom + " - " + timeTo,
  };
  let eventAdded = false;
  if (eventsArr.length > 0) {
    eventsArr.forEach((item) => {
      if (
        item.day == activeDay &&
        item.month == month + 1 &&
        item.year == year
      ) {
        item.events.push(newEvent);
        eventAdded = true;
      }
    });
  }

  if (!eventAdded) {
    eventsArr.push({
      day: activeDay,
      month: month + 1,
      year: year,
      hoursFrom: eventTimeFrom.slice(0, 2),
      minFrom: eventTimeFrom.slice(3, 5),
      hoursTo: eventTimeTo.slice(0, 2),
      minTo: eventTimeTo.slice(3, 5),
      events: [newEvent],
    });
  }

  // После этого удаляется класс "active" с формы для добавления нового события,
  // очищаются поля ввода, обновляется список событий на выбранной дате и проверяется,
  // есть ли уже класс "event" у выбранного дня - если нет, он добавляется.
  addEventWrapper.classList.remove("active");
  addEventTitle.value = "";
  addEventFrom.value = "";
  addEventTo.value = "";
  updateEvents(activeDay);

  // выберать активный день и добавить класс событий, если он не добавлен
  const activeDayEl = document.querySelector(".day.active");
  if (!activeDayEl.classList.contains("event")) {
    activeDayEl.classList.add("event");
  }
});

// Функция для редактирования события
editEventSubmit.addEventListener("click", () => {
  const newTitle = editEventWrapper.querySelector(".event-name").value;
  const newTimeFrom = editEventWrapper.querySelector(".event-time-from").value;
  const newTimeTo = editEventWrapper.querySelector(".event-time-to").value;

  // проверка правильного формата времени 24 часа
  const timeFromArr = newTimeFrom.split(":");
  const timeToArr = newTimeTo.split(":");
  if (
    timeFromArr.length != 2 ||
    timeToArr.length != 2 ||
    timeFromArr[0] > 23 ||
    timeFromArr[1] > 59 ||
    timeToArr[0] > 23 ||
    timeToArr[1] > 59
  ) {
    alert("Неверный формат времени");
    return;
  }

  // Проверка, что конечное время больше начального
  if (newTimeFrom >= newTimeTo) {
    alert("Конечное время должно быть больше начального");
    return;
  }

  // Находим редактируемое событие в массиве и изменяем его данные
  eventsArr.forEach((event) => {
    if (
      event.day == activeDay &&
      event.month == month + 1 &&
      event.year == year
    ) {
      event.events.forEach((event) => {
        if (event.title == currentTitle) {
          event.title = newTitle;
          event.time = `${newTimeFrom} - ${newTimeTo}`;
          event.hoursFrom = newTimeFrom.slice(0, 2);
          event.minFrom = newTimeFrom.slice(3, 5);
          event.hoursTo = newTimeTo.slice(0, 2);
          event.minTo = newTimeTo.slice(3, 5);
        }
      });
    }
  });

  // Обновляем список событий на странице и очищаем поля формы
  updateEvents(activeDay);
  editEventWrapper.querySelector(".event-name").value = "";
  editEventWrapper.querySelector(".event-time-from").value = "";
  editEventWrapper.querySelector(".event-time-to").value = "";

  // Закрываем форму для редактирования события
  editEventWrapper.classList.remove("active");
});

// Функция удаления события при нажатии на значок корзины
eventsContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("event-delete")) {
    if (confirm("Вы уверены, что хотите удалить это событие?")) {
      const eventTitle = e.target.parentNode.querySelector(".event-title").innerHTML;
      eventsArr.forEach((event) => {
        if (
          event.day === activeDay &&
          event.month === month + 1 &&
          event.year === year
        ) {
          event.events.forEach((item, index) => {
            if (item.title === eventTitle) {
              event.events.splice(index, 1);
            }
          });
          // если в этот день не осталось событий, удалить этот день из EventArr
          if (event.events.length === 0) {
            eventsArr.splice(eventsArr.indexOf(event), 1);
            // удалить класс event из дня
            const activeDayEl = document.querySelector(".day.active");
            if (activeDayEl.classList.contains("event")) {
              activeDayEl.classList.remove("event");
            }
          }
        }
      });
      updateEvents(activeDay);
    }
  }
});

// Функция сохранения событий в локальном хранилище
function saveEvents() {
  localStorage.setItem("events", JSON.stringify(eventsArr));
}

// Функция для получения событий из локального хранилища
function getEvents() {
  const events = localStorage.getItem("events");
  if (events != null) {
    const parsedEvents = JSON.parse(events);
    eventsArr.push(...parsedEvents);
  }
}



// Дополнительное задание: реализовать интерфейс для отправки уведомлений на почту/смс

// Интерфейс для отправки уведомлений
class NotificationSender {
  sendNotification(recipient, message) { }
}

// Реализация интерфейса для отправки уведомлений по почте
class EmailNotificationSender extends NotificationSender {
  sendNotification(emailAddress, message) {
    // Код для отправки уведомления по электронной почте
  }
}

// Реализация интерфейса для отправки уведомлений по SMS
class SmsNotificationSender extends NotificationSender {
  sendNotification(phoneNumber, message) {
    // Код для отправки уведомления по SMS
  }
}

// Класс для работы с датами и временем
class DateHelper {
  static isDateTimeTodayOrLater(dateTime) {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes());
    if (today >= dateTime) {
      return true;
    }
  }
}

// Обработчик уведомлений
class NotificationHandler {
  constructor(notificationSender) {
    this.notificationSender = notificationSender;
  }

  sendNotificationIfEventIsTodayOrLater(eventDateTime, recipient, message) {
    if (DateHelper.isDateTimeTodayOrLater(eventDateTime)) {
      this.notificationSender.sendNotification(recipient, message);
    }
  }
}

// Создаем объекты отправителей уведомлений
const emailSender = new EmailNotificationSender();
const smsSender = new SmsNotificationSender();

// Создаем объекты обработчиков уведомлений
const emailNotificationHandler = new NotificationHandler(emailSender);
const smsNotificationHandler = new NotificationHandler(smsSender);

// Функция для отправки уведомлений
function sendNotifications() {
  eventsArr.forEach((event) => {
    const eventDateTime = new Date(event.year, event.month - 1, event.day, event.hoursFrom, event.minFrom);
    if (DateHelper.isDateTimeTodayOrLater(eventDateTime)) {
      emailNotificationHandler.sendNotificationIfEventIsTodayOrLater(
        eventDateTime,
        '4846548944@gmail.com',
        `Напоминание: ${event.title}`
      );
      smsNotificationHandler.sendNotificationIfEventIsTodayOrLater(
        eventDateTime,
        '+4846548944',
        `Напоминание: ${event.title}`
      );
    }
  });
}

// Вызываем функцию для отправки уведомлений при загрузке страницы с календарем
sendNotifications();