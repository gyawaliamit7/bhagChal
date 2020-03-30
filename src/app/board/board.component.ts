import { element } from 'protractor';
import { Path } from './../Path';
import { Component, OnInit, ViewChild, HostListener, ElementRef, Host, OnChanges } from '@angular/core';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit, OnChanges {
  @ViewChild('canvas', { static: true })
  canvas: ElementRef<HTMLCanvasElement>;

  private ctx: CanvasRenderingContext2D;
  path: Path[] = [];
  deer: any[] = [];
  tigerTurn = false;
  deerTurn = true;
  xCordinates = 0;
  yCordinates = 0;
  gameStart = false;
  finalTurn = false;
  invalidMove = false;
  selectedTiger: Path;
  counter: number;

  @HostListener('click', ['$event'])
  onClick(event) {
    this.xCordinates = event.clientX;
    this.yCordinates = event.clientY;
    this.makeBoard();
    this.findMoves();
    this.displayTurn();
    this.displayStat();
    this.moveTiger();
    if (this.invalidMove) {
      this.invalidMove = false;
    }

  }

  ngOnChanges() {
    this.displayTurn();
  }


  constructor() { }

  ngOnInit() {
    this.ctx = this.canvas.nativeElement.getContext('2d');
    this.setPath();
    this.setLines();
    this.addDeer();
    this.printInfo();

  }

  setPath() {
    for (let i = 0 ; i < 5; ++i) {
      for (let j = 0; j < 5; ++j) {
         const temp = new Path();
         temp.set_x(i);
         temp.set_y(j);
         this.path.push(temp);
      }
    }
    this.counter = 20;
  }

  setLines() {
    this.path.forEach(e => {
      if ( (e.get_x() + e.get_y()) % 2 === 0) {
        this.path.forEach( x => {
          if ((Math.abs(e.get_x() - x.get_x()) === 1)  && (e.get_y() === x.get_y()) ) {
            const temp  = new Path();
            temp.set_x(x.get_x());
            temp.set_y(x.get_y());
            e.set_connector(temp);
          }
          if ((Math.abs(e.get_y() - x.get_y()) === 1) && (x.get_x() === e.get_x())) {
            const temp  = new Path();
            temp.set_x(x.get_x());
            temp.set_y(x.get_y());
            e.set_connector(temp);
          }

          if ((Math.abs(e.get_x() - x.get_x()) === 1) &&  (Math.abs(e.get_y() - x.get_y()) === 1)) {
            const temp  = new Path();
            temp.set_x(x.get_x());
            temp.set_y(x.get_y());
            e.set_connector(temp);
          }
        });
      }
    });

  }


  printInfo() {
    console.log('Path info is');
  }

  makeBoard() {
    this.ctx.fillStyle = '#ffffff';
    this.ctx.fillRect(0, 0, 900, 500);
    this.path.forEach(e => {
      const connector = e.get_connector();
      connector.forEach(connection => {
        this.ctx.beginPath();
        this.ctx.moveTo((e.get_x() + 1) * 100, (e.get_y() + 1) * 100);
        this.ctx.lineTo((connection.get_x() + 1) * 100 , (connection.get_y() + 1) * 100  );
        this.ctx.stroke();
      });
    });
  }

  letsPlay() {
    // tslint:disable-next-line: no-shadowed-variable
    this.makeBoard();
    this.gameStart = true;
    this.fillTiger();
    this.moveTiger();

  }


  displayTurn() {
    if (this.gameStart) {
    if (this.deerTurn) {
      this.ctx.fillStyle = '#000000';
      this.ctx.fillRect(100, 20, 200, 50);
      this.ctx.fillStyle = '#ffffff';
      this.ctx.fillText('DEER TURN', 100 , 50);

    } else if (this.tigerTurn) {
      this.ctx.fillStyle = '#000000';
      this.ctx.fillRect(100, 20, 200, 50);
      this.ctx.fillStyle = '#ffffff';
      this.ctx.fillText('TIGER TURN', 100 , 50);

    } else if (this.finalTurn) {
      this.ctx.fillStyle = '#000000';
      this.ctx.fillRect(100, 20, 200, 50);
      this.ctx.fillStyle = '#ffffff';
      this.ctx.fillText('MOVE TIGER', 100 , 50);
    } else if (this.invalidMove) {
      this.ctx.fillStyle = '#000000';
      this.ctx.fillRect(100, 20, 200, 50);
      this.ctx.fillStyle = '#ffffff';
      this.ctx.fillText('MOVE TIGER', 100 , 50);
    }
  }

  }

  displayStat() {
    this.ctx.fillStyle = '#000000';
    this.ctx.fillRect(400, 20, 200, 50);
    this.ctx.fillStyle = '#ffffff';
    this.ctx.fillText(' Deer Left: ' + this.counter, 400 , 50);

  }

  addDeer() {
    for (let i = 0; i < 20 ; ++i) {
      this.deer.push('O');
    }

  }

  fillTiger() {
    this.path.forEach(e => {
      if (e.get_x() === 0 && e.get_y() === 0) {
        e.set_tiger(true);
      }
      if (e.get_x() === 0 && e.get_y() === 4) {
        e.set_tiger(true);
      }
      if (e.get_x() === 4 && e.get_y() === 0) {
        e.set_tiger(true);

      }
      if (e.get_x() === 2 && e.get_y() === 2) {
        e.set_tiger(true);
      }
      if (e.get_x() === 4 && e.get_y() === 4) {
        e.set_tiger(true);
      }
    });
    console.log('After tiger info');
    console.log(this.path);

  }

  moveTiger() {
    this.path.forEach(e => {
      if (e.isTiger) {
        this.ctx.font = '30px Arial';
        this.ctx.fillStyle = '#ff0000';
        this.ctx.fillText('X', (e.get_x() + 1) * 100 , (e.get_y() + 1 ) * 100);
      } else if (e.isDeer) {
        this.ctx.font = '30px Arial';
        this.ctx.fillStyle = '#0000ff';
        this.ctx.fillText('O', (e.get_x() + 1) * 100 , (e.get_y() + 1 ) * 100);
      }
    });
  }

  findMoves() {
    const temp = this.findPath();
    if (this.deerTurn && temp != null && !temp.isTiger && !temp.isDeer) {
      temp.set_deer(true);
      --this.counter;
      this.ctx.font = '30px Arial';
      this.ctx.fillStyle = '#0000ff';
      this.ctx.fillText('O', (temp.get_x() + 1) * 100 , (temp.get_y() + 1 ) * 100);
      this.deerTurn = !this.deerTurn;
      this.tigerTurn = !this.tigerTurn;
    }
    if (this.tigerTurn && temp != null && !temp.isDeer && temp.isTiger) {
      this.finalTurn = !this.finalTurn;
      this.tigerTurn = !this.tigerTurn;
      this.selectedTiger = temp;
    }
    if (this.finalTurn && temp != null && !temp.isTiger && !temp.isDeer) {
      if (this.moveValid(temp, this.selectedTiger)) {
        this.deerTurn = !this.deerTurn;
        this.finalTurn = !this.finalTurn;
      } else if (this.deerEatable(temp, this.selectedTiger)) {
        this.selectedTiger.set_tiger(false);
        temp.set_tiger(true);
        this.deerTurn = !this.deerTurn;
        this.finalTurn = !this.finalTurn;
      } else {
        this.invalidMove = true;
      }
    }

  }

  deerEatable(temp: Path, prev: Path) {
    // verifying that the point is empty
    if (!temp.isDeer && !temp.isTiger) {
      //  if horizontal
      if (temp.get_y() === prev.get_y()) {
        // if the prev and current point difference is 2
        if (Math.abs(temp.get_x() - prev.get_x()) === 2) {
          // checking what is in the middle
          if (temp.get_x() > prev.get_x()) {
            const middle = this.path.find(e =>  e.get_x() === prev.get_x() + 1 && e.get_y() === prev.get_y());
            if (middle.isDeer) {
              middle.set_deer(false);
              return true;
            }
          } else {
            const middle = this.path.find(e =>  e.get_x() === temp.get_x() + 1 && e.get_y() === temp.get_y());
            if (middle.isDeer) {
              middle.set_deer(false);
              return true;
            }

          }
        }
      }
      // if vertical
      if (temp.get_x() === prev.get_x()) {
        // if the prev and current point difference is 2
        if (Math.abs(temp.get_y() - prev.get_y()) === 2) {
          // checking what is in the middle
          if (temp.get_y() > prev.get_y()) {
            const middle = this.path.find(e =>  e.get_y() === prev.get_y() + 1 && e.get_x() === prev.get_x());
            if (middle.isDeer) {
              middle.set_deer(false);
              return true;
            }
          } else {
            const middle = this.path.find(e =>  e.get_y() === temp.get_y() + 1 && e.get_x() === temp.get_x());
            if (middle.isDeer) {
              middle.set_deer(false);
              return true;
            }

          }
        }
      }
    // if across
    // if current point is accross
      // const commonConnector = temp.get_connector().some(e => e.get_x() === prev.get_y() && e.get_y() === prev.get_y());
      // const secondConnector = prev.get_connector().some(e => e.get_x() === temp.get_y() && e.get_y() === temp.get_y());

      const mutualConnector = temp.get_connector().find( e => {
        return prev.get_connector().find(f => f.get_x() === e.get_x() && f.get_y() === e.get_y());
      });

      const findPath = this.path.find(e=> e.get_x() === mutualConnector.get_x() && e.get_y() === mutualConnector.get_y());
      console.log('Mutual connector is');
      console.log(mutualConnector);
      if (findPath.isDeer) {
        findPath.set_deer(false);
        return true;
      }


    }
    return false;
  }

  moveValid(temp: Path , prev: Path) {
    // if the current point is empty
    if (!temp.isTiger && !temp.isDeer) {
      // if current point is horizontal
      if (temp.get_y() === prev.get_y()) {
        // if the prev and current point difference is 1
        if (Math.abs(temp.get_x() - prev.get_x()) === 1) {
          temp.set_tiger(true);
          prev.set_tiger(false);
          return true;
        }

      }
      // if current point is vertical
      if (temp.get_x() === prev.get_x()) {
        // if the prev and  current point difference is 1
        if (Math.abs(temp.get_y() - prev.get_y()) === 1) {
          temp.set_tiger(true);
          prev.set_tiger(false);
          return true;
        }
      }

      // if current point is accross
      const commonConnector = temp.get_connector().some(e => e.get_x() === prev.get_y() && e.get_y() === prev.get_y());
      const secondConnector = prev.get_connector().some(e => e.get_x() === temp.get_y() && e.get_y() === temp.get_y());
      if (commonConnector || secondConnector) {
        // if ((Math.abs(temp.get_x() - prev.get_y()) === 1) && (Math.abs(temp.get_x() - prev.get_y()) === 1)) {
          console.log('Common connector is');
          console.log(commonConnector);
          temp.set_tiger(true);
          prev.set_tiger(false);
          return true;
      //  }
      }

    }
    return false;
  }

  findPath() {
    const x = Math.trunc((Math.round(this.xCordinates)) / 100 - 1);
    const y = Math.trunc((Math.round(this.yCordinates)) / 100 - 1);
    const temp =  this.path.find(e => e.get_x() === x && e.get_y() === y);
    return temp;
  }

}
