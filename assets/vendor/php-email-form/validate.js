/**
 * PHP Email Form Validation - v3.10
 * URL: https://bootstrapmade.com/php-email-form/
 * Author: BootstrapMade.com
 */
document.addEventListener('DOMContentLoaded', function () {
  "use strict";

  let forms = document.querySelectorAll('.php-email-form');

  forms.forEach(function(e) {
    e.addEventListener('submit', function(event) {
      event.preventDefault();

      let thisForm = this;
      let action = thisForm.getAttribute('action');
      let recaptcha = thisForm.getAttribute('data-recaptcha-site-key');

      console.log(action); // Debugging line to check action value

      if (!action) {
        displayError(thisForm, 'The form action property is not set!');
        return;
      }

      thisForm.querySelector('.loading').classList.add('d-block');
      thisForm.querySelector('.error-message').classList.remove('d-block');
      thisForm.querySelector('.sent-message').classList.remove('d-block');

      let formData = new FormData(thisForm);

      if (recaptcha) {
        if (typeof grecaptcha !== "undefined") {
          grecaptcha.ready(function() {
            try {
              grecaptcha.execute(recaptcha, { action: 'php_email_form_submit' })
                .then(token => {
                  formData.set('recaptcha-response', token);
                  php_email_form_submit(thisForm, action, formData);
                });
            } catch (error) {
              displayError(thisForm, error);
            }
          });
        } else {
          displayError(thisForm, 'The reCaptcha javascript API url is not loaded!');
        }
      } else {
        php_email_form_submit(thisForm, action, formData);
      }
    });
  });

  function php_email_form_submit(thisForm, action, formData) {
    fetch(action, {
      method: 'POST',
      body: formData,
      headers: { 'X-Requested-With': 'XMLHttpRequest' }
    })
    .then(response => {
      thisForm.querySelector('.loading').classList.remove('d-block');
      thisForm.querySelector('.error-message').classList.remove('d-block');

      if (response.ok) {
        // If the response is OK, show the success message
        thisForm.querySelector('.sent-message').classList.add('d-block');
      } else {
        // If the response is not OK, throw an error
        throw new Error('Form submission failed. Please try again later.');
      }
    })
    .catch((error) => {
      displayError(thisForm, error);
    });
  }

  function displayError(thisForm, error) {
    thisForm.querySelector('.loading').classList.remove('d-block');
    thisForm.querySelector('.sent-message').classList.remove('d-block');
    thisForm.querySelector('.error-message').innerHTML = error.message; // Display the error message
    thisForm.querySelector('.error-message').classList.add('d-block');
  }

});