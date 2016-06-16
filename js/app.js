$(document).ready(function(){

  // each tweet will display full name in addition to username
  var allUsers = {
    sharksforcheap: 'Anthony Phillips',
    mracus: 'Marcus Phillips',
    shawndrost: 'Shawn Drost',
    douglascalhoun: 'Douglas Calhoun',
    visitor: 'Visitor'
  };

  // initial timeline will show tweets from all users
  var currentTimeline = streams.home;

  // keep track of posted tweet count to determine when new-tweets button should display
  var postedTweetCount = 0;

  // hide new-tweets button on initial view
  $('.view-new-tweets').hide();

  // use timeago to display human-friendly timestamp
  $('time.timeago').timeago();

  var addTweets = function() {
    $('.timeline').empty();

    // if coming from a view where new-tweets button was showing, hide button
    $('.view-new-tweets').slideUp('slow');

    if (currentTimeline === streams.home) {
      // message input field is available when viewing timeline for all users
      $('.message-input').show();
      // back-to-all button only appears on indivial user timelines
      $('.back-to-all').hide();
    }

    // loop through array of tweets and add each tweet as list item
    /* NOTE: I plan to come back later and change this to display fewer tweets at a time, and add a 'view more' button at bottom of list */
    for (var i = 0; i < currentTimeline.length; i++) {
      var tweet = currentTimeline[i];
      var $tweet = $('<li></li>');

      // convert time to IOS string so timeago will work
      var time = tweet.created_at.toISOString();

      $tweet.html('<h3><span class="full-name">' + allUsers[tweet.user] + '</span> @' + tweet.user + '</h3><time class="timeago" datetime="' + time + '"></time><p class="message">' + tweet.message + '</p>');

      $('.timeline').prepend($tweet);
    }

    // target ul to make timeago work on generated content
    $('ul').find('time.timeago').timeago();

    // return posted tweet count to use for calculating number of new tweets
    postedTweetCount = currentTimeline.length;
    return postedTweetCount;
  };

  addTweets();

  // display number of new tweets since last newTweet function call
  setInterval(function() {
    var newTweetCount = currentTimeline.length - postedTweetCount;

    if (newTweetCount > 0) {
      var buttonText = newTweetCount > 1 ? ' new tweets' : ' new tweet';

      $('.view-new-tweets').text(newTweetCount + ' ' + buttonText).slideDown('slow');
    }
  }, 2000);

  $('.view-new-tweets').on('click', addTweets);

  // show tweets for all users
  $('.back-to-all').on('click', function() {
    currentTimeline = streams.home;
    addTweets();
  });

  // when full name or username is clicked, show tweets for that user
  $('ul').on('click', 'h3', function() {

    // get index of @ symbol to slice username only (username is property name); do not want full name and @ symbol that preceeds actual username
    var indexOfSymbol = ($(this).html()).indexOf('@');
    var currentUser = $(this).html().slice(indexOfSymbol + 1);
    currentTimeline = streams.users[currentUser];

    $('.view-new-tweets').hide();

    // back-to-all button takes user back to timeline showing all tweets
    $('.back-to-all').slideDown('slow');

    // show message input field on visitor's timeline view, but not on other individual user timelines
    if (currentUser === 'visitor') {
      $('.message-input').show();
    } else {
      $('.message-input').hide();
    }
    addTweets();
  });

  // create visitor property so user can tweet
  window.visitor = 'visitor';
  streams.users.visitor = [];

  // clear placeholder text on focus
  $('.message-input').on('focus', function() {
    $(this).attr('placeholder', '');
  });

  // add different placeholder text on focusout
  $('.message-input').on('focusout', function() {
    $(this).attr('placeholder', 'Tweet here, please!');
  });

  // handle user message
  $('.message-input').on('keypress', function(event) {
    var message = $('.message-input').val();

    // verify that a message was typed and that enter key was pressed
    if (message && event.which === 13) {
      writeTweet(message);

      addTweets();

      // clear message from input field and add new placeholder text
      $('.message-input').val('').attr('placeholder', 'Tweet again?');
    }
  });

  // animate clouds in background
  var moveClouds = function() {
    $('.cloud-container').prepend('<img class="cloud cloud-1" src="img/cloud.svg" alt="cloud"><img class="cloud cloud-2" src="img/cloud.svg" alt="cloud">');

    $('.cloud-1').css({"top": "300px", "right": "-300px"}).animate({
      right: "+=2600px"
    }, 30000, 'linear');

    $('.cloud-2').css({"top": "-50px", "right": "-800px"}).animate({
      right: "+=2600px"
    }, 30000, 'linear');
  };

  moveClouds();
  setInterval(moveClouds, 14000);

});