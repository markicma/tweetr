'use strict';
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
