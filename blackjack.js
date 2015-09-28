// constructor function for playing cards
function Card(rank, suit) {
  this.rank = rank;
  this.suit = suit;
  this.backgroundPos = this.backgroundPosition();
};

// adding a backgroundPosition() method to the Card object
// so that I can access the position later, for the sprite sheet
Card.prototype.backgroundPosition = function() {
  var suits = ["clubs", "diamonds", "hearts", "spades"];
  var ranks = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];

  suitOffset = -124 * suits.indexOf(this.suit) + "px";
  rankOffset = -84 * ranks.indexOf(this.rank) + "px";

  return rankOffset + " " + suitOffset;
}

// deck object: just needs to create a new deck and then rearrange the objects in the array so that it "shuffles" the deck as well
var deck = {
  cards: [],
  suits: ["clubs", "diamonds", "hearts", "spades"],
  ranks: ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"],

  createDeck: function() {
    for (var i = 0; i < this.ranks.length; i++) {
      for (var j = 0; j < this.suits.length; j++) {
        var newCard = new Card(this.ranks[i], this.suits[j]);

        this.cards.push(newCard);
      }
    }
  },

  shuffleDeck: function() {
    for (var k = 0; k < this.cards.length; k++) {
        var temp = this.cards[k];
        var random = Math.floor(Math.random() * this.cards.length + 1);

        this.cards[k] = this.cards[random];
        this.cards[random] = temp;
    }

    for (var i = 0; i < this.cards.length; i++) {
      if (!this.cards[i]) {
        this.cards.splice(i, 1);
      }
    }
  },
}

// object to keep track of the bankroll, and also accept user input for player name and bankroll amount
var bankRoll = {
  totalCash: 0,
  playerName: "",

  initializeBankRoll: function() {
    this.playerName = prompt("What's your name?");
    $('.player-name').text("Player name: " + this.playerName);

    this.totalCash = Number(prompt("How much money do you have?"));

    if (this.totalCash == "") {
      this.totalCash = 100;
      $('.total-cash').html("Total cash: $" + this.totalCash.toString());
    } else {
        $('.total-cash').html("Total cash: $" + this.totalCash.toString());
    }

    alert("Enter your bet before cards are dealt, otherwise your bet will be $5!");
  },

  // update the view as well
  updateBankRollView: function() {
    $('.total-cash').html("Total cash: $" + this.totalCash.toString());
  }
}

