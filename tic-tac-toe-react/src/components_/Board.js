import React, { Component } from 'react';

class Board extends Component {
  constructor(props){
    super(props);

    this.state = {
        port1: '3001',
        port2: '3002',
        playing: false,
        board: [0,0,0,0,0,0,0,0,0],
        turn: Math.floor((Math.random() * 2) + 1),
        text_field: ''
    };

    this.handleChange = this.handleChange.bind(this);
    this.handlePlay = this.handlePlay.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.send_request = this.send_request.bind(this);
  }

  componentDidMount() {
    this.setState({text_field: this.state.text_field + 'Enter ports of player one and two and hit play'});
  }

  handleChange(e) {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  }

  handlePlay(e) {
    e.preventDefault();
    const { port1, port2 } = this.state;
    let participants = [port1, port2];
    this.setState({ playing: true });

    this.interval = setInterval(async () => {
        //send request and await response
        await this.send_request(this.state.turn, this.state.board, participants[this.state.turn - 1], this);

        //check if anyone has one
        if(hasWon(this.state.board, this.state.turn)) {
            this.setState({text_field: this.state.text_field + 'Player ' + this.state.turn + ' has won!' + '\n'})
            clearInterval(this.interval);
        }

        //if cells are full
        else if(!this.state.board.includes(0)) {
            this.setState({text_field: this.state.text_field + 'Noone won.' + '\n'});
            clearInterval(this.interval);
        }

        (this.state.turn === 1) ? this.setState({turn: 2}) : this.setState({turn: 1});
    }, 2000);

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
            // console.log(board[0] + ' ' + board[1] + ' ' + board[2]);
            // console.log(board[3] + ' ' + board[4] + ' ' + board[5]);
            // console.log(board[6] + ' ' + board[7] + ' ' + board[8]);
            
        })
        .catch(error => console.log(error));
}

  handleReset(e) {
    e.preventDefault();
    this.setState({text_field: this.state.text_field + 'Reset' + '\n'})
    clearInterval(this.interval);
    this.setState({board: [0, 0, 0, 0, 0, 0, 0, 0, 0]});
    // [0, 1, 2]
    // [3, 4, 5]
    // [6, 7, 8]
    this.setState({turn: Math.floor((Math.random() * 2) + 1), playing: false});
  }

  render() {
    const { port1, port2, playing } = this.state;
    return (
        <div>
          Turn {this.state.turn}
          <hr/>
          {this.state.board[0] + ' ' + this.state.board[1] + ' ' + this.state.board[2]}
          <div/>
          {this.state.board[3] + ' ' + this.state.board[4] + ' ' + this.state.board[5]}
          <div/>
          {this.state.board[6] + ' ' + this.state.board[7] + ' ' + this.state.board[8]}
          <hr/>
          <form name="form" onSubmit={this.handleSubmit}>
                    <div className='form-group'>
                        <label htmlFor="username">Port 1 (X) </label>
                        <input type="text" className="form-control" name="port1" value={port1} onChange={this.handleChange} />
                    </div>
                    <div className='form-group'>
                        <label htmlFor="password">Port 2 (O) </label>
                        <input type="text" className="form-control" name="port2" value={port2} onChange={this.handleChange} />
                    </div>
                    <button variant="contained" color="primary" disabled={playing} onClick={this.handlePlay} className="btn btn-primary">Play</button>
                    <button variant="contained" color="primary" onClick={this.handleReset} className="btn btn-primary">Reset</button>
                </form>
            <hr/>
            <textarea name="body"
            disabled={true}
            value={this.state.text_field}
            style={{width: 400, height: 400}}/>
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