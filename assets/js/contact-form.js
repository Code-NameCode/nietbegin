/*
 * Contact form delivery for NietBegin Stables.
 * Same behaviour as the APJ Capital enquiry form: the submit event is
 * intercepted in the capture phase (retiring any demo handler in site.js),
 * validated, then posted as JSON to the forms backend.
 */
(function () {
  'use strict';

  // Address of the contact backend created in DirectAdmin's "Setup Node.js App"
  // (the application URL, plus /v1/forms/nietbegin-stables). Update once live.
  var FORM_ENDPOINT = 'https://report.goodstuffdesigns.co.za/v1/forms/nietbegin-stables';
  var FALLBACK_HTML = 'Your enquiry could not be sent just now. Please try again, use <a href="https://wa.me/27827828761">WhatsApp</a>, or call 082 782 8761.';

  var form = document.querySelector('[data-contact-form]');
  if (!form) return;
  var status = form.querySelector('[data-form-status]');
  var submitButton = form.querySelector('button[type="submit"]');
  var submitLabel = submitButton ? submitButton.querySelector('[data-submit-label]') : null;

  // Preselect the enquiry type from /contact/?type=yard-visit style links.
  var params = new URLSearchParams(window.location.search);
  var enquiryType = form.elements.namedItem('enquiry_type');
  var allowedTypes = ['lessons', 'stabling', 'horse-sales', 'yard-visit', 'other'];
  if (enquiryType && allowedTypes.indexOf(params.get('type')) !== -1) {
    enquiryType.value = params.get('type');
  }

  function say(message, kind) {
    status.className = 'form-status' + (kind ? ' is-' + kind : '');
    status.textContent = message;
  }

  function sayHtml(html, kind) {
    status.className = 'form-status' + (kind ? ' is-' + kind : '');
    status.innerHTML = html;
  }

  function value(name) {
    var field = form.elements.namedItem(name);
    return field ? String(field.value).trim() : '';
  }

  function undeliverable() {
    sayHtml(FALLBACK_HTML, 'error');
  }

  document.addEventListener('submit', function (event) {
    if (event.target !== form) return;
    event.preventDefault();
    event.stopImmediatePropagation();

    if (!form.checkValidity()) {
      form.reportValidity();
      say('Please complete the highlighted fields before sending your enquiry.', 'error');
      return;
    }

    // Honeypot: silently drop bot submissions.
    if (value('website')) return;

    if (form.dataset.sending === 'true') return;
    form.dataset.sending = 'true';
    if (submitButton) submitButton.disabled = true;
    if (submitLabel) submitLabel.textContent = 'Sending enquiry\u2026';
    form.elements.namedItem('page_url').value = window.location.href;
    say('Sending your enquiry\u2026');

    fetch(FORM_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fields: {
          name: value('from_name'),
          email: value('reply_to'),
          phone: value('phone'),
          enquiry_type: value('enquiry_type'),
          message: value('message'),
          page_url: value('page_url'),
          privacy_consent: value('privacy_consent')
        },
        honeypot: value('website')
      })
    }).then(function (response) {
      if (response.status === 202) {
        say('Thank you. Your enquiry has been sent to the NietBegin team: we will be in touch soon.', 'success');
        form.reset();
      } else if (response.status === 429) {
        say('Too many enquiries from this connection right now. Please wait a little and try again.', 'error');
      } else if (response.status === 400) {
        say('Some details could not be accepted. Please check your entries and try again.', 'error');
      } else {
        undeliverable();
      }
    }).catch(undeliverable).finally(function () {
      form.dataset.sending = 'false';
      if (submitButton) submitButton.disabled = false;
      if (submitLabel) submitLabel.textContent = 'Send my enquiry';
      status.focus();
    });
  }, true);
})();
