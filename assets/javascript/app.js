var pName1 = "";
var pChoice1 = "";
var pScore1 = 0;

var pName2 = "";
var pChoice2 = "";
var pScore2 = 0;

var draws = 0;

var gameState;
var players = 0;

function resetGame(){
    pName1 = "";
    pChoice1 = "";
    pScore1 = 0;
    $("#score-1").text("Score: " + pScore1);

    pName2 = "";
    pChoice2 = "";
    pScore2 = 0;
    $("#score-2").text("Score: " + pScore2);

    draws = 0;

    players = 0;

    $("#player-input").css("display", "inline-block");
    $("#submit-player").css("display", "inline-block");
    $("#rematch").css("display", "none");

    gameState = "start";

    $("#results").text("Enter name for Player 1");
}

function prepMatch(){
    pChoice1 = "";
    pChoice1 = "";

    $("#results").text(pName1 + " is choosing...");

    gameState = "p1";
}

function chooseWinner(p1, p2){
    if((p1 === "r" && p2 === "s") || (p1 === "s" && p2 === "p") || (p1 === "p" && p2 === "r")){
        return 1;
    } else if (p1 === p2){
        return 0;
    } else {
        return 2;
    }
}

function setName(name){
    
    if(players == 0){
        pName1 = name;
        $("#name-1").text(pName1);
    } else if(players == 1){
        pName2 = name;
        $("#name-2").text(pName2);
    }
    players++;
    
}

$("#submit-player").on("click", function(event){
    event.preventDefault();
    if(gameState === "start"){
        setName($("#player-input").val().trim());
        console.log("Player 1: " + pName1);
        console.log("Player 2: " + pName2);

        if(players == 1){
            $("#results").text("Enter name for Player 2");
        } else if(players == 2){
            gameState = "p1";
            $("#results").text(pName1 + " is choosing...");

            $("#player-input").css("display", "none");
            $("#submit-player").css("display", "none");
        }

        $("#player-input").val("");
    }
    
});

$(".player-choice-1").on("click", function(){
    if(gameState === "p1"){
        pChoice1 = $(this).attr("data-choice");
        $("#results").text(pName2 + " is choosing...");
        gameState = "p2";
    }
});

$(".player-choice-2").on("click", function(){
    if(gameState === "p2"){
        pChoice2 = $(this).attr("data-choice");
        
        var gameResult = chooseWinner(pChoice1, pChoice2);

        if(gameResult === 1){
            $("#results").text(pName1 + " wins!");
            pScore1++;
        } else if(gameResult === 2){
            $("#results").text(pName2 + " wins!");
            pScore2++;
        } else {
            $("#results").text(pName1 + " and " + pName2 + " tied!");
            draws++;
        }

        $("#score-1").text("Score: " + pScore1);
        $("#score-2").text("Score: " + pScore2);
        
        $("#rematch").css("display", "inline-block");
        gameState = "result";
    }
});

$("#ready-button").on("click", function(){
    $("#rematch").css("display", "none");
    prepMatch();
});

$("#submit-chat").on("click", function(event){
    event.preventDefault();
    var text = $("#chat-input").val().trim();

    var newP = $("<p>");
    newP.text(text);
    $("#chat").append(newP);

    $("#chat-input").val("");

    console.log($("#chat")[0].scrollTop);
    $("#chat")[0].scrollTop = $("#chat")[0].scrollHeight;
});

$(document).ready(function(){
    resetGame();
});