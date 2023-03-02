import packageJson from '../../../package.json';
import * as bin from './index';
import mysql from 'mysql2/promise';


const connection = await mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
   ssl: {
   ca: process.env.SSL_CERT,
 }
});
/** 
export const email = async (emailAddress: string): Promise<string> => {
  if (!emailAddress) {
    return "Please provide an email address to save.";
  }

  const [rows] = await connection.execute('INSERT INTO emails (email) VALUES (?)', [emailAddress]);

  return `Email address ${emailAddress} saved successfully.`;
};
*/

export const help = async (args: string[]): Promise<string> => {
  const commands = [
    "adventure",
    "drop",
    "go",
    "map",
    "take",
    "use",
    "talk",
    "whoami"
  ].sort().join('\n ');

  return `Available commands:\n${commands}\n\n[tab]\t trigger completion.\n[ctrl+l] clear terminal.\n[ctrl+c] cancel command.`;
};

export const whoami = async (args: string[]): Promise<string> => {
  return `You are logged in to the Fractal Labs console via remote access. Your clearance level is: Operator: Department. Please access a Fractal Labs console to verify identity.
This action cannot be performed remotely.`;
};


export const banner = (args?: string[]): string => {
  return `

'
 ########:'########:::::'###:::::'######::'########::::'###::::'##:::::::
 ##.....:: ##.... ##:::'## ##:::'##... ##:... ##..::::'## ##::: ##:::::::
 ##::::::: ##:::: ##::'##:. ##:: ##:::..::::: ##:::::'##:. ##:: ##:::::::
 ######::: ########::'##:::. ##: ##:::::::::: ##::::'##:::. ##: ##:::::::
 ##...:::: ##.. ##::: #########: ##:::::::::: ##:::: #########: ##:::::::
 ##::::::: ##::. ##:: ##.... ##: ##::: ##:::: ##:::: ##.... ##: ##:::::::
 ##::::::: ##:::. ##: ##:::: ##:. ######::::: ##:::: ##:::: ##: ########:
..::::::::..:::::..::..:::::..:::......::::::..:::::..:::::..::........::
                                     
                        x         x                                      x
          x     x            x                           x      Rift        x
            x    x  Rift      x      x           x     x         x        x
      x ┌────────────────────────────────┐       ┌──────────────────────────────┐
        │     NOMO'S HOMEWORLD           │   Rift│            GUL1M22           │
 x   x  │                                │       │                              │
        │         DEPT. 33               │       │                              │ x
  Rift  │                                │       │                              │
        │  Sentrysoft©                   │       │                              │
        │                               xxxxx┼xxxxx                             ├────────► ...The Fractal Labs simulation size 
x       │  Dahae                         │       │                              │ x           is limited by the organisation ressources. 
        │                                │ Nomo  │                              │             The simulation grows as Fractal Labs augments its capacities...
    x   │  Company3                      │       │                              │
        │                                │       │                              │
 x      │  Company4                      │       │                              │
        │                                │       │                              │
        └────────────────────────────────┘       └──────────────────────────────┘
     x                                         Rift
        x             x            x                                     Rift
        x                                    x      x        x Rift
                Rift          x                        x

You open your eyes, feeling disoriented and weak. You seem to be laying down on a hospital bed. Fluorescent lights blare down from the ceiling and you hear the faint hum of electrical units. You look down and see that you are dressed in all white. Your stomach sinks. Something is very wrong. You can't remember who you are or why you're in this room.             
                
Type 'help' to see list of available commands.
`};

interface ObjectDescription {
  id: string;
  description: string;
}

interface LocationObject {
  id: string;
  descriptionId: string;
}

interface Location {
  name: string;
  description: string;
  items: string[];
  objects: { [key: string]: LocationObject };
  exits: { [key: string]: string };
  npc?:string
}

interface DialogOption {
  message: string;
  requiresItem?: string;
  responseMessage?: string;
}

interface NPC {
  name: string;
  message: string;
  dialogOptions: { [key: string]: DialogOption };
}


