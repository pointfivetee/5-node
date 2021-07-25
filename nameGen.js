const NAMES = {};

async function loadJson(path) {
    let fileContents = await fetch(path);
    return fileContents.json();
}

function capitalize(str) {
    return str.slice(0,1).toUpperCase().concat(str.slice(1));
}

async function nameGenInit() {
    // Human name lists are based on US Census data
    NAMES.humanFirstNames = await loadJson("./names/humanFirstNames.json");
    NAMES.humanSurnames = await loadJson("./names/humanSurnames.json");

    NAMES.gnomeNames = await loadJson("./names/gnomeNames.json");
    NAMES.halflingNames = await loadJson("./names/halflingNames.json");
    NAMES.tieflingNames = await loadJson("./names/tieflingNames.json");
    NAMES.dragonbornNames = await loadJson("./names/dragonbornNames.json");
}

function generateName() {
    return pickRandom([
        generateHumanName,
        generateOrcName,
        generateGnomeName,
        generateHalflingName,
        generateTieflingName,
        generateDragonbornName,
    ])();
}

function generateSurname() {
    let g = NAMES.gnomeNames;
    let h = NAMES.halflingNames;
    return pickRandom([
        () => pickRandom(NAMES.humanSurnames),
        () => `${pickRandom(g.surnamePrefixes)}${pickRandom(g.surnameSuffixes)}`,
        () => pickRandom(h.surnames),
    ])();
}

function generateHumanName() {
    return `${pickRandom(NAMES.humanFirstNames)} ${pickRandom(NAMES.humanSurnames)}`;
}

function generateGnomeName() {
    let g = NAMES.gnomeNames;
    return `${pickRandom(g.firstNames)} ${pickRandom(g.surnamePrefixes)}${pickRandom(g.surnameSuffixes)}`
}

function generateHalflingName() {
    let h = NAMES.halflingNames;
    return `${pickRandom(h.firstNames)} ${pickRandom(h.surnames)}`;
}

function generateTieflingFullName() {
    return pickRandom([
        () => generateTieflingName(),
        () => `${generateTieflingName()} ${generateTieflingName()}`,
    ])();
}

function generateDragonbornName() {
    let d = NAMES.dragonbornNames;
    return `${pickRandom(d.names)} of the ${pickRandom(d.adjectives)} ${pickRandom(d.nouns)}`;
}

function generateTieflingName() {
    let t = NAMES.tieflingNames;
    let c1 = t.initialConsonants;
    let c2 = t.middleConsonants;
    let c3 = t.finalConsonants;
    let v1 = t.initialVowels;
    let v2 = t.middleVowels;
    let v3 = t.finalVowels;

    let numPhonemes = rollD(3)+rollD(3)+1;
    let vowel;
    if (numPhonemes == 3 || numPhonemes == 5) {
        vowel = true;
    } else if (numPhonemes < 7) {
        vowel = rollD(2) == 1;
    } else {
        vowel = false;
    }
    let name = "";

    for (let i = 0; i < numPhonemes; i++) {
        if (i == 0) {
            name = name.concat(pickRandom(vowel ? v1 : c1));
        } else if (i < numPhonemes - 1) {
            name = name.concat(pickRandom(vowel ? v2 : c2));
        } else {
            name = name.concat(pickRandom(vowel ? v3 : c3));
        }
        vowel = !vowel;
    }

    // Light postprocessing
    name = name.replace(/[Ll].l([^aeiou])/, match => match.slice(0,2).concat(match[3]))
    return name;
}

function generateOrcName() {
    let rawName = capitalize(`${orcSyllable1()}'${orcSyllable2()}`);
    let name = rawName.replace(/er/, pickRandom(["ar", "or", "ur"]));
    return name;
}

function orcSyllable1() {
    return pickRandom([
        t`${orc1}${orc2a}${orc3}`,
        t`${orc1}${orc2b}`,
        t`${orc2c}${orc3}`,
    ])();
}

function orcSyllable2() {
    return pickRandom([
        t`${orc1}${orc2a}${orc3}`,
        t`${orc1}${orc2b}`,
    ])();
}

let orc1 = [
    "b",
    //"bh",
    "bl",
    "br",
    "d",
    //"dh",
    "dr",
    "f",
    //"fh",
    "fl",
    "fn",
    "fr",
    "g",
    //"gh",
    "gl",
    //"gn",
    "gr",
    "k",
    //"kh",
    "kl",
    "kr",
    "l",
    //"lh",
    "m",
    //"mh",
    "n",
    //"nh",
    "p",
    "pl",
    "pr",
    "r",
    //"rh",
    "s",
    "sh",
    "st",
    "str",
    "t",
    //"th",
    "thr",
    "tr",
    "v",
    //"vh",
    //"vl",
    //"vn",
    "vr",
    "z",
    "zl",
    "zn",
    "zr",
]

// consonant-vowel-consonant
let orc2a = [
    "a",
    //"ah",
    "e",
    //"eh",
    "o",
    "u",
];

// consonant-vowel
let orc2b = [
    "a",
    "ah",
    "eh",
    "o",
    "oh",
    "uh",
];

// vowel-consonant
let orc2c = [
    "a",
    //"ah",
    //"eh",
    "o",
    "u",
];


let orc3 = [
    "b",
    //"bh",
    "d",
    "dd",
    //"dh",
    "g",
    "gg",
    "k",
    //"kh",
    "kk",
    "kt",
    "kz",
    "l",
    //"mn",
    "n",
    "p",
    "q",
    //"rd",
    //"rh",
    "rk",
    "rm",
    "rn",
    "rr",
    "rth",
    "t",
    "th",
    "v",
    //"vh",
    "z",
];