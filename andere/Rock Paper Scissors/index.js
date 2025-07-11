function randomFunc(player) {
    const num = (Math.random());
    let comp = "XXX"
    let result = "XXX"
    if (num >= 0 && num < (1/3)){
            comp = "Rock"
        } else if (num >= (1/3) && num < (2/3)) {
            comp = "Paper"
        } else if (num >= (2/3) && num <= (1)) {
            comp = "Scissors"
        };
    if (player === comp) {
        result = "Even"
    }   else if ((player === "Rock") && (comp === "Paper")) {
            result = "You lost"}
        else if ((player === "Rock") && (comp === "Scissors")) {
            result = "You won"}
        else if ((player === "Paper") && (comp === "Rock")) {
            result = "You won"}
        else if ((player === "Paper") && (comp === "Scissors")) {
            result = "You lost"}
        else if ((player === "Scissors") && (comp === "Rock")) {
            result = "You lost"}
        else if ((player === "Scissors") && (comp === "Paper")) {
            result = "You won"};

    return("You played: " + player + " --- The Computer played: " + comp + " ----> " + result);
};
    
function rock() {
    let x = randomFunc("Rock");
    document.getElementById("result").innerHTML = x;
};

function paper() {
    let x = randomFunc("Paper");
    document.getElementById("result").innerHTML = x;
};

function scissors() {
    let x = randomFunc("Scissors");
    document.getElementById("result").innerHTML = x;
};