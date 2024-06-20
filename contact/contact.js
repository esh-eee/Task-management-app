document.addEventListener("DOMContentLoaded", function () {
  const contactForm = document.getElementById("contact-form");
  const successMessage = document.getElementById("success-message");
  const errorMessage = document.getElementById("error-message");

  contactForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const formData = new FormData(contactForm);
    const name = formData.get("name");
    const email = formData.get("email");
    const message = formData.get("message");

    if (!validateEmail(email)) {
      alert("Please enter a valid email address.");
      return;
    }

    // Simulate sending the message (you would typically send this to a server)
    setTimeout(() => {
      // Reset form after submitting
      contactForm.reset();
      // Show success message
      successMessage.classList.remove("hidden");
      // Hide success message after 3 seconds
      setTimeout(() => {
        successMessage.classList.add("hidden");
      }, 3000);
    }, 1000);
  });

  function validateEmail(email) {
    const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return pattern.test(email);
  }
});
