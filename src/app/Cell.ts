export interface Cell{
    r: number;
    c: number;
    selected: boolean;  
    val: number;
    available: boolean;
    revealed: boolean;
}

export interface CellPair{
    cell1: Cell | null;
    cell2: Cell | null;
}