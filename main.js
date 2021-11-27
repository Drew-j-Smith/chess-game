var chess;
var moveAudio = new Audio('./public_sound_standard_Move.mp3');
var captureAudio = new Audio('./public_sound_standard_Capture.mp3');

$(function generateBoard() {
    for (let i = 0; i < 8; i++) {
        $(".board").append(`<div class="row"></div>`)
        for (let j = 0; j < 8; j++) {
            $(".board .row").last().append(`<div class="square"></div>`);
        }
    }
    $(".board div:nth-child(2n) div:nth-child(2n+1)").addClass("dark-square");
    $(".board div:nth-child(2n + 1) div:nth-child(2n)").addClass("dark-square");

    $(".board div:nth-child(2n) div:nth-child(2n)").addClass("light-square");
    $(".board div:nth-child(2n + 1) div:nth-child(2n + 1)").addClass("light-square");

    $(":root").mousemove(() => {
        $(":root").css("--square-size", $(".board").width() / 8 + "px");
        $(".board").height($(".board").width());
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
        appendTo: ".board",
        start: function () {
            $(this).parent().addClass("dragging");
        },
        stop: function () {
            $(".dragging").removeClass("dragging");
        }
    });
    $(".square").droppable({
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
            $(`.board div:nth-child(${rank}) div:nth-child(${file})`).append(`<img src="${data[fen[i]]}">`);
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
    $(".board").children().children().children().addClass("piece");
    pieceMovement();
}