const locations: { [key: string]: Location } = {
  bedroom: {
    name: "Hospital bedroom",
    description: "You are in a sparsely furnished hospital bedroom. There is a plain bed in the center of the room, a small window in the corner, and an open door to the east. By the bed is a tray with some scraps of food. ",
    items: ["jello", "rock"],
    objects: { window: { id: "window", descriptionId: "windowDescription" }, tray: { id: "tray", descriptionId: "trayDescription" }, bed: { id: "bed", descriptionId: "bedDescription" } },
    exits: { east: "lobby" },
  },
  lobby: {
    name: "Hospital Lobby",
    description: "You find yourself in a vast underground facility.",
    items: ["datapad"],
    objects: { sign: { id: "sign", descriptionId: "signDescription" } },
    exits: { west: "bedroom", south: "sidewalk1", east: "medroom" },
    npc: "RoboNurse",
  },
  sidewalk1: {
    name: "Sidewalk",
    description: "You are on the sidewalk of the bustling city. There are people all around, and the cacophony of voices, cars, and construction noises fill the air. You look around and try to get your bearings. The mental hospital is to the north. A signpost points to the west: University of Newmont Campus. To the east is an impressive sky scraper with the word DAHAE arching across its entrance. A phone that doesn't seem to belong to anyone is laying on the pavement ",
    items: ["phone"],
    objects: { signpost: { id: "signpost", descriptionId: "signpostDescription" } },
    exits: { north: "lobby", west: "library", east: "dahae" },
  },
  medroom: {
    name: "Medical Records Room",
    description: "You quickly walk down the corridor, avoiding eye contact with the robot nurse stationed in the lobby, and find yourself in the Medical Records Room. No one seems to be here, but the low hum of the data servers in this room feels make them seem oddly alive.\nThere is a coat slung over a chair by the light switch. Someone must have left it behind accidentally.",
    items: ["coat"],
    objects: { window: { id: "window", descriptionId: "windowDescription" } },
    exits: { west: "lobby" },
  },
  library: {
    name: "Caron Library",
    description: "You are inside the University of Newmont's Caron Library. A lingering scent of coffee and hushed whispers immediately engulfs you. Rows of bookshelves stand tall, filled with a large array of physical books and digital discs. There are several college students at the study tables and a robot librarian that zips around silently, tidying up the vast library.",
    items: [],
    objects: { librarian: { id: "robot", descriptionId: "robotDescription" }, robot: { id: "robot", descriptionId: "robotDescription" }, bookshelves: { id: "bookshelves", descriptionId: "bookshelvesDescription" }, book: { id: "bookshelves", descriptionId: "bookshelvesDescription" }, bookshelf: { id: "bookshelves", descriptionId: "bookshelvesDescription" } },
    exits: { east: "sidewalk1", south:"lecturehall" },
    npc: "Girl",
  },
  dahae: {
    name: "Dahae's headquarters",
    description: "You are inside the lobby of Dahae's headquarters. Futuristic and sleek, the space makes it evident that Dahae is a major tech company. A massive digital display along the back of the receptionist's desk, looping a short video that exhibits some of the company's latest innovations. You find your eyes hypnotically drawn to the display",
    items: ["magazine"],
    objects: { desk: { id: "desk", descriptionId: "deskDescription" }, display: { id: "display", descriptionId: "displayDescription" } },
    exits: { east: "office", west: "sidewalk1" },
    npc: "Receptionist",
  },
  office: {
    name: "Office",
    description: "You enter the open office area, feeling a brief tingle on your skin as a security sensor scans you for possible unsafe items. The space is flooded with natural light from the expansive windows, which are lined with living ivy. Work stations with state-of-the-art terminals are arranged in neat rows, each one occupied by a busy Dahae employee focused intently on their work.",
    items: [],
    objects: { window: { id: "window2", descriptionId: "window2Description" }, windows: { id: "window2", descriptionId: "window2Description" }, ivy: { id: "ivy", descriptionId: "ivyDescription" }, employee : { id: "employee", descriptionId: "employeeDescription" }, employees : { id: "employee", descriptionId: "employeeDescription" }, terminal: { id: "¨terminal", descriptionId: "terminalDescription" }, terminals: { id: "¨terminal", descriptionId: "terminalDescription" } },
    exits: { south: "hallway", west: "dahae" },
    npc: "Receptionist",
  },
  hallway: {
    name: "Hallway",
    description: "You find yourself standing in a brightly lit office hallway, lined with closed doors. The only sound your hear is the soft whir of the atmosphere conditioning ducts, somewhere out of sight.You notice a set of elevator doors at the end of the hall, with a rather imposing looking robot standing guard in front of them. It doesn't say anything but you can tell by the way its eyes are tracking your movements that this is not an area of the building you should be exploring.\nThere is a wallet on the floor by your feet. It must have fallen out of a Dahae employee's pocket.",
    items: ["wallet"],
    objects: { elevator: { id: "elevator", descriptionId: "elevatorDescription" }, door: { id: "door", descriptionId: "doorDescription" }, doors: { id: "door", descriptionId: "doorDescription" }},
    exits: { north: "office" },
    npc: "Patrolbot",
  },
  lecturehall: {
    name: "Lecture Hall",
    description: "You walk inside a large, empty room filled with rows of seats. There is a plaque by the door with the words: “University of Newmont: Lecture Hall C”. A blank holoscreen commands most of the wall behind the lectern, glowing faintly with traces of mathematical equations from a previous class. You hear the faintest echo of footsteps from outside the lecture hall.\nA student ID card lays on the floor. Someone must have dropped it. ",
    items: ["IDnomo"],
    objects: { plaque: { id: "plaque", descriptionId: "plaqueDescription" }, holoscreen: { id: "holoscreen", descriptionId: "holoscreenDescription" } },
    exits: { north: "library", south: "sidewalk3" },
  },
  sidewalk3: {
    name: "Sidewalk3",
    description: "The city sidewalk you are on is flanked by towering buildings that cast deep shadows. From above the glinting skyscraper windows you catch glimpses of fluffy white clouds as sunshine filters down. The street curves at an angle; to the north you see the University of Newmont and to the east is a gated park entrance surrounded by flowers and ornamental shrubbery.",
    items: [],
    objects: { flower: { id: "flower", descriptionId: "flowerDescription" }, flowers: { id: "flower", descriptionId: "flowerDescription" }  },
    exits: { north: "lecturehall" },//NEED EAST = WESTENTRANCE
  },
  sidewalk2: {
    name: "Sidewalk2",
    description: "The city is teeming with life. People and cars rush by and for a moment you feel at peace. Despite not being able to remember who you are, or knowing why you feel the compulsion to “find the weapons room” like the strange phone call directed you to do… the warm summer air and purposeful activity of the city’s inhabitants makes you feel normal. Whatever “normal” means, anyway. You catch the scent of blooming flowers coming from the south.",
    items: [],
    objects: {  },
    exits: { north: "sidewalk1" },//NEED south = WESTENTRANCE
  },
};

