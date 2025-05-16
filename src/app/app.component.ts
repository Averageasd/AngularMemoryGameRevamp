import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { gameConfig } from './configuration';
import { Cell } from './Cell';

@Component({
  selector: 'app-root',
  imports: [CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  title = 'angular-memorygame-revamp';
  private row: number = gameConfig.SMALL_ROW;
  private col: number = gameConfig.SMALL_COL;
  gameBoard: Cell[][] = [];
  clickedCell: Cell | null = null;

  ngOnInit(): void {
    this.fillGameBoard();
    this.setAllCellsVals();
  }

  fillGameBoard(): void {
    for (let i = 0; i < this.row; i++) {
      const cellRow: Cell[] = [];
      for (let j = 0; j < this.col; j++) {
        cellRow.push(
          {
            r: i,
            c: j,
            selected: false,
            val: -1,
            available: true
          } as Cell
        );
      }
      this.gameBoard.push(cellRow);
    }
  }

  setAllCellsVals() {
    const numElems: number = Math.floor(this.row * this.col) / 2;
    for (let i = 1; i <= numElems; i++) {
      this.setCellValRandom(i);
      this.setCellValRandom(i);
    }
  }

  private setCellValRandom(val: number): void {
    let validPos: boolean = false;
    let randRow: number = Math.floor(Math.random() * this.row);
    let randCol: number = Math.floor(Math.random() * this.col);
    do {
      if (this.gameBoard[randRow][randCol].val == -1) {
        this.gameBoard[randRow][randCol].val = val;
        validPos = true;
      } else {
        randRow = Math.floor(Math.random() * this.row);
        randCol = Math.floor(Math.random() * this.col);
      }
    } while (!validPos);
  }

  clickCell(r: number, c: number): void {
    if (!this.clickedCell){
      this.clickedCell = {
        r: r,
        c: c,
        selected: true,
        val: this.gameBoard[r][c].val,
        available: true
      } as unknown as Cell;
      this.gameBoard[r][c].selected = true;
    }
    else{
      const chosenCell : Cell = this.gameBoard[r][c];
      if (r!==this.clickedCell.r || c!==this.clickedCell.c){
        if (chosenCell.val === this.clickedCell.val ){
          this.gameBoard[this.clickedCell.r][this.clickedCell.c].selected = false;
          this.gameBoard[this.clickedCell.r][this.clickedCell.c].available = false;
          chosenCell.selected = false;
          chosenCell.available = false;
          this.clickedCell = null;
        }
      }
    }
  }

  isCellChosen(r: number, c: number): boolean {
    if (this.gameBoard[r][c].selected){
      console.log(this.clickedCell !== null
      && this.clickedCell.r === r 
      && this.clickedCell.c === c);
    }
    
    return this.clickedCell !== null
    && this.clickedCell.r === r 
    && this.clickedCell.c === c;
  }

  isCellAvailable(r: number, c: number) : boolean {
    return this.gameBoard[r][c].available;
  }
}