// massive game object to hold all of the things we'll need to play through the game
var game = {
  // the basics
  dealerCards: [],
  playerCards: [],
  bet: 5,
  dealerTotal: 0,
  playerTotal: 0,

  // boolean values to prevent multiple blackjack alerts
  playerBlackjack: false,
  dealerBlackjack: false,

  // boolean value to confirm when player presses "stand" so that the dealer's card total can be revealed
  standPressed: false,

  // boolean values to tell when someone has an ace
  dealerAce: false,
  playerAce: false,

  //in-game alerts that will be appended under certain conditions
  $dealerBJAlert: $('<div class="bj-alert">BLACKJACK FOR DEALER!!</div>'),
  $playerBJAlert: $('<div class="bj-alert">BLACKJACK FOR PLAYER!!</div>'),
  $dealerWinsAlert: $('<div class="bj-alert">DEALER WINS!</div>'),
  $playerBustAlert: $('<div class="bj-alert">BUST! YOU LOSE!</div>'),
  $drawAlert: $('<div class="bj-alert">PUSH!</div>'),
  $playerWinsAlert: $('<div class="bj-alert">YOU WIN! CONGRATS!</div>'),
  $dealerBustAlert: $('<div class="bj-alert">DEALER BUSTS! YOU WIN!</div>'),
  $pennilessAlert: $('<div class="bj-alert">OH NO!! YOU ARE PENNILESS!!</div>'),

  // some more jquery elements I want to keep handy
  $dealerCardsSection: $('.dealer-cards'),
  $playerCardsSection: $('.player-cards'),
  $dealerTotal: $('.dealer-total'),
  $playerTotal: $('.player-total'),
  $deal: $('#deal-button'),
  $hitButton: $('<button class="hit-button">HIT</button>'), //haha shit button
  $standButton: $('<button class="stand-button">STAND</button></br>'),
  $gameOver: $('<img class="game-over-image" src="images/game-over.png">'),
  $resetButton: $('<button class="reset-button">RESET</button>'),

  // let's get it started!
  initializeGame: function () {
    this.setListeners();

    deck.createDeck();
    deck.shuffleDeck();

    // doing this allowed the elements on the page to load before the prompts for player name / bankroll appear
    setTimeout(function() {
      bankRoll.initializeBankRoll();
    }, 500);

    // wanted to be able to switch the music to game over music, and then have this original youtube embed appended again, every time the game is restarted, but having trouble. Something to come back to..
    // $('body').append('<embed height="0" width="0" src="http://www.youtube.com/embed/yaWkjUKSyLA?autoplay=1&loop=1" />';
  },

  setListeners: function() {
    // when the deal button is pressed..
    this.$deal.on("click", function(e) {
      game.submitBet();
      game.dealCards();
      game.addUpDealtCards();
      game.appendHitStandButtons();
    });
  },

  resetGame: function () {
    // using initializeGame() would result in two setListeners() being called, and thus four cards in the first hand dealt after a game over / reset
    // made this resetGame() function instead.

    deck.createDeck();
    deck.shuffleDeck();

    //doing this allowed the elements on the page to load before the prompts for player name / bankroll appear
    setTimeout(function() {
      bankRoll.initializeBankRoll();
    }, 500);
  },

  // conditions for the player submitting their bet
  submitBet: function() {
    if ($('#player-bet').val() > bankRoll.totalCash) {
      alert("You don't have enough cash. Your bet has been set to your remaining amount of cash.");
      game.bet = bankRoll.totalCash;
      $('#player-bet').val(bankRoll.totalCash);
    } else if (bankRoll.totalCash < 5) {
        alert("Wow, you're not doing so well. Minimum bet is $5, but we'll let you play with what you've got.");
        game.bet = bankRoll.totalCash;
        $('#player-bet').val(bankRoll.totalCash);
    } else if ($('#player-bet').val() < 0) {
        alert("You cannot input a negative bet.");
        game.bet = 5;
        $('#player-bet').val("5");
    } else if ($('#player-bet').val() == "") {
        game.bet = 5;
        $('#player-bet').val("5");
    } else {
        game.bet = $('#player-bet').val();
    }
  },

  dealCards: function() {
    // For initial deal only. If dealer or player hit and there are no cards left in the deck, we will recreate and shuffle the deck then.

    if (deck.cards.length < 4) {
      deck.createDeck();
      deck.shuffleDeck();
    }

    for (var i = 0; i < 2; i++) {
      var newPlayerCard = deck.cards[0];
      this.playerCards.push(newPlayerCard);
      deck.cards.shift();
      this.playerCardsView(newPlayerCard);

      var newDealerCard = deck.cards[0];
      this.dealerCards.push(newDealerCard);
      deck.cards.shift();
      this.dealerCardsView(newDealerCard);
    }

    $('.dealer-cards .card-in-play:first-of-type').css("background-position", "0 0");

    this.$deal.off();
  },

  dealerCardsView: function(card) {
    // was using this to see what the cards were before I utilized the sprite sheet
    // var cardView = $('<div class="card-in-play"><h2>' + card.rank + '</h2><h2>' + card.suit + '</h2></div>');

    var $dCardView = $('<div class="card-in-play"></div>');
    $dCardView.css("background-position", card.backgroundPos);

    this.$dealerCardsSection.append($dCardView);
  },

  playerCardsView: function(card) {
    // var cardView = $('<div class="card-in-play"><h2>' + card.rank + '</h2><h2>' + card.suit + '</h2></div>');
    // was using this to see what the cards were before I utilized the sprite sheet

    var $cardView = $('<div class="card-in-play"></div>');
    $cardView.css("background-position", card.backgroundPos);

    this.$playerCardsSection.append($cardView);
  },

  addUpDealtCards: function() {
    // set the totals to 0 just in case..
    this.dealerTotal = 0;
    this.playerTotal = 0;

    // originally went through these two arrays from start to finish, but had to traverse them backwards in case there's an ace in the [0] position
    // e.g., a starting hand of A + 6 would be 17, but if you draw a J next it should still be 17.

    for (var b = this.dealerCards.length - 1; b >= 0; b--) {
      if (this.dealerCards[b].rank == "A") {
        this.dealerAce = true;

        if (this.dealerTotal > 10) {
          this.dealerTotal += 1; // setting the ace equal to 1 instead of 11, right off the bat, to avoid being in a situation later on where you'd have to subtract 10 from a hand
        } else {
            this.dealerTotal += 11;
        }
      } else if (this.dealerCards[b].rank == "J" ||
                 this.dealerCards[b].rank == "Q" ||
                 this.dealerCards[b].rank == "K") {
          this.dealerTotal += 10;
      } else {
          this.dealerTotal += Number(this.dealerCards[b].rank);
      }
    }

    for (var c = this.playerCards.length - 1; c >= 0; c--) {
      if (this.playerCards[c].rank == "A") {
        this.playerAce = true;

        if (this.playerTotal > 10) {
          this.playerTotal += 1;
        } else {
            this.playerTotal += 11;
        }
      } else if (this.playerCards[c].rank == "J" ||
                 this.playerCards[c].rank == "Q" ||
                 this.playerCards[c].rank == "K") {
          this.playerTotal += 10;
      } else {
          this.playerTotal += Number(this.playerCards[c].rank);
      }
    }

    // update the dealer total view--make it "??" if the user hasn't settled their hand yet, and show the numeric value otherwise
    if (this.standPressed) {
      this.$dealerTotal.text("Dealer total: " + this.dealerTotal.toString());
    } else {
        this.$dealerTotal.text("Dealer total: ??");
    }

    // update the player total view
    this.$playerTotal.text("Player total: " + this.playerTotal.toString());
  },

  //create hit and stand buttons, apppend to player-cards div
  appendHitStandButtons: function() {
    $('.play-buttons').append(this.$hitButton);
    $('.play-buttons').append(this.$standButton);

    // set listener for the hit button, run the necessary functions
    this.$hitButton.on("click", function(e) {
      game.hitPlayer();
      game.addUpDealtCards();
      game.checkPlayerBust();
    });

    // set listener for the stand button too
    this.$standButton.on("click", function(e) {
      //can now display the dealer's total score
      game.standPressed = true;
      game.$dealerTotal.text("Dealer total: " + game.dealerTotal.toString());

      // reveal dealer's first card
      game.revealDealerFirstCard(game.dealerCards[0]);

      // playerTotal is now set. Have to compare the hands.
      // if the dealer's hand is higher than the player's, the dealer doesn't even have to hit once
      game.compareHands();

      //hit dealer if total < 17, and while player still has cards (so that this doesn't happen even after dealer wins or busts)
      while (game.dealerTotal < 17 && game.playerTotal > 0) {
        alert("The dealer hits!");

        game.hitDealer();
        game.addUpDealtCards();
        game.checkDealerBust();

        if (game.dealerTotal > 0 && game.playerTotal > 0) { // just to make sure this doesn't result in erroneous "push" notifications
          game.compareHands();
        }
      }
    });
  },

  // create the new jquery element for the dealer's first card, and use the card object's backgroundPos value to map to correct location on the sprite sheet
  revealDealerFirstCard: function(card) {
    var $dealerFirstCard = $('.dealer-cards > .card-in-play:first-of-type');

    $dealerFirstCard.css("background", "url(images/CardsSpriteSheet.png)");
    $dealerFirstCard.css("background-position", card.backgroundPos);
    $dealerFirstCard.css("background-size", "1300% 400%");
  },

  // give the player a card!
  hitPlayer: function() {
    // in case the deck is getting low, we'll create and shuffle a new deck so an undefined value isn't accidentally pushed into the player cards array
    if (deck.cards.length < 10) {
      deck.createDeck();
      deck.shuffleDeck();
    }

    // now can give the player a new card
    var hitCard = deck.cards[0];
    this.playerCards.push(hitCard);
    deck.cards.shift();
    this.playerCardsView(hitCard);
  },

  checkPlayerBust: function() {
    //if the total is above 21, the player loses.

    if (this.playerTotal > 21 && this.playerAce) {
      this.playerTotal -= 10;

      // in case they get a second one
      this.playerAce = false;

    } else if (this.playerTotal > 21) {
        alert("I think you went a little too far there, " + bankRoll.playerName);

        // insert the animation
        $('main').append(this.$playerBustAlert);

        //set a timeout for removing the element so that it's not just sitting there at the bottom of the page
        setTimeout(function() {
          game.$playerBustAlert.remove();
        }, 2500);

        bankRoll.totalCash -= this.bet;
        bankRoll.updateBankRollView();
        this.$hitButton.off();

        this.removeCardsAndDealAgain();
    }
  },

  hitDealer: function() {
    // same as with the player function, need to ensure that the deck doesn't get too low
    if (deck.cards.length < 10) {
      deck.createDeck();
      deck.shuffleDeck();
    }

    var dealerHitCard = deck.cards[0];
    this.dealerCards.push(dealerHitCard);
    deck.cards.shift();
    this.dealerCardsView(dealerHitCard);
  },

  compareHands: function() {
    // first of all, checking to see if either has blackjack..

    // had this in the original conditional, too, but most likely not needed: && this.playerTotal < 21
    if (this.dealerTotal === 21 && this.dealerCards.length === 2 && this.dealerBlackjack == false) {
        this.dealerBlackjack = true; // so this alert won't happen more than once.

        alert("Blackjack for our magnanimous dealer! I swear this isn't rigged..");
        // show dealer Blackjack alert--had this set as a separate function
        this.dealerBlackjackAlert();
    } else if (this.playerTotal === 21 && this.playerCards.length === 2 && this.playerBlackjack == false) {
        this.playerBlackjack = true; // again, to avoid multiple alerts

        alert("Blackjack for you! Bravo!");
        // show player Blackjack alert
        this.playerBlackjackAlert();
    }

    // now just compare the cards
    if (this.dealerTotal > this.playerTotal) {
      alert("Dealer's hand beats the player's--house wins again!");

      // get the animation going
      $('main').append(this.$dealerWinsAlert);

      // set a timeout for removing the element so that it's not just sitting there at the bottom of the page
      setTimeout(function() {
        game.$dealerWinsAlert.remove();
      }, 2500);

      bankRoll.totalCash -= this.bet;
      bankRoll.updateBankRollView();

      this.removeCardsAndDealAgain();
    } else if (this.dealerTotal == this.playerTotal) {
      // have to set rule for when both player and dealer have 21, but one of them is a blackjack...
        if (this.dealerBlackjack == true && this.playerBlackjack == false) {
            alert("Dealer's hand beats the player's--house wins again!");

            // append the animation div
            $('main').append(this.$dealerWinsAlert);

            // set a timeout for removing the element so that it's not just sitting there at the bottom of the page
            setTimeout(function() {
              game.$dealerWinsAlert.remove();
            }, 2500);

            bankRoll.totalCash -= this.bet;
            bankRoll.updateBankRollView();

            this.removeCardsAndDealAgain();
        } else if (this.dealerBlackjack == false && this.playerBlackjack == true) {
            alert("Look at you, " + bankRoll.playerName + "! Congrats!");

            // append the animation div
            $('main').append(this.$playerWinsAlert);

            // set a timeout for removing the element so that it's not just sitting there at the bottom of the page
            setTimeout(function() {
              game.$playerWinsAlert.remove();
            }, 2500);

            bankRoll.totalCash += (this.bet * 1.5);
            bankRoll.updateBankRollView();

            this.removeCardsAndDealAgain();
        } else {
            alert("Ah, a tie. Your bet has been returned to you.");

            // append the animation div
            $('main').append(this.$drawAlert);

            // set a timeout for removing the element so that it's not just sitting there at the bottom of the page
            setTimeout(function() {
              game.$drawAlert.remove();
            }, 2500);

            this.removeCardsAndDealAgain();
        }
    } else if (this.dealerTotal >= 17 && (this.dealerTotal < this.playerTotal)) {
      alert("You did it, " + bankRoll.playerName + "! Congrats!");

      // append the animation div
      $('main').append(this.$playerWinsAlert);

      // set a timeout for removing the element so that it's not just sitting there at the bottom of the page
      setTimeout(function() {
        game.$playerWinsAlert.remove();
      }, 2500);

      bankRoll.totalCash += (this.bet * 1.5);
      bankRoll.updateBankRollView();

      this.removeCardsAndDealAgain();
    }
  },

  // alerts for dealer and player blackjacks, respectively
  dealerBlackjackAlert: function() {
    $('main').append(this.$dealerBJAlert);

    // set a timeout for removing the element so that it's not just sitting there at the bottom of the page
    setTimeout(function() {
      game.$dealerBJAlert.remove();
    }, 2500);
  },

  playerBlackjackAlert: function() {
    $('main').append(this.$playerBJAlert);

    // set a timeout for removing the element so that it's not just sitting there at the bottom of the page
    setTimeout(function() {
      game.$playerBJAlert.remove();
    }, 2500);
  },

  // assuming the player didn't already bust, checking to see if the dealer does
  checkDealerBust: function() {
    if (this.dealerTotal > 21 && this.dealerAce) {
      this.dealerTotal -= 10;

      // in case they get a second one
      this.dealerAce = false;



        // going to find the index for the dealer's ace, if they have one
        // var searchTerm = "A";
        // var index = -1;

        // go through the array of objects and find the index
        // for(var i = 0, len = myArray.length; i < len; i++) {
        //   if (this.dealerCards[i].rank === searchTerm) {
        //     index = i;
        //     break;
        //   }
        // }

        // now, if the A is in the first or last position,
    } else if (this.dealerTotal > 21) {
        alert("The dealer busts! You win by default--hooray!");

        //append the animation div
        $('main').append(this.$dealerBustAlert);

        // set a timeout for removing the element so that it's not just sitting there at the bottom of the page
        setTimeout(function() {
          game.$dealerBustAlert.remove();
        }, 2500);

        bankRoll.totalCash += (this.bet * 1.5);
        bankRoll.updateBankRollView();

        this.removeCardsAndDealAgain();
      }
  },

  // let's start all over!
  removeCardsAndDealAgain: function() {
    // set dealer and player totals to 0, so they don't bust when drawing again.
    this.dealerTotal = 0;
    this.playerTotal = 0;

    // set blackjack and ace boolean values to false again
    this.playerBlackjack = false;
    this.dealerBlackjack = false;
    this.playerAce = false;
    this.dealerAce = false;

    // set stand button boolean back to false, too
    this.standPressed = false;

    // remove the cards from the player and dealer cards arrays
    for (var x = this.playerCards.length - 1; x >= 0; x--) {
      this.playerCards.pop();
    }
    for (var y = this.dealerCards.length - 1; y >= 0; y--) {
      this.dealerCards.pop();
    }

    // remove the card views from both sides as well
    this.removeCardsView();

    // turn the deal button listener back on so we can play again!
    this.setListeners();

    // check to see if player is penniless
    this.isPlayerBroke();
  },

  removeCardsView: function() {
    // remove the card elements from the page
    $('div').remove('.card-in-play');

    // get rid of the hit and stand buttons too
    this.$hitButton.remove();
    this.$standButton.remove();

    // set the text within the input field back to an empty string
    $('#player-bet').val("");

    // reset the card totals views, too
    this.$dealerTotal.text("Dealer total: ");
    this.$playerTotal.text("Player total: ");
  },

  // here we find out if you're really bad at blackjack
  isPlayerBroke: function() {
    if (bankRoll.totalCash <= 0) {
      // append the animation div
      $('main').append(this.$pennilessAlert);

      // set a timeout for removing the element so that it's not just sitting there at the bottom of the page
      setTimeout(function() {
        game.$pennilessAlert.remove();
      }, 2500);

      // and here is where we'll have to trigger the random event at the end of the game
      // for testing
      // var oneInThree = 2;

      // 1 in 3 odds for real game
      var oneInThree = Math.floor(Math.random() * 3) + 1;

      if (oneInThree === 3) {
        var familyMembers = [
          "grandmother",
          "grandfather",
          "great-uncle",
          "step-uncle-in-law",
          "personal trainer",
          "mail carrier",
          "spouse",
          "local barista",
          "estranged brother",
          "separated-at-birth twin",
          "roommate",
          "driver",
          "yoga instructor"
        ];
        var randomSums = [
          100,
          200,
          400000,
          12500,
          9000000,
          20,
          725,
          1,
          50,
          1000000000,
          57,
          6500,
          4
        ];

        var randomIndex = Math.floor(Math.random() * 13) + 1;

        alert("I'm sorry to be the bearer of bad news, but your " + familyMembers[randomIndex] + " has passed away. It was very sudden. But! they've left you the handsome sum of $" + randomSums[randomIndex].toString() + ". Aren't you LUCKY?! In my professional opinion, I'd suggest that you hold off on grieving for now and just go spend your money instead.");

        // bestow this gift of random money upon the player
        bankRoll.totalCash = randomSums[randomIndex];
        bankRoll.updateBankRollView();

      } else {
          // game over--for real this time!
          // tried adding different game over music, to no avail. Something to come back to..
          // $('body embed').remove();
          // $('body').append('<embed height="0" width="0" src="http://www.youtube.com/embed/LE9vGD6JvzA?autoplay=1&loop=1" />';

          // append the two game over animation elements
          $('main').append(this.$gameOver);
          $('main').append(this.$resetButton);

          alert("Press reset to try your luck again.");

          // if the user wants, they can try again.
          this.$resetButton.on("click", function(e) {
            game.$gameOver.remove();
            game.$resetButton.remove();
            game.resetGame();
          });
      }
    }
  }
};

// the one little line that gets the ball rolling
game.initializeGame();
