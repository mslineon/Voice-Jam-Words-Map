// Idea # 2
// Map of the words - the map is not the territory / the response is not the answer. 

"use strict";

const voiceOutput = new p5.Speech(); // variables to output speech (class)
let voiceText = ""; // empty strings

let words; // array(list) of strings(words) held here
let amtWords; // number of words - only set after finished typing

let textBox, submitTextButton; // variables that holds the HTML textbox & button

let responseAnswerArray;
let responseAnswer = "";

// let currentVoice = "user"; // Initialize the current voice as "user"

let letterToNumber = { // ChatGpt4 for reordering/associating the alphabetical object
    "a": "01",
    "b": "02",
    "c": "03",
    "d": "04",
    "e": "05",
    "f": "06",
    "g": "07",
    "h": "08",
    "i": "09",
    "j": "10",
    "k": "11",
    "l": "12",
    "m": "13",
    "n": "14",
    "o": "15",
    "p": "16",
    "q": "17",
    "r": "18",
    "s": "19",
    "t": "20",
    "u": "21",
    "v": "22",
    "w": "23",
    "x": "24",
    "y": "25",
    "z": "26"
  };

function preload() {
    responseAnswerArray = loadStrings("assets/data/text.txt"); // P5js ref to load the text files.
}

function setup() {
    // voiceOutput.setVoice(`Google UK English Female`); // why my voice doesn't change? 
    createCanvas(windowWidth,windowHeight);

    // text Box to input text
    const textBoxWidth = 400; 
    textBox = createInput(""); // field with text 
    textBox.size(textBoxWidth); // size of the box
    textBox.position(width/2 - textBoxWidth/2, height - 100); // display in box

    //button
    const submitButtonWidth = textBoxWidth/2;
    submitTextButton = createButton("answer");
    submitTextButton.size(textBoxWidth/3);
    submitTextButton.position(width/2 - submitButtonWidth/3,  height - 50);
    submitTextButton.mousePressed(getResponseAnswer);

    textAlign(CENTER, CENTER);
    // console.log(voiceOutput.listVoices()); 

    // Ref ChatGPT4
    // let originalString = "This is a sample string, with numbers 123 and symbols !@#.";
    // let cleanedString = originalString.replace(/[^a-zA-Z\s]/g, '').replace(/\s+/g, ' ');
    // console.log(cleanedString);
    // Result: This is a sample string, with numbers and symbols.
}

// Create new function for user questions input?



function getResponseAnswer() {

    // keep this in case
    // if (currentVoice === "user") {
    //     voiceOutput.setVoice(`Google UK English Male`);
    //     currentVoice = "computer";
    // } 
    //     else {
    //     voiceOutput.setVoice(`Google UK English Female`);
    //     currentVoice = "user";
    //     }
    // console.log("Current voice after switch:", currentVoice);
  

    voiceOutput.setVoice(`Google UK English Male`);
    responseAnswer = random(responseAnswerArray); // get new answer
    voiceOutput.speak(responseAnswer);

    responseAnswer = responseAnswer.replace(/[^a-zA-Z\s]/g, '').replace(/\s+/g, ' '); // GPT4 - Regular expression (removing numb & symbols)
}

function draw() {
    background(30);
    
    let textBoxContent = textBox.value(); // identify the word in the textbox
    textBoxContent = textBoxContent.replace(/[^a-zA-Z\s]/g, '').replace(/\s+/g, ' '); // GPT4 - Regular expression (removing numb & symbols)
    words = textBoxContent.split(" "); // split the sentence in the textbox at each space, and get back a list of words

    let unfinishedWord = words.pop(); // remove the last word of the array and put it in the unfinished word
    text(unfinishedWord, width/2, height/2); // display the last word written by the user
    
    // word.length only changes when the user is done writing a word & adds a space // move this in a function
    if (amtWords != words.length) { // only run once
        amtWords = words.length; 
        if (words[amtWords - 1]) { // the voice output happening when we start writing the first word
            voiceOutput.setVoice(`Google UK English Female`); // why my voice doesn't change? 
            voiceOutput.speak(words[amtWords - 1]); // voice output of the user writing the last word
        }
    }
    
    wordMap(words, true); // words on map (see function below)

    if (responseAnswer.length > 0) {
        let responseWords = responseAnswer.split(" ");
        wordMap(responseWords,false);
    }
    textSize(30);
    fill(255);
    // text(textBox.value(), width/2, height/3);
    text(`The map is not the territory\nThe response is not the answer`, width/2, height/3);
    textSize(20);
    text(`The Map of The Words`, width/2, 50);
    textSize(15);
    text(`Ask me any questions and I will try to map an answer.`, width/2, height - 200);
    textSize(10);
}

function wordMap(currentPhrase, isUser) { // visual of the maps 
    textSize(10);

    push();
        translate(width/2, height/2);
        beginShape(); // drawing the line starts here
        for (let i = 0; i < currentPhrase.length; i++) {
            let vectorResult = wordToVec(currentPhrase[i]); // the magic happens here - turn word into vector (matrices & vectors course got handy here)
            if (isUser) {
                fill(255,0,0);
            }
            else {
                fill(0,0, 255);
            }
            vertex(vectorResult[0] * width/3, vectorResult[1] * height/3); // points connected by the line
            text(currentPhrase[i], vectorResult[0] * (width/3), vectorResult[1] * (height/3)); // integrating user sentence and position it a the point where we calculated the vectors
        }
        noFill();
        stroke(255, 50);
        endShape(); // Drawing the line is ended, all the points are defined and the line are connecting it 
    pop();
}


function wordToVec(word) {

    let vectorString = ["0.", "0."]; // array of strings [0,1]

    for (let letterIdx = 0; letterIdx < word.length; letterIdx++) { // indicating each letters in the word 

        let letter = word[letterIdx].toLowerCase(); // get the letter at the Idx above
        let letterNumber = letterToNumber[letter]; // lookup letter in the object to link letter to a number
        
        if (letterIdx <= word.length/2) { // first half of the word (x)
            vectorString[0] += letterNumber; // add digits to vector string (x)
        }
        else { // second half of the word
            vectorString[1] += letterNumber; // add digits to vector string (y)
        }
    }
    // turn the vector x,y into number
    let x = Number(vectorString[0]); 
    let y = Number(vectorString[1]); 

    // scaling the number 
    let vector = [
        (x * 3.3) * 2 - 1,
        (y * 3.3) * 2 - 1
    ]
    return vector; // pooping it out
}


