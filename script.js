document.addEventListener("DOMContentLoaded", function () {
  const homeBtn = document.getElementById("home-btn");
  const projectsBtn = document.getElementById("projects-btn");
  const descriptionBtn = document.getElementById("description-btn");
  const contactsBtn = document.getElementById("contacts-btn");
  const homeSection = document.getElementById("home");
  const projectsSection = document.getElementById("projects");
  const descriptionSection = document.getElementById("description");
  const contactsSection = document.getElementById("contacts");

  function showSection(section) {
    [homeSection, projectsSection, descriptionSection, contactsSection].forEach((sec) => {
      sec.style.display = "none";
    });
    section.style.display = section.classList.contains("video-section") ? "flex" : "block";
  }

  homeBtn.addEventListener("click", () => showSection(homeSection));
  projectsBtn.addEventListener("click", () => showSection(projectsSection));
  descriptionBtn.addEventListener("click", () => showSection(descriptionSection));
  contactsBtn.addEventListener("click", () => showSection(contactsSection));

  const menuBtn = document.querySelector(".menu-btn");
  const menu = document.querySelector(".menu");
  const menuLinks = document.querySelectorAll(".menu li a");

  menuBtn.addEventListener("click", function () {
    menu.classList.toggle("active");
    menuBtn.innerHTML = menu.classList.contains("active") ? "✖" : "☰";
  });

  menuLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      if (link.id === "home-btn") showSection(homeSection);
      if (link.id === "projects-btn") showSection(projectsSection);
      if (link.id === "description-btn") showSection(descriptionSection);
      if (link.id === "contacts-btn") showSection(contactsSection);
      menu.classList.remove("active");
      menuBtn.innerHTML = "☰";
    });
  });

  document.addEventListener("click", function (e) {
    if (!menu.contains(e.target) && !menuBtn.contains(e.target)) {
      menu.classList.remove("active");
      menuBtn.innerHTML = "☰";
    }
  });

  const startBtn = document.querySelector(".start-button");
  const content = document.querySelector(".section-content");
  const gameScreen = document.getElementById("gameScreen");
  const pauseBtn = document.getElementById("pauseBtn");
  const pauseModal = document.getElementById("pauseModal");
  const resumeBtn = document.getElementById("resumeBtn");
  const exitBtn = document.getElementById("exitBtn");
  const startSound = document.getElementById("startSound");
  const gameComment = document.getElementById("gameComment");
  const timerBar = document.getElementById("timerBar");
  const choiceButtons = document.getElementById("choiceButtons");
  let nextBtn = document.getElementById("nextBtn");

  if (!nextBtn) {
    nextBtn = document.createElement("button");
    nextBtn.className = "choice";
    nextBtn.id = "nextBtn";
    nextBtn.textContent = "Продолжить";
    choiceButtons.innerHTML = "";
    choiceButtons.appendChild(nextBtn);
  }

  const initialImage = document.getElementById("initialImage");
  const imageContainer = document.querySelector(".image-container");
  const allImages = Array.from(imageContainer.querySelectorAll("img"));

  allImages.forEach((img) => {
    if (img === initialImage) {
      img.classList.add("game-image");
      img.classList.remove("result-scene");
    } else {
      img.classList.add("result-scene");
      img.classList.remove("game-image");
    }
    img.style.display = "none";
    img.style.opacity = "0";
    img.style.pointerEvents = "none";
    img.style.position = "absolute";
    img.style.top = "0";
    img.style.left = "0";
    img.style.width = "100%";
    img.style.height = "100%";
    img.style.objectFit = "cover";
  });

  let currentIndex = 0; 
  let timerHandle = null;
  let colorInterval = null;
  let paused = false;
  let timerStartTs = 0;
  let timerDuration = 0;
  let remainingMs = 0;

  const comments = [
    "Я был обычным подростоком который только и делал что тратил свое время…",
    "Ночами сидел за компьютером и смотрел разные глупые видео которые пытались облегчить мою душу и спрятать мои проблемы под подушку...",
    "Родители мои не были богачами поэтому приходилось покупать дешевую еду и подробатывать чтобы выжить...",
    "Иногда бывали и несчастные случаи но долги и кредиты которые имели мои родители не давали мне покончить собой",
    "Красатой я не обладал поскольку я никогда не занимался спортом и не пытался исправить свой вид",
    "В школе я был неудачником который только и делал что выполнял приказы хулиганов",
    "Эй лузер тупоголовый...",
    "Я просил принести тебе сигареты ну и где они?",
    "Хулиганы часто издевались надо мной и мучели меня до сметри",
    "Издевались и смеялись говоря что я не кто и мое место как среди вонючих свиней",
    "Ну и тупая свинья - так называла меня девушка в которой я был влюблен",
    "Ублюдок как ты смеешь смотреть на мою девушку говорил ее ухожер",
    "Дома тоже не было сладко так как родителей постоянно не было дома",
    "В голове звучит музыка, настроение меняется и меня это начинало надоедать",
    "Мое тело больше не хотело проходить весь этот ад и я решился изменить свое будущие чтобы отомстим и получить желаемое",
    "Желание иметь красивых девушек, денег и так же власть в котором не один мудак не сможет мне помешать",
    "Ну чтобы этого достичь мне нужна дисциплина и крепкое тело для реализации моего будущего плана",
    "Так что начнем мой путь ведь меня зовут...",
    "С сегодняшнего дня все измениться и я стану тем монстром/человеком которого они не ждут",
    "Эй свинья ты принес вещь которую я просила?",
    "Конечно я принес тебе...",
    "Вау это то что было нужно",
    "Тупой ублюдок я не просила это...",
    "Прости я не знал что тебе нужно было это...",
    "Эй тупая безмозглая свинья",
    "Что насчет моих сигарет?",
    "Как же они меня задолбали",
    "Вся их нее шайка состоит из кучки отбросов которые только и делаеют что только и ломают жизнь такому как мне",
    "Простите я забыл про твои сигареты так как я спешил сюда",
    "Ведь их родители имеют власть и деньги над которой школа не чего не сможет им сопоставить",
    "Обычным же родителем не чего не остается кроме как обвинять своих же собственных детей и заставлять извинятся перед хулиганами",
    "Однажды все это закончится и я буду мстить каждому кто навредил мне в этой жизни",
  ];

  let typeWriterInterval = null; 

