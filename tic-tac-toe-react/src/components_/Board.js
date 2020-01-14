import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import 'bootstrap/dist/css/bootstrap.min.css';

class Board extends Component {
  constructor(props){
    super(props);

    this.state = {
        port1: '3001',
        port2: '3002',
        playing: false,
        board: [0,0,0,0,0,0,0,0,0],
        turn: Math.floor((Math.random() * 2) + 1),
        text_field: '',
        speed: 50,
        numberG: 100,
        wins: [0, 0]
    };

    this.handleChange = this.handleChange.bind(this);
    this.handlePlay = this.handlePlay.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.reset = this.reset.bind(this);
    this.send_request = this.send_request.bind(this);
    this.play = this.play.bind(this);
  }

  componentDidMount() {
    this.setState({text_field: this.state.text_field + 'Enter ports of player one and two and hit play' + '\n'});
  }

  handleChange(e) {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  }

  handlePlay(e) {
    e.preventDefault();
    this.setState({ playing: true });
    this.numberG_ = this.state.numberG; //saving for reset
    this.play();
  }

    play() {
    const { port1, port2 } = this.state;
    let participants = [port1, port2];
      this.interval = setInterval(async () => {

        //send request and await response
        await this.send_request(this.state.turn, this.state.board, participants[this.state.turn - 1]);

        //check if anyone has won
        if(hasWon(this.state.board, this.state.turn)) {
            this.setState({numberG: this.state.numberG - 1})
            this.state.wins[this.state.turn - 1] = this.state.wins[this.state.turn - 1] + 1;
            this.setState({text_field: this.state.text_field + 'Player ' + this.state.turn + ' has won!' + '\n'})
            this.reset();

            if(this.state.numberG > 0) {
              this.play();
            }
        }

        //if cells are full
        else if(!this.state.board.includes(0)) {
            this.setState({numberG: this.state.numberG - 1})
            this.setState({text_field: this.state.text_field + 'Noone won.' + '\n'});
            this.reset();

            if(this.state.numberG > 0) {
              this.play();
            }
        }

        (this.state.turn === 1) ? this.setState({turn: 2}) : this.setState({turn: 1});

    }, this.state.speed);
    }

   async send_request(turn, board, port) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json',
        //some bs error about security, probably not necessary
        'Access-Control-Allow-Origin': 'http://localhost:3000' },
        body: JSON.stringify({me: turn, turn: turn, board: board})
    };
    
    await fetch('http://localhost:' + port, requestOptions)
        .then(res => { return res.json() })
        .then(json => {
            //check if valid response
            if(json.cell === 'undefined' ||
            (json.cell < 0 || json.cell > 8) ||
            board[json.cell] !== 0) {
                this.setState({text_field: this.state.text_field + 'Incorrect response from player ' + turn + ' response: ' + json.cell + '\n'})
                this.setState({text_field: this.state.text_field + 'Turn skipped.' + '\n'})
                return;
            }

            this.setState({text_field: this.state.text_field + 'Player ' + turn + ' placed cell on ' + json.cell + '\n'})
            board[json.cell] = turn;            
        })
        .catch(error => console.log(error));
}

  //resets state of everything
  handleReset(e) {
    e.preventDefault();
    this.setState({text_field: this.state.text_field + 'Reset' + '\n'})
    clearInterval(this.interval);
    this.setState({board: [0, 0, 0, 0, 0, 0, 0, 0, 0]});
    // [0, 1, 2]
    // [3, 4, 5]
    // [6, 7, 8]
    this.setState({turn: Math.floor((Math.random() * 2) + 1), playing: false, wins: [0, 0], numberG: this.numberG_, text_field: ''});
  }

  //resets the only the game state
  reset() {
    clearInterval(this.interval);
    this.setState({board: [0, 0, 0, 0, 0, 0, 0, 0, 0]});
    this.setState({turn: Math.floor((Math.random() * 2) + 1)});
  }

  render() {
    const { port1, port2, playing, speed, numberG } = this.state;
    return (
        <div class="container" style={{marginTop: 20, marginBottom: 20, color: 'white', fontSize: 25, fontWeight:'bold'}}>
          <div class="row">
            <div class="col-4 text-center">
              Player X <div/>{this.state.wins[0]}
            </div>
            <div class="col-4 text-center">
              Turn <div/> {this.state.turn}
            </div>
            
            <div class="col-4 text-center">
              Player O <div/> {this.state.wins[1]}
            </div>
          </div>
          
          <hr/>
          <div style={{fontSize: 60, WebkitUserSelect:'none'}}>
            {this.state.board[0] + ' ' + this.state.board[1] + ' ' + this.state.board[2]}
            <div/>
            {this.state.board[3] + ' ' + this.state.board[4] + ' ' + this.state.board[5]}
            <div/>
            {this.state.board[6] + ' ' + this.state.board[7] + ' ' + this.state.board[8]}
          </div>
          <hr/>
            <form name="form" onSubmit={this.handleSubmit} style={{fontSize: 14}}>
              <div className='form-group'>
                <div class="row">
                <div class="col-2 text-left">
                    <label htmlFor="username">Port 1 (X)</label>
                  </div>
                  <div class="col-10 text-center">
                    <input type="text" className="form-control" name="port1" disabled={playing} value={port1} onChange={this.handleChange} />
                  </div>
                </div>
              </div>
              <div className='form-group'>
                <div class="row">
                <div class="col-2 text-left">
                    <label htmlFor="password">Port 2 (O)</label>
                  </div>
                  <div class="col-10 text-center">
                    <input type="text" className="form-control" name="port1" disabled={playing} value={port2} onChange={this.handleChange} />
                  </div>
                </div>
              </div>
              <div class="row">
                  <div class="col-2 text-left">
                    <label htmlFor="password">Request speed(ms): </label>
                  </div>
                  <div class="col-10 text-center">
                  <div className='form-group'>
                    <input type="text" className="form-control" name="speed" disabled={playing} value={speed} onChange={this.handleChange} />
                  </div>
                </div>
              </div>

              <div class="row">
                  <div class="col-2 text-left">
                    <label htmlFor="password">Number of games: </label>
                  </div>
                  <div class="col-10 text-center">
                  <div className='form-group'>
                    <input type="text" className="form-control" name="numberG" disabled={playing} value={numberG} onChange={this.handleChange} />
                  </div>
                </div>
              </div>

              <Button variant="contained" color="secondary" disabled={playing} onClick={this.handlePlay} className="btn btn-primary" style={{margin: 10}}>Play</Button>
              <Button variant="contained" color="secondary" onClick={this.handleReset} className="btn btn-primary" style={{margin: 10}}>Reset</Button>
              </form>
            <hr/>
            <textarea name="body"
            disabled={true}
            value={this.state.text_field}
            style={{width: '100%', height: 200, borderRadius: 5, fontSize: 12}}/>
        </div>
      );
  }
}

export default Board;

function hasWon(board, player) {
    if((board[0] === board[1] && board[1] === board[2] && board[0] === player)
        || (board[3] === board[4] && board[4] === board[5] && board[3] === player)
        || (board[6] === board[7] && board[7] === board[8] && board[6] === player)
        
        || (board[0] === board[3] && board[3] === board[6] && board[0] === player)
        || (board[1] === board[4] && board[4] === board[7] && board[1] === player)
        || (board[2] === board[5] && board[5] === board[8] && board[2] === player)
        
        || (board[0] === board[4] && board[4] === board[8] && board[0] === player)
        || (board[2] === board[4] && board[4] === board[6] && board[2] === player)) {
        return true;
    }
    return false;
}