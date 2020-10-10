var chessboard = new ChessGraph('myBoard'); // Chessboard graphic object
var queenProblem; // Genetic Algorithm object
var historicalBest = 0;
var foundSolutions = [];
var curGeneration = 0;
var GENO_SIZE;
var population;
var mutation;
var bestChromosome;
var unique;

// Convert the decimal coordinates of queens into coordinates the chessboard object understands
function setPositions(coordinates) {
  let positions = {};

  positions['a'+ (coordinates[0]+1).toString()] = 'wQ';
  positions['b'+ (coordinates[1]+1).toString()] = 'wQ';
  positions['c'+ (coordinates[2]+1).toString()] = 'wQ';
  positions['d'+ (coordinates[3]+1).toString()] = 'wQ';
  positions['e'+ (coordinates[4]+1).toString()] = 'wQ';
  positions['f'+ (coordinates[5]+1).toString()] = 'wQ';
  positions['g'+ (coordinates[6]+1).toString()] = 'wQ';
  positions['h'+ (coordinates[7]+1).toString()] = 'wQ';

  return positions
}

// Output the current generation to the front-end
function displayGen(curGeneration) {
  document.getElementById('gen').innerHTML = 'Generation: ' + curGeneration;
}
// Output the fiteness of the best chromosome to the front-end
function displayFit(bestFitness) {
  document.getElementById('best-fit').innerHTML = 'Best Fit Function: ' + bestFitness;
}

// Output the current number of solutions found
function displaySolutions(solutionsNum) {
  document.getElementById('sol').innerHTML = 'Number of Unique Solutions: ' + solutionsNum;
}

// Add solution to drop menu
function addSolution() {
  let option = document.createElement('option');

  option.text = 'Solution ' + foundSolutions.length;
  option.value = foundSolutions.length - 1;
  option.selected = true;
  dropMenu.add(option);
}

function compareArray(a, b) {
  if (a.length != b.length) 
    return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i]-b[i] != 0)
      return false; //False if different
  } 
  return true; //True if same
}

// Loop for each generation
function genLoop (curGeneration, maxGen) {    
  setTimeout(function () {  
    curGeneration++;   
    queenProblem.step();
    bestChromosome = queenProblem.getBestChromosome();
    displayGen(curGeneration)

    if (curGeneration < maxGen && foundSolutions.length < 92) { 
      //If solution found
      if (bestChromosome.fitness == 1) {
        let coordinates = bestChromosome.genes;
        let positions = setPositions(coordinates);
        chessboard.setQueens(positions);
        displayFit(bestChromosome.fitness.toFixed(3));

        unique = true;
        //Iterate though all solutions in solution array
        for (let i = 0; i < foundSolutions.length; i++) {
          //If current found solution is already in array
          if (compareArray(foundSolutions[i], bestChromosome.genes)) {
            unique = false;
            console.log("Non-unique solution found");
            break;
          }
        }

        // If the found solution is unique
        if (unique) {
          foundSolutions.push(bestChromosome.genes);
          displaySolutions(foundSolutions.length);
          addSolution();
          console.log("Unique solutions found: " + foundSolutions.length);
        }
        historicalBest = 0;
        queenProblem.resetBoard();
        bestChromosome = new Chromosome(8);
      }
      genLoop(curGeneration, maxGen);          
    }
    if (curGeneration >= maxGen || foundSolutions.length >= 92)
      console.log(foundSolutions);
}, 0)
}

// Form submit event listener
function startGen(event) {
  const GENO_SIZE = 8;
  population = parseInt(document.getElementById('input-chromo').value);
  mutation = parseFloat(document.getElementById('input-mut').value);
  maxGen = parseInt(document.getElementById('input-cut').value);
  historicalBest = 0;
  
  queenProblem = new ChessGenetic(GENO_SIZE, population, mutation);
  genLoop(curGeneration, maxGen);
  event.preventDefault(); // Prevent the default behaviour of the form tag 
}

// DropMenu change event listener
function selectSolution(event) {
  let solutionIndex = dropMenu.value;
  let coordinates = foundSolutions[solutionIndex];
  let positions = setPositions(coordinates);

  chessboard.setQueens(positions);
}

// Create the submit event
const form = document.getElementById('form-gen');
const dropMenu = document.getElementById('list-sol');
form.addEventListener('submit', startGen);
dropMenu.addEventListener('change', selectSolution);