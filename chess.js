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
const blackPawnMoves = [
    { file: -1, rank: 1, valid: (chess, dst) => chess.posToPiece(dst) !== "" },
    { file: 0, rank: 1, valid: (chess, dst) => chess.posToPiece(dst) === "" },
    { file: 1, rank: 1, valid: (chess, dst) => chess.posToPiece(dst) !== "" },
    { file: 0, rank: 2, valid: (chess, dst) => chess.posToPiece({ file: dst.file, rank: 2 }) === "" && dst.rank === 3 }
];
const whitePawnMoves = [
    { file: -1, rank: -1, valid: (chess, dst) => chess.posToPiece(dst) !== "" },
    { file: 0, rank: -1, valid: (chess, dst) => chess.posToPiece(dst) === "" },
    { file: 1, rank: -1, valid: (chess, dst) => chess.posToPiece(dst) !== "" },
    { file: 0, rank: -2, valid: (chess, dst) => chess.posToPiece({ file: dst.file, rank: 5 }) === "" && dst.rank === 4 }
];
const pieces = {
    r: { moveSet: ranksAndFiles, absoluteEquals: false },
    R: { moveSet: ranksAndFiles, absoluteEquals: false },
    n: { moveSet: knightMoves, absoluteEquals: true },
    N: { moveSet: knightMoves, absoluteEquals: true },
    b: { moveSet: diagonals, absoluteEquals: false },
    B: { moveSet: diagonals, absoluteEquals: false },
    q: { moveSet: ranksAndFiles.concat(diagonals), absoluteEquals: false },
    Q: { moveSet: ranksAndFiles.concat(diagonals), absoluteEquals: false },
    k: { moveSet: ranksAndFiles.concat(diagonals), absoluteEquals: true },
    K: { moveSet: ranksAndFiles.concat(diagonals), absoluteEquals: true },
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

class Chess {
    constructor(fen) {
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
        this.enPassent = fenArr[3];
        this.fiftyMove = parseInt(fenArr[4], 10);
        this.moveCount = parseInt(fenArr[5], 10);
    }

    posToPiece = (pos) => this.board[pos.rank][pos.file];

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
        // TODO make sure not in check, en passent and castling
        return true;
    }

    move(start, dst) {
        // TODO implement castling and en passent

        if (this.posToPiece(dst) !== "" || this.posToPiece(start).toLowerCase() === "p") {
            this.fiftyMove = 0;
        } else {
            this.fiftyMove++;
        }

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
        let checkingPieces = [];

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
        let oppositePieceSet = color === "w" ? blackPieceSet : whitePieceSet;

        let isValid = (pos) =>
            0 <= pos.file &&
            pos.file < 8 &&
            0 <= pos.rank &&
            pos.rank < 8;
        let isValidRelative = (pos) => isValid(posAdd(pos, kingPos));
        
        let findPiece = (element) => {
            let pos = posAdd(kingPos, element);
            while (isValid(pos) && this.posToPiece(pos) === "") {
                pos = posAdd(pos, element);
            }
            if (!isValid(pos)) return;
            if (!oppositePieceSet.has(this.posToPiece(pos))) return;
            return pos;
        }


        // bishop/queen/pawn check
        diagonals.filter(isValidRelative).forEach(element => {
            let pos = findPiece(element);
            if (!pos) return;
            if (!new Set(["b", "q", "p"]).has(this.posToPiece(pos).toLowerCase())) return;
            if (this.posToPiece(pos).toLowerCase() === "p") {
                if (color === "w" && element.rank > 0) return;
                if (color === "b" && element.rank < 0) return;
                if (pos.file !== posAdd(kingPos, element).file) return;
                if (pos.rank !== posAdd(kingPos, element).rank) return;
            }
            checkingPieces.push(pos);
        });


        // rook/queen check
        ranksAndFiles.filter(isValidRelative).forEach(element => {
            let pos = findPiece(element);
            if (!pos) return;
            if (this.posToPiece(pos).toLowerCase() !== "r" &&
                this.posToPiece(pos).toLowerCase() !== "q") return;
            checkingPieces.push(pos);
        });

        // knight check
        knightMoves.filter(isValidRelative).forEach(element => {
            let pos = posAdd(kingPos, element);
            if (!oppositePieceSet.has(this.posToPiece(pos))) return;
            if (this.posToPiece(pos).toLowerCase() !== "n") return;
            checkingPieces.push(pos);
        });

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
            res += "/";
        }

        return `${res} ${this.turn} ${this.castlingRights} ${this.enPassent} ${this.fiftyMove} ${this.moveCount}`
    }
}
