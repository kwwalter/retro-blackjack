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
  totalCash: 100,
  playerName: "",

  initializeBankRoll: function() {
    playerName = prompt("What's your name?");
    $('.player-name').text("Player name: " + playerName);

    // alert("Welcome to Las Vegas! Assuming you showed up empty-handed, here's $100.");
    $('.total-cash').text("Total cash: $" + this.totalCash);
  }
}

var game = {
  dealerCards: [],
  playerCards: [],

  initializeGame: function () {
    deck.createDeck();
    deck.shuffleDeck();
    bankRoll.initializeBankRoll();
  }

  dealCards: function() {
    for (var i = 0; i < 4; i++) {
      playerCards.push(deck.cards[i]; 
    }
  }
}

// $('modal-button').on("click", function() {
//   game.initializeGame();
// });

game.initializeGame();
