function Card(rank, suit) {
  this.rank = rank;
  this.suit = suit;
};

var deck = {
  cards: [],
  suits: ["clubs", "spades", "diamonds", "hearts"],
  ranks: ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"],

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
    $('.total-cash').html("Total cash: $", this.totalCash);
  },

  updateBankRollView: function() {
    $('.total-cash').html("Total cash: $", this.totalCash);
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
      game.checkHands();
    });
  },

  submitBet: function() {
    if ($('#player-bet').val() > bankRoll.totalCash) {
      alert("You don't have enough cash. Your bet has been set to your remaining amount of cash.");
      game.bet = bankRoll.totalCash;
    }

    game.bet = $('#player-bet').val();
    console.log(game.bet);
  },

  dealCards: function() {
    //For initial deal only. If dealer or player hit and there are no cards left in the deck, we will recreate and shuffle the deck then.

    if (deck.cards.length < 4) {
      deck.createDeck();
      deck.shuffleDeck();
    }

    for (var i = 0; i < 2; i++) {
      var newPlayerCard = deck.cards[i];
      this.playerCards.push(newPlayerCard);
      deck.cards.shift();
      this.playerCardsView(newPlayerCard);

      var newDealerCard = deck.cards[i];
      this.dealerCards.push(newDealerCard);
      deck.cards.shift();
      this.dealerCardsView(newDealerCard);
    }

    if (this.dealerTotal === 21 && this.playerTotal < 21) {
      alert("Blackjack for dealer! House wins!");
      bankRoll.totalCash -= this.bet;
      bankRoll.updateBankRollView();

    } else if (this.playerTotal === 21) {
      alert("Blackjack! You win!");
      bankRoll.totalCash += (this.bet * 1.5);
      bankRoll.updateBankRollView();
    }
  },

  dealerCardsView: function(card) {
    var cardView = $('<div><h2>' + card.rank + '</h2><h2>' + card.suit + '</h2></div>');
    this.$dealerCardsSection.append(cardView);
  },

  playerCardsView: function(card) {
    var cardView = $('<div><h2>' + card.rank + '</h2><h2>' + card.suit + '</h2></div>');
    this.$playerCardsSection.append(cardView);
  },

  checkHands: function() {
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
  },
};

// $('modal-button').on("click", function() {
//   game.initializeGame();
// });

game.initializeGame();
