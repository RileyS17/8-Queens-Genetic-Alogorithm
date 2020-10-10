class ChessGraph {
    constructor(boardElement) {
        this.boardElement = boardElement;
        this.myBoard = Chessboard(this.boardElement);
    }

    setQueens(queens) {
        this.myBoard = Chessboard(this.boardElement, queens);
    }
}