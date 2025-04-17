/**
 * PHP Email Form Validation - v3.10
 * URL: https://bootstrapmade.com/php-email-form/
 * Author: BootstrapMade.com
 */
(function () {
  "use strict";

  let forms = document.querySelectorAll('.php-email-form');

  forms.forEach(function (e) {
    e.addEventListener('submit', function (event) {
      event.preventDefault(); // Prevent the default form submission

      let thisForm = this;  
      let action = thisForm.getAttribute('action');

      // No need to check action for Netlify forms
      thisForm.querySelector('.loading').classList.add('d-block');
      thisForm.querySelector('.error-message').classList.remove('d-block');
      thisForm.querySelector('.sent-message').classList.remove('d-block');

      let formData = new FormData(thisForm);

      fetch(action, {
        method: 'POST',
        body: formData,
        headers: { 'X-Requested-With': 'XMLHttpRequest' }
      })
      .then(response => {
        thisForm.querySelector('.loading').classList.remove('d-block');
        if (response.ok) {
          thisForm.querySelector('.sent-message').classList.add('d-block');
          thisForm.reset(); // Reset the form fields
          thisForm.querySelector('.sent-message').scrollIntoView({ behavior: 'smooth' }); // Scroll to the success message
          return response.text();
        } else {
          throw new Error('Form submission failed with status: ' + response.status);
        }
      })
      .then(data => {
        thisForm.querySelector('.loading').classList.remove('d-block');
        if (data.trim() === 'OK') {
          thisForm.querySelector('.sent-message').classList.add('d-block');
          thisForm.reset(); // Reset the form fields
          thisForm.querySelector('.sent-message').scrollIntoView({ behavior: 'smooth' }); // Scroll to the success message
        } else {
          throw new Error(data ? data : 'Form submission failed and no error message returned from: ' + action);
        }
      })
      .catch((error) => {
        displayError(thisForm, error);
      });
    });
  });

  function displayError(thisForm, error) {
    thisForm.querySelector('.loading').classList.remove('d-block');
    thisForm.querySelector('.error-message').innerHTML = error;
    thisForm.querySelector('.error-message').classList.add('d-block');
  }

})();