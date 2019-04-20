var pName1 = "";
var pChoice1 = "";
var pScore1 = 0;

var pName2 = "";
var pChoice2 = "";
var pScore2 = 0;

var draws = 0;

var gameState;
var players = 0;

var connectionId;
var uniqueId;
var playerId1;
var playerId2;

var latestChat = "";
var latestSender = "";

var screenName = "";

var c1 = {
    name: "rock",
    value: "r"
};
var c2 = {
    name: "paper",
    value: "p"
};
var c3 = {
    name: "scissors",
    value: "s"
};

var choiceBank = [c1, c2, c3];

function resetGame(){
    pName1 = "Player 1";
    pChoice1 = "";
    pScore1 = 0;
    $("#score-1").text("Score: " + pScore1);

    pName2 = "Player 2";
    pChoice2 = "";
    pScore2 = 0;
    $("#score-2").text("Score: " + pScore2);

    draws = 0;

    players = 0;

    playerId1 = "no";
    playerId2 = "no";

    // $("#name-form").css("display", "block");
    $("#rematch").css("display", "none");

    gameState = "start";
    updateGame(gameState, players, playerId1, playerId2);
    updateP1(pName1, pChoice1, pScore1);
    updateP2(pName2, pChoice2, pScore2);

    resultRef.set({
        outcome: ("Waiting for result...")
    });
    // updatePrompt();

    // $("#results").text("Enter name for Player 1");
}

function newPlayer(){
    //Update prompt accordingly?

    updatePrompt(gameState);
}

function updatePrompt(state){
    //start, p1, p2, result
    var result;
    switch(state) {
        case "start":
            result = "Enter name for player " + (players + 1);
            break;
        case "p1":
            result = pName1 + " is choosing...";
            break;
        case "p2":
            result = pName2 + " is choosing...";
            break;
        case "result":
            result = "";
            break;
        default:
            result = "Loading...";
    }
    // $("#results").text(result);
    promptRef.set({
        prompt: result
    });
}

function prepMatch(){
    pChoice1 = "";
    pChoice1 = "";

    // $("#results").text(pName1 + " is choosing...");

    gameState = "p1";
    updateGame(gameState, players, playerId1, playerId2);
    updatePrompt(gameState);
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
    
    
}

function pushChat(message){
    var newP = $("<p>");
    newP.text(latestSender + ": " + message);
    $("#chat").append(newP);

    $("#chat-input").val("");

    console.log($("#chat")[0].scrollTop);
    $("#chat")[0].scrollTop = $("#chat")[0].scrollHeight;
}

function updateGame(statePass, playersPass, idPass1, idPass2){
    gameRef.set({
        state: statePass,
        players: playersPass,
        p1id: idPass1,
        p2id: idPass2
    });
}

function updateP1(name, choice, score){
    p1Ref.set({
        name: name,
        choice: choice,
        score: score
    });
}

