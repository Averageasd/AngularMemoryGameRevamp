import {
  Component,
  OnInit,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { gameConfig } from './configuration';
import { Cell, CellPair } from './Cell';

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
  gameBoard = signal<Cell[][]>([]);
  cellPair: CellPair = {
    cell1: null,
    cell2: null,
  };

  ngOnInit(): void {
    this.fillGameBoard();
    this.setAllCellsVals();
  }

  fillGameBoard(): void {
    const tempGameBoard: Cell[][] = [];
    for (let i = 0; i < this.row; i++) {
      const cellRow: Cell[] = [];
      for (let j = 0; j < this.col; j++) {
        cellRow.push(this.newCell(i, j));
      }
      tempGameBoard.push(cellRow);
    }
    this.gameBoard.set(tempGameBoard);
  }

  newCell(r: number, c: number): Cell {
    return {
      r: r,
      c: c,
      selected: false,
      val: -1,
      available: true,
      revealed: false,
    };
  }

  setAllCellsVals() {
    const numElems: number = Math.floor(this.row * this.col) / 2;
    const tempGameBoard = this.gameBoard();
    for (let i = 1; i <= numElems; i++) {
      this.setCellValRandom(tempGameBoard, i);
      this.setCellValRandom(tempGameBoard, i);
    }
    this.gameBoard.set(tempGameBoard);
  }

  private setCellValRandom(tempGameBoard: Cell[][], val: number): void {
    let validPos: boolean = false;
    let randRow: number = Math.floor(Math.random() * this.row);
    let randCol: number = Math.floor(Math.random() * this.col);
    do {
      if (tempGameBoard[randRow][randCol].val == -1) {
        tempGameBoard[randRow][randCol].val = val;
        validPos = true;
      } else {
        randRow = Math.floor(Math.random() * this.row);
        randCol = Math.floor(Math.random() * this.col);
      }
    } while (!validPos);
  }

  clickCell(r: number, c: number): void {
    const tempGameBoard = this.gameBoard();
    const selectedCell = tempGameBoard[r][c];
    if (!selectedCell.available) {
      return;
    }
    selectedCell.revealed = true;
    selectedCell.selected = true;

    // if we have not selected a cell, set cell1 to this cell as first selected cell
    if (!this.cellPair.cell1) {
      this.cellPair.cell1 = selectedCell;
    } else {
      // now we have ref to 1 selected cell. Compare value of this selected cell to new selected cell
      // make sure they are different cells
      if (
        selectedCell.r !== this.cellPair.cell1.r ||
        selectedCell.c != this.cellPair.cell1.c
      ) {
        if (
          !this.cellPair.cell2 &&
          selectedCell.val === this.cellPair.cell1.val
        ) {
          // these cells are no longer clickable
          // they are green now
          selectedCell.selected = false;
          selectedCell.available = false;
          this.cellPair.cell1.selected = false;
          this.cellPair.cell1.available = false;
          this.cellPair.cell1 = null;
        }

        // new cell does not match cell1
        else {
          // both cell1 and cell2 are selected non-matching pair of cells.
          // hide values of both
          // set cell1 to newly selected cell
          if (this.cellPair.cell2) {
            this.cellPair.cell1.revealed = false;
            this.cellPair.cell1.selected = false;
            this.cellPair.cell2.revealed = false;
            this.cellPair.cell2.selected = false;
            this.cellPair.cell1 = selectedCell;
            this.cellPair.cell2 = null;
          }

          // we only have 1 selected cell cell1 atm. set cell2 to newly selected cell
          else {
            this.cellPair.cell2 = selectedCell;
          }
        }
      }
    }

    this.gameBoard.set(tempGameBoard);
  }

  isCellChosen(r: number, c: number): boolean {
    return this.gameBoard()[r][c].selected;
  }

  isCellAvailable(r: number, c: number): boolean {
    return this.gameBoard()[r][c].available;
  }

  reset() {
    this.gameBoard.set([]);
    this.cellPair.cell1 = null;
    this.cellPair.cell2 = null;
    this.fillGameBoard();
    this.setAllCellsVals();
  }

  chooseGameBoardSize(event: any): void {
    const size: number = event.target.value as number;
    this.row = size;
    this.col = size;
    this.reset();
  }
}
