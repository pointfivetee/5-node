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

async function start() {
    await nameGenInit();
    generate();
}

function generate() {
    //console.log("Generating nodes!");
    let nodes = [];
    for (let i = 0; i < 5; i++) {
        let node = generateNode();
        node.label = String.fromCharCode(65+i);
        nodes.push(node);
    }
    //console.log("Generating clues!");
    for (let link of NETWORK) {
        let fromNode = nodes[link[0]];
        let toNode = nodes[link[1]];
        let clue = generateClue(fromNode, toNode);
        fromNode.clues.push(clue);
    }
    //console.log("Finished generating!");
    for (let node of nodes) {
        //console.log(`${node.label}: ${node.name}`);
        for (let clue of node.clues) {
            //console.log("  " + clue.text);
        }
        renderNode(node);
    }
    // Reset list of previously chosen nodes
    resetPicks();
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

const NODE_TYPES = [
    // PLACES
    {
        id: "residence",
        name: () => {return `${generateName()}'s ${pickRandom(["hovel", "cottage", "house", "apartment", "estate", "mansion"])}`},
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
    {
        id: "npc",
        name: () => {return `${generateName()}`},
        subtitle: "a person of interest",
        clues: [
            t`carries ${'item'}`,
            t`known associate of ${'person'}`,
            t`frequent clandestine meetings with ${'person'}`,
            t`romantically involved with ${'person'}`,
            t`shares ${["rumors", "secrets", "gossip"]} about ${'person'}`,
            t`shares ${["rumors", "secrets", "gossip"]} about ${'topic'}`,
        ],
        items: [
            t`a note written on ${'name'}'s personalized stationery`,
            t`a ${["steamy", "poetic", "cheesy"]} love letter ${["penned by", "addressed to"]} ${'name'}`,
            t`a sketchbook filled with drawings of ${'name'}`,
        ],
        topics: [
            t`${'name'}`,
        ],
        people: [
            t`${'name'}`,
        ],
    },
    // ORGANIZATIONS
    {
        id: "noble-family",
        name: () => {return `the House of ${generateSurname()}`},
        subtitle: "a noble family",
        clues: [
            t`bitter cousin shows the PCs ${'item'}`,
            t`nosy servant overheard secret conversation about ${'topic'}`,
            t`nosy servant overheard secret conversation about ${'person'}`,
            t`philandering noble is having a torrid affair with ${'person'}`
        ],
        items: [
            t`a letter sealed with the crest of ${'name'}`,
            t`a ${["priceless treasure", "family heirloom"]} stolen from the vaults of ${'name'}`,
        ],
        topics: [
            t`${'name'}`,
        ],
        people: [
            t`a lesser scion of ${'name'}`,
            t`the patriarch of ${'name'}`,
            t`the matriarch of ${'name'}`,
        ],
    },
    {
        id: "bandits",
        name: () => {return `The ${pickRandom(["Bloody", "Scarlet", "Iron"])} ${pickRandom(["Blades", "Claws", "Hawks"])}`},
        subtitle: "a bandit gang",
        clues: [
            t`${'item'} found in bandit hideout`,
        ],
        items: [
            t`a discarded mask worn by members of ${'name'}`,
        ],
        topics: [
            t`${'name'}`,
            t`the recent bandit attacks`,
        ],
        people: [
            t`a member of ${'name'}`,
            t`the leader of ${'name'}`,
        ],
    },
    // EVENTS
    {
        id: "royal-ball",
        name: () => {return "the annual Royal Ball"},
        subtitle: "the social event of the season",
        clues: [
            t`masked attendee hands the PCs ${'item'}`,
            t`attendees gossip about ${'topic'}`,
        ],
        items: [
            t`an embossed invitation to the Royal Ball`,
            t`a guest list for the Royal Ball with certain names ${["crossed out", "circled", "underlined"]}`,
        ],
        topics: [
            t`${'name'}`,
        ],
        people: [
            t`a guest of honor at the upcoming Royal Ball`,
        ],
    }
];

window.onload = () => {
    start();
}