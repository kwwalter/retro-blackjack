function Card(rank, suit) {
  this.rank = rank;
  this.suit = suit;
  this.backgroundPos = this.backgroundPosition();
};

Card.prototype.backgroundPosition = function() {
  var suits = ["clubs", "diamonds", "hearts", "spades"];
  var ranks = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];

  suitOffset = -124 * suits.indexOf(this.suit) + "px";
  rankOffset = -84 * ranks.indexOf(this.rank) + "px";

  return rankOffset + " " + suitOffset;
}

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
  },

  updateBankRollView: function() {
    $('.total-cash').html("Total cash: $" + this.totalCash.toString());
  }
}

var game = {
  dealerCards: [],
  playerCards: [],
  bet: 5,
  // playerAceIndex: null,
  // dealerAceIndex: null,
  // playerHasAce: false,
  // dealerHasAce: false,
  $dealerCardsSection: $('.dealer-cards'),
  $playerCardsSection: $('.player-cards'),
  dealerTotal: 0,
  playerTotal: 0,
  $dealerTotal: $('.dealer-total'),
  $playerTotal: $('.player-total'),
  $deal: $('#deal-button'),
  $hitButton: $('<button class="hit-button">HIT</button>'), //haha shit button
  $standButton: $('<button class="stand-button">STAND</button>'),
  $gameOver: $('<img class="game-over-image" src="images/game-over.png">'),

  initializeGame: function () {
    this.setListeners();

    deck.createDeck();
    deck.shuffleDeck();
    bankRoll.initializeBankRoll();

    alert("Enter your bet before cards are dealt, otherwise your bet will be $5!");
  },

  setListeners: function() {
    this.$deal.on("click", function(e) {
      game.submitBet();
      game.dealCards();
      game.addUpDealtCards();
      // game.checkForBlackjack(); //shouldn't run here.
      game.appendHitStandButtons(); //but this needs to run here.
    });
  },

  submitBet: function() {
    if ($('#player-bet').val() > bankRoll.totalCash) {
      alert("You don't have enough cash. Your bet has been set to your remaining amount of cash.");
      game.bet = bankRoll.totalCash;
    } else if ($('#player-bet').val() < 1) {
      alert("Come on buddy, you have to bet at least $1");
      game.bet = 1;
    } else if ($('#player-bet').val() == "") {
      game.bet = 5;
    } else {
      game.bet = $('#player-bet').val();
    }
    console.log("Bet is: ", game.bet);
  },

  dealCards: function() {
    //For initial deal only. If dealer or player hit and there are no cards left in the deck, we will recreate and shuffle the deck then.

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

    // $('.dealer-cards .card-in-play:first-of-type').addClass("background-card");
    // $('.dealer-cards .card-in-play:first-of-type').css("background", "url(images/mario-cards-back-no-bg.png)");
    $('.dealer-cards .card-in-play:first-of-type').css("background-position", "0 0");

    this.$deal.off();
  },

  dealerCardsView: function(card) {
    // var cardView = $('<div class="card-in-play"><h2>' + card.rank + '</h2><h2>' + card.suit + '</h2></div>');
    var $cardView = $('<div class="card-in-play"></div>');
    $cardView.css("background-position", card.backgroundPos);

    this.$dealerCardsSection.append($cardView);
  },

  playerCardsView: function(card) {
    // var cardView = $('<div class="card-in-play"><h2>' + card.rank + '</h2><h2>' + card.suit + '</h2></div>');
    var $cardView = $('<div class="card-in-play"></div>');
    $cardView.css("background-position", card.backgroundPos);

    this.$playerCardsSection.append($cardView);
  },

  addUpDealtCards: function() {
    this.dealerTotal = 0;
    this.playerTotal = 0;

    for (var b = 0; b < this.dealerCards.length; b++) {
      // if (this.dealerCards[b].rank == "A") {
      //   if (this.dealerTotal <= 10) {
      //     this.dealerTotal += 11;
      //   } else {
      //     this.dealerTotal += 1;
      //   }
      // }
      if (this.dealerCards[b].rank == "A") {
        if (this.dealerTotal > 10) {
          this.dealerTotal += 1;
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

    for (var c = 0; c < this.playerCards.length; c++) {
      // if (this.playerCards[c].rank == "A") {
      //   if (this.playerTotal <= 10) {
      //     this.playerTotal += 11;
      //   } else {
      //     this.playerTotal += 1;
      //   }
      // }
      if (this.playerCards[c].rank == "A") {
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

    this.$dealerTotal.text("Dealer total: " + this.dealerTotal.toString());
    this.$playerTotal.text("Player total: " + this.playerTotal.toString());
  },

  checkForBlackjack: function() {
    if ((this.dealerTotal === 21 && this.dealerCards.length === 2) && this.playerTotal < 21) {
      alert("Blackjack for dealer! House wins!");

      // probably dont want this to do this, because then it'll go through
      // the conditionals again and will result in a dealer win, and then
      // a draw. should just alert that it's a blackjack.

      // bankRoll.totalCash -= this.bet;
      // bankRoll.updateBankRollView();
      //
      // this.removeCardsAndDealAgain();
    } else if (this.playerTotal === 21 && this.playerCards.length === 2) {
      alert("Blackjack for you! Bravo!");

      //should keep going here, and eventually get to the dealer's chance to hit, and after that there will be another compare

      // bankRoll.totalCash += (this.bet * 1.5);
      // bankRoll.updateBankRollView();
      //
      // this.removeCardsAndDealAgain();
    }

    //probably don't need this, but need to call appendHitStandButtons() elsewhere.

    // else {
    //   console.log("no blackjacks here!");
    //   this.appendHitStandButtons();
    // }
  },

  appendHitStandButtons: function() {
    //player decides to hit or stand based on current total
    //create hit and stand buttons, apppend to player-cards div

    $('.play-buttons').append(this.$hitButton);
    $('.play-buttons').append(this.$standButton);


    this.$hitButton.on("click", function(e) {
      game.hitPlayer();
      game.addUpDealtCards();
      // game.checkPlayerforAces(); //taking this out for now
      game.checkPlayerBust();
    });

    this.$standButton.on("click", function(e) {
      // reveal dealer's first card -- commented out until i get it working
      game.revealDealerFirstCard(game.dealerCards[0]);

      //playerTotal is now set. have to compare.
      game.compareHands();

      //hit dealer if total < 17, and while player still has cards (so that this doesn't happen even after dealer wins or busts)
      while (game.dealerTotal < 17 && game.playerTotal > 0) {
        //check to see if dealer wins
        alert("dealer hits!");
        game.hitDealer();
        game.addUpDealtCards();
        // game.checkDealerforAces();
        game.checkDealerBust();

        if (game.dealerTotal > 0 && game.playerTotal > 0) {
          game.compareHands();
        }
      }
    });
  },

  revealDealerFirstCard: function(card) {
    var $dealerFirstCard = $('.dealer-cards > .card-in-play:first-of-type');

    $dealerFirstCard.css("background", "url(images/CardsSpriteSheet.png)");
    $dealerFirstCard.css("background-position", card.backgroundPos);
    $dealerFirstCard.css("background-size", "1300% 400%");
  },

  hitPlayer: function() {
    // in case the deck is getting low, so an undefined value isn't pushed into the player cards array

    if (deck.cards.length < 10) {
      deck.createDeck();
      deck.shuffleDeck();
    }

    var hitCard = deck.cards[0];
    this.playerCards.push(hitCard);
    deck.cards.shift();
    this.playerCardsView(hitCard);
  },

  // checkPlayerforAces: function() {
  //   while (this.playerTotal > 21) {
  //     for (var d = 0; d < this.playerCards.length; d++) {
  //       if (this.playerCards[d].rank == "A" && d !== this.playerAceIndex) {
  //         // if (this.playerTotal > 21) {
  //           this.playerTotal -= 10;
  //           this.$playerTotal.text("Player total: " + this.playerTotal.toString());
  //
  //           this.playerAceIndex = d;
  //         // }
  //       }
  //     }
  //   }
  //
  //   console.log("After checking for aces, player total is now", this.playerTotal);
  // },

  //trying again, without the ace index. shouldn't need it.

  checkPlayerforAces: function() {
    while (this.playerTotal > 21) {
      for (var d = 0; d < this.playerCards.length; d++) {
        if (this.playerCards[d].rank == "A") {
          // if (this.playerTotal > 21) {
            this.playerTotal -= 10;
            this.$playerTotal.text("Player total: " + this.playerTotal.toString());
          // }
        }
      }
    }

    console.log("After checking for aces, player total is now", this.playerTotal);
  },

  checkPlayerBust: function() {
    //then, if the total is still above 21, the player loses.

    if (this.playerTotal > 21) {
      alert("Player busts! Sorry, you lose.");
      bankRoll.totalCash -= this.bet;
      bankRoll.updateBankRollView();
      this.$hitButton.off();

      this.removeCardsAndDealAgain();
    } else {
      return;
    }
  },

  hitDealer: function() {
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
    //checking to see if either has blackjack..
    this.checkForBlackjack();

    if (this.dealerTotal > this.playerTotal) {
      alert("Dealer's hand beats the player's--house wins!");

      bankRoll.totalCash -= this.bet;
      bankRoll.updateBankRollView();

      this.removeCardsAndDealAgain();

    } else if (this.dealerTotal == this.playerTotal) {
      alert("the result is a draw--no one wins! Your bet has been returned to you.");

      this.removeCardsAndDealAgain();
    }

    else if (this.dealerTotal >= 17 && (this.dealerTotal < this.playerTotal)) {
      alert("Player wins! Congrats!");
      bankRoll.totalCash += (this.bet * 1.5);
      bankRoll.updateBankRollView();

      this.removeCardsAndDealAgain();
    }
  },

  // checkDealerforAces: function() {
  //   while (this.dealerTotal > 21) {
  //     for (var e = 0; e < this.dealerCards.length; e++) {
  //       if (this.dealerCards[e].rank == "A" && e !== this.dealerAceIndex) {
  //         // if (this.dealerTotal > 21) {
  //           this.dealerTotal -= 10;
  //           this.$dealerTotal.text("Dealer total: " + this.dealerTotal.toString());
  //
  //           this.dealerAceIndex = e;
  //         // }
  //       }
  //     }
  //   }
  //
  //   console.log("After checking for aces, dealer total is now", this.dealerTotal);
  // },

  //trying again without ace index, shouldn't need it
  checkDealerforAces: function() {
    while (this.dealerTotal > 21) {
      for (var e = 0; e < this.dealerCards.length; e++) {
        if (this.dealerCards[e].rank == "A") {
          // if (this.dealerTotal > 21) {
            this.dealerTotal -= 10;
            this.$dealerTotal.text("Dealer total: " + this.dealerTotal.toString());
          // }
        }
      }
    }

    console.log("After checking for aces, dealer total is now", this.dealerTotal);
  },

  checkDealerBust: function() {
    //then, if the total is still above 21, the player loses.
    if (this.dealerTotal > 21) {
      alert("Dealer busts! You win by default--hooray!");
      bankRoll.totalCash += (this.bet * 1.5);
      bankRoll.updateBankRollView();

      this.removeCardsAndDealAgain();
    }
    //   else {
    //   return;
    // }
  },

  removeCardsAndDealAgain: function() {
    //set dealer and player totals to 0, so they don't bust when drawing again.
    this.dealerTotal = 0;
    this.playerTotal = 0;

    //remove the cards from the player and dealer cards arrays
    for (var x = this.playerCards.length - 1; x >= 0; x--) {
      this.playerCards.pop();
    }
    for (var y = this.dealerCards.length - 1; y >= 0; y--) {
      this.dealerCards.pop();
    }
    console.log("Player cards: ", this.playerCards, "Dealer cards: ", this.dealerCards)

    //remove the card views from both sides as well
    this.removeCardsView();

    //turn the deal button listener back on so we can play again!
    this.setListeners();

    //check to see if player is penniless
    this.isPlayerBroke();
  },

  removeCardsView: function() {
    $('div').remove('.card-in-play');
    this.$hitButton.remove();
    this.$standButton.remove();

    $('#player-bet').val("");
    this.$dealerTotal.text("Dealer total: ");
    this.$playerTotal.text("Player total: ");
  },

  isPlayerBroke: function() {
    if (bankRoll.totalCash <= 0) {
      alert("Oh no!! You're penniless!!");

      //and here is where we'll have to trigger the random events
      //1 in 3 odds for real game, but leaving that off for testing.
      // var oneInThree = Math.floor(Math.random() * 3) + 1;

      var oneInThree = 2;

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
          "separated-at-birth twin"
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
          1000000000
        ];

        var randomIndex = Math.floor(Math.random() * 10) + 1;

        alert("I'm sorry to be the bearer of bad news, but your " + familyMembers[randomIndex] + " has passed away. But! they've left you the handsome sum of $" + randomSums[randomIndex].toString() + ". Aren't you lucky? Don't grieve--spend your money here!");

        bankRoll.totalCash = randomSums[randomIndex];
        bankRoll.updateBankRollView();

      } else {
          $('.body').css("background", "black");
          $('.intro-head').remove();
          $('.intro-image').remove();
          $('header').remove();
          $('main').remove();
          $('footer').remove();
          // $('.game-over-image').css("top", "0");
          $('body').append(this.$gameOver);
          // debugger;
          // $('.game-over-image').css("top", "0");
          // $('body').append((this.$gameOver).css("top", "0px"));

          //maybe set timer on this?
          // alert("Press refresh to try your luck again.");
      }
    }
  }
};

// $('modal-button').on("click", function() {
//   game.initializeGame();
// });

game.initializeGame();
