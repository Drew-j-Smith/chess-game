var chess;
var moveAudio = new Audio('./public_sound_standard_Move.mp3');
var captureAudio = new Audio('./public_sound_standard_Capture.mp3');

class chess_board extends HTMLElement {
    constructor() {
        super();
    }
}

class chess_row extends HTMLElement {
    constructor() {
        super();
    }
}

class chess_square extends HTMLElement {
    constructor() {
        super();
    }
}

class chess_piece extends HTMLElement {
    constructor() {
        super();
    }
}

customElements.define("chess-board", chess_board);
customElements.define("chess-row", chess_row);
customElements.define("chess-square", chess_square);
customElements.define("chess-piece", chess_piece);

$(function generateBoard() {
    for (let i = 0; i < 8; i++) {
        $("chess-board").append(`<chess-row></chess-row>`)
        for (let j = 0; j < 8; j++) {
            $("chess-board chess-row").last().append(`<chess-square></chess-square>`);
        }
    }
    $("chess-board chess-row:nth-child(2n) chess-square:nth-child(2n+1)").addClass("dark-square");
    $("chess-board chess-row:nth-child(2n + 1) chess-square:nth-child(2n)").addClass("dark-square");

    $("chess-board chess-row:nth-child(2n) chess-square:nth-child(2n)").addClass("light-square");
    $("chess-board chess-row:nth-child(2n + 1) chess-square:nth-child(2n + 1)").addClass("light-square");

    $(":root").mousemove(() => {
        $(":root").css("--square-size", $("chess-board").width() / 8 + "px");
        $("chess-board").height($("chess-board").width());
    });
});

function pieceMovement() {
    $("chess-piece").draggable({
        scroll: false,
        revert: true,
        revertDuration: 0,
        zIndex: 100,
        helper: "clone",
        cursorAt: { top: 50, left: 50 },
        appendTo: "chess-board",
        start: function () {
            $(this).parent().addClass("dragging");
        },
        stop: function () {
            $(".dragging").removeClass("dragging");
        }
    });
    $("chess-square").droppable({
        accept: function (dropElem) {
            return chess.valid(
                {
                    file: dropElem.parent().index(), 
                    rank: dropElem.parent().parent().index()
                },
                {
                    file: $(this).index(), 
                    rank: $(this).parent().index()
                });
        },
        drop: function (event, ui) {
            if ($(this).children().length === 0) {
                moveAudio.play();
            } else {
                captureAudio.play();
            }

            chess.move(
                {
                    file: ui.draggable.parent().index(), 
                    rank: ui.draggable.parent().parent().index()},
                {
                    file: $(this).index(), 
                    rank: $(this).parent().index()
                });
            console.log(chess.fen());
            console.log(chess.findCheckingPieces("w"));
            console.log(chess.findCheckingPieces("b"));
            $(this).children().remove();
            $(this).append(ui.draggable);
        }
    });
}

$(function generatePieces() {
    loadFen("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
})

function loadFen(fen) {
    $("chess-piece").remove();
    chess = new Chess(fen);
    let file = 1;
    let rank = 1;
    for (let i = 0; i < fen.length; i++) {
        if (fen[i] === " ") break;
        if (fen[i] === "/") {
            file = 1;
            rank++;
            continue;
        }
        if (fen[i] >= "0" && fen[i] <= "9") {
            file += parseInt(fen[i], 10);
            continue
        }
        $(`chess-board chess-row:nth-child(${rank}) chess-square:nth-child(${file})`)
                .append(`<chess-piece class="${fen[i]}"></chess-piece>`);
        file++;
    }
    pieceMovement();
}

