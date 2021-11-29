const whitePieceSet = new Set(["R", "N", "B", "Q", "K", "P"]);
const blackPieceSet = new Set(["r", "n", "b", "q", "k", "p"]);
const pieceSet = new Set([...whitePieceSet, ...blackPieceSet]);
const diagonals = [
    { file: 1, rank: 1 },
    { file: 1, rank: -1 },
    { file: -1, rank: 1 },
    { file: -1, rank: -1 }
];
const ranksAndFiles = [
    { file: 1, rank: 0 },
    { file: -1, rank: 0 },
    { file: 0, rank: 1 },
    { file: 0, rank: -1 }
];
const knightMoves = [
    { file: 2, rank: 1 },
    { file: 1, rank: 2 },
    { file: 2, rank: -1 },
    { file: 1, rank: -2 },
    { file: -2, rank: 1 },
    { file: -1, rank: 2 },
    { file: -2, rank: -1 },
    { file: -1, rank: -2 }
];
const squareNonEmpty = (chess, dst) => chess.posToPiece(dst) !== "";
const squareEmpty = (chess, dst) => chess.posToPiece(dst) === "";
const blackPawnMoves = [
    { file: -1, rank: 1, valid: squareNonEmpty },
    { file: 0, rank: 1, valid: squareEmpty },
    { file: 1, rank: 1, valid: squareNonEmpty },
    { file: 0, rank: 2, valid: (chess, dst) => squareEmpty(chess, dst) && squareEmpty(chess, { file: dst.file, rank: 2 }) && dst.rank === 3 }
];
const whitePawnMoves = [
    { file: -1, rank: -1, valid: squareNonEmpty },
    { file: 0, rank: -1, valid: squareEmpty },
    { file: 1, rank: -1, valid: squareNonEmpty },
    { file: 0, rank: -2, valid: (chess, dst) => squareEmpty(chess, dst) && squareEmpty(chess, { file: dst.file, rank: 5 }) && dst.rank === 4 }
];
const blackCastling = [
    {
        file: 2,
        rank: 0,
        valid: (chess, dst) =>
            chess.castlingRights.includes("k") &&
            squareEmpty(chess, { rank: 0, file: 5 }) &&
            squareEmpty(chess, { rank: 0, file: 6 }) &&
            chess.findAttackingPieces("w", { rank: 0, file: 5 }).length === 0 &&
            chess.findAttackingPieces("w", { rank: 0, file: 4 }).length === 0
    },
    {
        file: -3,
        rank: 0,
        valid: (chess, dst) =>
            chess.castlingRights.includes("q") &&
            squareEmpty(chess, { rank: 0, file: 3 }) &&
            squareEmpty(chess, { rank: 0, file: 2 }) &&
            squareEmpty(chess, { rank: 0, file: 1 }) &&
            chess.findAttackingPieces("w", { rank: 0, file: 3 }).length === 0 &&
            chess.findAttackingPieces("w", { rank: 0, file: 4 }).length === 0
    }
]
const whiteCastling = [
    {
        file: 2,
        rank: 0,
        valid: (chess, dst) =>
            chess.castlingRights.includes("K") &&
            squareEmpty(chess, { rank: 7, file: 5 }) &&
            squareEmpty(chess, { rank: 7, file: 6 }) &&
            chess.findAttackingPieces("b", { rank: 7, file: 5 }).length === 0 &&
            chess.findAttackingPieces("b", { rank: 7, file: 4 }).length === 0
    },
    {
        file: -3,
        rank: 0,
        valid: (chess, dst) =>
            chess.castlingRights.includes("Q") &&
            squareEmpty(chess, { rank: 7, file: 3 }) &&
            squareEmpty(chess, { rank: 7, file: 2 }) &&
            squareEmpty(chess, { rank: 7, file: 1 }) &&
            chess.findAttackingPieces("b", { rank: 7, file: 3 }).length === 0 &&
            chess.findAttackingPieces("b", { rank: 7, file: 4 }).length === 0
    }
]
const pieces = {
    r: { moveSet: ranksAndFiles, absoluteEquals: false },
    R: { moveSet: ranksAndFiles, absoluteEquals: false },
    n: { moveSet: knightMoves, absoluteEquals: true },
    N: { moveSet: knightMoves, absoluteEquals: true },
    b: { moveSet: diagonals, absoluteEquals: false },
    B: { moveSet: diagonals, absoluteEquals: false },
    q: { moveSet: ranksAndFiles.concat(diagonals), absoluteEquals: false },
    Q: { moveSet: ranksAndFiles.concat(diagonals), absoluteEquals: false },
    k: { moveSet: ranksAndFiles.concat(diagonals).concat(blackCastling), absoluteEquals: true },
    K: { moveSet: ranksAndFiles.concat(diagonals).concat(whiteCastling), absoluteEquals: true },
    p: { moveSet: blackPawnMoves, absoluteEquals: true },
    P: { moveSet: whitePawnMoves, absoluteEquals: true }
};

