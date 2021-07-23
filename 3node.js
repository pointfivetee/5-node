const NETWORK = [
    [0,1],
    [0,2],
    [0,3],
    [1,2],
    [1,3],
    [1,4],
    [2,1],
    [2,3],
    [2,4],
    [3,1],
    [3,2],
    [3,4]
];

function generate() {
    console.log("Generating nodes!");
    let nodes = [];
    for (let i = 0; i < 5; i++) {
        let node = generateNode();
        node.label = String.fromCharCode(65+i);
        nodes.push(node);
    }
    console.log("Generating clues!");
    for (let link of NETWORK) {
        let fromNode = nodes[link[0]];
        let toNode = nodes[link[1]];
        let clue = generateClue(fromNode, toNode);
        fromNode.clues.push(clue);
    }
    console.log("Finished generating!");
    for (let node of nodes) {
        console.log(`${node.label}: ${node.name}`);
        for (let clue of node.clues) {
            console.log("  " + clue.text);
        }
        renderNode(node);
    }
    // Reset list of previously chosen nodes
    picks = [];
}

function renderNode(node) {
    let nodeElem = document.getElementById("node-" + node.label);
    let title = nodeElem.querySelector(".card-title");
    title.innerHTML = `${node.label}: ${node.name}`;
    let subtitle = nodeElem.querySelector(".card-subtitle");
    subtitle.innerHTML = node.subtitle;
    let ul = nodeElem.querySelector("ul");
    ul.innerHTML = "";
    node.clues.forEach(clue => {
        let clueElem = document.createElement("li");
        clueElem.classList.add("mb-1");
        clueElem.innerHTML = `${clue.text} <span style='white-space: nowrap'>(${clue.from}->${clue.to})</span>`;
        ul.appendChild(clueElem);
    });
}

const RETRIES = 5;
let picks = [];
function pickRandom(arr) {
    let i = 0;
    while (i < RETRIES) {
        let pick = arr[Math.floor(Math.random() * arr.length)];
        if (! picks.includes(pick)) {
            picks.push(pick);
            return pick;
        }
        i++;
    }
    let pick = arr[Math.floor(Math.random() * arr.length)];
    console.log("<<retry limit reached: reusing item>>");
    return pick;
}

/*function pickRandom(arr) {
    let pick = arr[Math.floor(Math.random() * arr.length)];
    console.log("accepting random pick:", pick);
    return pick;
}*/

function generateNode() {
    let nodeType = pickRandom(NODE_TYPES);
    let node = {
        nodeType: nodeType,
        name: nodeType.name(),
        subtitle: nodeType.subtitle,
        clues: [],
        label: "",
    };
    node.item = () => {
        return pickRandom(node.nodeType.items)(node);
    };
    node.topic = () => {
        return pickRandom(node.nodeType.topics)(node);
    };
    node.person = () => {
        return pickRandom(node.nodeType.people)(node);
    };
    return node;
}

function generateClue(fromNode, toNode) {
    let clueText = pickRandom(fromNode.nodeType.clues)(toNode);
    //console.log(clueText);
    return {
        from: fromNode.label,
        to: toNode.label,
        text: clueText,
    }
}

function t(strings, ...tokens) {
    return function (context) {
        let result = [strings[0]];
        tokens.forEach(function(token, i) {
            let value = token instanceof Array ? token : context[token];
            result.push(value instanceof Function ? value() : value instanceof Array ? pickRandom(value) : value, strings[i + 1]);
        });
        console.log(result.join(""));
        return result.join("");
    }
}

