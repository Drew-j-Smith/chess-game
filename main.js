$(function generateBoard() {
    $(".board").css("grid-template-columns", "100px ".repeat(8));
    $(".board").css("grid-template-rows", "100px ".repeat(8));

    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            $(".board").append(`<div class="${i % 2 != j % 2 ? "dark" : "light"}-square"></div>`);
        }
    }
    $(".board").children("*").addClass("square");
});

function pieceMovement() {
    $(".piece").draggable({
        scroll: false,
        revert: "invalid",
        revertDuration: 0
    });
    $(".piece").mousedown(function () {
        $(this).css('z-index', '1000');
    });
    $(".piece").mouseup(function () {
        $(this).css('z-index', '1');
    });
    $(".square").droppable({
        accept: function (dropElem) {
            if ($(this).find(dropElem).length == 1) {
                return false;
            }
            return true;
        },
        drop: function (event, ui) {
            $(ui.draggable).css({ "left": 0, "top": 0 });
            if ($(this).children().length == 0) {
                var audio = new Audio('./public_sound_standard_Move.mp3');
            } else {
                var audio = new Audio('./public_sound_standard_Capture.mp3');
            }
            audio.play();

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
    // alert(new Chess(fen).fen());
    var pos = 0;
    let data = await $.getJSON("./pictures.json");
    for (var i = 0; i < fen.length; i++) {
        if (pos >= 64)
            break;
        if (fen[i] in data) {
            pos++;
            $(`.board div:nth-child(${pos})`).append(`<img src="${data[fen[i]]}">`);
            continue;
        }
        if (fen[i] == "/") {
            continue;
        }
        pos += parseInt(fen[i], 10);
    }
    $(".board").children().children().addClass("piece");
    pieceMovement();
}

