'use strict';
// When the document is ready the callback function takes place
// When a key is lifted from the keyboard, the length of the text area value
// is taken and the counter text becomes 140 - the length of the text in the
// text area. If the length is more than 140 the colour becomes red.
$(document).ready(() => {
  $(".new-tweet textarea").on('keyup', function() {
    const length = $(this).val().length;
    const counter = $(this).siblings(".counter");
    counter.text(140-length);
    if (length > 140) {
      counter.addClass("red");
    } else {
      counter.removeClass("red");
    }
  })
});
