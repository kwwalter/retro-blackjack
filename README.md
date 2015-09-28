# retro-blackjack
## aka, The Modern Casino

One of my favorite multiplayer / party games for the NES is [Vegas Dream](https://en.wikipedia.org/wiki/Vegas_Dream) released by HAL Laboratory in 1988. It sounds corny, but really, check it out!

Making a casino game with any sort of replay value is a monumental feat, and HAL was able to achieve this by including a lot of random events and a ton of personality in their game. With this app, I've tried to capture a fraction of the feel of that game, but using modern-day programming languages. Hooray!

###Technology Used

For this app, I used:
* HTML5 for my basic, underlying structure
* CSS3 for styling and transforms
* Javascript and jQuery to make the game playable and responsive

###Approach

I started by drawing out, roughly, what I wanted the final board to look like, and wrote out the basic HTML that I'd need to make that happen.

Then, I wrote up the logic that created the deck of cards, and then "shuffled" the contents of the array so that I could easily shift objects off of the front of the array, mimicking the action of taking the first card from a deck. It definitely didn't have to be that way, but it felt true to the spirit of the game. I used a constructor function to create the card objects, and applied rank and suit properties to each. I also created a background position method for the Card object so that I would have an easier time mapping to the correct location on the 8-bit card sprite sheet I found online.

The next step was to work on the logic for the game of blackjack itself, which was much more difficult than I expected it to be (especially when it pertained to dealing with ace values!). Once I had the majority of this handled, I got to work on implementing a betting system for the user so that he/she could determine the amount of money to bet on each hand. I applied very minimal CSS styles to these elements just so I could play through the logic in a sort of sandbox environment.

At this point, my "cards" were basically divs that spelled out the suit and rank of every card that was played, so I found a way to set the card views to the correct background position for each card. Also, to make the cards look even more pixelated, I essentially blew them up to 200%. Finally, my game was starting to look like a crappy 8-bit port!

I then took a break from the logic to make the game look more like what I was going for. I added some screengrabs from Vegas Dream (the dealer face, and the blackjack table), and then based the rest of my app's color palette on the latter image. I also found a nice looking 8-bit gif of floating pixels that I included as the background for my main section. During this time I also (finally) got the back of the first dealer card to display correct (i.e., face down). At first I was using `!important` to set the background position on the Mario card, but I learned the hard way that undoing an `!important` property is a fool's errand.

It was also during this time that I found the 8-bit style ARCADEPI font that really tied the whole thing together. Really, without this, the project would not have been the same!

I then alternated between working on ace logic (undeniably the clear-cut winner for "Sisyphusian task of the project" award) and the random events that can happen when the player runs out of money. I only have one style of random event in there now (basically, a family member / acquaintance passes away, and you get some money as a result--which you can then go gamble away, because you're in the perfect place to do so!), but I'd really love to work some more random events in here. Maybe ones where a stranger approaches you and offers to bring you to a show, or a guard comes up to you and tells you that you have a phone call. And what's on the other end of the line? The possibilities are practically infinite.

This is all taking a page from Vegas Dream's book, of course. As was the game over screen, which I worked on next. I got that and the accompanying reset button working, so that the user can reset the game if they're completely out of money.

I then got the animation working for that (it's appended to the end of the main section, and then slowly scrolls up the screen, using a transform). The reset button comes along for the ride, too. At first, I was trying to use `position: absolute` and `position: relative` to move the image and button up the page, but that proved to be really impractical. The transforms worked a million times better.

After that I went back to the CSS and cleaned up the styling of the buttons and input fields, and also added some nice chunky looking borders to the main and header sections.

Then I found that HTML5 has an audio capability, and that I could play an mp3 through my app. But, sadly, it's really hard to find mp3s of midi / 8-bit style music that fits the casino theme. Thankfully, I found a trick [here](https://developers.google.com/youtube/player_parameters?hl=en) on how to embed a youtube video with the height and width set to 0, so that it wouldn't actually appear on the screen, but the sound would still work. Plus, I could set it to autoplay and set it to loop for all of eternity. Lucky you!

After cleaning up the CSS file a bit, I then started working on other animations to announce when someone wins, gets blackjack, or if there's a tie or a bust. I was able to use the same transform on all of these images, which saved a lot of time, but I had a hard time figuring out how to append them, animate them, and then remove them seamlessly. I used some `setTimeout` tricks to work around this, but I then also ran into a problem where you couldn't see the dealer's full hand if you lost, since the cards would be removed before the "dealer wins" animation appears. I'm sure that there's a better way to work around this than with EVEN MORE setTimeouts.

I then added a couple of media queries so that the app would look better in smaller screen sizes, and continued plugging away with the animations until I got them looking exactly how I wanted them. I then fixed the logic on the reset button so that listeners weren't being set twice, and thought I was close to the finish line. I cleaned up my HTML, CSS, and JS files and inserted copious comments in the latter two.

Then, in the 11th hour (literally: it was around 11pm, when I was sitting down to write this ReadMe), I found a couple of hands that fouled up my ace adding logic, so I spent a good while trying to find a workaround for that. What I have now appears to be functional, but there's an issue where sometimes the display of the dealer or player total is 10 higher than it should be, even though the app is registering the correct total value. This is something else I'd like to go back to at a later time.

###Installation Instructions

You can find the game [here](http://kwwalter.github.io/retro-blackjack/).

###Unsolved Problems
* First and foremost: a couple of hands where aces might still be tricky.
* Totals display inconsistently, at times, when the hand contains an ace, even though the total value is still correct.
* Need to find a better timing mechanism for animations.
* Would love to add more random events to enrich the user experience.
* Would have loved to implement the split, double down, and insurance options in this game.

###Wireframe Images / User Stories

I hope you can read my tiny chicken-scratch!

![Wireframe](https://github.com/kwwalter/retro-blackjack/blob/master/wireframes/IMAG2388.jpg)

![User Stories](https://github.com/kwwalter/retro-blackjack/blob/master/wireframes/IMAG2389.jpg)

![ERD / notes](https://github.com/kwwalter/retro-blackjack/blob/master/wireframes/IMAG2390.jpg)

###Attributions

Last, but certainly not least, here's where I got the materials for the game:

* ARCADEPI font: http://www.myfontfree.com/arcadepix-myfontfreecom84f2035.htm
* Dealer face image, blackjack table image, game over image: Vegas Dream, NES (HAL Laboratory, 1988)
* GIF background for main section can be found here: http://jecichon.tumblr.com/post/51465620838/trying-to-make-some-interesting-yet-not-annoying
    * But really, I found it here: http://giphy.com/gifs/blue-background-bPiLQFMPRIEX6)
* Retro cards sprite sheet: http://davesilvermanart.com/blog/wp-content/uploads/2014/12/NewCards1.png
* Mario playing card for back of dealer card: http://craziestgadgets.com/wp-content/uploads/2013/07/mario-cards-back.jpg
* And of course, the background music (Sinatra's "Fly Me to the Moon"): https://www.youtube.com/watch?v=yaWkjUKSyLA

Thanks to all!
