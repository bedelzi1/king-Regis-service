document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;

  const loader = document.getElementById("loader");
  const loadProgress = document.getElementById("load-progress");
  const loadPercent = document.getElementById("load-percent");

  if (loader && loadProgress && loadPercent) {
    const startLoading = () => {
      const startedAt = performance.now();
      const duration = 1000;
      loadProgress.value = 0;
      loadPercent.textContent = "0%";

      const intervalId = setInterval(() => {
        const progress = Math.min(
          ((performance.now() - startedAt) / duration) * 100,
          100
        );

        loadProgress.value = Math.round(progress);
        loadPercent.textContent = `${Math.round(progress)}%`;

        if (progress < 100) {
          return;
        }

        clearInterval(intervalId);
        loader.classList.add("complete");
        setTimeout(() => {
          body.classList.add("page-loaded");
          loader.remove();
        }, 350);
      }, 50);
    };

    if (document.readyState === "complete") {
      startLoading();
    } else {
      window.addEventListener("load", startLoading, { once: true });
    }
  } else {
    body.classList.add("page-loaded");
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
     FILTRES DES RÉALISATIONS
  ================================= */

  const filterButtons = document.querySelectorAll(".filter-button");
  const projectCards = document.querySelectorAll(".project-card");
  const emptyProjectsMessage = document.getElementById("projects-empty-state");

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const selectedFilter = button.dataset.filter;

      filterButtons.forEach((item) => {
        item.classList.remove("active");
        item.setAttribute("aria-pressed", "false");
      });

      button.classList.add("active");
      button.setAttribute("aria-pressed", "true");

      projectCards.forEach((card) => {
        const cardCategory = card.dataset.category;

        const shouldShow =
          selectedFilter === "all" ||
          selectedFilter === cardCategory;

        card.classList.toggle("hide", !shouldShow);

      });

      if (emptyProjectsMessage) {
        const hasVisibleProjects = Array.from(projectCards).some(
          (card) => !card.classList.contains("hide")
        );
        emptyProjectsMessage.hidden = hasVisibleProjects;
      }
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
    FORMULAIRE : PRÉPARATION EMAIL
  ================================= */

  const auditForm = document.getElementById("audit-form");
  const formSuccess = document.getElementById("form-success");

  if (auditForm) {
    const emailInput = document.getElementById("email");
    const whatsappPhone = document.getElementById("whatsapp-phone");
    const emailGroup = document.getElementById("email-group");
    const whatsappGroup = document.getElementById("whatsapp-group");
    const contactMethodInputs = auditForm.querySelectorAll(
      'input[name="contact-method"]'
    );

    const updateContactMethod = () => {
      const selectedMethod = auditForm.querySelector(
        'input[name="contact-method"]:checked'
      )?.value;
      const useWhatsApp = selectedMethod === "whatsapp";

      emailGroup.hidden = useWhatsApp;
      emailInput.required = !useWhatsApp;
      whatsappGroup.hidden = !useWhatsApp;
      whatsappPhone.required = useWhatsApp;
    };

    contactMethodInputs.forEach((input) => {
      input.addEventListener("change", updateContactMethod);
    });
    updateContactMethod();

    whatsappPhone.addEventListener("input", () => {
      whatsappPhone.setCustomValidity("");
    });

    auditForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const name =
        document.getElementById("name")?.value.trim();

      const contactMethod = auditForm.querySelector(
        'input[name="contact-method"]:checked'
      )?.value;

      const objectiveElement =
        document.getElementById("objective");

      const message =
        document.getElementById("message")?.value.trim();

      if (
        !name ||
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
        `Nouvelle demande King Service | ${objectiveText}`
      );

      let contactDetails;
      let destination;

      if (contactMethod === "whatsapp") {
        const whatsappDigits = whatsappPhone.value.replace(/\D/g, "");

        if (!/^[1-9]\d{7,14}$/.test(whatsappDigits)) {
          whatsappPhone.setCustomValidity(
            "Entrez un numéro avec indicatif international, par exemple +225 07 00 00 00 00."
          );
          whatsappPhone.reportValidity();
          return;
        }

        contactDetails = `WhatsApp du demandeur : +${whatsappDigits}`;
      } else {
        const email = emailInput.value.trim();
        contactDetails = `E-mail du demandeur : ${email}`;
      }

      const messageBody =
        `Bonjour King Service,

Nom ou entreprise :
${name}

${contactDetails}

Objectif principal :
${objectiveText}

Description du projet et impact attendu :
${message}

Merci.`;

      if (contactMethod === "whatsapp") {
        const whatsappUrl = new URL("https://wa.me/2250564782099");
        whatsappUrl.searchParams.set("text", messageBody);
        destination = whatsappUrl.toString();
      } else {
        const gmailUrl = new URL("https://mail.google.com/mail/");
        gmailUrl.searchParams.set("view", "cm");
        gmailUrl.searchParams.set("fs", "1");
        gmailUrl.searchParams.set("to", "bedelzijeanregis@gmail.com");
        gmailUrl.searchParams.set("su", decodeURIComponent(subject));
        gmailUrl.searchParams.set("body", messageBody);
        destination = gmailUrl.toString();
      }

      if (formSuccess) {
        formSuccess.textContent =
          "Votre demande est prête dans l'application choisie. Confirmez son envoi.";
        formSuccess.classList.add("show");
      }

      window.location.href = destination;
    });
  }


  /* =================================
     ANNÉE AUTOMATIQUE DU FOOTER
  ================================= */

  const footerYear = document.getElementById("footer-year");
  if (footerYear) {
    footerYear.textContent = String(new Date().getFullYear());
  }

});