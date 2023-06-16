const API_URL = "https://ninth-scratched-cake.glitch.me";

const year = new Date().getFullYear();

// GET /api - получить список услуг
// GET /api?service={n} - получить список барберов
// GET /api?spec={n} - получить список месяца работы барбера
// GET /api?spec={n}&month={n} - получить список дней работы барбера
// GET /api?spec={n}&month={n}&day={n} - получить список свободных часов барбера
// POST /api/order - оформить заказ

// ========================================================================= SLIDER PRELOAD =============================================
const addPreload = (elem) => {
  elem.classList.add("preload");
};

const removePreload = (elem) => {
  elem.classList.remove("preload");
};

const startSlider = () => {
  const sliderItems = document.querySelectorAll(".slider__item");
  const sliderList = document.querySelector(".slider__list");
  const btnPrevSlide = document.querySelector(".slider__arrow-left");
  const btnNextSlide = document.querySelector(".slider__arrow-right");

  let activeSliderItem = 1;
  let position = 0;

  const checkSlider = () => {
    if (
      (activeSliderItem + 1 === sliderItems.length &&
        document.documentElement.offsetWidth > 560) ||
      activeSliderItem === sliderItems.length
    ) {
      btnNextSlide.style.display = "none";
    } else {
      btnNextSlide.style.display = "";
    }

    if (activeSliderItem === 1) {
      btnPrevSlide.style.display = "none";
    } else {
      btnPrevSlide.style.display = "";
    }
  };

  checkSlider();

  const nextSlide = () => {
    sliderItems[activeSliderItem]?.classList.remove("slider__item__active");
    position = -sliderItems[0].clientWidth * activeSliderItem;

    sliderList.style.transform = `translateX(${position}px)`;
    activeSliderItem += 1;
    sliderItems[activeSliderItem]?.classList.add("slider__item__active");
    checkSlider();
  };

  const prevSlide = () => {
    sliderItems[activeSliderItem]?.classList.remove("slider__item__active");
    position = -sliderItems[0].clientWidth * (activeSliderItem - 2);

    sliderList.style.transform = `translateX(${position}px)`;
    activeSliderItem -= 1;
    sliderItems[activeSliderItem]?.classList.add("slider__item__active");
    checkSlider();
  };

  btnPrevSlide.addEventListener("click", prevSlide);
  btnNextSlide.addEventListener("click", nextSlide);

  window.addEventListener("resize", () => {
    if (
      activeSliderItem + 2 > sliderItems.length &&
      document.documentElement.offsetWidth > 560
    ) {
      activeSliderItem = sliderItems.length - 2;
      sliderItems[activeSliderItem]?.classList.add("slider__item__active");
    }

    position = -sliderItems[0].clientWidth * (activeSliderItem - 1);
    sliderList.style.transform = `translateX(${position}px)`;
    checkSlider();
  });
};

const initSlider = () => {
  const slider = document.querySelector(".slider");
  const sliderContainer = document.querySelector(".slider__container");

  sliderContainer.style.display = "none";
  addPreload(slider);

  window.addEventListener("load", () => {
    sliderContainer.style.display = "";

    removePreload(slider);
    startSlider();
  });
};

// ================================================================= API DATA =====================================================

// ============================ RENDERS ============================

// =====Rendering prices from database=======
const renderPrice = (wrapper, data) => {
  data.forEach((item) => {
    const priceItem = document.createElement("li");
    priceItem.classList.add("price__item");
    priceItem.innerHTML = `
    <span class="price__item-title">${item.name}</span>
    <span class="price__item-amount">${item.price} €</span>
    `;
    wrapper.append(priceItem);
  });
};

// =====Rendering actual services from database=======
const renderService = (wrapper, data) => {
  const labels = data.map((item) => {
    const label = document.createElement("label");

    label.classList.add("radio");
    label.innerHTML = `
    <input class="radio__input" type="radio" name="service" value="${item.id}">
    <span class="radio__label">${item.name}</span>
    `;

    return label;
  });

  wrapper.append(...labels);
};

// =====Rendering barbers from database=======
const renderSpec = (wrapper, data) => {
  const labels = data.map((item) => {
    const label = document.createElement("label");

    label.classList.add("radio");
    label.innerHTML = `
          <input class="radio__input" type="radio" name="spec" value="${item.id}">
          <span class="radio__label radio__label-spec" style="--bg-img: url(${API_URL}/${item.img})">${item.name}</span>
          `;

    return label;
  });

  wrapper.append(...labels);
};

// =====Rendering free monthes from database=======
const renderMonth = (wrapper, data) => {
  const labels = data.map((month) => {
    const label = document.createElement("label");

    label.classList.add("radio");
    label.innerHTML = `
            <input class="radio__input" type="radio" name="month" value="${month}">
            <span class="radio__label">${new Intl.DateTimeFormat("de-DE", {
              month: "long",
            }).format(new Date(year, month))}</span>
            `;

    return label;
  });

  wrapper.append(...labels);
};

// =====Rendering free days from database=======
const renderDay = (wrapper, data, month) => {
  const labels = data.map((day) => {
    const label = document.createElement("label");

    label.classList.add("radio");
    label.innerHTML = `
            <input class="radio__input" type="radio" name="day" value="${day}">
            <span class="radio__label">${new Intl.DateTimeFormat("de-DE", {
              month: "long",
              day: "numeric",
            }).format(new Date(year, month, day))}</span>
            `;

    return label;
  });

  wrapper.append(...labels);
};

