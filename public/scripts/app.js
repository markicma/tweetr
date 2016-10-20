/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */
'use strict';
$(document).ready(() => {

  const createTweetElement = (data) => {
    const e = (str) => {
    	const div = document.createElement('div');
      div.appendChild(document.createTextNode(str));
      return div.innerHTML;
    }
      const $tweet = $("<article>").addClass('tweet').prependTo("section.tweets");
      $tweet.append(`<header>
                      <img src="${e(data.user.avatars.regular)}"/>
                       <h2>${e(data.user.name)}</h2>
                       <p>${e(data.user.handle)}</p>
                     </header>
                       <main class="content">
                       <p>${e(data.content.text)}</p>
                     </main>
                       <footer class="date">
                       <p>${e(Math.floor((new Date() - new Date(data.created_at)) / 86400000))} days ago</p>
                     </footer>`);
      return $tweet;
  };

  const renderTweets = (tweets) => {
    for (const tweet of tweets) {
      createTweetElement(tweet);
    }
  }

  const loadTweets = () => {
    $.ajax({
      method: 'GET',
      url: '/tweets',
      success: (response) => {
        renderTweets(response);
      }
    })
  }

  loadTweets();

  $(".new-tweet form input[value=Tweet]").on('click', (event) => {
    event.preventDefault();
    $('#less-content, #more-content').remove();
    if ($(".new-tweet form textarea[name=text]").val().length > 140) {
      $('.new-tweet form').after(`<p id="less-content">Tweet needs to be less than 140 characters</p>`);
    } else if (!$(".new-tweet form textarea[name=text]").val()) {
      $('.new-tweet form').after(`<p id="more-content">Tweet needs content</p>`);
    } else {
      $.ajax({
        method: 'POST',
        url: '/tweets',
        data: $(".new-tweet form textarea[name=text]").serialize(),
      })
      $.ajax({
        method: 'GET',
        url: '/tweets',
        success: (response) => {
          createTweetElement(response[response.length - 1]);
        }
      })
      $(".new-tweet form textarea[name=text]").val('');
      $(".new-tweet form .counter").text(140);
    }
  });

  $("#toggle").on('click', (event) => {
    event.preventDefault();
    $(".new-tweet").slideToggle(() => {
      $(".new-tweet form textarea[name=text]").focus();
    });
  })
});
