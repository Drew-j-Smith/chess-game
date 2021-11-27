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

customElements.define("chess-board", chess_board);
customElements.define("chess-row", chess_row);
customElements.define("chess-square", chess_square);

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
    $(".piece").draggable({
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
            return chess.valid([dropElem.parent().index(), dropElem.parent().parent().index()],
                [$(this).index(), $(this).parent().index()]);
        },
        drop: function (event, ui) {
            if ($(this).children().length === 0) {
                moveAudio.play();
            } else {
                captureAudio.play();
            }

            chess.move([ui.draggable.parent().index(), ui.draggable.parent().parent().index()],
                [$(this).index(), $(this).parent().index()]);
            console.log(chess.fen());
            console.log(`"${chess.findCheckingPieces("w")}"\n"${chess.findCheckingPieces("b")}"`)
            $(this).children().remove();
            $(this).append(ui.draggable);
        }
    });
}

$(function generatePieces() {
    loadFen("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
})

async function loadFen(fen) {
    $(".piece").remove();
    chess = new Chess(fen);
    let file = 1;
    let rank = 1;
    let data = await $.getJSON("./pictures.json");
    for (let i = 0; i < fen.length; i++) {
        if (isNaN(file)) break;
        if (fen[i] in data) {
            $(`chess-board chess-row:nth-child(${rank}) chess-square:nth-child(${file})`).append(`<img src="${data[fen[i]]}">`);
            file++;
            continue;
        }
        if (fen[i] === "/") {
            file = 1;
            rank++;
            continue;
        }
        file += parseInt(fen[i], 10);
    }
    $("chess-board").children().children().children().addClass("piece");
    pieceMovement();
}