const objectDescriptions: { [key: string]: ObjectDescription } = {
  windowDescription: { id: "windowDescription", description: "You look out of the window and see a sprawling cityscape. You can see the signage of a building to the south: University of Newmont Caron Library." },
  signDescription: { id: "signDescription", description: "The sign says 'Welcome to Newmont Hospital'." },
  trayDescription: { id: "trayDescription", description: "Nothing on this tray looks edible." },
  bedDescription: { id: "bedDescription", description: "It doesn't look very comfortable." },
  robotDescription: { id: "robotDescription", description: "Would you look at that? One of his arms seems to have a feather duster extension." },
  bookshelvesDescription: { id: "bookshelvesDescription", description: "There are more digital discs than physical books on the shelves. Interestingly, the titles here seem to be written in French, as well as English and Kyoreugul." },
  deskDescription: { id: "deskDescription", description: "There is nothing on the receptionist's desk." },
  displayDescription: { id: "displayDescription", description: "Dahae seems to be a major manufacturer of Personal Bots." },
  signpostDescription: { id: "signpostDescription", description: "Judging by the sign, Newmont University seems like an expensive school." },
  window2Description: { id: "window2Description", description: "You look out of the window see a serene forest instead of the city. From a distance you can see what looks like a herd of shaggy unicorns.\n\nWait, what? \n…These must be digital panels, not windows." },
  ivyDescription: { id: "ivyDescription", description: "You reach out and feel an ivy leaf. It's real." },
  employeeDescription: { id: "employeeDescription", description: "They seem busy. Best not bother them." },
  terminalDescription: { id: "terminalDescription", description: "These are definitely not your typical consumer model terminals." },
  elevatorDescription: { id: "elevatorDescription", description: "It's an elevator. It goes up and down." },
  doorDescription: { id: "doorDescription", description: "They're locked. You shouldn't try to open them. The robot is watching you." },
  plaqueDescription: { id: "plaqueDescription", description: "I wonder where lecture halls A and B are…" },
  holoscreenDescription: { id: "holoscreenDescription", description: "The professor who last used this didn't do a very good job wiping the screen clean." },
  flowerDescription: { id: "flowerDescription", description: "They are brightly colored, trumpet-shaped blooms" },
};

