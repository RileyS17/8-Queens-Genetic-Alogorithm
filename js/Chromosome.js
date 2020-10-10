function Chromosome(genoSize) {
    this.fitness = 0;
    this.genes = new Array(genoSize);
    this.nonConflict = 0;
}

// Populate the geno to have 0s and 1s
Chromosome.prototype.initalize = function() {
    for (let index = 0; index < this.genes.length; index++) {
        this.genes[index] = Math.floor(Math.random()*8);
        // Evaluate the fitness of the inital chromosome
        this.getFitness();
    }
}

Chromosome.prototype.getFitness = function() {
    let conflicts = 0;
    let numOfQueens = 8;
    // Array of the coordanates of the queens index=>colom | element=>row
    let queenArray = this.genes;

    // Iterates through array of queens, countes how many queens on each row and diagonals
    // Queens on n-slope diagonals have the same sum of column + row num (i + x)
    // Queens on p-slope diagonals have same sum of column (i) + inverted row (numOfQueens-1 - x)
    let q_row = new Array(numOfQueens*2).fill(0);
    let q_ndiag = new Array(numOfQueens*2).fill(0);
    let q_pdiag = new Array(numOfQueens*2).fill(0);

    for (let i = 0; i < numOfQueens; i++) {
        let x = queenArray[i];
        q_row[x]++; // Counter for rows
        q_ndiag[x + i]++; // Counter for negative slope diagonals
        q_pdiag[numOfQueens - 1 - x + i]++; // Counter for positive slope diagonals
    }
    // (X * (X-1)) / 2 = number of conflicts per straight line (row / diagonal)
    // Counts conflicts based on num of queens per row
    // Iterates numOfQueens*2 because diagonals can be stored up to value of 14
    for (let i = 0; i < numOfQueens*2; i++) {
        conflicts += ((q_row[i] * (q_row[i] - 1)) / 2);
        conflicts += ((q_ndiag[i] * (q_ndiag[i] - 1)) / 2);
        conflicts += ((q_pdiag[i] * (q_pdiag[i] - 1)) / 2);
    }
    this.nonConflict = 28 - conflicts; // Number of non-conflict pairs in the chromosome
    this.fitness = 1-(conflicts/28); // 28 is maximum number of conflicts, inverse so higher fitness = less conflict percentage
}

// One point crossover with two parent chromosomes
Chromosome.prototype.crossover = function(otherChromo) {
    let child = new Chromosome(this.genes.length);
    let crossPoint = Math.round(Math.random()*(this.genes.length));
    child.genes = this.genes.slice(0, crossPoint).concat(otherChromo.genes.slice(crossPoint));
    child.getFitness();
    return child;
}

// Mutation of the genes
Chromosome.prototype.mutate = function(mutFactor) {
    if (Math.random() < mutFactor) { // Number between 0 and 1
        this.genes[Math.floor(Math.random()*8)] = Math.floor(Math.random()*8);
    }
}