function typeWriter(element, text, speed = 60) {
  if (typeWriterInterval) {
    clearInterval(typeWriterInterval);
    typeWriterInterval = null;
  }

  element.textContent = "";
  let i = 0;

  typeWriterInterval = setInterval(() => {
    element.textContent += text.charAt(i);
    i++;
    if (i >= text.length) {
      clearInterval(typeWriterInterval);
      typeWriterInterval = null;
    }
  }, speed);
}


  function showImage(index) {
    allImages.forEach((img, i) => {
      if (i === index) {
        img.style.display = "block";
        img.style.opacity = "0";
        img.style.pointerEvents = "auto";
        requestAnimationFrame(() => {
          img.style.transition = "opacity 0.8s ease";
          img.style.opacity = "1";
        });
      } else {
        img.style.opacity = "0";
        img.style.pointerEvents = "none";
        setTimeout(() => {
          if (img.style.opacity === "0") img.style.display = "none";
        }, 800);
      }
    });
  }

  function clearTimer() {
    if (timerHandle) clearTimeout(timerHandle);
    timerHandle = null;
    if (colorInterval) clearInterval(colorInterval);
    colorInterval = null;
  }

  function updateTimerBarColor(progress) {
    const red = Math.min(255, Math.floor(255 * progress));
    const green = Math.max(0, Math.floor(255 * (1 - progress)));
    timerBar.style.backgroundColor = `rgb(${red},${green},0)`;
  }

  function startDecisionTimer(duration = 10000) {
    clearTimer();
    paused = false;
    timerDuration = duration;
    remainingMs = duration;
    timerStartTs = performance.now();
    timerBar.style.transition = "none";
    timerBar.style.width = "100%";
    timerBar.style.backgroundColor = "limegreen";
    void timerBar.offsetWidth;

    timerBar.style.transition = `width ${duration}ms linear`;
    requestAnimationFrame(() => {
      timerBar.style.width = "0%";
    });

    let elapsed = 0;
    colorInterval = setInterval(() => {
      elapsed += 100;
      const progress = Math.min(1, elapsed / duration);
      updateTimerBarColor(progress);
    }, 100);

    timerHandle = setTimeout(() => {
      nextStep(true);
    }, duration);
  }

  function pauseTimer() {
    if (paused) return;
    paused = true;
    const now = performance.now();
    const elapsed = now - timerStartTs;
    remainingMs = Math.max(0, timerDuration - elapsed);

    timerBar.style.transition = "none";
    clearTimer();
  }

  function resumeTimer() {
    if (!paused) return;
    paused = false;

    timerStartTs = performance.now();
    timerDuration = remainingMs;

    timerBar.style.transition = `width ${remainingMs}ms linear`;
    requestAnimationFrame(() => {
      timerBar.style.width = "0%";
    });

    let elapsed = 0;
    colorInterval = setInterval(() => {
      elapsed += 100;
      const progress = Math.min(1, elapsed / remainingMs);
      updateTimerBarColor(progress);
    }, 100);

    timerHandle = setTimeout(() => {
      nextStep(true);
    }, remainingMs);
  }

  function nextStep(isAuto = false) {
    clearTimer();
    currentIndex++;
    if (currentIndex < allImages.length) {
      showImage(currentIndex);

      if (comments[currentIndex]) {
        typeWriter(gameComment, comments[currentIndex], 60);
      }

      startDecisionTimer(10000);
    } else {
      typeWriter(gameComment, "Конец истории.", 50);
      nextBtn.style.display = "none";
      timerBar.style.transition = "none";
      timerBar.style.width = "0%";
      timerBar.style.backgroundColor = "white";
    }
  }

  startBtn.addEventListener("click", function (e) {
    e.preventDefault();
    content.classList.add("fade-out");

    setTimeout(() => {
      content.style.display = "none";
      gameScreen.style.display = "flex";

      currentIndex = 0;
      showImage(currentIndex);

      if (comments[currentIndex]) {
        typeWriter(gameComment, comments[currentIndex], 60);
      }

      try {
        if (startSound) {
          startSound.play();
        }
      } catch (e) {}

      startDecisionTimer(10000);
    }, 1000); 
  }); 


  nextBtn.addEventListener("click", function () {
    nextStep(false);
  });

  pauseBtn.addEventListener("click", function () {
    pauseModal.style.display = "flex";
    pauseTimer();
  });

  resumeBtn.addEventListener("click", function () {
    pauseModal.style.display = "none";
    resumeTimer();
  });

  exitBtn.addEventListener("click", function () {
    pauseModal.style.display = "none";
    clearTimer();
    gameScreen.style.display = "none";
    content.style.display = "block";
    content.classList.remove("fade-out");
    gameComment.textContent = "Зазвонил будильник ваши действие...";
    nextBtn.style.display = "inline-block";
    timerBar.style.transition = "none";
    timerBar.style.width = "100%";
    timerBar.style.backgroundColor = "limegreen";
    allImages.forEach((img) => {
      img.style.opacity = "0";
      img.style.display = "none";
    });
  });
});
