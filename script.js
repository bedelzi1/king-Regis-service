document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;


  /* =================================
     LOADER KING SERVICE
  ================================= */

  body.classList.add("loading");

  const loader = document.getElementById("loader");
  const loaderProgress = document.getElementById("loader-progress");
  const loaderNumber = document.getElementById("loader-number");

  let progress = 0;

  if (loader && loaderProgress && loaderNumber) {
    const loadingAnimation = setInterval(() => {
      progress += Math.floor(Math.random() * 7) + 3;

      if (progress >= 100) {
        progress = 100;
        clearInterval(loadingAnimation);

        setTimeout(() => {
          loader.classList.add("hidden");
          body.classList.remove("loading");
        }, 650);
      }

      loaderProgress.style.width = `${progress}%`;
      loaderNumber.textContent = progress;
    }, 70);
  } else {
    body.classList.remove("loading");
  }


  /* =================================
     NAVIGATION FIXE
  ================================= */

  const header = document.getElementById("header");

  const updateHeader = () => {
    if (!header) {
      return;
    }

    header.classList.toggle("scrolled", window.scrollY > 60);
  };

  window.addEventListener("scroll", updateHeader, { passive: true });
  updateHeader();


  /* =================================
     MENU MOBILE
  ================================= */

  const menuToggle = document.getElementById("menu-toggle");
  const navLinks = document.getElementById("nav-links");
  const navItems = document.querySelectorAll(".nav-links a");

  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("open");

      menuToggle.classList.toggle("active");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
    });

    navItems.forEach((link) => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("open");
        menuToggle.classList.remove("active");
        menuToggle.setAttribute("aria-expanded", "false");
      });
    });
  }


  /* =================================
     RÉVÉLATION AU DÉFILEMENT
  ================================= */

  const revealElements = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -45px 0px"
      }
    );

    revealElements.forEach((element, index) => {
      element.style.transitionDelay = `${Math.min(index % 4, 3) * 90}ms`;
      revealObserver.observe(element);
    });
  } else {
    revealElements.forEach((element) => {
      element.classList.add("visible");
    });
  }


  /* =================================
     COMPTEURS DES DOMAINES
  ================================= */

  const statNumbers = document.querySelectorAll(".stat-item strong");

  const animateNumber = (element) => {
    const finalNumber = Number(element.textContent.trim());

    if (Number.isNaN(finalNumber) || finalNumber === 0) {
      return;
    }

    const duration = 900;
    const startTime = performance.now();

    const updateNumber = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progressValue = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progressValue, 3);

      element.textContent = String(
        Math.floor(easeOut * finalNumber)
      ).padStart(2, "0");

      if (progressValue < 1) {
        requestAnimationFrame(updateNumber);
      } else {
        element.textContent = String(finalNumber).padStart(2, "0");
      }
    };

    requestAnimationFrame(updateNumber);
  };

  if ("IntersectionObserver" in window) {
    const statsObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateNumber(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.7 }
    );

    statNumbers.forEach((number) => {
      statsObserver.observe(number);
    });
  }


  /* =================================
     FILTRES DES RÉALISATIONS
  ================================= */

  const filterButtons = document.querySelectorAll(".filter-button");
  const projectCards = document.querySelectorAll(".project-card");

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const selectedFilter = button.dataset.filter;

      filterButtons.forEach((item) => {
        item.classList.remove("active");
      });

      button.classList.add("active");

      projectCards.forEach((card) => {
        const cardCategory = card.dataset.category;

        const shouldShow =
          selectedFilter === "all" ||
          selectedFilter === cardCategory;

        card.classList.toggle("hide", !shouldShow);

        if (shouldShow) {
          card.animate(
            [
              {
                opacity: 0,
                transform: "translateY(25px)"
              },
              {
                opacity: 1,
                transform: "translateY(0)"
              }
            ],
            {
              duration: 450,
              easing: "cubic-bezier(0.22, 1, 0.36, 1)"
            }
          );
        }
      });
    });
  });


  /* =================================
     MODALE DES IMAGES
  ================================= */

  const modal = document.getElementById("image-modal");
  const modalImage = document.getElementById("modal-image");
  const modalClose = document.getElementById("modal-close");
  const viewButtons = document.querySelectorAll(".view-project");

  if (modal && modalImage && modalClose) {
    const closeModal = () => {
      modal.classList.remove("show");
      body.style.overflow = "";

      setTimeout(() => {
        modalImage.src = "";
      }, 350);
    };

    viewButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const projectCard = button.closest(".project-card");
        const projectImage = projectCard?.querySelector("img");

        if (!projectImage) {
          return;
        }

        modalImage.src = projectImage.src;
        modalImage.alt = projectImage.alt;

        modal.classList.add("show");
        body.style.overflow = "hidden";
      });
    });

    modalClose.addEventListener("click", closeModal);

    modal.addEventListener("click", (event) => {
      if (event.target === modal) {
        closeModal();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeModal();
      }
    });
  }


  /* =================================
     PHOTO DE PROFIL
  ================================= */

  const heroCard = document.querySelector(".hero-card");
  const profilePhoto = document.querySelector(".profile-photo");

  if (heroCard && profilePhoto) {
    const showPhoto = () => {
      heroCard.classList.add("has-profile-photo");
    };

    const hidePhoto = () => {
      heroCard.classList.remove("has-profile-photo");
    };

    if (profilePhoto.complete) {
      if (profilePhoto.naturalWidth > 0) {
        showPhoto();
      } else {
        hidePhoto();
      }
    } else {
      profilePhoto.addEventListener("load", showPhoto);
      profilePhoto.addEventListener("error", hidePhoto);
    }
  }


  /* =================================
     CARTE 3D ET PARALLAXE DU HERO
  ================================= */

  const hero = document.querySelector(".hero");
  const lightOne = document.querySelector(".light-one");
  const lightTwo = document.querySelector(".light-two");
  const circleOne = document.querySelector(".circle-one");
  const circleTwo = document.querySelector(".circle-two");

  if (hero && heroCard && window.innerWidth > 700) {
    let animationFrame;

    hero.addEventListener("mousemove", (event) => {
      cancelAnimationFrame(animationFrame);

      animationFrame = requestAnimationFrame(() => {
        const rect = hero.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;

        heroCard.style.transform = `
          rotateY(${x * 10}deg)
          rotateX(${y * -8}deg)
          rotateZ(3deg)
          translateY(-7px)
        `;

        if (lightOne) {
          lightOne.style.transform = `translate(${x * 28}px, ${y * 28}px)`;
        }

        if (lightTwo) {
          lightTwo.style.transform = `translate(${x * -28}px, ${y * -28}px)`;
        }

        if (circleOne) {
          circleOne.style.transform = `translate(${x * 12}px, ${y * 12}px)`;
        }

        if (circleTwo) {
          circleTwo.style.transform = `translate(${x * -15}px, ${y * -15}px)`;
        }
      });
    });

    hero.addEventListener("mouseleave", () => {
      heroCard.style.transform = "rotate(5deg)";

      if (lightOne) {
        lightOne.style.transform = "";
      }

      if (lightTwo) {
        lightTwo.style.transform = "";
      }

      if (circleOne) {
        circleOne.style.transform = "";
      }

      if (circleTwo) {
        circleTwo.style.transform = "";
      }
    });
  }


  /* =================================
     EFFET 3D SUR LES PROJETS
  ================================= */

  const projectImages = document.querySelectorAll(".project-image");

  if (window.innerWidth > 700) {
    projectImages.forEach((projectImage) => {
      projectImage.addEventListener("mousemove", (event) => {
        const rect = projectImage.getBoundingClientRect();

        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;

        projectImage.style.transform = `
          perspective(900px)
          rotateY(${x * 3.5}deg)
          rotateX(${y * -3.5}deg)
          translateY(-8px)
        `;
      });

      projectImage.addEventListener("mouseleave", () => {
        projectImage.style.transform = "";
      });
    });
  }


  /* =================================
     FORMULAIRE — PRÉPARATION EMAIL
  ================================= */

  const auditForm = document.getElementById("audit-form");
  const formSuccess = document.getElementById("form-success");

  if (auditForm) {
    auditForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const name =
        document.getElementById("name")?.value.trim();

      const email =
        document.getElementById("email")?.value.trim();

      const countryCode =
        document.getElementById("country-code")?.value;

      const phone =
        document.getElementById("phone")?.value.trim();

      const objectiveElement =
        document.getElementById("objective");

      const message =
        document.getElementById("message")?.value.trim();

      if (
        !name ||
        !email ||
        !countryCode ||
        !phone ||
        !objectiveElement ||
        !objectiveElement.value ||
        !message
      ) {
        alert("Veuillez remplir tous les champs du formulaire.");
        return;
      }

      const objectiveText =
        objectiveElement.options[
          objectiveElement.selectedIndex
        ].text;

      const subject = encodeURIComponent(
        `Nouvelle demande King Service — ${objectiveText}`
      );

      const emailBody = encodeURIComponent(
        `Bonjour King Service,

Nom ou entreprise :
${name}

Email :
${email}

Téléphone :
${countryCode} ${phone}

Objectif principal :
${objectiveText}

Description du projet et impact attendu :
${message}

Merci.`
      );

      const mailtoLink =
        "mailto:bedelzijeanregis@gmail.com" +
        `?subject=${subject}` +
        `&body=${emailBody}`;

      if (formSuccess) {
        formSuccess.textContent =
          "Votre demande est prête à être envoyée depuis votre messagerie.";
        formSuccess.classList.add("show");
      }

      window.location.href = mailtoLink;
    });
  }


  /* =================================
     ANNÉE AUTOMATIQUE DU FOOTER
  ================================= */

  const footerParagraphs = document.querySelectorAll(".footer p");

  const footerYear = Array.from(footerParagraphs).find(
    (paragraph) => paragraph.textContent.includes("2026")
  );

  if (footerYear) {
    footerYear.textContent =
      `© ${new Date().getFullYear()} King Service. Tous droits réservés.`;
  }

});