function updateP2(name, choice, score){
    p2Ref.set({
        name: name,
        choice: choice,
        score: score
    });
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
var p1Ref = database.ref("/player1");
var p2Ref = database.ref("/player2");
var promptRef = database.ref("/prompt");
var resultRef = database.ref("/result");
///////////SET GAME STATE IN DB

// '.info/connected' is a boolean value, true if the client is connected and false if they are not.
var connectedRef = database.ref(".info/connected");
console.log("Connected: " + connectedRef);

// When the client's connection state changes...
connectedRef.on("value", function(snap) {
    // If they are connected..
    if (snap.val()) {

        // Add user to the connections list.
        connectionId = connectionsRef.push(true);

        screenName = connectionId.key.substr(connectionId.key.length - 5);
        $("#screen-name").text(screenName);

        chatRef.set({
            chat: screenName + " has joined the chat!",
            sender: "System"
        });
        // uniqueId = connectionId.key;

        // Remove user from the connection list when they disconnect.
        connectionId.onDisconnect().remove();

        // for (key in connectionId){
        //     console.log(key);
        // }

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
    gameState = snapshot.val().state;
    players = snapshot.val().players;
    playerId1 = snapshot.val().p1id;
    playerId2 = snapshot.val().p2id;
    updatePrompt(gameState);

    $("#choices-1").empty();
    $("#choices-2").empty();

    if(gameState !== "start"){
        $("#name-form").css("display", "none");
    } else {
        $("#name-form").css("display", "block");
        // $("#matchup").text("");
    }

    if((gameState === "p1") && (connectionId.key === playerId1)){
        populateChoices(1);
        
    } else if((gameState === "p2") && (connectionId.key === playerId2)){
        populateChoices(2);
        
    }
}, function(errorObject){
    console.log(errorObject.code);
});

p1Ref.on("value", function(snapshot){
    pChoice1 = snapshot.val().choice;
    pName1 = snapshot.val().name;
    pScore1 = snapshot.val().score;
    $("#name-1").text(pName1);
    $("#score-1").text("Score: " + pScore1);
});

p2Ref.on("value", function(snapshot){
    pChoice2 = snapshot.val().choice;
    pName2 = snapshot.val().name;
    pScore2 = snapshot.val().score;
    $("#name-2").text(pName2);
    $("#score-2").text("Score: " + pScore2);
});

promptRef.on("value", function(snapshot){
    $("#results").text(snapshot.val().prompt);
});

resultRef.on("value", function(snapshot){
    $("#matchup").text(snapshot.val().outcome);
});

chatRef.on("value", function(snapshot){

    //Keep track of players in the game
    latestChat = snapshot.val().chat;
    latestSender = snapshot.val().sender;
    pushChat(latestChat);
    console.log(snapshot.numChildren());
}), function(errorObject){
    console.log(errorObject.code);
};


$("#submit-player").on("click", function(event){
    event.preventDefault();
    var input = $("#player-input").val().trim();
    if(gameState === "start" && input !== "" && players < 2){
        
        console.log("Player 1: " + pName1);
        console.log("Player 2: " + pName2);

        if(players == 0){
            setName(input);
            // $("#results").text("Enter name for Player 2");
            players++;
            updatePrompt(gameState);
            updateGame(gameState, players, connectionId.key, playerId2);
            updateP1(pName1, "", 0);
            

            console.log("Set the player info");
        } else if((players == 1) && (connectionId.key !== playerId1)){
            setName(input);
            gameState = "p1";
            // $("#results").text(pName1 + " is choosing...");
            $("#name-form").css("display", "none");
            players++;
            updateGame(gameState, players, playerId1, connectionId.key);
            updateP2(pName2, "", 0);
            updatePrompt(gameState);
            console.log("Pouplatng player 1...");
            // populateChoices(1);
        }

        
        
    }
    console.log("Game State: " + gameState);
    console.log("Players: " + players);
    $("#player-input").val("");
    
});

$("#choices-1").on("click", ".player-choice-1", function(){
    if(gameState === "p1" && connectionId.key === playerId1){
        pChoice1 = $(this).attr("data-choice");
        // $("#results").text(pName2 + " is choosing...");
        gameState = "p2";
        // populateChoices(2);
        updateGame(gameState, players, playerId1, playerId2);
        updateP1(pName1, pChoice1, pScore1);
        updatePrompt(gameState);
    }
});

$("#choices-2").on("click", ".player-choice-2", function(){
    if(gameState === "p2" && connectionId.key === playerId2){
        pChoice2 = $(this).attr("data-choice");
        updateP2(pName2, pChoice2, pScore2);

        var gameResult = chooseWinner(pChoice1, pChoice2);

        // $("#matchup").text(pName1 + ": " + pChoice1 + " - " + pName2 + ": " + pChoice2);

        var pChoiceDisplay1;
        var pChoiceDisplay2;

        if(pChoice1 === "r"){
            pChoiceDisplay1 = "rock";
        } else if(pChoice1 === "p"){
            pChoiceDisplay1 = "paper";
        } else if(pChoice1 === "s"){
            pChoiceDisplay1 = "scissors";
        }

        if(pChoice2 === "r"){
            pChoiceDisplay2 = "rock";
        } else if(pChoice2 === "p"){
            pChoiceDisplay2 = "paper";
        } else if(pChoice2 === "s"){
            pChoiceDisplay2 = "scissors";
        }

        resultRef.set({
            outcome: (pName1 + ": " + pChoiceDisplay1 + " - " + pName2 + ": " + pChoiceDisplay2)
        });
        
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
        // gameState = "result";
        gameState = "p1";
        updateGame(gameState, players, playerId1, playerId2);
        updateP1(pName1, pChoice1, pScore1);
        updateP2(pName2, pChoice2, pScore2);
        
        $("#choices-1").empty();
        $("#choices-2").empty();
    }
});


$("#submit-chat").on("click", function(event){
    event.preventDefault();
    var text = $("#chat-input").val().trim();

    chatRef.set({
        chat: text,
        sender: connectionId.key.substr(connectionId.key.length - 5)
    });

    //Debug - uncover reset button
    if(text === "debug"){
        $("#magic-button").css("display", "inline-block");
    }
});

$(document).ready(function(){
    // resetGame();
    newPlayer();
});

function populateChoices(player){
    $.each(choiceBank, function(i, choice){
        var rpsP = $("<p>");
        rpsP.addClass("player-choice-" + player);
        rpsP.attr("id", choice.name + "-" + player);
        rpsP.attr("data-choice", choice.value);
        rpsP.text(choice.name);
        $("#choices-" + player).append(rpsP);
        console.log(rpsP);
    });
}

$("#magic-button").on("click", resetGame);

function checkGame(){
    console.log("CHECK START---");
    console.log("Game state: " + gameState);
    console.log("My ID: " + connectionId.key);
    console.log("P1 ID: " + playerId1);
    console.log("P2 ID: " + playerId2);
    console.log("Players: " + players);
    console.log("Players: " + players);
    console.log("Condition check: " + (connectionId.key !== playerId1));
    console.log("ID Key type: " + typeof connectionId.key);
    console.log("Unique ID: " + uniqueId);
    console.log("Unique ID Check: " + (connectionId.key != uniqueId));
    console.log("Unique ID pid Check: " + (playerId1 != uniqueId));
    console.log("Sanity Check: " + ("poo" != "poo"));
    console.log(connectionId.key.substr(connectionId.key.length - 5));
}

$("#check-button").on("click", checkGame);