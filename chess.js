class Chess {

    pieceSet = new Set(["r", "n", "b", "q", "k", "p", "R", "N", "B", "Q", "K", "P"]);

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

        this.board[dst] == this.board[start];
        this.board[start] == "";

        if (this.turn == "w") {
            this.turn = "b";
        } else {
            this.turn = "w";
            this.moveCount++;
        }
    }

    state() {
        // TODO
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
        return `${res} ${this.turn} ${this.castlingRights} ${this.enPassent} ${this.fiftyMove} ${this.moveCount}`
    }
}
