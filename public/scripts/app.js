/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */
'use strict';
// When the document has finished loading proceed with the callback function.
$(document).ready(() => {

  // This function is responsible for creating the html of each new tweet given
  // the user's name, handle, avatar, tweet context and the date of creation.
  const createTweetElement = (data) => {

    // The e function is an escape function used to escape the inputted data
    // from cross site scripting.
    const e = (str) => {
    	const div = document.createElement('div');
      div.appendChild(document.createTextNode(str));
      return div.innerHTML;
    }
      // Each new tweet is added to the html document before the older tweets
      // that way the newest tweets are seen at the top.
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

  // This function is responsible for adding the html to index.html for all
  // the tweets stored in the database.
  const renderTweets = (tweets) => {
    for (const tweet of tweets) {
      createTweetElement(tweet);
    }
  }

  // This function actually loads the tweets onto the page with an ajax GET
  // request, if the tweets are successfully retrieved then they are rendered
  // on the page.
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

  // When the submit button on the form with the class of new tweet is clicked,
  // the default post request is prevented. To account for white spaces, the
  // value of the text area is trimmed using .trim(). Then the elements containing
  // a class of error are removed. If the tweet is over 140 characters or has no
  // content (If tweet contains only spaces it is considered no content) then an
  // error message appears with the class of error. If the tweet has content less
  // than or equal to 140 characters, the value of the text area is then set to
  // the trimmed text value that way the data sent to the database doesn't
  // contain extra white spaces. An ajax post request takes place to post the
  // data to the database, then a get request takes place to create the tweet
  // in html that was just added to the database. The text area becomes empty
  // and the counter resets.
  $(".new-tweet form input[value=Tweet]").on('click', (event) => {
    event.preventDefault();

    const textarea = $(".new-tweet form textarea[name=text]")
    const trimmed_text = textarea.val().trim();

    $('.error').remove();
    if (textarea.val().length > 140) {
      $('.new-tweet form').after(`<p class="error">Tweet needs to be less than 140 characters</p>`);
    } else if (!trimmed_text) {
      $('.new-tweet form').after(`<p class="error">Tweet needs content</p>`);
    } else {
      textarea.val(trimmed_text);
      $.ajax({
        method: 'POST',
        url: '/tweets',
        data: textarea.serialize(),
      })
      $.ajax({
        method: 'GET',
        url: '/tweets',
        success: (response) => {
          createTweetElement(response[response.length - 1]);
        }
      })
      textarea.val('');
      $(".new-tweet form .counter").text(140);
    }
  });

  // When the button with the id of toggle is clicked the default link reference
  // is prevented and the form with the class of new-tweet is toggled up and down
  // when the form is toggled, the textarea is automatically selected using the
  // .focus() method.
  $("#toggle").on('click', (event) => {
    event.preventDefault();
    $(".new-tweet").slideToggle(() => {
      $(".new-tweet form textarea[name=text]").focus();
    });
  })
});
