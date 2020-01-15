export default function sketch(p){
    let canvas;
    let diameter = 40;
    let board = [[150,85], [250,85], [350,85],
                 [150,155], [250,155], [350,155],
                 [150,235], [250,235], [350,235]];

    p.setup = () => {
      canvas = p.createCanvas(500, 300);
      p.noStroke();
    }

    p.draw = () => {
      //map
      p.line(200, 50, 200, 260);
      p.line(300, 50, 300, 260);

      p.line(130, 120, 370, 120);
      p.line(130, 190, 370, 190);

      p.strokeWeight(5);
      p.stroke('white');
    }

    p.myCustomRedrawAccordingToNewPropsHandler = (newProps) => {
        if(canvas) {
            p.noFill();
            p.strokeWeight(5);
            if(newProps.board.every(checkCells)) p.clear();
            for(let i = 0; i < 9; i++) {
                let [x,y] = board[i];
                if(newProps.board[i] == 1) {
                    p.line(x-25, y+25, x+25, y-25);
                    p.line(x+25, y+25, x-25, y-25);
                }
                else if(newProps.board[i] == 2) {
                    p.circle(x, y, diameter);
                }
            }
        }
    }
}

function checkCells(cell) {
    return cell == 0;
}