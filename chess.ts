interface Position {
    file: number;
    rank: number;
}

interface Movement {
    start: Position;
    dst: Position;
}

interface Move extends Position {
    valid?: (chess: Chess, dst: Position) => boolean;
    move?: Movement;
    remove?: (chess: Chess) => Position;
}

interface Piece {
    moveSet: Array<Move>;
    allowMultiples: boolean;
}

interface Pieces {
    [key: string]: Piece
}

const whitePieceSet = new Set(["R", "N", "B", "Q", "K", "P"]);
const blackPieceSet = new Set(["r", "n", "b", "q", "k", "p"]);
const pieceSet = new Set();
whitePieceSet.forEach(el => pieceSet.add(el));
blackPieceSet.forEach(el => pieceSet.add(el));
const diagonals: Array<Move> = [
    { file: 1, rank: 1 },
    { file: 1, rank: -1 },
    { file: -1, rank: 1 },
    { file: -1, rank: -1 }
];
const ranksAndFiles: Array<Move> = [
    { file: 1, rank: 0 },
    { file: -1, rank: 0 },
    { file: 0, rank: 1 },
    { file: 0, rank: -1 }
];
const knightMoves: Array<Move> = [
    { file: 2, rank: 1 },
    { file: 1, rank: 2 },
    { file: 2, rank: -1 },
    { file: 1, rank: -2 },
    { file: -2, rank: 1 },
    { file: -1, rank: 2 },
    { file: -2, rank: -1 },
    { file: -1, rank: -2 }
];
const squareNonEmpty = (chess: Chess, dst: Position) => chess.posToPiece(dst) !== "";
const squareEmpty = (chess: Chess, dst: Position) => chess.posToPiece(dst) === "";
const blackPawnMoves: Array<Move> = [
    { file: -1, rank: 1, valid: squareNonEmpty },
    { file: 0, rank: 1, valid: squareEmpty },
    { file: 1, rank: 1, valid: squareNonEmpty },
    { file: 0, rank: 2, valid: (chess: Chess, dst: Position) => squareEmpty(chess, dst) && squareEmpty(chess, { file: dst.file, rank: 2 }) && dst.rank === 3 }
];
const whitePawnMoves: Array<Move> = [
    { file: -1, rank: -1, valid: squareNonEmpty },
    { file: 0, rank: -1, valid: squareEmpty },
    { file: 1, rank: -1, valid: squareNonEmpty },
    { file: 0, rank: -2, valid: (chess: Chess, dst: Position) => squareEmpty(chess, dst) && squareEmpty(chess, { file: dst.file, rank: 5 }) && dst.rank === 4 }
];
const blackCastling: Array<Move> = [
    {
        file: 2,
        rank: 0,
        valid: (chess: Chess, dst: Position) =>
            chess.castlingRights.includes("k") &&
            squareEmpty(chess, { rank: 0, file: 5 }) &&
            squareEmpty(chess, { rank: 0, file: 6 }) &&
            chess.findAttackingPieces("w", { rank: 0, file: 5 }).length === 0 &&
            chess.findAttackingPieces("w", { rank: 0, file: 4 }).length === 0,
        move: {
            start: {
                file: 7,
                rank: 0
            },
            dst: {
                file: 5,
                rank: 0
            }
        }
    },
    {
        file: -2,
        rank: 0,
        valid: (chess: Chess, dst: Position) =>
            chess.castlingRights.includes("q") &&
            squareEmpty(chess, { rank: 0, file: 3 }) &&
            squareEmpty(chess, { rank: 0, file: 2 }) &&
            squareEmpty(chess, { rank: 0, file: 1 }) &&
            chess.findAttackingPieces("w", { rank: 0, file: 3 }).length === 0 &&
            chess.findAttackingPieces("w", { rank: 0, file: 4 }).length === 0,
        move: {
            start: {
                file: 0,
                rank: 0
            },
            dst: {
                file: 3,
                rank: 0
            }
        }
    }
]
const whiteCastling: Array<Move> = [
    {
        file: 2,
        rank: 0,
        valid: (chess: Chess, dst: Position) =>
            chess.castlingRights.includes("K") &&
            squareEmpty(chess, { rank: 7, file: 5 }) &&
            squareEmpty(chess, { rank: 7, file: 6 }) &&
            chess.findAttackingPieces("b", { rank: 7, file: 5 }).length === 0 &&
            chess.findAttackingPieces("b", { rank: 7, file: 4 }).length === 0,
        move: {
            start: {
                file: 7,
                rank: 7
            },
            dst: {
                file: 5,
                rank: 7
            }
        }
    },
    {
        file: -2,
        rank: 0,
        valid: (chess: Chess, dst: Position) =>
            chess.castlingRights.includes("Q") &&
            squareEmpty(chess, { rank: 7, file: 3 }) &&
            squareEmpty(chess, { rank: 7, file: 2 }) &&
            squareEmpty(chess, { rank: 7, file: 1 }) &&
            chess.findAttackingPieces("b", { rank: 7, file: 3 }).length === 0 &&
            chess.findAttackingPieces("b", { rank: 7, file: 4 }).length === 0,
        move: {
            start: {
                file: 0,
                rank: 7
            },
            dst: {
                file: 3,
                rank: 7
            }
        }
    }
]

