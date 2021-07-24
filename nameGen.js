const NAMES = {};

async function nameGenInit() {
    let humanFirstNames = await fetch("./names/humanFirstNames.json");
    NAMES.humanFirstNames = await humanFirstNames.json();

    let humanSurnames = await fetch("./names/humanSurnames.json");
    NAMES.humanSurnames = await humanSurnames.json();
}

function generateName() {
    return pickRandom(NAMES.humanFirstNames) + " " + pickRandom(NAMES.humanSurnames);
}

function generateSurname() {
    return pickRandom(NAMES.humanSurnames);
}