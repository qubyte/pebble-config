(function () {
  'use strict';

  // Used for validation.
  var canHavePattern = ['text', 'search', 'url', 'tel', 'email', 'password'];
  var canHaveMinMaxStep = ['range', 'number', 'date', 'month', 'week', 'datetime', 'datetime-local', 'time'];
  var canHaveMaxLength = ['text', 'search', 'url', 'tel', 'email', 'password'];

  // Hunt for the form-definition query parameter and decode and parse it.
  var formDefinition = (function () {
    var searchItems = window.location.search.slice(1).split('&');

    for (var i = 0, len = searchItems.length; i < len; i++) {
      var encodedKeyVal = searchItems[i].split('=');

      if (encodedKeyVal[0] === 'form-definition') {
        return JSON.parse(decodeURIComponent(encodedKeyVal[1]));
      }
    }
  }());

  // Stop here if no definition was found.
  if (!formDefinition) {
    throw new Error('No form definition found in search string');
  }

  // This will be appended to the body later.
  var $form = document.createElement('form');

  function createAndAppendFormItem(formItem, index) {
    var $container = document.createElement('div');
    var $label = document.createElement('label');
    var $input = document.createElement('input');

    var inputId = 'form-item-' + index;
    var type = (formItem.type || 'text').trim().toLowerCase();

    $label.htmlFor = inputId;
    $label.textContent = formItem.name;
    $input.id = inputId;
    $input.type = formItem.type;
    $input.dataset.name = formItem.name;
    $input.required = !!formItem.required;

    if (canHavePattern.indexOf(type) !== -1 && typeof formItem.pattern === 'string') {
      $input.pattern = formItem.pattern;
    }

    if (canHaveMinMaxStep.indexOf(type) !== -1) {
      if (typeof formItem.max === 'number') {
        $input.max = formItem.max;
      }

      if (typeof formItem.min === 'number') {
        $input.min = formItem.min;
      }

      if (formItem.step && formItem.step === 'number') {
        $input.step = formItem.step;
      }
    }

    if (canHaveMaxLength.indexOf(type) !== -1 && formItem.maxLength > 0) {
      $input.maxLength = formItem.maxLength;
    }

    $container.appendChild($label);
    $container.appendChild($input);
    $form.appendChild($container);
  }

  function createAndAppendSaveButton() {
    var $buttonContainer = document.createElement('div');
    $buttonContainer.className = 'button-container';

    var $button = document.createElement('button');
    $button.textContent = 'save';

    $buttonContainer.appendChild($button);
    $form.appendChild($buttonContainer);
  }

  function formSubmitHandler(evt) {
    evt.preventDefault();

    var data = {};
    var inputs = $form.getElementsByTagName('input');

    for (var i = 0, len = inputs.length; i < len; i++) {
      data[inputs[i].dataset.name] = inputs[i].value;
    }

    // Pebble uses this to pass data to itself. You'll need to decode and parse.
    window.location.href = 'pebblejs://close#' + encodeURIComponent(JSON.stringify(data));
  }

  formDefinition.forEach(createAndAppendFormItem);
  createAndAppendSaveButton();
  $form.addEventListener('submit', formSubmitHandler);

  document.body.appendChild($form);
}());
