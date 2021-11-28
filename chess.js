class Chess {

    whitePieceSet = new Set(["R", "N", "B", "Q", "K", "P"]);
    blackPieceSet = new Set(["r", "n", "b", "q", "k", "p"]);
    pieceSet = new Set([...this.whitePieceSet, ...this.blackPieceSet]);
    diagonals = [
        { file: 1, rank: 1 },
        { file: 1, rank: -1 },
        { file: -1, rank: 1 },
        { file: -1, rank: -1 }
    ];
    ranksAndFiles = [
        { file: 1, rank: 0 },
        { file: -1, rank: 0 },
        { file: 0, rank: 1 },
        { file: 0, rank: -1 }
    ];
    knightMoves = [
        { file: 2, rank: 1 },
        { file: 1, rank: 2 },
        { file: 2, rank: -1 },
        { file: 1, rank: -2 },
        { file: -2, rank: 1 },
        { file: -1, rank: 2 },
        { file: -2, rank: -1 },
        { file: -1, rank: -2 }
    ];
    blackPawnMoves = [
        {file: -1, rank: 1},
        {file: 0, rank: 1},
        {file: 1, rank: 1},
        {file: 0, rank: 2}
    ];
    whitePawnMoves = [
        {file: -1, rank: -1},
        {file: 0, rank: -1},
        {file: 1, rank: -1},
        {file: 0, rank: -2}
    ];

    constructor(fen) {
        let fenArr = fen.split(' ');

        this.board = [];
        let rank = []
        let boardStr = fenArr[0];
        for (let i = 0; i < boardStr.length; i++) {
            if (this.pieceSet.has(boardStr[i])) {
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
        let relativeEqual = (first, second) => 
            (first.rank > 0) === (second.rank > 0) && 
            (first.rank < 0) === (second.rank < 0) &&
            (first.file > 0) === (second.file > 0) && 
            (first.file < 0) === (second.file < 0);
        let posEquals = (first, second) => first.rank === second.rank && first.file === second.file;
        let checkForIntermediatePieces = (direction) => {

            if (Math.abs(direction.rank) === 1 && Math.abs(direction.file) === 1 &&
                Math.abs(diff.rank) !== Math.abs(diff.file)) return true;
            let pos = start;
            while (!posEquals(pos, dst)) {
                pos = {
                    file: pos.file + direction.file,
                    rank: pos.rank + direction.rank
                }
                if (!posEquals(pos, dst) && this.posToPiece(pos) !== "") return true;
            }
            return false;
        }
        if (start.rank === dst.rank && start.file === dst.file) return false;
        if (this.turn === "w") {
            if (this.blackPieceSet.has(this.posToPiece(start))) return false;
            if (this.whitePieceSet.has(this.posToPiece(dst))) return false;
        } else {
            if (this.whitePieceSet.has(this.posToPiece(start))) return false;
            if (this.blackPieceSet.has(this.posToPiece(dst))) return false;
        }
        switch (this.posToPiece(start)) {
            case "":
                return false;
            case "r":
            case "R": {
                let direction = this.ranksAndFiles.find(element =>
                    relativeEqual(element, diff));
                if (!direction) return false;
                if (checkForIntermediatePieces(direction)) return false;
                break;
            }
            case "n":
            case "N": {
                let direction = this.knightMoves.find(element =>
                    element.file === diff.file &&
                    element.rank === diff.rank);
                if (!direction) return false;
                break;
            }
            case "b":
            case "B": {
                let direction = this.diagonals.find(element =>
                    relativeEqual(element, diff));
                if (!direction) return false;
                if (checkForIntermediatePieces(direction)) return false;
                break;
            }
            case "q":
            case "Q": {
                let direction = this.ranksAndFiles.concat(this.diagonals).find(element =>
                    relativeEqual(element, diff));
                if (!direction) return false;
                if (checkForIntermediatePieces(direction)) return false;
                break;
            }
            case "k":
            case "K": {
                let direction = this.ranksAndFiles.concat(this.diagonals).find(element =>
                    element.file === diff.file &&
                    element.rank === diff.rank);
                if (!direction) return false;
                break;
            }
            case "p": {
                let direction = this.blackPawnMoves.find(element =>
                    element.file === diff.file &&
                    element.rank === diff.rank);
                if (!direction) return false;
                if (diff.file !== 0 && this.posToPiece(dst) === "") return false;
                if (diff.file === 0 && this.posToPiece(dst) !== "") return false;
                if (diff.rank === 2 && this.posToPiece({ file: start.file, rank: 2 }) !== "") return false;
                if (diff.rank === 2 && start.rank !== 1) return false;
                break;
                // TODO en pessant
            }
            case "P": {
                let direction = this.whitePawnMoves.find(element =>
                    element.file === diff.file &&
                    element.rank === diff.rank);
                if (!direction) return false;
                if (diff.file !== 0 && this.posToPiece(dst) === "") return false;
                if (diff.file === 0 && this.posToPiece(dst) !== "") return false;
                if (diff.rank === -2 && this.posToPiece({ file: start.file, rank: 5 }) !== "") return false;
                if (diff.rank === -2 && start.rank !== 6) return false;
                break;
                // TODO en pessant
            }
        }
        // TODO make sure not in check
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
        let oppositePieceSet = color === "w" ? this.blackPieceSet : this.whitePieceSet;

        let isValid = (pos) =>
            0 <= pos.file &&
            pos.file < 8 &&
            0 <= pos.rank &&
            pos.rank < 8;
        let isValidRelative = (pos) => isValid(addVec(pos, kingPos));
        let addVec = (first, second) => {
            return {
                file: first.file + second.file,
                rank: first.rank + second.rank
            };
        };
        let findPiece = (element) => {
            let pos = addVec(kingPos, element);
            while (isValid(pos) && this.posToPiece(pos) === "") {
                pos = addVec(pos, element);
            }
            if (!isValid(pos)) return;
            if (!oppositePieceSet.has(this.posToPiece(pos))) return;
            return pos;
        }


        // bishop/queen/pawn check
        this.diagonals.filter(isValidRelative).forEach(element => {
            let pos = findPiece(element);
            if (!pos) return;
            if (!new Set(["b", "q", "p"]).has(this.posToPiece(pos).toLowerCase())) return;
            if (this.posToPiece(pos).toLowerCase() === "p") {
                if (color === "w" && element.rank > 0) return;
                if (color === "b" && element.rank < 0) return;
                if (pos.file !== addVec(kingPos, element).file) return;
                if (pos.rank !== addVec(kingPos, element).rank) return;
            }
            checkingPieces.push(pos);
        });


        // rook/queen check
        this.ranksAndFiles.filter(isValidRelative).forEach(element => {
            let pos = findPiece(element);
            if (!pos) return;
            if (this.posToPiece(pos).toLowerCase() !== "r" &&
                this.posToPiece(pos).toLowerCase() !== "q") return;
            checkingPieces.push(pos);
        });

        // knight check
        this.knightMoves.filter(isValidRelative).forEach(element => {
            let pos = addVec(kingPos, element);
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
                if (!this.pieceSet.has(this.board[i][j])) {
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
