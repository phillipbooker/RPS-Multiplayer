var pName1 = "";
var pChoice1 = "";
var pScore1 = 0;

var pName2 = "";
var pChoice2 = "";
var pScore2 = 0;

var draws = 0;

var gameState;
var players = 0;

var userId = 17;
var connectionId;
var uniqueId;
var playerId1;
var playerId2;

var latestChat = "";

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

function pushChat(message){
    var newP = $("<p>");
    newP.text(userId + ": " + message);
    $("#chat").append(newP);

    $("#chat-input").val("");

    console.log($("#chat")[0].scrollTop);
    $("#chat")[0].scrollTop = $("#chat")[0].scrollHeight;
}

// Initialize firebase
var config = {
    apiKey: "AIzaSyDerblX8eACRH313yiepS-e9ovK8qG5owk",
    authDomain: "intro-project-a72be.firebaseapp.com",
    databaseURL: "https://intro-project-a72be.firebaseio.com",
    projectId: "intro-project-a72be",
    storageBucket: "intro-project-a72be.appspot.com",
    messagingSenderId: "305225461072"
};

firebase.initializeApp(config);

// Create a variable to reference the database.
var database = firebase.database();

// Store node references here
var connectionsRef = database.ref("/connections");
var chatRef = database.ref("/chat");
var gameRef = database.ref("/gameValues");


// '.info/connected' is a boolean value, true if the client is connected and false if they are not.
var connectedRef = database.ref(".info/connected");
console.log("Connected: " + connectedRef);

// When the client's connection state changes...
connectedRef.on("value", function(snap) {
    // If they are connected..
    if (snap.val()) {

        // Add user to the connections list.
        connectionId = connectionsRef.push(true);

        // uniqueId = connectionId.substring(1, 4);

        // Remove user from the connection list when they disconnect.
        connectionId.onDisconnect().remove();

        for (key in connectionId){
            console.log(key);
        }
        console.log("Connection id: " + connectionId);
        console.log("Type: " + connectionId.key);
    }
}, function(errorObject){
    console.log(errorObject.code);
});

connectionsRef.on("value", function(snap) {
    console.log(snap.numChildren());
    console.log(snap);
});

gameRef.on("value", function(snapshot){
    players = snapshot.val().players;
    playerId1 = snapshot.val().p1id;
    playerId2 = snapshot.val().p2id;
}, function(errorObject){
    console.log(errorObject.code);
});






chatRef.on("value", function(snapshot){
    // userId = snapshot.val().userId;

    //Keep track of players in the game
    latestChat = snapshot.val().chat;
    pushChat(latestChat);
    console.log(snapshot.numChildren());
}), function(errorObject){
    console.log(errorObject.code);
};


$("#submit-player").on("click", function(event){
    event.preventDefault();
    var input = $("#player-input").val().trim();
    if(gameState === "start" && input !== ""){
        setName(input);
        console.log("Player 1: " + pName1);
        console.log("Player 2: " + pName2);

        if(players == 1){
            $("#results").text("Enter name for Player 2");
            gameRef.set({
                p1id: connectionId.key,
                p2id: playerId2,
                players: players
            });

            console.log("Set the player info");
        } else if(players == 2){
            gameState = "p1";
            $("#results").text(pName1 + " is choosing...");

            $("#player-input").css("display", "none");
            $("#submit-player").css("display", "none");
            gameRef.set({
                p1id: playerId1,
                p2id: connectionId.key,
                players: players
            });
        }

        
        
    }
    $("#player-input").val("");
    
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

    chatRef.set({
        chat: text,
        userId: userId
    });
    connectionsRef.push(true);

    // pushChat(text);
});

$(document).ready(function(){
    resetGame();
});