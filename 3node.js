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
        clueElem = document.createElement("li");
        clueElem.innerHTML = `${clue.text} <span style='white-space: nowrap'>(${clue.from}->${clue.to})</span>`;
        ul.appendChild(clueElem);
    });
}

/*const RETRIES = 3;
let picks = [];
function pickRandom(arr) {
    let i = 0;
    while (i < RETRIES) {
        let pick = arr[Math.floor(Math.random() * arr.length)];
        if (! picks.includes(pick)) {
            picks.push(pick);
            console.log("accepting random pick:", pick);
            return pick;
        }
        console.log("rejecting random pick:", pick)
        i++;
    }
    let pick = arr[Math.floor(Math.random() * arr.length)];
    console.log("accepting random pick (after exhausting retries):", pick);
    return pick;
}*/

function pickRandom(arr) {
    let pick = arr[Math.floor(Math.random() * arr.length)];
    console.log("accepting random pick:", pick);
    return pick;
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
    console.log(clueText);
    return {
        from: fromNode.label,
        to: toNode.label,
        text: clueText,
    }
}

function t(strings, ...keys) {
    return function (context) {
        let result = [strings[0]];
        keys.forEach(function(key, i) {
            let value = context[key];
            result.push(value instanceof Function ? value() : value instanceof Array ? pickRandom(value) : value, strings[i + 1]);
        });
        console.log(result);
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
            (node) => node.name.split("'")[0],
        ],
    },
    /*{
        id: "temple",
        name: () => {return `The Temple of ${pickRandom(["Pelor", "Boccob", "Vecna"])}`},
        subtitle: "a place of worship",
        clue: (toNode) => {return pickRandom([
            `head priest carries ${toNode.item()}`,
            `${toNode.person()} is an avid worshipper`,
        ])},
        item: (toNode) => {return pickRandom([
            `a holy symbol of ${toNode.name.split(" ")[3]}`,
            `a small statuette of ${toNode.name.split(" ")[3]}`,
            `a ${pickRandom(["trinket", "minor relic", "holy artifact"])} stolen from ${toNode.name}`
        ])},
        topic: (toNode) => {return pickRandom([
            toNode.name,
            toNode.name.split(" ")[3],
        ])},
        person: (toNode) => {return `the head priest at ${toNode.name}`},
    },
    {
        id: "dungeon",
        name: () => {return "The Deep Dark Dungeon"},
        subtitle: "a dangerous place to delve",
        clue: (toNode) => {return pickRandom([
            `treasure chest contains ${toNode.item()}`,
            `kobold trash pile contains ${toNode.item()}`,
            `hidden chamber contains ${toNode.item()}`,
            `skeleton of unlucky adventurer still clutching ${toNode.item()}`,
        ])},
        item: (toNode) => {return pickRandom([
            `a map with the location of ${toNode.name} marked with an X`,
            `notes detailing a planned expedition to ${toNode.name}`,
        ])},
        topic: (toNode) => {return toNode.name},
        person: (toNode) => {return pickRandom([
            `the guardian of ${toNode.name}`,
            `an adventurer last seen heading to ${toNode.name}`,
        ])},
    },
    {
        id: "tavern",
        name: () => {return `The ${pickRandom(["Laughing", "Prancing", "Winking"])} ${pickRandom(["Donkey", "Dragon", "Rooster"])}`},
        subtitle: "the local tavern",
        clue: (toNode) => {return pickRandom([
            `mysterious guest left behind ${toNode.item()}`,
            `nervous patrons discuss ${toNode.topic()} in hushed tones`,
            `bartender relays rumor about ${toNode.topic()}`,
            `nervous patrons discuss ${toNode.person()} in hushed tones`,
            `bartender relays rumor about ${toNode.person()}`,
            `graffiti in privy includes a crude message about ${toNode.person()}`,
        ])},
        item: (toNode) => {return `a beer stein pilfered from ${toNode.name}`},
        topic: (toNode) => {return pickRandom([
            toNode.name,
            `a recent bar brawl at ${toNode.name}`
        ])},
        person: (toNode) => {return `the tavernkeep at ${toNode.name}`},
    },
    {
        id: "graveyard",
        name: () => {return "a spooky graveyard"},
        subtitle: "an undead plague just waiting to happen",
        clue: (toNode) => {return pickRandom([
            `sarcophagus contains ${toNode.item()}`,
            `disembodied voice ${pickRandom(["whispers dire warnings", "chatters", "drones on and on"])} about ${toNode.topic()}`,
            `in their haste, grave robbers dropped ${toNode.item()}`,
        ])},
        item: (toNode) => {return pickRandom([
            "a handful of fresh grave-dirt",
            `a copy of ${pickRandom([
                "<em>Necromancy 101</em>",
                "<em>Necromancy for Dummies</em>",
                "<em>The Idiot's Guide to Raising the Dead</em>",
            ])}`,
        ])},
        topic: (toNode) => {return pickRandom([
            toNode.name,
            "recent undead sightings",
            "zombie attacks",
            "the restless dead",
        ])},
        person: (toNode) => {return `your friendly neighborhood gravedigger`},
    },
    {
        id: "hideout",
        name: () => {return "a secret hideout"},
        subtitle: "a gathering place for villains",
        clue: (toNode) => {return pickRandom([
            `guard carries ${toNode.item()}`,
            `if interrogated, guard mentions ${toNode.topic()}`,
            `if interrogated, guard mentions ${toNode.person()}`,
            `${toNode.person()} being held prisoner inside`,
            `secret room contains ${toNode.item()}`,
            `locked chest contains ${toNode.item()}`,
        ])},
        item: (toNode) => {return "a map marked with an X"},
        topic: (toNode) => {return toNode.name},
        person: (toNode) => {return `a villainous henchperson`},
    },
    {
        id: "sewers",
        name: () => {return "the sewers"},
        subtitle: "a smelly place to look for clues",
        clue: (toNode) => {return pickRandom([
            `${toNode.item()} hidden in disused tunnel`,
            `mad sewer-dwelling hermit babbles about ${toNode.topic()}`,
            `mad sewer-dwelling hermit babbles about ${toNode.person()}`,
            `mad sewer-dwelling hermit shoves ${toNode.item()} into PC's hands`,
            `${toNode.person()} has been skulking about the area`,
        ])},
        item: (toNode) => {return "a map of the city sewers"},
        topic: (toNode) => {return toNode.name},
        person: (toNode) => {return `a mad sewer-dwelling hermit`},
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
        clue: (toNode) => {return pickRandom([
            `${toNode.item()} hidden in storage room`,
            `${toNode.person()} is a frequent customer`,
            `shopkeeper is eager to blab about ${toNode.topic()}`,
            `shopkeeper is eager to blab about ${toNode.person()}`,
        ])},
        item: (toNode) => {return pickRandom([
            `a bill of sale from ${toNode.name}`,
            `an expensive item purchased from ${toNode.name}`
        ])},
        topic: (toNode) => {return pickRandom([
            toNode.name,
            `${toNode.name}'s big going-out-of-business sale`
        ])},
        person: (toNode) => {return `the owner of ${toNode.name}`},
    },
    // PEOPLE
    {
        id: "npc",
        name: () => {return `${pickRandom(["Diego", "Elena", "Forrest", "Geraldine"])} ${pickRandom(["Greenhold", "Harrier", "Ironbolt", "Joyce"])}`},
        subtitle: "a person of interest",
        clue: (toNode) => {return pickRandom([
            `carries ${toNode.item()}`,
            `known associate of ${toNode.person()}`,
            `frequent clandestine meetings with ${toNode.person()}`,
            `romantically involved with ${toNode.person()}`,
            `shares ${pickRandom(["rumors", "secrets", "gossip"])} about ${toNode.person()}`,
            `shares ${pickRandom(["rumors", "secrets", "gossip"])} about ${toNode.topic()}`,
        ])},
        item: (toNode) => {return pickRandom([
            `a note written on ${toNode.name}'s personalized stationery`,
            `a ${pickRandom(["steamy", "poetic", "cheesy"])} love letter ${pickRandom(["penned by", "addressed to"])} ${toNode.name}`,
            `a sketchbook filled with drawings of ${toNode.name}`
        ])},
        topic: (toNode) => {return toNode.name},
        person: (toNode) => {return toNode.name},
    },
    // ORGANIZATIONS
    {
        id: "noble-family",
        name: () => {return `the House of ${pickRandom(["Argentos", "Borealis", "Clairmont", "Desdemona", "Eagleton", "Flechette"])}`},
        subtitle: "a noble family",
        clue: (toNode) => {return pickRandom([
            `bitter cousin shows the PCs ${toNode.item()}`,
            `nosy servant overheard secret conversation about ${toNode.topic()}`,
            `nosy servant overheard secret conversation about ${toNode.person()}`,
            `philandering noble is having a torrid affair with ${toNode.person()}`
        ])},
        item: (toNode) => {return pickRandom([
            `a letter sealed with the crest of ${toNode.name}`,
            `a ${pickRandom(["priceless treasure", "family heirloom"])} stolen from the vaults of ${toNode.name}`,
        ])},
        topic: (toNode) => {return toNode.name},
        person: (toNode) => {return pickRandom([
            `a lesser scion of ${toNode.name}`,
            `the patriarch of ${toNode.name}`,
            `the matriarch of ${toNode.name}`,
        ])},
    },
    {
        id: "bandits",
        name: () => {return `The ${pickRandom(["Bloody", "Scarlet", "Iron"])} ${pickRandom(["Blades", "Claws", "Hawks"])}`},
        subtitle: "a bandit gang",
        clue: (toNode) => {return `${toNode.item()} found in bandit hideout`},
        item: (toNode) => {return `a discarded mask worn by members of ${toNode.name}`},
        topic: (toNode) => {return pickRandom([
            toNode.name,
            "the recent bandit attacks",
        ])},
        person: (toNode) => {return pickRandom([
            `a member of ${toNode.name}`,
            `the leader of ${toNode.name}`,
        ])},
    },
    // EVENTS
    {
        id: "royal-ball",
        name: () => {return "the annual Royal Ball"},
        subtitle: "the social event of the season",
        clue: (toNode) => {return pickRandom([
            `masked attendee hands the PCs ${toNode.item()}`,
            `attendees gossip about ${toNode.topic()}`
        ])},
        item: (toNode) => {return pickRandom([
            "an embossed invitation to the Royal Ball",
            `a guest list for the Royal Ball with certain names ${pickRandom(["crossed out", "circled", "underlined"])}`
        ])},
        topic: (toNode) => {return toNode.name},
        person: (toNode) => {return `a guest of honor at the upcoming Royal Ball`},
    }*/
];

generate();