export const examine = (args: string[]): Promise<string> => {
  const objectToExamine = args[0];
  if (currentLocation.items.includes(objectToExamine)|| inventory.includes(objectToExamine)) {
    switch (objectToExamine) {
      case "rock":
        return Promise.resolve("You examine the rock and find a strange symbol etched into its surface.");
      case "datapad":
        return Promise.resolve("You examine the datapad and see that it has a new function called 'unplug'.");
      case "jello":
        return Promise.resolve("You look at the container of jello. It's an unappetizing dark green color. Yuck!");
      case "magazine":
      return Promise.resolve("“Current Signals” magazine seems to be a tech-focused lifestyle publication. You flip through it and find nothing that interests you. It is mostly written in English with small sections in Kyoreugul.");
      case "coat":
        inventory.push("IDcard");
        return Promise.resolve("A doctor's hospital ID falls out of the coat!");    
      case "IDcard":
        return Promise.resolve("This ID belongs to a Dr. Jian Bouchard.");
      case "IDnomo":
      return Promise.resolve("This ID belongs to Nomo Bouchard.");
      case "wallet":
         return Promise.resolve("It has some cash inside but nothing else.");
         case "phone":
          return Promise.resolve("You tap on the phone and attempt to unlock it but can’t get past the lockscreen. ");         
      default:
        return Promise.resolve(`You examine the ${objectToExamine} and find nothing noteworthy.`);
    }
  }
  if (currentLocation.npc?.toLowerCase() === objectToExamine.toLowerCase()) {
    switch (currentLocation.npc.toLowerCase()) {
      case "jenny":
        const jenny = npcs.jenny;
        return Promise.resolve(`You examine ${objectToExamine} and hear her muttering something about "${jenny.dialogOptions[1].responseMessage}".`);
      case "robonurse":
        return Promise.resolve(`The robot nurse turns her head 90 degrees to meet your gaze, a broad smile affixed to her matte silver face. `);
      case "girl":
        return Promise.resolve(`She is one of the few students in the library using physical books. They seem to be volumes on engineering.`);
      case "receptionist":
      return Promise.resolve(`He looks friendly.`);
      case "patrolbot":
      return Promise.resolve(`You're not sure why but its eyes make you feel uneasy.`);
      default:
        return Promise.resolve(`There's no ${objectToExamine} here.`);
    }
  }
  if (currentLocation.name === "office" && (objectToExamine.toLowerCase()==="window" || objectToExamine==="window") ){
    return Promise.resolve(`You look out of the window see a serene forest instead of the city. From a distance you can see what looks like a herd of shaggy unicorns.`)
  }
  if (currentLocation.objects[objectToExamine]) {
    const object = currentLocation.objects[objectToExamine];
    const objectDescription = objectDescriptions[object.descriptionId];
    return Promise.resolve(`${objectDescription.description}`);
  }


  return Promise.resolve(`There's no ${objectToExamine} here to examine.`);

};

