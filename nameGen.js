const NAMES = {};

const LAST_NAMES = ["A", "B", "C"];

async function nameGenInit() {
    let r = await fetch("./names/humanFirstNames.json");
    NAMES.humanFirstNames = await r.json();
}

function generateName() {
    return pickRandom(NAMES.humanFirstNames) + " " + pickRandom(LAST_NAMES);
}