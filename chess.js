class Chess {

    whitePieceSet = new Set(["R", "N", "B", "Q", "K", "P"]);
    blackPieceSet = new Set(["r", "n", "b", "q", "k", "p"]);
    pieceSet = new Set([...this.whitePieceSet, ...this.blackPieceSet]);

    constructor(fen) {
        let fenArr = fen.split(' ');

        this.board = [];
        let boardStr = fenArr[0];
        let pos = 0;
        for (let i = 0; i < boardStr.length; i++) {
            if (this.pieceSet.has(boardStr[i])) {
                pos++;
                this.board.push(boardStr[i]);
                continue;
            }
            if (boardStr[i] == "/") {
                continue;
            }
            let number = parseInt(boardStr[i], 10);
            pos += number;
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

    valid(start, dst) {
        if (start == dst) return false;
        if (this.turn == "w") {
            if (this.blackPieceSet.has(this.board[start])) return false;
            if (this.whitePieceSet.has(this.board[dst])) return false;
        } else {
            if (this.whitePieceSet.has(this.board[start])) return false;
            if (this.blackPieceSet.has(this.board[dst])) return false;
        }
        switch (this.board[start]) {
            case "":
                return false;
            //TODO
        }
        return true;
    }

    move(start, dst) {
        // TODO implement castling and en passent

        if (this.board[dst] != "" || this.board[start].toLowerCase() == "p") {
            this.fiftyMove = 0;
        } else {
            this.fiftyMove++;
        }

        this.board[dst] = this.board[start];
        this.board[start] = "";

        if (this.turn == "w") {
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

    getOppositePieceSet(color) {
        if (color == "w") {
            return this.blackPieceSet;
        } else {
            return this.whitePieceSet;
        }
    }

    getKingPos(color) {
        let kingIndex = this.board.findIndex(element =>
            color == "w" && element == "K" ||
            color == "b" && element == "k");
        return [kingIndex % 8, (kingIndex - kingIndex % 8) / 8];
    }

    findCheckingPieces(color) {
        let checkingPieces = [];

        let kingPos = this.getKingPos(color);
        let oppositePieceSet = this.getOppositePieceSet(color);
        // alert(color + " " + kingPos + " " + [...oppositePieceSet])

        let isValid = (pos) =>
            0 <= pos[0] &&
            pos[0] < 8 &&
            0 <= pos[1] &&
            pos[1] < 8;
        let isValidRelative = (pos) => isValid(addVec(pos, kingPos));
        let addVec = (first, second) => [first[0] + second[0], first[1] + second[1]];
        let posToPiece = (pos) => this.board[pos[0] + pos[1] * 8];


        // bishop/queen/pawn check
        [[1, 1], [1, -1], [-1, 1], [-1, -1]].filter(isValidRelative).forEach(element => {
            let pos = addVec(kingPos, element);
            while (isValid(pos) && posToPiece(pos) == "") {
                pos = addVec(pos, element);
            }
            if (!isValid(pos)) return;
            if (!oppositePieceSet.has(posToPiece(pos))) return;
            if (!new Set(["b", "q", "p"]).has(posToPiece(pos).toLowerCase())) return;
            if (posToPiece(pos).toLowerCase() == "p") {
                if (color == "w" && element[1] > 0) return;
                if (color == "b" && element[1] < 0) return;
                if (pos[0] != addVec(kingPos, element)[0]) return;
                if (pos[1] != addVec(kingPos, element)[1]) return;
            }
            checkingPieces.push(pos);
        });


        // rook/queen check
        [[1, 0], [-1, 0], [0, 1], [0, -1]].filter(isValidRelative).forEach(element => {
            let pos = addVec(kingPos, element);
            while (isValid(pos) && posToPiece(pos) == "") {
                pos = addVec(pos, element);
            }
            if (!(isValid(pos))) return;
            if (!oppositePieceSet.has(posToPiece(pos))) return;
            if (posToPiece(pos).toLowerCase() != "r" &&
                posToPiece(pos).toLowerCase() != "q") return;
            checkingPieces.push(pos);
        });

        // knight check
        [[2, 1], [1, 2], [2, -1], [1, -2], [-2, 1], [-1, 2], [-2, -1], [-1, -2]]
            .filter(isValidRelative).forEach(element => {
                let pos = addVec(kingPos, element);
                if (!oppositePieceSet.has(posToPiece(pos))) return;
                if (posToPiece(pos).toLowerCase() != "n") return;
                checkingPieces.push(pos);
            });

        return checkingPieces;
    }

    fen() {
        let res = "";
        let count = 0;
        for (let i = 0; i < 64; i++) {

            if (i != 0 && i % 8 == 0) {
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