const npcs: { [key: string]: NPC } = {

  patrolbot: {
    name: "Patrolbot",
    message: "You nod your head at the patrolbot and it nods back, acknowledging your presence.",
    dialogOptions: {
      "1": {
        message: "Howdy, partner!",
        responseMessage: "The robot turns its body and tilts head at an angle and observes you intently before resuming his standing position, apparently unamused by your friendly greeting."
      },
      "2": { message: "Excuse me, I'd like to use the elevator." ,
           responseMessage: "PATROLBOT: “You do not seem to have the right security clearance level to access the elevators. Please speak to a qualified attendant if you believe this is an error.”"
           },
      "3": { message: "I'm looking for the bathroom." ,
           responseMessage: "PATROLBOT: “Public bathrooms are located near the lobby.”"
           },
      "4": { message: "Come here often?" ,
           responseMessage: "PATROLBOT: “I'm sorry, I don't understand your question.”\nPATROLBOT: …\nPATROLBOT: “I am always here.”"
           },     
    },
  },

  jenny: {
    name: "Jenny",
    message: "Hi, I'm Jenny. Nice to meet you!",
    dialogOptions: {
      "1": {
        message: "Here, have this shiny key in exchange for that rock you're holding.",
        requiresItem: "rock",
        responseMessage: "Jenny gives you a shiny key in exchange for the rock."
      },
      "2": { message: "Nice meeting you too!" ,
           responseMessage: "Jenny says: 'Why did the tomato turn red? Because it saw the salad dressing!'"
           },
      
    },
  },
  robonurse: {
    name: "RoboNurse",
    message: "The robot nurse glides over to you and scans your body before saying: GO. BACK. TO. YOUR. ROOM.",
    dialogOptions: {
      "1": {
        message: "Where am I?",
        responseMessage: " You are in St. Dymphna Behavioral Health Hospital, located in Newmont. We are the highest rated mental health facility in the G.S.A. You are safe here but you MUST GO. BACK. TO. YOUR. ROOM."
           },
      "2": { message: "I don't belong here." ,
           responseMessage: "You belong here. You don't have a visitor's pass and you are not a staff member. Therefore, you are an in-patient of our mental health facility. If you don't want a rules violation on your record, you MUST GO BACK TO YOUR ROOM NOW."
           },
      "3": { message: "I'm trying to leave." ,
           responseMessage: "You are a patient and you cannot leave without a medical clearance from one of our doctors. For your health and safety, please GO BACK TO YOUR ROOM. "
           },             
    },
  },
  girl: {
    name: "Girl",
    message: "A pretty girl sitting at one of the tables looks up from her studies and smiles at you politely before going back to her notes.",
    dialogOptions: {
      "1": {
        message: "Hey, I'm a little lost…",
        responseMessage: "“Okay…?” She says with a hesitant smile. “So can I help you…?”\nShe seems a little creeped out.\nYou shake your head and mumble, “Nevermind.”"
           },
      "2": { message: "What is this place?" ,
           responseMessage: "She looks at you for a second before pointing to the giant sign by the door that says: University of Newmont: Caron Library."
           },
      "3": { message: "So what's good, lil mama?" ,
           responseMessage: "She wrinkles her nose in obvious disgust, then turns back to her tablet and resumes studying.\n “Please leave,” she says, refusing to meet eyes with you, \n“Or I'm going to call over the librarian.”"
           },               
    },
  },
  receptionist: {
    name: "Receptionist",
    message: "The robot receptionist at the desk notices your stare and lifts his arm to wave hello.",
    dialogOptions: {
      "1": {
        message: "What is this place?",
        responseMessage: "Welcome to Dahae's headquarters, located in the heart of Newmont! Together, we can do anything. While most people know us for creating the best Personal Bots on the market, Dahae is first and foremost an innovation company. We're excited to have you here as our guest."
           },
      "2": { message: "I need some help." ,
           responseMessage: "I can certainly help you. What did you require assistance with?\n\nAfter a few seconds of consideration, you decide to be be brutally blunt with the receptionist robot.\nYOU: “I woke up from a mental hospital today and I can't remember anything. Someone called me on a phone I found on the sidewalk. They told me to find a room full of weapons.”\n\n...\n\nRECEPTIONIST: “I can't help you with that.” "
           },
      "3": { message: "I would like a tour." ,
           responseMessage: "RECEPTIONIST: “We don't have any tour guides available at this time but you are more than welcome to explore our lobby and take a look at our open office area, located in the east pavilion.”"
           },
      "4": { message: "…Do you guys sell weapons?" ,
           responseMessage: "RECEPTIONIST: …\n\n No."
           },                         
    },
  },  
};

let currentLocation = locations.bedroom;
let inventory: string[] = [];
const takenItems = new Set<string>();

export const here = (): Promise<string> => {
return Promise.resolve(displayLocation());
}

