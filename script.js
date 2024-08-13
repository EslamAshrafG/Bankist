'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const tabs = document.querySelectorAll('.operations__tab');
const tabContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
const nav = document.querySelector('.nav');

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

// Smooth Scrolling
btnScrollTo.addEventListener('click', function (e) {
  e.preventDefault();
  section1.scrollIntoView({
    behavior: 'smooth',
  });
});

// document.querySelectorAll('.nav__link').forEach(link => {
//   link.addEventListener('click', function (e) {
//     e.preventDefault();
//     const id = this.getAttribute('href');
//     const targetSection = document.querySelector(id);
//     targetSection.scrollIntoView({ behavior: 'smooth' });
//   });
// });

// Event Delegation
document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    const targetSection = document.querySelector(id);
    targetSection.scrollIntoView({ behavior: 'smooth' });
  }
});

// Tab component

tabContainer.addEventListener('click', function (e) {
  e.preventDefault();
  const targetTabBtn = e.target.closest('.operations__tab');

  if (!targetTabBtn) return;

  tabs.forEach(tb => tb.classList.remove('operations__tab--active'));

  targetTabBtn.classList.add('operations__tab--active');
  const targetTab = document.querySelector(
    `.operations__content--${targetTabBtn.getAttribute('data-tab')}`
  );
  tabsContent.forEach(tc => tc.classList.remove('operations__content--active'));
  targetTab.classList.add('operations__content--active');
});

// Menu fade animation
function handleHover(opacity, e) {
  if (e.target.classList.contains('nav__link')) {
    const targetLink = e.target;
    const siblings = targetLink.closest('.nav').querySelectorAll('.nav__link');
    const logo = targetLink.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if (el !== targetLink) el.style.opacity = opacity;
    });
    logo.style.opacity = opacity;
  }
}

// nav.addEventListener('mouseover', e => handleHover(e, 0.5));
// nav.addEventListener('mouseout', e => handleHover(e, 1));

nav.addEventListener('mouseover', handleHover.bind(undefined, 0.5));
nav.addEventListener('mouseout', handleHover.bind(undefined, 1));

// Sticky NavBar

// const initialCoords = section1.getBoundingClientRect();
// window.addEventListener('scroll', function () {
//   if (this.window.scrollY > initialCoords.top) {
//     console.log(nav);
//     nav.classList.add('sticky');
//   } else {
//     nav.classList.remove('sticky');
//   }
// });

const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;

function stickyNav(entries) {
  const [entry] = entries;
  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
}

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});

headerObserver.observe(header);

// Reveal Sections
const allSections = document.querySelectorAll('.section');

const revealSection = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  else if (entry.isIntersecting) {
    entry.target.classList.remove('section--hidden');
    observer.unobserve(entry.target);
  }
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(section => {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});

// LAZY IMAGE

const imgTargets = document.querySelectorAll('img[data-src]');
function loadImg(entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;

  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });

  observer.unobserve(entry.target);
}
const imgeObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '-100px',
});
imgTargets.forEach(img => imgeObserver.observe(img));

// Slider Component

const slides = document.querySelectorAll('.slide');
const slider = document.querySelector('.slider');
const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right');
let currentSlide = 0;
const maxSlide = slides.length;
const dotContainer = document.querySelector('.dots');

//Functions
function createDots() {
  slides.forEach((_, i) => {
    dotContainer.insertAdjacentHTML(
      'beforeend',
      `
      <button class="dots__dot" data-slide = "${i}"></button>
      `
    );
  });
}

function activeDot(slideNumber) {
  document
    .querySelectorAll('.dots__dot')
    .forEach(dot => dot.classList.remove('dots__dot--active'));
  document
    .querySelector(`.dots__dot[data-slide="${slideNumber}"`)
    .classList.add('dots__dot--active');
}

const goToSlide = function (slideNumber) {
  slides.forEach(
    (s, i) => (s.style.transform = `translateX(${(i - slideNumber) * 100}%)`)
  );
};
// 2.Next Slide
function nextSlide() {
  if (currentSlide === maxSlide - 1) currentSlide = 0;
  else currentSlide++;
  goToSlide(currentSlide);
  activeDot(currentSlide);
}
// 2.Previous Slide
function prevSlide() {
  if (currentSlide === 0) currentSlide = maxSlide - 1;
  else currentSlide--;
  goToSlide(currentSlide);
  activeDot(currentSlide);
}
function init() {
  createDots();
  goToSlide(0);
  activeDot(0);
}

init();

// Event Handlers
btnRight.addEventListener('click', nextSlide);

btnLeft.addEventListener('click', prevSlide);

document.addEventListener('keydown', function (e) {
  if (e.key === 'ArrowLeft') prevSlide();
  if (e.key === 'ArrowRight') nextSlide();
});

dotContainer.addEventListener('click', function (e) {
  if (e.target.classList.contains('dots__dot')) {
    const { slide } = e.target.dataset;
    goToSlide(slide);
    activeDot(slide);
  }
});

/////////////////////////////////////////////////////////////////

// Hover Event
// const h1 = document.querySelector('h1');
// h1.addEventListener('mouseenter', function (e) {
//   // alert('addEventlister : Great');
// });

// h1.onmouseenter = function (e) {
//   // alert('addEventlister : Great');
// };

// Event Propagation
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

const randomColor = () =>
  `rgb(${randomInt(0, 255)},${randomInt(0, 255)},${randomInt(0, 255)})`;

// document.querySelector('.nav__link').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor();
//   console.log('LINK', e.target);

//   // Stop Propagation
//   // e.stopPropagation();
// });

// document.querySelector('.nav__links').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor();
//   console.log('CONTAINER', e.target);
// });

// document.querySelector('.nav').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor();
//   console.log('NAV', e.target);
// });

// document.addEventListener('DOMContentLoaded',function(e){

// })

// window.addEventListener('load',function(e){

// })