const NODE_TYPES = [
    // PLACES
    {
        id: "residence",
        name: () => {return `${pickRandom(["Alice", "Bob", "Claire"])}'s ${pickRandom(["hovel", "cottage", "house", "apartment", "estate", "mansion"])}`},
        subtitle: "a private residence",
        clues: [
            t`${'item'} hidden in ${["bedroom", "kitchen", "privy", "garden"]}`,
            t`wastepaper basket contains letter from ${'person'}`,
            t`most recent diary entry mentions ${'person'}`,
            t`most recent diary entry mentions ${'topic'}`,
            t`a sketchbook filled with drawings of ${'person'}`,
            t`${'person'} is bound and gagged in a closet`,
        ],
        items: [
            t`an invitation to a gathering at ${'name'}`,
            t`a scrap of paper bearing the address of ${'name'}`,
            t`a crudely drawn map with directions to ${'name'}`,
        ],
        topics: [t`${'name'}`],
        people: [
            node => node.name.split("'")[0],
        ],
    },
    {
        id: "temple",
        name: () => {return `The Temple of ${pickRandom(["Pelor", "Boccob", "Vecna", "Nerull", "Gruumsh", "Lolth"])}`},
        subtitle: "a place of worship",
        clues: [
            t`head priest carries ${'item'}`,
            t`${'person'} is an avid worshipper`,
        ],
        items: [
            node => `a holy symbol of ${node.name.split(" ")[3]}`,
            node => `a small statuette of ${node.name.split(" ")[3]}`,
            t`a ${["trinket", "minor relic", "holy artifact"]} stolen from ${'name'}`
        ],
        topics: [
            t`${'name'}`,
            node => node.name.split(" ")[3],
        ],
        people: [t`the head priest at ${'name'}`],
    },
    {
        id: "dungeon",
        name: () => {return `The ${pickRandom(["Deep Dark", "Forgotten", "Forbidden", "Deeper Darker", "Deepest Darkest", "Dragon's"])} Dungeon`},
        subtitle: "a dangerous place to delve",
        clues: [
            t`treasure chest contains ${'item'}`,
            t`kobold trash pile contains ${'item'}`,
            t`hidden chamber contains ${'item'}`,
            t`skeleton of unlucky adventurer still clutching ${'item'}`,
        ],
        items: [
            t`a map with the location of ${'name'} marked with an X`,
            t`notes detailing a planned expedition to ${'name'}`,
        ],
        topics: [
            t`${'name'}`,
        ],
        people: [
            t`the guardian of ${'name'}`,
            t`an adventurer last seen heading to ${'name'}`,
        ],
    },
    {
        id: "tavern",
        name: () => {return `The ${pickRandom(["Laughing", "Prancing", "Winking"])} ${pickRandom(["Donkey", "Dragon", "Rooster"])}`},
        subtitle: "the local tavern",
        clues: [
            t`mysterious guest left behind ${'item'}`,
            t`in hushed tones, nervous patrons discuss ${'topic'}`,
            t`in hushed tones, nervous patrons discuss ${'person'}`,
            t`bartender relays rumor about ${'topic'}`,
            t`bartender relays rumor about ${'person'}`,
            t`graffiti in privy includes a crude message about ${'person'}`,
            t`mysterious stranger is actually ${'person'}, wearing ${["an effective", "a passable", "an unconvincing"]} disguise`,
            t`bard performs a ${["playful ditty", "somber tune", "wistful ballad"]} about ${'topic'}`,
            t`bard performs a ${["playful ditty", "somber tune", "wistful ballad"]} about ${'person'}`,
        ],
        items: [
            t`a beer stein pilfered from ${'name'}`,
            t`a drink menu from ${'name'}`,
            t`a bottle of wine sold exclusively at ${'name'}`,
        ],
        topics: [
            t`${'name'}`,
            t`a recent bar brawl at ${'name'}`
        ],
        people: [t`${'name'}'s barkeep`],
    },
    {
        id: "graveyard",
        name: () => {return `a spooky ${pickRandom(["boneyard", "catacomb", "cemetery", "graveyard"])}`},
        subtitle: "an undead plague just waiting to happen",
        clues: [
            t`sarcophagus contains ${'item'}`,
            t`disembodied voice ${["whispers dire warnings", "chatters", "drones on and on"]} about ${'topic'}`,
            t`in their haste, grave robbers dropped ${'item'}`,
        ],
        items: [
            t`a handful of fresh grave-dirt`,
            t`a copy of ${[
                "<em>Necromancy 101</em>",
                "<em>Necromancy for Dummies</em>",
                "<em>The Idiot's Guide to Raising the Dead</em>",
            ]}`,
        ],
        topics: [
            t`${name}`,
            t`recent undead sightings`,
            t`zombie attacks`,
            t`the restless dead`,
        ],
        people: [
            t`your friendly neighborhood gravedigger`
        ],
    },
    {
        id: "hideout",
        name: () => {return "a secret hideout"},
        subtitle: "a gathering place for villains",
        clues: [
            t`guard carries ${'item'}`,
            t`if interrogated, guard mentions ${'topic'}`,
            t`if interrogated, guard mentions ${'person'}`,
            t`${'person'} being held prisoner inside`,
            t`secret room contains ${'item'}`,
            t`locked chest contains ${'item'}`,
        ],
        items: [t`a map marked with an X`],
        topics: [t`${'name'}`],
        people: [t`a villainous (but easily tailed) henchperson`],
    },
    {
        id: "sewers",
        name: () => {return "the sewers"},
        subtitle: "a smelly place to look for clues",
        clues: [
            t`${'item'} hidden in disused tunnel`,
            t`mad sewer-dwelling hermit babbles about ${'topic'}`,
            t`mad sewer-dwelling hermit babbles about ${'person'}`,
            t`mad sewer-dwelling hermit shoves ${'item'} into PC's hands`,
            t`${'person'} has been skulking about the area`,
        ],
        items: [t`a map of the city sewers`],
        topics: [t`${'name'}`],
        people: [t`a mad sewer-dwelling hermit`],
    },
    {
        id: "shop",
        name: () => {return pickRandom([
            "the alchemist's shop",
            "the antique store",
            "the bakery",
            "the bookshop",
            "the butcher shop",
            "the candlestick store",
            "the cheesemonger's shop",
            "the confectionery",
            "the enchanter's shop",
            "the jewelry shop",
            "the smithy",
        ])},
        subtitle: "a local shop",
        clues: [
            t`${'item'} hidden in storage room`,
            t`${'person'} is a frequent customer`,
            t`shopkeeper is eager to blab about ${'topic'}`,
            t`shopkeeper is eager to blab about ${'person'}`,
            t`shopkeeper is willing to share information about ${'topic'}... for the right price`,
            t`shopkeeper is willing to share information about ${'person'}... for the right price`,
        ],
        items: [
            t`a bill of sale from ${'name'}`,
            t`an expensive item purchased from ${'name'}`,
        ],
        topics: [
            t`${'name'}`,
            t`${'name'}'s big going-out-of-business sale`,
            t`strange noises coming from ${'name'} at night`,
        ],
        people: [t`the owner of ${'name'}`],
    },
    // PEOPLE
    /*{
        id: "npc",
        name: () => {return `${pickRandom(["Diego", "Elena", "Forrest", "Geraldine"])} ${pickRandom(["Greenhold", "Harrier", "Ironbolt", "Joyce"])}`},
        subtitle: "a person of interest",
        clue: (toNode) => {return pickRandom([
            `carries ${'item'}`,
            `known associate of ${'person'}`,
            `frequent clandestine meetings with ${'person'}`,
            `romantically involved with ${'person'}`,
            `shares ${pickRandom(["rumors", "secrets", "gossip"])} about ${'person'}`,
            `shares ${pickRandom(["rumors", "secrets", "gossip"])} about ${'topic'}`,
        ])},
        item: (toNode) => {return pickRandom([
            `a note written on ${'name'}'s personalized stationery`,
            `a ${pickRandom(["steamy", "poetic", "cheesy"])} love letter ${pickRandom(["penned by", "addressed to"])} ${'name'}`,
            `a sketchbook filled with drawings of ${'name'}`
        ])},
        topic: (toNode) => {return 'name'},
        person: (toNode) => {return 'name'},
    },
    // ORGANIZATIONS
    {
        id: "noble-family",
        name: () => {return `the House of ${pickRandom(["Argentos", "Borealis", "Clairmont", "Desdemona", "Eagleton", "Flechette"])}`},
        subtitle: "a noble family",
        clue: (toNode) => {return pickRandom([
            `bitter cousin shows the PCs ${'item'}`,
            `nosy servant overheard secret conversation about ${'topic'}`,
            `nosy servant overheard secret conversation about ${'person'}`,
            `philandering noble is having a torrid affair with ${'person'}`
        ])},
        item: (toNode) => {return pickRandom([
            `a letter sealed with the crest of ${'name'}`,
            `a ${pickRandom(["priceless treasure", "family heirloom"])} stolen from the vaults of ${'name'}`,
        ])},
        topic: (toNode) => {return 'name'},
        person: (toNode) => {return pickRandom([
            `a lesser scion of ${'name'}`,
            `the patriarch of ${'name'}`,
            `the matriarch of ${'name'}`,
        ])},
    },
    {
        id: "bandits",
        name: () => {return `The ${pickRandom(["Bloody", "Scarlet", "Iron"])} ${pickRandom(["Blades", "Claws", "Hawks"])}`},
        subtitle: "a bandit gang",
        clue: (toNode) => {return `${'item'} found in bandit hideout`},
        item: (toNode) => {return `a discarded mask worn by members of ${'name'}`},
        topic: (toNode) => {return pickRandom([
            'name',
            "the recent bandit attacks",
        ])},
        person: (toNode) => {return pickRandom([
            `a member of ${'name'}`,
            `the leader of ${'name'}`,
        ])},
    },
    // EVENTS
    {
        id: "royal-ball",
        name: () => {return "the annual Royal Ball"},
        subtitle: "the social event of the season",
        clue: (toNode) => {return pickRandom([
            `masked attendee hands the PCs ${'item'}`,
            `attendees gossip about ${'topic'}`
        ])},
        item: (toNode) => {return pickRandom([
            "an embossed invitation to the Royal Ball",
            `a guest list for the Royal Ball with certain names ${pickRandom(["crossed out", "circled", "underlined"])}`
        ])},
        topic: (toNode) => {return 'name'},
        person: (toNode) => {return `a guest of honor at the upcoming Royal Ball`},
    }*/
];

generate();