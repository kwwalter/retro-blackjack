function Card(rank, suit) {
  this.rank = rank;
  this.suit = suit;
};

Card.prototype.backgroundPosition = function() {
  var suits = ["clubs", "diamonds", "hearts", "spades"];
  var ranks = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];

  suitOffset = -42 * suits.indexOf(this.suit) + "px";
  rankOffset = -62 * ranks.indexOf(this.rank) + "px";

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
    // this.playerName = prompt("What's your name?");
    $('.player-name').text("Player name: " + this.playerName);

    // this.totalCash = Number(prompt("How much money do you have?"));

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
  $dealerCardsSection: $('.dealer-cards'),
  $playerCardsSection: $('.player-cards'),
  dealerTotal: 0,
  playerTotal: 0,
  $deal: $('#deal-button'),
  $hitButton: $('<button class="hit-button">HIT</button>'), //haha shit button
  $standButton: $('<button class="stand-button">STAND</button>'),

  initializeGame: function () {
    this.setListeners();

    deck.createDeck();
    // deck.shuffleDeck();
    bankRoll.initializeBankRoll();

    // alert("Enter your bet before cards are dealt, otherwise your bet will be $5!");
  },

  setListeners: function() {
    this.$deal.on("click", function(e) {
      game.submitBet();
      game.dealCards();
      game.addUpDealtCards();
      game.checkForBlackjack();
    });
  },

  submitBet: function() {
    if ($('#player-bet').val() > bankRoll.totalCash) {
      alert("You don't have enough cash. Your bet has been set to your remaining amount of cash.");
      game.bet = bankRoll.totalCash;
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

    this.$deal.off();
  },

  dealerCardsView: function(card) {
    // var cardView = $('<div class="card-in-play"><h2>' + card.rank + '</h2><h2>' + card.suit + '</h2></div>');
    var $cardView = $('<div class="card-in-play"></div>');
    // $cardView.css("top: ")

    this.$dealerCardsSection.append($cardView);
  },

  playerCardsView: function(card) {
    // var cardView = $('<div class="card-in-play"><h2>' + card.rank + '</h2><h2>' + card.suit + '</h2></div>');
    var $cardView = $('<div class="card-in-play"></div>');
    this.$playerCardsSection.append($cardView);
  },

  addUpDealtCards: function() {
    this.dealerTotal = 0;
    this.playerTotal = 0;

    for (var b = 0; b < this.dealerCards.length; b++) {
      if (this.dealerCards[b].rank == "A") {
        if (this.dealerTotal <= 10) {
          this.dealerTotal += 11;
        } else {
          this.dealerTotal += 1;
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
      if (this.playerCards[c].rank == "A") {
        if (this.playerTotal <= 10) {
          this.playerTotal += 11;
        } else {
          this.playerTotal += 1;
        }
      } else if (this.playerCards[c].rank == "J" ||
                 this.playerCards[c].rank == "Q" ||
                 this.playerCards[c].rank == "K") {
          this.playerTotal += 10;
      } else {
        this.playerTotal += Number(this.playerCards[c].rank);
      }
    }

    console.log(this.dealerTotal, this.playerTotal);

    // this.checkPlayerforAces();
    // this.checkPlayerBust();
    //
    // this.checkDealerforAces();
    // this.checkDealerBust();
    //
    // this.compareHands();
  },

  checkForBlackjack: function() {
    if (this.dealerTotal === 21 && this.playerTotal < 21) {
      alert("Blackjack for dealer! House wins!");

      bankRoll.totalCash -= this.bet;
      bankRoll.updateBankRollView();

      this.removeCardsAndDealAgain();
    } else if (this.playerTotal === 21) {
      alert("Blackjack! You win!");

      bankRoll.totalCash += (this.bet * 1.5);
      bankRoll.updateBankRollView();

      this.removeCardsAndDealAgain();
    } else {
      console.log("no blackjacks here!");
      this.appendHitStandButtons();
    }
  },

  appendHitStandButtons: function() {
    //player decides to hit or stand based on current total
    //create hit and stand buttons, apppend to player-cards div

    this.$playerCardsSection.append(this.$hitButton);
    this.$playerCardsSection.append(this.$standButton);

    this.$hitButton.on("click", function(e) {
      game.hitPlayer();
      game.addUpDealtCards();
      game.checkPlayerforAces();
      game.checkPlayerBust();
    });

    this.$standButton.on("click", function(e) {
      console.log("testing the click button!");

      //playerTotal is now set. have to compare.
      game.compareHands();

      //hit dealer if total < 17, and while player still has cards (so that this doesn't happen even after dealer wins or busts)
      while (game.dealerTotal < 17 && game.playerTotal > 0) {
        //check to see if dealer wins
        alert("dealer hits!");
        game.hitDealer();
        game.addUpDealtCards();
        game.checkDealerforAces();
        game.checkDealerBust();

        if (game.dealerTotal > 0 && game.playerTotal > 0) {
          game.compareHands();
        }
      }
    });
  },

  hitPlayer: function() {
    var hitCard = deck.cards[0];
    this.playerCards.push(hitCard);
    deck.cards.shift();
    this.playerCardsView(hitCard);
  },

  checkPlayerforAces: function() {
    if (this.playerTotal > 21) {
      for (var d = 0; d < this.playerCards.length; d++) {
        if (this.playerCards[d].rank == "A") {
          this.playerTotal -= 10;
          }
        }
    }
    console.log(this.playerTotal);
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
    console.log("testing hitDealer function");
    var dealerHitCard = deck.cards[0];
    this.dealerCards.push(dealerHitCard);
    deck.cards.shift();
    this.dealerCardsView(dealerHitCard);
  },

  compareHands: function() {
    // if (this.playerCards.length == 2 && this.dealerCards.length == 2) {
    //   return;
    // } else
    if (this.dealerTotal > this.playerTotal) {
      alert("Dealer's hand beats the player's--house wins!");

      bankRoll.totalCash -= this.bet;
      bankRoll.updateBankRollView();

      this.removeCardsAndDealAgain();

    } else if (this.dealerTotal == this.playerTotal) {
      alert("the result is a draw--no one wins! Your bet has been returned to you.");

      this.removeCardsAndDealAgain();
    } else if (this.dealerTotal >= 17 && (this.dealerTotal < this.playerTotal)) {
      alert("Player wins! Congrats!");
      bankRoll.totalCash += (this.bet * 1.5);
      bankRoll.updateBankRollView();

      this.removeCardsAndDealAgain();
    }
  },

  checkDealerforAces: function() {
    if (this.dealerTotal > 21) {
      for (var e = 0; e < this.dealerCards.length; e++) {
        if (this.dealerCards[e].rank == "A") {
          this.dealerTotal -= 10;
          }
        }
    }
    console.log(this.dealerTotal);
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
  },

  removeCardsView: function() {
    $('div').remove('.card-in-play');
    this.$hitButton.remove();
    this.$standButton.remove();
    $('#player-bet').val("");
  }
};

// $('modal-button').on("click", function() {
//   game.initializeGame();
// });

game.initializeGame();
