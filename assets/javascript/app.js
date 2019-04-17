var pName1 = "";
var pChoice1 = "";
var pScore1 = 0;

var pName2 = "";
var pChoice2 = "";
var pScore2 = 0;

var gameState;
var players = 0;

function resetGame(){
    pName1 = "";
    pChoice1 = "";
    pScore1 = 0;

    pName2 = "";
    pChoice2 = "";
    pScore2 = 0;

    players = 0;

    $("#player-input").css("display", "inline-block");
    $("#submit-player").css("display", "inline-block");

    gameState = "start";
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
    } else if(players == 1){
        pName2 = name;
    }
    players++;
    
}

$("#submit-player").on("click", function(event){
    event.preventDefault();
    if(gameState === "start"){
        setName($("#player-input").val());
        console.log("Player 1: " + pName1);
        console.log("Player 2: " + pName2);

        $("#player-input").val("");

        if(players == 2){
            gameState = "p1";
            $("#player-input").css("display", "none");
            $("#submit-player").css("display", "none");
        }
    }
    
});

$(document).ready(function(){
    resetGame();
});