// =====Rendering free time from database=======
const renderTime = (wrapper, data) => {
  const labels = data.map((time) => {
    const label = document.createElement("label");

    label.classList.add("radio");
    label.innerHTML = `
            <input class="radio__input" type="radio" name="time" value="${time}">
            <span class="radio__label">${time}</span>
            `;

    return label;
  });

  wrapper.append(...labels);
};

// ==========================================INITS==================================
const initService = () => {
  const priceList = document.querySelector(".price__list");
  const reserveFieldsetService = document.querySelector(
    ".reserve__fieldset-service"
  );

  priceList.textContent = "";
  addPreload(priceList);

  reserveFieldsetService.innerHTML =
    '<legend class="reserve__legend">Dienstleistung</legend>';
  addPreload(reserveFieldsetService);

  fetch(`${API_URL}/api`)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      renderPrice(priceList, data);
      removePreload(priceList);
      return data;
    })
    .then((data) => {
      renderService(reserveFieldsetService, data);
      removePreload(reserveFieldsetService);
    });
};

const addDisabled = (arr) => {
  arr.forEach((elem) => {
    elem.disabled = true;
  });
};

const removeDisabled = (arr) => {
  arr.forEach((elem) => {
    elem.disabled = false;
  });
};

const initReserve = () => {
  const reserveForm = document.querySelector(".reserve__form");
  const { fieldservice, fieldspec, fieldmonth, fieldday, fieldtime, btn } =
    reserveForm;

  addDisabled([fieldspec, fieldmonth, fieldday, fieldtime, btn]);

  reserveForm.addEventListener("change", async (event) => {
    const target = event.target;

    // ==========================================GETTING FREE BARBER==================================
    if (target.name === "service") {
      addDisabled([fieldspec, fieldmonth, fieldday, fieldtime, btn]);
      fieldspec.innerHTML = '<legend class="reserve__legend">Fachmann</legend>';
      addPreload(fieldspec);

      const response = await fetch(`${API_URL}/api/?service=${target.value}`);
      const data = await response.json();

      renderSpec(fieldspec, data);
      removePreload(fieldspec);
      removeDisabled([fieldspec]);
    }

    // ==========================================GETTING FREE MONTHES==================================
    if (target.name === "spec") {
      addDisabled([fieldmonth, fieldday, fieldtime, btn]);
      addPreload(fieldmonth);

      const response = await fetch(`${API_URL}/api/?spec=${target.value}`);
      const data = await response.json();

      fieldmonth.textContent = "";
      renderMonth(fieldmonth, data);
      removePreload(fieldmonth);
      removeDisabled([fieldmonth]);
    }

    // ==========================================GETTING FREE DAYS==================================
    if (target.name === "month") {
      addDisabled([fieldday, fieldtime, btn]);
      addPreload(fieldday);

      const response = await fetch(
        `${API_URL}/api/?spec=${reserveForm.spec.value}&month=${reserveForm.month.value}`
      );
      const data = await response.json();

      fieldday.textContent = "";
      renderDay(fieldday, data, reserveForm.month.value);
      removePreload(fieldday);
      removeDisabled([fieldday]);
    }

    // ==========================================GETTING FREE TIME==================================
    if (target.name === "day") {
      addDisabled([fieldtime, btn]);

      addPreload(fieldtime);

      const response = await fetch(
        `${API_URL}/api/?spec=${reserveForm.spec.value}&month=${reserveForm.month.value}&day=${target.value}`
      );
      const data = await response.json();

      fieldtime.textContent = "";
      renderTime(fieldtime, data);
      removePreload(fieldtime);
      removeDisabled([fieldtime]);
    }

    // ==========================================UNBLOCKING BUTTON==================================
    if (target.name === "time") {
      removeDisabled([btn]);
    }
  });

  // ==========================================SENDING DATA TO SERVER==================================
  reserveForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(reserveForm);
    const json = JSON.stringify(Object.fromEntries(formData));

    const response = await fetch(`${API_URL}/api/order`, {
      method: "post",
      body: json,
    });

    const data = await response.json();

    addDisabled([
      fieldservice,
      fieldspec,
      fieldmonth,
      fieldday,
      fieldtime,
      btn,
    ]);

    // ==========================================RENDERING POPUP==================================
    const popup = document.querySelector(".popup__container");
    const popupForm = document.querySelector(".popup__form");
    const popupBtn = document.querySelector(".popup-btn");
    const shader = document.querySelector(".shader");

    shader.classList.remove("hidden");
    popup.classList.remove("hidden");
    popup.classList.add("popup");
    popupForm.innerHTML += ` <img src="../img/popup-done-240.svg"></img> <h2>Danke für Ihre Bestellung!</h2>
    <p class="popup-num">  Ihre Buchungsnummer: <span>#${data.id}</span></p>
    <p>Wir erwarten Sie am <br> 
    <span>${new Intl.DateTimeFormat("de-DE", {
      month: "long",
      day: "numeric",
    }).format(new Date(`${data.month}/${data.day}`))}, 

    um ${data.time} </span>
    </p>
    `;

    popupBtn.addEventListener("click", () => {
      shader.classList.add("hidden");
      popup.classList.add("hidden");
    });
  });
};

const init = () => {
  initSlider();
  initService();
  initReserve();
};

window.addEventListener("DOMContentLoaded", init);