const posEquals = (first, second) => first.rank === second.rank && first.file === second.file;
const posRelativeEqual = (first, second) =>
    (first.rank > 0) === (second.rank > 0) &&
    (first.rank < 0) === (second.rank < 0) &&
    (first.file > 0) === (second.file > 0) &&
    (first.file < 0) === (second.file < 0);
const posAdd = (first, second) => {
    return {
        file: first.file + second.file,
        rank: first.rank + second.rank
    };
};
const posSubtract = (first, second) => {
    return {
        file: first.file - second.file,
        rank: first.rank - second.rank
    };
};

class Chess {
    constructor(variable) {
        if (variable instanceof Chess) {
            this.copyConstructor(variable);
        } else {
            this.stringConstructor(variable);
        }
    }

    copyConstructor(chess) {
        this.board = chess.board.map(el => [...el]);
        this.turn = chess.turn;
        this.castlingRights = chess.castlingRights;
        this.enPassant = chess.enPassant;
        this.fiftyMove = chess.fiftyMove;
        this.moveCount = chess.moveCount;
    }

    stringConstructor(fen) {
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

    posToPiece(pos) {
        return this.board[pos.rank][pos.file];
    }

    valid(start, dst) {
        let diff = {
            rank: dst.rank - start.rank,
            file: dst.file - start.file
        };

        if (posEquals(start, dst)) return false;
        if ((this.turn === "w" ? blackPieceSet : whitePieceSet).has(this.posToPiece(start))) return false;
        if ((this.turn === "w" ? whitePieceSet : blackPieceSet).has(this.posToPiece(dst))) return false;

        let piece = pieces[this.posToPiece(start)];
        let direction = piece.moveSet.find(element =>
            piece.absoluteEquals ? posEquals(element, diff) : posRelativeEqual(element, diff));
        if (!direction) return false;
        if (Math.abs(direction.rank) === 1 && Math.abs(direction.file) === 1 &&
            Math.abs(diff.rank) !== Math.abs(diff.file)) return false;
        let pos = posAdd(start, direction);
        while (!posEquals(pos, dst)) {
            if (this.posToPiece(pos) !== "") return false;
            pos = posAdd(pos, direction);
        }

        if ("valid" in direction) {
            if (!direction["valid"](this, dst)) return false;
        }
        let chessCopy = new Chess(this);
        chessCopy.move(start, dst);
        if (chessCopy.findCheckingPieces(this.turn).length > 0) return false;
        return true;
    }

    move(start, dst) {
        // TODO implement castling and en passant

        if (this.posToPiece(dst) !== "" || this.posToPiece(start).toLowerCase() === "p") {
            this.fiftyMove = 0;
        } else {
            this.fiftyMove++;
        }

        this.enPassant = "-";
        let updateEnPassant = (pawn, rank, rankLetter) => {
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

        let updateCastling = (king, queen, rook, rank) => {
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

    findCheckingPieces(color) {
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

    findAttackingPieces(color, target) {
        let checkingPieces = [];
        let oppositePieceSet = color === "w" ? blackPieceSet : whitePieceSet;

        let isValid = (pos) =>
            0 <= pos.file &&
            pos.file < 8 &&
            0 <= pos.rank &&
            pos.rank < 8;


        for (const pieceType in pieces) {
            if (oppositePieceSet.has(pieceType)) continue;
            pieces[pieceType].moveSet.forEach(element => {
                let pos = posSubtract(target, element);
                while (isValid(pos) && this.posToPiece(pos) === "" && !pieces[pieceType].absoluteEquals) {
                    pos = posSubtract(pos, element);
                }
                if (!isValid(pos)) return;
                if (this.posToPiece(pos) !== pieceType) return;
                if ("valid" in element) {
                    if (!element["valid"](this, target)) return;
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