const displayLocation = (): string => {
  let output = `${currentLocation.description}`;
  const items = currentLocation.items.filter((item) => !takenItems.has(item));
  if (items.length > 0) {
    output += `\n\nYou see the following items here: ${items.join(", ")}`;
  }

  //robotcheck ID card
  if (currentLocation.npc?.toLowerCase() === "robonurse") {
    if (inventory.includes("IDcard")) {
      npcs.robonurse.dialogOptions["4"] = {
        message: "(hidden option) Show her your hospital ID card.",
        responseMessage: "Hello, Dr. Bouchard! You are currently scheduled as OFF DUTY. You have ZERO messages. Have a nice day!"
      };
    } else {
      delete npcs.robonurse.dialogOptions["4"];
    }
  }

  //girlcheck
  if (currentLocation.npc?.toLowerCase() === "girl") {
    if (inventory.includes("IDnomo")) {
      npcs.girl.dialogOptions["4"] = {
        message: "(hidden option) Show her Nomo Bouchard's student ID card.",
        requiresItem: "IDnomo",
        responseMessage: "“Oh my gosh!” she exclaims, drawing some irritated looks from the other students. “This is my friend's card. I'm sorry, do you know Nomo?”\nYou lie and say that you do.\nYou can tell that she can tell that you're lying.\n\n“O-okay… well, I'll just take this,” she takes the ID card from your hand. “He and I both intern at FRV, so I'll give it to him later today when I see him.”\nThe two of you stare at each other in awkward silence.\n“Thanks,” she says, then turns away."
      };
    } else {
      delete npcs.girl.dialogOptions["4"];
    }
  }


  if (currentLocation.npc) {
    const npc = npcs[currentLocation.npc.toLowerCase()];
    output += `\n(${npc.name}): ${npc.message}\n`;
    let i = 1;
    for (const option in npc.dialogOptions) {
      const dialogOption = npc.dialogOptions[option];
      const itemRequirement = dialogOption.requiresItem
        ? ` (requires ${dialogOption.requiresItem})`
        : "";
      output += `  ${i}: ${dialogOption.message}${itemRequirement}\n`;
      i++;
    }
  }
  output += "\nExits:";
  for (const direction in currentLocation.exits) {
    output += `\n  ${direction}: ${currentLocation.exits[direction]}`;
  }
  return output;
};
export const talk = (option: string): Promise<string> => {
  const npc = npcs[currentLocation.npc?.toLowerCase()];
  if (!npc) {
    return Promise.resolve("There is no one to talk to here.");
  }
  const dialogOption = npc.dialogOptions[option];
  if (!dialogOption) {
    return Promise.resolve("Invalid dialog option. Please try again.");
  }

  //if (dialogOption.requiresItem && !inventory.includes(dialogOption.requiresItem)) {
    //if (currentLocation.npc?.toLowerCase() === "robonurse" && dialogOption.message === "(hidden option) Show her your hospital ID card." && !inventory.includes("rock")) {
   //   return Promise.resolve(`You need a rock to ask that question.`);
   // }
  //  return Promise.resolve(dialogOption.responseMessage);
 // }
  
  if (dialogOption.requiresItem) {
    const result = handleItemExchange(dialogOption.requiresItem, dialogOption.responseMessage);
    if (result) {
      return Promise.resolve(result);
    }
  }
  return Promise.resolve(dialogOption.responseMessage);
};


const handleItemExchange = (item: string, responseMessage: string): string | undefined => {
  if (item === "rock") {
    const index = inventory.indexOf("rock");
    if (index === -1) {
      return `You don't have the necessary item to select that option.`;
    }
    inventory.splice(index, 1);
    inventory.push("key");
    return responseMessage;
  }

  if (item === "IDnomo") {
    const index = inventory.indexOf("IDnomo");
    if (index === -1) {
      return `You don't have the necessary item to select that option.`;
    }
    inventory.splice(index, 1);
    return responseMessage;
  }
  return undefined;
};

export const go = (direction: string): string => {
  if (currentLocation.name === "lobby" && direction === "south" && !inventory.includes("IDcard")) {
    return "You cannot exit the hospital. The robot nurse is watching you closely.";
  }
  if (!currentLocation.exits[direction]) {
    return "You can't go that way.";
  }

  currentLocation = locations[currentLocation.exits[direction]];
  return displayLocation();
};

