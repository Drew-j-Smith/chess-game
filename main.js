function generateBoard() {
    $(".board").css("grid-template-columns", "100px ".repeat(8));
    $(".board").css("grid-template-rows", "100px ".repeat(8));

    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            $(".board").append("<div class=\"" + (i * 8 + j) + " " + (i % 2 == j % 2 ? "dark" : "light") + "-square\"></div>");
        }
    }
    $(".board").children("*").addClass("square");
}

$(function () { generateBoard(); });


function clearBoard() {
    $(".board").children("*").children("*").remove();
}

$(function generatePieces() {
    loadFen("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
})

function loadFen(fen) {
    clearBoard();
    var pos = 0;
    for (var i = 0; i < fen.length; i++) {
        if (pos >= 64)
            break;
        switch (fen[i]) {
            case "r":
                $("." + pos).append("<img src=\"./cburnett/bR.svg\">");
                pos++;
                break;
            case "n":
                $("." + pos).append("<img src=\"./cburnett/bN.svg\">");
                pos++;
                break;
            case "b":
                $("." + pos).append("<img src=\"./cburnett/bB.svg\">");
                pos++;
                break;
            case "q":
                $("." + pos).append("<img src=\"./cburnett/bQ.svg\">");
                pos++;
                break;
            case "k":
                $("." + pos).append("<img src=\"./cburnett/bK.svg\">");
                pos++;
                break;
            case "p":
                $("." + pos).append("<img src=\"./cburnett/bP.svg\">");
                pos++;
                break;

            case "R":
                $("." + pos).append("<img src=\"./cburnett/wR.svg\">");
                pos++;
                break;
            case "N":
                $("." + pos).append("<img src=\"./cburnett/wN.svg\">");
                pos++;
                break;
            case "B":
                $("." + pos).append("<img src=\"./cburnett/wB.svg\">");
                pos++;
                break;
            case "Q":
                $("." + pos).append("<img src=\"./cburnett/wQ.svg\">");
                pos++;
                break;
            case "K":
                $("." + pos).append("<img src=\"./cburnett/wK.svg\">");
                pos++;
                break;
            case "P":
                $("." + pos).append("<img src=\"./cburnett/wP.svg\">");
                pos++;
                break;

            case "/":
                break;

            default:
                pos += parseInt(fen[i], 10);
        }
    }
    $(".board").children("*").children("*").addClass("piece");
}

$(function pieceMovement() {
    $(".piece").draggable({ scroll: false });
    $(".piece").mousedown(function () {
        $('.board').css('z-index', '1');
        $(this).css('z-index', '1000');
        $(this).attr("curr-pos", "position: relative; left: " + $(this).position().left + "; top: " + $(this).position().top + ";")
    });
    $(".piece").mouseup(function () {
        $(this).attr("style", $(this).attr("curr-pos"))
    });
});



