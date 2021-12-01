// import { Chess } from "./chess";

var chess: Chess;
var moveAudio = new Audio('./public_sound_standard_Move.mp3');
var captureAudio = new Audio('./public_sound_standard_Capture.mp3');

customElements.define("chess-board", class extends HTMLElement {});
customElements.define("chess-row", class extends HTMLElement {});
customElements.define("chess-square", class extends HTMLElement {});
customElements.define("chess-piece", class extends HTMLElement {});

$(function generateBoard() {
    for (let i = 0; i < 8; i++) {
        $("chess-board").append("<chess-row></chess-row>")
        for (let j = 0; j < 8; j++) {
            $("chess-board chess-row").last().append("<chess-square></chess-square>");
        }
    }
    $("chess-board :nth-child(2n) :nth-child(2n + 1)").addClass("dark-square");
    $("chess-board :nth-child(2n + 1) :nth-child(2n)").addClass("dark-square");

    $("chess-board :nth-child(2n) :nth-child(2n)").addClass("light-square");
    $("chess-board :nth-child(2n + 1) :nth-child(2n + 1)").addClass("light-square");

    $(":root").mousemove(() => { // kinda a workaround but idk how to do it better
        if ($("chess-board").height() !== $("chess-board").width()) {
            let width = $("chess-board").width();
            if (width) {
                $(":root").css("--square-size", width / 8 + "px");
                $("chess-board").height(width);
                $("chess-piece").draggable("option", "cursorAt", { top: width / 16, left: width / 16 } );
            }
        }
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
        accept: function (dropElem: JQuery<HTMLElement>) {
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
            document.location.hash = `#${chess.fen().split(" ").join("_")}`
            console.log(chess.fen());
            if (chess.findCheckingPieces("w").length > 0) {
                $("chess-piece.K").parent().addClass("check");
            } else {
                $("chess-piece.K").parent().removeClass("check");
            }
            if (chess.findCheckingPieces("b").length > 0) {
                $("chess-piece.k").parent().addClass("check");
            } else {
                $("chess-piece.k").parent().removeClass("check");
            }
            $(this).children().remove();
            $(this).append(ui.draggable);
        }
    });
}

$(function generatePieces() {
    if (document.location.hash.length > 0) { 
        loadFen(document.location.hash.substr(1).split("_").join(" "));
    } else {
        loadFen("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
    }
})

function loadFen(fen: string) {
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
        $(`chess-board :nth-child(${rank}) :nth-child(${file})`)
                .append(`<chess-piece class="${fen[i]}"></chess-piece>`);
        file++;
    }
    pieceMovement();
    if (chess.findCheckingPieces("w").length > 0) {
        $("chess-piece.K").parent().addClass("check");
    }
    if (chess.findCheckingPieces("b").length > 0) {
        $("chess-piece.k").parent().addClass("check");
    }
}
