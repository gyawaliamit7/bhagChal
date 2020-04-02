import { element } from 'protractor';
import { Path } from './../Path';
import { Component, OnInit, ViewChild, HostListener, ElementRef, Host, OnChanges } from '@angular/core';

import { moveCheck , deerCheck} from '../Validity';
import { setLayout, makeLines, createBorder, backButton, displayInfo, fillAnimals } from './../Layout';


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
  selectedDeer: Path;
  counter: number;
  deerMove = false;
  finalDeerTurn = false;
  reverse = false;

  @HostListener('click', ['$event'])
  onClick(event) {
    this.xCordinates = event.clientX;
    this.yCordinates = event.clientY;
    this.makeBoard();
    this.findMoves();
    this.displayTurn();
    this.reverseStep();
    this.displayStat();
    this.moveTiger();
    if (this.invalidMove) {
      this.invalidMove = false;
    }
    if (this.counter === 0) {
      this.deerMove = true;
    } else {
      this.deerMove = false;
    }
    console.log(this.xCordinates);
    console.log(this.yCordinates);
    if (this.xCordinates >= 100 && this.xCordinates <= 180 && this.yCordinates >= 100 && this.yCordinates <= 150) {
      console.log('Event details is: ');
      console.log(event);
      this.reverse = true;
      this.reverseStep();
      this.displayTurn();
      this.reverse = false;
    }
  }

  ngOnChanges() {
    this.displayTurn();
    this.reverseStep();
  }


  constructor() { }

  ngOnInit() {
    this.ctx = this.canvas.nativeElement.getContext('2d');
    this.setPath();
    this.setLines();
    this.addDeer();

  }

  setPath() {
    this.path = setLayout(this.path);
    this.counter = 20;
  }

  setLines() {
    this.path = makeLines(this.path);

  }


  makeBoard() {
    createBorder(this.ctx, this.path);
  }

  letsPlay() {
    this.makeBoard();
    this.gameStart = true;
    this.fillTiger();
    this.moveTiger();

  }

  reverseStep() {
    backButton(this.ctx);
    if (this.finalTurn && this.reverse) {
      this.finalTurn = false;
      this.tigerTurn = true;
    } else if (this.finalDeerTurn && this.reverse) {
      this.finalDeerTurn = false;
      this.deerTurn = true;
    }
  }


  displayTurn() {
    if (this.gameStart) {
      if (this.deerTurn && this.counter >= 0) {
      displayInfo('DEER TURN', this.ctx);
      } else if (this.deerTurn && this.counter === 0) {
        displayInfo('SELECT DEER', this.ctx);
      } else if (this.tigerTurn) {
        displayInfo('SELECT TIGER', this.ctx);

      } else if (this.finalTurn) {
        displayInfo('MOVE TIGER', this.ctx);

      } else if (this.invalidMove) {
        displayInfo('INVALID TURN', this.ctx);

      } else if (this.finalDeerTurn && !this.deerMove) {
        displayInfo('MOVE DEER', this.ctx);
      }
    }
  }

  displayStat() {
    this.ctx.fillStyle = '#000000';
    this.ctx.fillRect(300, 550, 300, 50);
    this.ctx.fillStyle = '#ffffff';
    this.ctx.fillText(' Deer Left: ' + this.counter, 300 , 580);

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
      if (e.get_x() === 4 && e.get_y() === 4) {
        e.set_tiger(true);
      }
    });
    console.log('After tiger info');
    console.log(this.path);

  }

  moveTiger() {
    fillAnimals(this.ctx, this.path);
  }

  findMoves() {
    const temp = this.findPath();
    if (this.deerTurn && temp != null && !temp.isTiger && !temp.isDeer && !this.deerMove) {
      if (this.counter > 0 ) {
        --this.counter;
        temp.set_deer(true);
        this.ctx.font = '30px Arial';
        this.ctx.fillStyle = '#0000ff';
        this.ctx.fillText('O', (temp.get_x() + 1) * 100 , (temp.get_y() + 1 ) * 100);
        this.deerTurn = !this.deerTurn;
        this.tigerTurn = !this.tigerTurn;
      }
    }
    if (this.deerTurn && temp != null && temp.isDeer && !temp.isTiger && this.deerMove) {
      this.selectedDeer = temp;
      this.finalDeerTurn = !this.finalDeerTurn;
      this.deerTurn = !this.deerTurn;
    }
    if (this.finalDeerTurn && temp != null && !temp.isDeer && !temp.isTiger ) {
      if (this.moveValidDeer(temp, this.selectedDeer)) {
        console.log('Hami yeta');
        temp.set_deer(true);
        this.selectedDeer.set_deer(false);
        this.tigerTurn = !this.tigerTurn;
        this.finalDeerTurn = !this.finalDeerTurn;
      } else {
        this.invalidMove = true;
      }

    }
    if (this.tigerTurn && temp != null && !temp.isDeer && temp.isTiger) {
      this.finalTurn = !this.finalTurn;
      this.tigerTurn = !this.tigerTurn;
      this.selectedTiger = temp;
    }
    if (this.finalTurn && temp != null && !temp.isTiger && !temp.isDeer) {
      if (this.moveValid(temp, this.selectedTiger)) {
        temp.set_tiger(true);
        this.selectedTiger.set_tiger(false);
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
    return deerCheck(temp, prev, this.path);
  }

  moveValid(temp: Path , prev: Path) {
    return moveCheck(temp, prev, false);
  }
  moveValidDeer(temp: Path , prev: Path) {
    return moveCheck(temp, prev, true);
  }

  findPath() {
    const x = Math.trunc((Math.round(this.xCordinates)) / 100 - 1);
    const y = Math.trunc((Math.round(this.yCordinates)) / 100 - 1);
    return  this.path.find(e => e.get_x() === x && e.get_y() === y);
  }

}
