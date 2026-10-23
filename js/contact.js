/* ==========================================================
   Contact form validation
   Rules:
   1. No field may be empty
   2. Email must have a valid format
   3. Phone number must contain only digits
   ========================================================== */

// ---------- 1. Get the elements ----------
const contactForm = document.getElementById("contact-form");
const nameInput = document.getElementById("name-input");
const emailInput = document.getElementById("email-input");
const phoneInput = document.getElementById("phone-input");
const messageInput = document.getElementById("message-input");
const successMsg = document.getElementById("success-msg");

// ---------- 2. Helper functions to show and clear errors ----------
function showError(input, message) {
  document.getElementById(input.id.replace("-input", "-error")).textContent = message;
  input.classList.add("invalid");
}

function clearError(input) {
  document.getElementById(input.id.replace("-input", "-error")).textContent = "";
  input.classList.remove("invalid");
}

// ---------- 3. One validation function per field ----------
// Each returns true if the field is valid, false if not.
function validateName() {
  if (nameInput.value.trim() === "") {
    showError(nameInput, "Please enter your name.");
    return false;
  }
  clearError(nameInput);
  return true;
}

function validateEmail() {
  const email = emailInput.value.trim();
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (email === "") {
    showError(emailInput, "Please enter your email address.");
    return false;
  }
  if (!emailPattern.test(email)) {
    showError(emailInput, "Please enter a valid email address, like name@example.com.");
    return false;
  }
  clearError(emailInput);
  return true;
}

function validatePhone() {
  const phone = phoneInput.value.trim();
  const digitsOnly = /^[0-9]+$/;

  if (phone === "") {
    showError(phoneInput, "Please enter your phone number.");
    return false;
  }
  if (!digitsOnly.test(phone)) {
    showError(phoneInput, "Phone number must contain digits only (no spaces, letters or symbols).");
    return false;
  }
  clearError(phoneInput);
  return true;
}

function validateMessage() {
  if (messageInput.value.trim() === "") {
    showError(messageInput, "Please type a message.");
    return false;
  }
  clearError(messageInput);
  return true;
}

// ---------- 4. Check fields while the user types ----------
nameInput.addEventListener("blur", validateName);
emailInput.addEventListener("blur", validateEmail);
phoneInput.addEventListener("blur", validatePhone);
messageInput.addEventListener("blur", validateMessage);

// ---------- 5. Check everything when the form is submitted ----------
contactForm.addEventListener("submit", function (event) {
  event.preventDefault();
  successMsg.style.display = "none";

  // Run every check, so all errors show at once
  const results = [
    validateName(),
    validateEmail(),
    validatePhone(),
    validateMessage()
  ];

  const allValid = results.every(function (result) {
    return result === true;
  });

  if (allValid) {
    successMsg.textContent =
      "Thank you, " + nameInput.value.trim() + "! Your message has been validated successfully.";
    successMsg.style.display = "block";
    contactForm.reset();
  }
});