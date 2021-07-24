const NAMES = {};

async function loadJson(path) {
    let fileContents = await fetch(path);
    return fileContents.json();
}

function capitalize(str) {
    return str.slice(0,1).toUpperCase().concat(str.slice(1));
}

async function nameGenInit() {
    NAMES.humanFirstNames = await loadJson("./names/humanFirstNames.json");
    NAMES.humanSurnames = await loadJson("./names/humanSurnames.json");
}

function generateName() {
    return pickRandom([
        generateHumanName,
        generateOrcName,
    ])();
}

function generateSurname() {
    return pickRandom(NAMES.humanSurnames);
}

function generateHumanName() {
    return `${pickRandom(NAMES.humanFirstNames)} ${pickRandom(NAMES.humanSurnames)}`;
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