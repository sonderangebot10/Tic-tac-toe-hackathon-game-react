## Tic Tac Toe Hackathon

**Note**  
This is a concept hackathon type game. Tic-tac-toe is a solved game, thereby it is not ideal for real life usage, since there is a specific technique for a player never to lose. For a proper experience, the game should be open-world type and not contain a specific strategy that would guarantee a win. For example, [Catan](https://www.catan.com/) or [Ticket to Ride](https://www.daysofwonder.com/tickettoride/en/) would be ideal, since it is completely open, yet well contained game with limited moves and more than two people can play.

### `The Game`

Idea behind this project is to help people understand and learn to develop certain algorithms in a competitive way with your colleagues or friends.  
The way this works, is two people create their own servers which listen to different ports. Does not matter which programming language, what frameworks or whatever. One can use `Node` and the other `Spring-boot`, for example. Then this game-server sends json information about the game (in this case the board and who's turn it is) and the people have to respond with their move.   
Objective is for a player to beat the other player. Various parameters help to decide who's code is better, for example multiple games can be played and the the player with the most wins might be considered superior.

### `Architecture`

![Architecture](https://github.com/sonderangebot10/Tic-tac-toe-hackathon-game-react/blob/master/tic-tac-toe-react/src/artwork_/architecture.png)

### `JSON information`

As mention previously, information is sent, for example as `{ me: 1, turn: 1, board: [0, 0, 1, 2, 2, 0, 0, 1, 0] }` which would translate to a board looking as:  

`[0, 0, 1]`  
`[2, 2, 0]`  
`[0, 1, 0]`  
  
or  
  
[board_example]

`me` defines what is your turn and `turn` which turn is it.

The person has to respond with `{cell: cell_nr}`, where `cell_nr` is the number of the cell player want to place it on (0 - 8). This is the board numeration:

`[0, 1, 2]`  
`[3, 4, 5]`  
`[6, 7, 8]`  

### `How To`

1. Run your game servers (in this case examplary code can be found in `/test_example` folder). Although this might be written in any language, yet must listen to different ports.
2. This game server is built with React and runs on the port 3000. Run it with npm start command, open [http://localhost:3000](http://localhost:3000) to view it in the browser.
[PIC]
3. Once all the servers are running, input the correct ports to send information to (in this case, 3001 and 3002) and select the speed of requests in ms (recommended 50 to 1000ms) and how many games you wish to be played.
4. Click play and watch the results. Later try to compare the codes and discuss how the logic might be improved.

### `Future plans`

This is only a concept version. In the future I am planning on developing more difficult games with more than 2+ players game support and more intuitive controls.
