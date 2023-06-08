const API_URL = "https://ninth-scratched-cake.glitch.me/api";

// GET /api - получить список услуг
// GET /api?service={n} - получить список барберов
// GET /api?spec={n} - получить список месяца работы барбера
// GET /api?spec={n}&month={n} - получить список дней работы барбера
// GET /api?spec={n}&month={n}&day={n} - получить список свободных часов барбера
// POST /api/order - оформить заказ

// ============================ SLIDER PRELOAD ============================
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

    if (activeSliderItem === 0) {
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

// ============================ API ============================
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

const initService = () => {
  const priceList = document.querySelector(".price__list");

  priceList.textContent = "";
  addPreload(priceList);

  fetch(API_URL)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      renderPrice(priceList, data);
      removePreload(priceList);
    });
};

const init = () => {
  initSlider();
  initService();
};

window.addEventListener("DOMContentLoaded", init);