const pieces: Pieces = {
    r: { moveSet: ranksAndFiles, allowMultiples: true },
    R: { moveSet: ranksAndFiles, allowMultiples: true },
    n: { moveSet: knightMoves, allowMultiples: false },
    N: { moveSet: knightMoves, allowMultiples: false },
    b: { moveSet: diagonals, allowMultiples: true },
    B: { moveSet: diagonals, allowMultiples: true },
    q: { moveSet: ranksAndFiles.concat(diagonals), allowMultiples: true },
    Q: { moveSet: ranksAndFiles.concat(diagonals), allowMultiples: true },
    k: { moveSet: ranksAndFiles.concat(diagonals).concat(blackCastling), allowMultiples: false },
    K: { moveSet: ranksAndFiles.concat(diagonals).concat(whiteCastling), allowMultiples: false },
    p: { moveSet: blackPawnMoves, allowMultiples: false },
    P: { moveSet: whitePawnMoves, allowMultiples: false }
};

const posEquals = (first: Position, second: Position) => first.rank === second.rank && first.file === second.file;
const posRelativeEqual = (first: Position, second: Position) =>
    (first.rank > 0) === (second.rank > 0) &&
    (first.rank < 0) === (second.rank < 0) &&
    (first.file > 0) === (second.file > 0) &&
    (first.file < 0) === (second.file < 0);
const posAdd = (first: Position, second: Position) => {
    return {
        file: first.file + second.file,
        rank: first.rank + second.rank
    };
};
const posSubtract = (first: Position, second: Position) => {
    return {
        file: first.file - second.file,
        rank: first.rank - second.rank
    };
};

class Chess {

    board: Array<Array<string>> = [];
    turn: string = "";
    castlingRights: string = "";
    enPassant: string = "";
    fiftyMove: number = 0;
    moveCount: number = 0;

    constructor(variable: Chess | string) {
        if (variable instanceof Chess) {
            this.copyConstructor(variable);
        } else {
            this.stringConstructor(variable);
        }
    }

    copyConstructor(chess: Chess) {
        this.board = chess.board.map(el => [...el]);
        this.turn = chess.turn;
        this.castlingRights = chess.castlingRights;
        this.enPassant = chess.enPassant;
        this.fiftyMove = chess.fiftyMove;
        this.moveCount = chess.moveCount;
    }

    stringConstructor(fen: string) {
        let fenArr = fen.split(' ');

        this.board = [];
        let rank = []
        let boardStr = fenArr[0];
        for (let i = 0; i < boardStr.length; i++) {
            if (pieceSet.has(boardStr[i])) {
                rank.push(boardStr[i]);
                continue;
            }
            if (boardStr[i] === "/") {
                this.board.push(rank);
                rank = [];
            }
            let number = parseInt(boardStr[i], 10);
            for (let j = 0; j < number; j++) {
                rank.push("");
            }
        }
        this.board.push(rank);

        this.turn = fenArr[1];
        this.castlingRights = fenArr[2];
        this.enPassant = fenArr[3];
        this.fiftyMove = parseInt(fenArr[4], 10);
        this.moveCount = parseInt(fenArr[5], 10);
    }

    posToPiece(pos: Position) {
        return this.board[pos.rank][pos.file];
    }

    valid(start: Position, dst: Position) {
        let diff = {
            rank: dst.rank - start.rank,
            file: dst.file - start.file
        };

        if (posEquals(start, dst)) return;
        if ((this.turn === "w" ? blackPieceSet : whitePieceSet).has(this.posToPiece(start))) return;
        if ((this.turn === "w" ? whitePieceSet : blackPieceSet).has(this.posToPiece(dst))) return;

        let piece: Piece = pieces[this.posToPiece(start)];
        let direction = piece.moveSet.find(element =>
            piece.allowMultiples ? posRelativeEqual(element, diff): posEquals(element, diff));
        if (!direction) return;
        if (Math.abs(direction.rank) === 1 && Math.abs(direction.file) === 1 &&
            Math.abs(diff.rank) !== Math.abs(diff.file)) return;
        let pos = posAdd(start, direction);
        while (!posEquals(pos, dst)) {
            if (this.posToPiece(pos) !== "") return;
            pos = posAdd(pos, direction);
        }

        if (direction.valid) {
            if (!direction.valid(this, dst)) return;
        }
        let chessCopy = new Chess(this);
        chessCopy.move(start, dst, direction);
        if (chessCopy.findCheckingPieces(this.turn).length > 0) return;
        return direction;
    }

