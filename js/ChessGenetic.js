function ChessGenetic(geneSize, population, mutFactor) {
    this.geneSize = geneSize;
    this.population = population;
    this.mutateFactor = mutFactor;
    this.chromosomes = new Array(this.population);
    
    for (let index = 0; index < this.chromosomes.length; index++) {
        this.chromosomes[index] = new Chromosome(this.geneSize);
        this.chromosomes[index].initalize();
    }
}

ChessGenetic.prototype.resetBoard = function() {
    for (let index = 0; index < this.chromosomes.length; index++) {
        this.chromosomes[index] = new Chromosome(this.geneSize);
        this.chromosomes[index].initalize();
    }
}

// Sort Chromosomes array by descending order
function compare(a, b) {
    let chromosome1 = a.fitness;
    let chromosome2 = b.fitness;
    let comparison = 0;

    if (chromosome1 > chromosome2) {
        comparison = -1;
    } else if(chromosome1 < chromosome2) {
        comparison = 1;
    }

    return comparison;
}

// Select parents from current generation using Roulette Wheel Selection
ChessGenetic.prototype.selection = function() {
    this.chromosomes.sort(compare);
    let selectFator = 5;
    let rand = Math.floor(Math.pow(Math.random(), selectFator) * this.population);
    let parent = this.chromosomes[rand];

    return parent;
}

// Run one iteration of the genetic algorithm
ChessGenetic.prototype.step = function() {
    let nextGenChromosomes = new Array();

    // Select, crossover, and mutate the next generation
    for (let generation = 0; generation < this.population; generation++) {
        let parentA = this.selection();
        let parentB = this.selection();
        let child = parentA.crossover(parentB);
        child.mutate(this.mutateFactor);
        child.getFitness();
        nextGenChromosomes[generation] = child;
    }
    // Set the next generation of chromosomes as the current ones
    this.chromosomes = nextGenChromosomes;
}

// Return the chromosome with the highest fitness
ChessGenetic.prototype.getBestChromosome = function() {
    let bestChromosome = new Chromosome(this.geneSize);

    this.chromosomes.forEach(chromosome => {
        if (chromosome.fitness >= bestChromosome.fitness) {
            bestChromosome = chromosome;
        }
    });

    return bestChromosome;
}