/* ==========================================================================
   ZERU NATION - CONTACT FORM VALIDATION & EMAIL SUBMISSION (js/contact.js)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const contactForm = document.getElementById('contactForm');
  const alertContainer = document.getElementById('form-alert-container');
  const submitBtn = document.getElementById('submitBtn');

  if (!contactForm) return;

  contactForm.addEventListener('submit', async function (event) {
    event.preventDefault();
    event.stopPropagation();

    // Reset previous alerts
    alertContainer.innerHTML = '';

    // Check Bootstrap HTML5 Validation
    if (!contactForm.checkValidity()) {
      contactForm.classList.add('was-validated');
      showAlert('danger', 'Please fill out all required fields correctly before submitting.');
      return;
    }

    contactForm.classList.add('was-validated');

    // Show Loading State on Submit Button
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin me-2"></i>Sending...';

    // Prepare Form Data payload
    const formData = new FormData(contactForm);

    try {
      // Post to Web3Forms Free API Engine
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      if (response.status === 200) {
        // Success Alert
        showAlert('success', '<strong>Thank you!</strong> Your message has been sent successfully to Zeru Nation. We will respond shortly.');
        contactForm.reset();
        contactForm.classList.remove('was-validated');
      } else {
        // API Error Alert
        showAlert('warning', result.message || 'Something went wrong. Please try again later.');
      }
    } catch (error) {
      // Network Error Alert
      console.error('Submission Error:', error);
      showAlert('danger', 'Network error. Please check your internet connection and try again.');
    } finally {
      // Restore Button State
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnText;
    }
  });

  // Helper Function for Bootstrap Glass Alerts
  function showAlert(type, message) {
    const icon = type === 'success' ? 'fa-circle-check' : 'fa-triangle-exclamation';
    alertContainer.innerHTML = `
      <div class="alert alert-${type} alert-dismissible fade show glass-card border-0 mb-4" role="alert">
        <i class="fa-solid ${icon} me-2"></i>${message}
        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>
    `;
  }
});