    move(start: Position, dst: Position, move: Move) {
        // TODO implement castling and en passant

        if (move.move) {
            this.board[move.move.dst.rank][move.move.dst.file] = this.posToPiece(move.move.start);
            this.board[move.move.start.rank][move.move.start.file] = "";
        }
        if (move.remove) {
            let remove = move.remove(this);
            this.board[remove.rank][remove.file] = "";
        }

        if (this.posToPiece(dst) !== "" || this.posToPiece(start).toLowerCase() === "p") {
            this.fiftyMove = 0;
        } else {
            this.fiftyMove++;
        }

        this.enPassant = "-";
        let updateEnPassant = (pawn: string, rank: number, rankLetter: string) => {
            let oppositePawn = pawn === "p" ? "P" : "p";
            if (this.posToPiece(start) === pawn && Math.abs(posSubtract(dst, start).rank) === 2) {
                if (start.file > 0 && this.posToPiece({ file: start.file - 1, rank: rank}) === oppositePawn ||
                    start.file < 7 && this.posToPiece({ file: start.file + 1, rank: rank}) === oppositePawn ) { 
                    this.enPassant = String.fromCharCode(97 + start.file) + rankLetter;
                }
            }
        }
        updateEnPassant("p", 3, "6");
        updateEnPassant("P", 4, "3");

        let updateCastling = (king: string, queen: string, rook: string, rank: number) => {
            if (this.castlingRights.includes(king) || this.castlingRights.includes(queen)) {
                if (this.posToPiece(start) === king) {
                    this.castlingRights = this.castlingRights.replace(king, "");
                    this.castlingRights = this.castlingRights.replace(queen, "");
                }
                if (this.posToPiece(start) === rook && posEquals(start, { file: 0, rank: rank})) {
                    this.castlingRights = this.castlingRights.replace(queen, "");
                }
                if (this.posToPiece(start) === rook && posEquals(start, { file: 7, rank: rank})) {
                    this.castlingRights = this.castlingRights.replace(king, "");
                }
                if (this.castlingRights.length == 0) {
                    this.castlingRights = "-";
                }
            }
        }
        updateCastling("k", "q", "r", 0);
        updateCastling("K", "Q", "R", 7);

        this.board[dst.rank][dst.file] = this.posToPiece(start);
        this.board[start.rank][start.file] = "";

        if (this.turn === "w") {
            this.turn = "b";
        } else {
            this.turn = "w";
            this.moveCount++;
        }
    }

    state() {
        // TODO
        // returns normal, check, checkmate, 50move
    }

    findCheckingPieces(color: string) {
        let rank = this.board.findIndex(element =>
            color === "w" && element.includes("K") ||
            color === "b" && element.includes("k"));
        let file = this.board[rank].findIndex(el =>
            color === "w" && el === "K" ||
            color === "b" && el === "k");
        let kingPos = {
            file: file,
            rank: rank
        };
        return this.findAttackingPieces(color === "w" ? "b" : "w", kingPos)
    }

    findAttackingPieces(color: string, target: Position) {
        let checkingPieces: Array<Position> = [];
        let oppositePieceSet = color === "w" ? blackPieceSet : whitePieceSet;

        let isValid = (pos: Position) =>
            0 <= pos.file &&
            pos.file < 8 &&
            0 <= pos.rank &&
            pos.rank < 8;


        for (const pieceType in pieces) {
            if (oppositePieceSet.has(pieceType)) continue;
            pieces[pieceType].moveSet.forEach(element => {
                let pos = posSubtract(target, element);
                while (isValid(pos) && this.posToPiece(pos) === "" && pieces[pieceType].allowMultiples) {
                    pos = posSubtract(pos, element);
                }
                if (!isValid(pos)) return;
                if (this.posToPiece(pos) !== pieceType) return;
                if (element.valid) {
                    if (!element.valid(this, target)) return;
                }

                checkingPieces.push(pos)
            });
        }

        return checkingPieces;
    }

    fen() {
        let res = "";
        let count = 0;
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                if (!pieceSet.has(this.board[i][j])) {
                    count++;
                    continue;
                }
                if (count > 0) {
                    res += count;
                    count = 0;
                }
                res += this.board[i][j];
            }

            if (count > 0) {
                res += count;
                count = 0;
            }
            if (i !== 7) res += "/";
        }

        return `${res} ${this.turn} ${this.castlingRights} ${this.enPassant} ${this.fiftyMove} ${this.moveCount}`
    }
}

if (typeof module !== 'undefined') {
    module.exports = {
        Chess
    };
}
