class Chess {

    whitePieceSet = new Set(["R", "N", "B", "Q", "K", "P"]);
    blackPieceSet = new Set(["r", "n", "b", "q", "k", "p"]);
    pieceSet = new Set([...this.whitePieceSet, ...this.blackPieceSet]);
    diagonals = [[1, 1], [1, -1], [-1, 1], [-1, -1]];
    ranksAndFiles = [[1, 0], [-1, 0], [0, 1], [0, -1]];
    knightMoves = [[2, 1], [1, 2], [2, -1], [1, -2], [-2, 1], [-1, 2], [-2, -1], [-1, -2]];

    constructor(fen) {
        let fenArr = fen.split(' ');

        this.board = [];
        let boardStr = fenArr[0];
        for (let i = 0; i < boardStr.length; i++) {
            if (this.pieceSet.has(boardStr[i])) {
                this.board.push(boardStr[i]);
                continue;
            }
            if (boardStr[i] === "/") {
                continue;
            }
            let number = parseInt(boardStr[i], 10);
            for (let j = 0; j < number; j++) {
                this.board.push("");
            }
        }

        this.turn = fenArr[1];
        this.castlingRights = fenArr[2];
        this.enPassent = fenArr[3];
        this.fiftyMove = parseInt(fenArr[4], 10);
        this.moveCount = parseInt(fenArr[5], 10);
    }


    posToPiece = (pos) => this.board[pos[0] + pos[1] * 8];

    valid(start, dst) {
        let diff = [dst[0] - start[0], dst[1] - start[1]];
        let relativeEqual = (el1, el2) => (el1 > 0) === (el2 > 0) && (el1 < 0) === (el2 < 0);
        if (start[0] === dst[0] && start[1] === dst[1]) return false;
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
                    relativeEqual(element[0], diff[0]) &&
                    relativeEqual(element[1], diff[1]));
                if (!direction) return false;
                break;
            }
            case "n":
            case "N": {
                let direction = this.knightMoves.find(element =>
                    element[0] === diff[0] &&
                    element[1] === diff[1]);
                if (!direction) return false;
                break;
            }
            case "b":
            case "B": {
                if (Math.abs(diff[0]) !== Math.abs(diff[1])) return false;
                let direction = this.diagonals.find(element =>
                    relativeEqual(element[0], diff[0]) &&
                    relativeEqual(element[1], diff[1]));
                if (!direction) return false;
                break;
            }
            case "q":
            case "Q": {
                let direction = this.ranksAndFiles.concat(this.diagonals).find(element =>
                    relativeEqual(element[0], diff[0]) &&
                    relativeEqual(element[1], diff[1]));
                if (!direction) return false;
                break;
            }
            case "k":
            case "K": {
                let direction = this.ranksAndFiles.concat(this.diagonals).find(element =>
                    element[0] === diff[0] &&
                    element[1] === diff[1]);
                if (!direction) return false;
                break;
            }
            case "p": {
                let direction = [[-1, 1], [0, 1], [1, 1], [0, 2]].find(element =>
                    element[0] === diff[0] &&
                    element[1] === diff[1]);
                if (!direction) return false;
                break;
            }
            case "P": {
                let direction = [[-1, -1], [0, -1], [1, -1], [0, -2]].find(element =>
                    element[0] === diff[0] &&
                    element[1] === diff[1]);
                if (!direction) return false;
                break;
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

        this.board[dst[0] + dst[1] * 8] = this.posToPiece(start);
        this.board[start[0] + start[1] * 8] = "";

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

        let kingIndex = this.board.findIndex(element =>
            color === "w" && element === "K" ||
            color === "b" && element === "k");
        let kingPos = [kingIndex % 8, (kingIndex - kingIndex % 8) / 8];
        let oppositePieceSet = color === "w" ? this.blackPieceSet : this.whitePieceSet;

        let isValid = (pos) =>
            0 <= pos[0] &&
            pos[0] < 8 &&
            0 <= pos[1] &&
            pos[1] < 8;
        let isValidRelative = (pos) => isValid(addVec(pos, kingPos));
        let addVec = (first, second) => [first[0] + second[0], first[1] + second[1]];
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
                if (color === "w" && element[1] > 0) return;
                if (color === "b" && element[1] < 0) return;
                if (pos[0] !== addVec(kingPos, element)[0]) return;
                if (pos[1] !== addVec(kingPos, element)[1]) return;
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
        for (let i = 0; i < 64; i++) {

            if (i !== 0 && i % 8 === 0) {
                if (count > 0) {
                    res += count;
                    count = 0;
                }
                res += "/";
            }
            if (this.pieceSet.has(this.board[i])) {
                if (count > 0) {
                    res += count;
                    count = 0;
                }
                res += this.board[i];
                continue;
            }
            count++;
        }
        if (count > 0) {
            res += count;
        }
        return `${res} ${this.turn} ${this.castlingRights} ${this.enPassent} ${this.fiftyMove} ${this.moveCount}`
    }
}
