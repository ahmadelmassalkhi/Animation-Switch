const fancy = document.querySelector(".fancy");
const input = document.querySelector(".submit-input");
const button = document.querySelector(".submit-btn");

const delay = 50; // Short delay between the addition/removal of spans' classes
let timer1 = null; // Will be used to run the addClass function once every *delay* ms
let timer2 = null; // Will be used to run the removeClass function once every *delay* ms
let character = 0; // used to loop though spans in the span-List 

button.addEventListener("click", animate);

function animate() {
  if (input.value !== "") {
    button.removeEventListener("click", animate); // Prevents the code from crashing in case the user clicked the button again while animation is running
    button.innerText = "De-Animate";

    let letters = input.value.split(""); // Creates a list of letters inserted by the user 

    input.value = "";
    fancy.innerHTML = "";
    letters.forEach((letter) => {
      fancy.innerHTML += `<span>${letter}</span>`; // Creates the spans that will be animated
    });
    timer1 = setInterval(addClass, delay); // Starts calling addClass once every *delay*

  }
}



function addClass() {
  const spans = fancy.childNodes; 
  const currentSpan = spans[character];
  const ms = spans.length * delay; // ms variable is the time taken to add/remove a class from all the spans

  //Animate
  currentSpan.classList.add("fade");

  //Fix broken spaces after animating
  if (currentSpan.innerText === "") {
    currentSpan.innerHTML = "&nbsp;";
  }

  // Setting random colors before recoloring to make it alittle fancy
  setTimeout(() => {
    setRandomColor(currentSpan);
  }, ms);


  //Re-coloring the spans
  setTimeout(() => {
    currentSpan.style.color = 'white';
  }, 2 * (ms + delay)); // 2*(ms+delay) because 2*ms makes random colors innoticable to the user

  character++; // Necessary to loop through the spans
  if (character == spans.length) { // When the class is  appplied to all spans
    clearInterval(timer1);
    timer1 = null;
    button.addEventListener("click", clock);
  }
}

function clock() {  //After clicking "De-Animate"
  button.innerText = "Animate!";
  button.removeEventListener("click", clock); //Prevents code crash
  timer2 = setInterval(removeClass, delay);
  const spans = fancy.childNodes;
  character = spans.length - 1; // Setting character to last span's index : spans[spans.length-1] = last span
}

function removeClass() {
  const spans = fancy.childNodes;
  const currentSpan = spans[character];
  const ms = spans.length * delay;
  currentSpan.style.color =  'black';
  setTimeout(() => {
    currentSpan.classList.remove("fade");
  }, ms);

  character--; // Necessary to loop through the spans backwards and remove classes
  if (character == -1) {  
    clearInterval(timer2);
    timer2 = null;
    character = 0; // Preparing character for the next animation
    
    button.addEventListener("click", animate);
  }
}



// Random Color generator
function getRandomColor() {
  let letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function setRandomColor(element) {
  element.style.color = getRandomColor();
}