let phonePickedUp = false;
export const take = (args: string[]): Promise<string> => {
  const index = currentLocation.items.indexOf(args[0]);
  if (index === -1) {
    return Promise.resolve("That item isn't here. Current location: " + currentLocation.name);
  }

  takenItems.add(currentLocation.items[index]);
  inventory.push(currentLocation.items[index]);


  if (currentLocation.items[index] === "wallet") {
  currentLocation.items.splice(index, 1);
  return Promise.resolve(`The robot doesn't say or do anything when you reach down to pick the wallet up.\nItem added to inventory.`);
  } 


  if (currentLocation.items[index] === "phone") {
    if (!phonePickedUp) {
      const dialogSequence = [
        "--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------\n",
        "YOU: 'Hello?'\n",
        "VOICE: 'HELLO—Ope—ray'\n",
        "YOU: 'I'm sorry. I can't hear you very well, I—'\n",
        "The static suddenly disappears and you can hear the voice clearly.\n",
        "VOICE: 'Operator, we don't have much time. The connection in this module is very weak. We can guarantee a clean unplug but you must be at the extraction point within two hours.'\n",
        "YOU: 'What?'\n",
        "VOICE: 'The weapons room. Again, Operator—'\n",
        "YOU: '…I don't think I am who you think I am.'\n",
        "VOICE: '—we have to manually disconnect you if you don't make it there in time. Make your way out of the hospital and head to the weapons room.'\n\n",
        "The phone emits a shrieking noise so loud you almost drop it. \n\n\n",
        "YOU: 'Hello?'\n\n\n\n...\n\n\n\nYOU: 'Hello??'\n\n\n",
        "The call has ended.\n",
        "--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------"
      ];

      phonePickedUp = true;
      const output = dialogSequence.join("");
      currentLocation.items.splice(index, 1);
      return Promise.resolve(`${output}\nYou took ${args[0]}.`);
    } else {
      currentLocation.items.splice(index, 1);
      return Promise.resolve(`You took ${args[0]}.`);
    }
  } else {
    currentLocation.items.splice(index, 1);
    return Promise.resolve(`You took ${args[0]}.`);
  }
};



export const drop = (args: string[]): Promise<string> => {
  const item = args[0];
  const index = inventory.indexOf(item);
  if (index === -1) {
    return Promise.resolve("You don't have that item.");
  }
  takenItems.delete(item);
  currentLocation.items.push(inventory[index]);
  inventory.splice(index, 1);
  return Promise.resolve(`You dropped ${item}.`);
};

export const use = (args: string[]):Promise<string> => {
  if (args[0] === "datapad") {
    return Promise.resolve("You have used the datapad and discovered a new function called unplug.");
  }
  return Promise.resolve("You can't use that item.");
};

export const unplug = (): Promise<string> => {
  if (inventory.includes("datapad")) {
    currentLocation = locations.bedroom;
    return Promise.resolve(displayLocation());
  }
  return Promise.resolve("You need the datapad to unplug.");
};

export const fight = (args: string[]): Promise<string> => {
  const objectTofight = args[0];
  if (currentLocation.npc?.toLowerCase() === objectTofight.toLowerCase()) {
    switch (currentLocation.npc.toLowerCase()) {
      case "jenny":
        const jenny = npcs.jenny;
        return Promise.resolve(`You try to fight ${objectTofight}. She roundhouse kicks you and you fall to the ground.\n DON'T mess with Jenny `);
      case "robonurse":
        const roboNurse = npcs.RoboNurse;
        return Promise.resolve(`The robot nurse calmly extends a metal prong from her left arm. You feel cool metal on your thigh then suddenly—BZZZZT!\nYou've been tased!\nIt feels like there are a million angry robot bees swarming inside of your bones.\nYou better not try that again.`);
        case "girl":
        return Promise.resolve(`This is a library. Stay calm.`);
        case "patrolbot":
          return Promise.resolve(`You muster up the courage and rush toward the robot.\nIt turns to look at you and its eyes flash green. You feel a brain splitting headache and fall to your knees, clutching your head.\nIt takes you a minute before you can stand back up. You're not sure what just happened.\nYou look cautiously at the robot. It stares you down but doesn't move from its position.\n\nYou better not try that again.`);
      default:
        return Promise.resolve(`There's no ${objectTofight} here.`);
    }
  }
  return Promise.resolve(`There's no ${objectTofight} here to fight.`);
};

export const adventure = async (args?: string[]): Promise<string> => {
  if (!args || args.length === 0) {
    return `Welcome to the adventure game!

Available commands:
- go "direction" (ex: go east)
- take "item" (ex: take datapad)
- drop "item" (ex: drop rock)
- use "item" (ex: use rock)

Start by typing 'adventure go "direction" ' to move to a different location.`;
  }
  switch (args[0]) {
    case "go":
      return go(args[1]);
    case "take":
      return await take(args.slice(1));
    case "drop":
      return await drop(args.slice(1));
    case "use":
      return await use(args.slice(1));
    case "unplug":
      return await unplug();
    default:
      return "Invalid command. Please try again.";
  }
};