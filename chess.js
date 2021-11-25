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

    findCheckingPieces() {
        let checkingPieces = [];

        let kingPos;
        let oppositePieceSet;
        if (this.color == "w") {
            kingPos = this.board.findIndex(element => element == "K");
            oppositePieceSet = this.blackPieceSet;
        } else {
            kingPos = this.board.findIndex(element => element == "k");
            oppositePieceSet = this.whitePieceSet;
        }
        let file = kingPos % 8;
        let rank = (kingPos - file) / 8;

        let isValid = (pos) =>
            0 <= file + pos[0] &&
            file + pos[0] < 8 &&
            0 <= rank + pos[1] &&
            rank + pos[1] < 8;
        let isInbound = (pos) => 0 <= pos && pos < 64;
        let addRankAndFileToIndex = (index, el) => index + el[0] + el[1] * 8;


        // bishop/queen/pawn check
        [[1, 1], [1, -1], [-1, 1], [-1, -1]].filter(isValid).forEach(element => {
            let pos = addRankAndFileToIndex(kingPos, element);
            // TODO check pawns
            while (isInbound(pos) && this.board[pos] == "") {
                pos = addRankAndFileToIndex(pos, element);
            }
            if (!isInbound(pos)) return;
            if (!oppositePieceSet.has(this.board[pos])) return;
            if (this.board[pos].toLowerCase() != "b" &&
                this.board[pos].toLowerCase() != "q") return;
            checkingPieces.push(pos);
        });


        // rook/queen check
        [[1, 0], [-1, 0], [0, 1], [0, -1]].filter(isValid).forEach(element => {
            let pos = addRankAndFileToIndex(kingPos, element);
            while (isInbound(pos) && this.board[pos] == "") {
                pos = addRankAndFileToIndex(pos, element);
            }
            if (!(isInbound(pos))) return;
            if (!oppositePieceSet.has(this.board[pos])) return;
            if (this.board[pos].toLowerCase() != "r" &&
                this.board[pos].toLowerCase() != "q") return;
            checkingPieces.push(pos);
        });

        // knight check
        [[2, 1], [1, 2], [2, -1], [1, -2], [-2, 1], [-1, 2], [-2, -1], [-1, -2]]
            .filter(isValid).forEach(element => {
                let pos = addRankAndFileToIndex(kingPos, element);
                if (!oppositePieceSet.has(this.board[pos])) return;
                if (this.board[pos].toLowerCase() != "n") return;
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