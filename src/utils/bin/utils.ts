import packageJson from '../../../package.json';
import * as bin from './index';




export const help = async (args: string[]): Promise<string> => {
  const commands = [
    "go [direction]",
    "take [item]",
    "examine [item, npc or thing]",
    "talk [npc]",
    "sneak [npc]",
    "open [door]",

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

You open your eyes, feeling disoriented and weak. You seem to be lying down on a hospital bed. Fluorescent lights blare down from the ceiling and you hear the faint hum of electrical units. You look down and see that you are dressed in all white. Your stomach sinks. Something is very wrong. You can't remember who you are or why you're in this room.

You are in a sparsely furnished hospital bedroom. There is a plain bed in the center of the room, a small window in the corner, and an open door to the east. By the bed is a tray with some scraps of food. 

You see the following item here: jello 
-----------------------------------------------------------
START BY TYPING 'help' to see a list of available commands.
Then, try to 'examine jello', 'take jello' or 'go east'.
-----------------------------------------------------------
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
    items: ["jello"],//,"icecream","lockpick","phone","card" are good items for godmode
    objects: { window: { id: "window", descriptionId: "windowDescription" }, tray: { id: "tray", descriptionId: "trayDescription" },foodtray: { id: "tray", descriptionId: "trayDescription" }, food: { id: "tray", descriptionId: "trayDescription" }, bed: { id: "bed", descriptionId: "bedDescription" } },
    exits: { east: "lobby" },
  },
  lobby: {
    name: "Hospital Lobby",
    description: "You are in the hospital lobby. You can see a long corridor to the east and an exit to the south. On the wall is a sign that reads: St. Dymphna Behavioral Health Hospital. There is no one in the lobby except for one robot nurse, patrolling the empty lobby with a smile.",
    items: [],
    objects: { sign: { id: "sign", descriptionId: "signDescription" } },
    exits: { west: "bedroom", south: "sidewalk1", east: "medroom" },
    npc: "RoboNurse",
  },
  sidewalk1: {
    name: "Sidewalk",
    description: "You are on the sidewalk of the bustling city. There are people all around, and the cacophony of voices, cars, and construction noises fill the air. You look around and try to get your bearings. The mental hospital is to the north. A signpost points to the west: University of Newmont Campus. To the east is an impressive sky scraper with the word DAHAE arching across its entrance. A phone that doesn't seem to belong to anyone is laying on the pavement ",
    items: ["phone"],
    objects: { signpost: { id: "signpost", descriptionId: "signpostDescription" } },
    exits: { north: "lobby", west: "library", east: "dahae", south: "sidewalk2" },
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
    exits: { south: "hallway", west: "dahae", east:"terminal"},
    npc: "Receptionist",
  },
  terminal: {
    name: "Terminal Station",
    description: "You enter a second communal work space. Unlike the open office where there was plenty of greenery and light, this place is minimal and austere. Tall dividers separate each terminal, providing privacy. Only a handful of Dahae employees are present here, each one sequestered and seated far apart from one another.\n\nYou sit down in front of a terminal, looking around to see if anyone noticed you before booting it on. It prompts you for a password.",
    items: [],
    objects: { terminal: {id:"terminal2", descriptionId: "terminal2Description"}  },
    exits: {west: "office"},
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
    items: ["ID"],
    objects: { plaque: { id: "plaque", descriptionId: "plaqueDescription" }, holoscreen: { id: "holoscreen", descriptionId: "holoscreenDescription" } },
    exits: { north: "library", south: "sidewalk3" },
  },
  sidewalk3: {
    name: "Sidewalk3",
    description: "The city sidewalk you are on is flanked by towering buildings that cast deep shadows. From above the glinting skyscraper windows you catch glimpses of fluffy white clouds as sunshine filters down. The street curves at an angle; to the north you see the University of Newmont and to the east is a gated park entrance surrounded by flowers and ornamental shrubbery.",
    items: [],
    objects: { flower: { id: "flower", descriptionId: "flowerDescription" }, flowers: { id: "flower", descriptionId: "flowerDescription" }  },
    exits: { north: "lecturehall", east:"westentrance" },//NEED EAST = WESTENTRANCE
  },
  sidewalk2: {
    name: "Sidewalk2",
    description: "The city is teeming with life. People and cars rush by and for a moment you feel at peace. Despite not being able to remember who you are, or knowing why you feel the compulsion to “find the weapons room” like the strange phone call directed you to do… the warm summer air and purposeful activity of the city's inhabitants makes you feel normal. Whatever “normal” means, anyway. You catch the scent of blooming flowers coming from the south.",
    items: [],
    objects: {  },
    exits: { north: "sidewalk1", south: "westentrance" },//NEED south = WESTENTRANCE
  },
  center: {
    name: "Center",
    description: "You make your way inside the park—a serene and verdant reminder of nature in a metropolis dominated by technology. A magnificent fountain is at the center, its clear, cool water sparkling in the sunlight. From here you can see three paths. The paths to the west and to south both seem to meander through the park. The third path leads to the east, out of the park and towards a spectacular glass building with the words “SENTRYSOFT” emblazoned across the entrance.\n\nYou see an security access card next to an empty can of soda by the benches. Some employee at SentrySoft must have lost his ID.",
    items: ["card"],
    objects: { foutain: { id: "fountain", descriptionId: "fountainDescription" }},
    exits: {east: "sentrysoft", west: "westentrance" , south: "southentrance" },
    npc: "Vendorbot",
  },
  sentrysoft: {
    name: "Sentrysoft",
    description: "You are inside the SentrySoft lobby. Sleek architectural lines and ambient light exude an air of sophistication. You can see the park right outside of the lobby—what a beautiful view.  There is no receptionist or security personnel here, just two large kiosks for employee sign-ins. One kiosk is on the east side of the lobby, and the other is on the south.\nThere is a large metal door by each kiosk that automatically open up to let people through once they sign in.",
    items: [],
    objects: {},
    exits: {east: "dock", west: "center" , south: "recordsroom" },
    npc: "Kiosk",
  },
  recordsroom: {
    name: "recordsroom",
    description: "You head south and walk down a long corridor lined with steel doors. It feels a bit eerie. There's no sign of life, not even ambient noises. You see an open door to your left and slip inside, leaving the door ajar just in case it locks behind you.\nYou seem to be in a storage room of some kind. Shelves fill the entirety of the room, stacked with data drives firmly locked into metal slots.\nA thumbdrive is inserted into a data drive. It's sticking out like a sore thumb. You wince at yourself for making such a lame pun.",
    items: ["thumbdrive"],
    objects: {shelves : { id: "shelves", descriptionId: "shelvesDescription" }, shelf : { id: "shelves", descriptionId: "shelvesDescription" }, drive : { id: "drive", descriptionId: "driveDescription" }, drives : { id: "drive", descriptionId: "driveDescription" }, data : { id: "drive", descriptionId: "driveDescription" }},
    exits: {north: "sentrysoft", door: "sentrysoft" },
  },
  
  westentrance: {
    name: "West Entrance",
    description: "You reach the ornamental wraught iron gates of the park. A stone sign nestled between vibrant clusters of tulips lets you know that you are at the West Entrance of Nouvelle Park. The air is filled with the sweet scent of blooming flowers and freshly cut grass. You can hear the sound of laughter and music off in the distance to the east, deep within the park. The city sidewalks stretch on to the north, the south, and to the west… You spot a small thumb drive attached to a lanyard, peeking out from between the tulips.",
    items: ["thumbdrive"],
    objects: { tulip: { id: "tulip", descriptionId: "tulipDescription" }, tulips: { id: "tulip", descriptionId: "tulipDescription" }, flowers: { id: "tulip", descriptionId: "tulipDescription" }, flower: { id: "tulip", descriptionId: "tulipDescription" } },
    exits: { north: "sidewalk2", east: "center", west: "sidewalk3" , south: "sidewalk4" },
  },
  sidewalk4: {
    name: "Sidewalk4",
    description: "You make your way down the snaking sidewalk, a narrow concrete pathway that meanders through the heart of the bustling metropolis. To the north and east you see entrances to Nouvelle Park. You see a gigantic glass and steel behemoth of a building to the south, giant letters spelling out “OCELLUS” affixed high on the rooftop.",
    items: [],
    objects: { lightpost: { id: "lightpost", descriptionId: "lightpostDescription" } },
    exits: { north: "westentrance", east: "southentrance", south: "ocellus" },
  },
  ocellus: {
    name: "Ocellus",
    description: "You enter Ocellus Corps headquarters. Its is much more inviting than the exterior of the building suggests. Bright and bold abstract paintings hang on the walls, making the lobby feel like a high end gallery. Emerald green velvet chairs cluster around beechwood coffee tables, interspersed throughout the space. A small group of rather serious looking men are seated at the far end of the lobby, quietly discussing something.",
    items: [],	
    objects: {painting: {id: "painting", descriptionId: "paintingDescription"}, paintings: {id: "painting", descriptionId: "paintingDescription"}, men : {id: "men", descriptionId: "menDescription"}, man : {id: "men", descriptionId: "menDescription"},},
    exits: { north: "sidewalk4", upstairs: "rooftop", up : "rooftop", upstair:"rooftop" },
    npc: "Securotron",
  },
  rooftop: {
    name: "Rooftop",
    description: "You enter the elevator and it begins to begins to ascend immediately as the doors close behind you. You press on the panel buttons at random but the elevator doesn't respond. It continues to woosh upwards, soft dings informing you of the floors you're passing.\nThe doors open and you step outside—literally. You are on the rooftop of the building. The large OCELLUS letters you saw from the ground are massive up close. They take up most of the roof. Not much seems to be up here other than a few cigarette butts littered by the letter S.\nA lockpick set sits on top of the middle leg of the letter E. Wonder why it's here…",
    items: ["lockpick"],	
    objects: {},
    exits: { down: "ocellus", downstairs: "ocellus", downstair : "ocellus" },
  },
  southentrance: {
    name: "Southentrance",
    description: "A lush canopy of trees form an archway over your head, their leaves swaying gently in the breeze. A large fence marks the borders of the park and a large metal plaque informs you of where you are: Nouvelle Park South Entrance. You can see into the park from here, a charming cobblestone walkway lined with tulips beckons you north, deep into the lush oasis inside. A winding path of city pavement unfolds before you to the west. To the south you can see a tall building that appears to be made out of polished black glass panels—the letters FRV etched into the opaque yet highly reflective glass.",
    items: [],
    objects: {fence: {id: "fence", descriptionId: "fenceDescription"}, plaque: {id: "plaq", descriptionId: "plaqDescription"}},
    exits: { north: "center", west: "sidewalk4", south: "frv" },
  },
  frv : {
    name: "FRV",
    description: "You enter FRV's lobby and are immediately met with a wave of soft, jazzy music. The walls are lined with artfully arranged succulent plants, adding a touch of greenery and life to the space. Comfortable lounge chairs and bean bags are scattered throughout, You can smell something delicious wafting down from the employee cafeteria upstairs, which you can catch a glimpse of through the open air balcony directly above. ",
    items: [],
    objects: {balcony: {id: "balcony", descriptionId: "balconyDescription"}, beanbag: {id: "beanbag", descriptionId: "beanbagDescription"}, beanbags: {id: "beanbag", descriptionId: "beanbagDescription"}, bean: {id: "beanbag", descriptionId: "beanbagDescription"}},
    exits: {north: "southentrance",up:"upstairs",upstairs:"upstairs",upstair:"upstairs",down:"downstairs",downstair:"downstairs",downstairs:"downstairs"},
    npc: "Guard",
  },
  upstairs:
  {
    name: "Upstairs",
    description: "You are inside the FRV cafeteria. The room is filled with the sounds of clinking cutlery and lively conversations. High-top tables and cozy booths are amply available for employees to enjoy their meals and catch up with colleagues. The serving area features a wide variety of fresh and healthy options. A large screen behind the buffet plays a video of food being made in the cafeteria kitchen.",
    items: ["dumplings","soda"],
    objects: {screen: {id: "screen", descriptionId: "screenDescription"}, video: {id: "video", descriptionId: "videoDescription"},  buffet: {id: "buffet", descriptionId: "buffetDescription"}},
    exits: {down:"frv",downstair:"frv",downstairs:"frv"},
  },
  downstairs:
  {
    name: "Downstairs",
    description: "You go down the flight of stairs and wander through the halls for a few minutes before realizing that you are hopelessly lost in the maze of corridors. Unlike the airy lobby above, navigating the downstairs area feels like attempting at a labryinthian puzzle.\n You reach the end of a long hallway. You find yourself face-to-face with an oddly plain wooden door.\n\nIt is much darker here than any of the other areas you've explored. You look up at the ceiling and realize that the dim lighting is by design. Only a few recessed lights, spaced far apart from one another, offer illumination. ",
    items: [],
    objects: {door: {id: "doors", descriptionId: "doorsDescription"}, lock: {id: "lock", descriptionId: "lockDescription"},locks: {id: "lock", descriptionId: "lockDescription"}},
    exits: {up:"frv",upstair:"frv",upstairs:"frv", door: "weaponsroom", gate: "weaponsroom", room: "weaponsroom"},
    npc : "Door",
  },
  weaponsroom:
  {
    name: "Weaponsroom",
    description: "You step through the door, unsure of what to expect. The space suddenly floods with light.\n\nYou are in a completely wooden room, wall to wall with weapons. Most of them seem to be knives, though there are a few guns and what looks like a rocket launcher.",
    items: [],
    objects: {knives: {id: "knives", descriptionId: "knivesDescription"},knife:{id: "knives", descriptionId: "knivesDescription"}, rocketlauncher:{id: "rocket", descriptionId: "rocketDescription"},rocket:{id: "rocket", descriptionId: "rocketDescription"},rockets:{id: "rocket", descriptionId: "rocketDescription"},guns:{id: "guns", descriptionId: "gunsDescription"},gun:{id: "guns", descriptionId: "gunsDescription"}},
    exits: {door: "downstairs", gate: "downstairs", back: "downstairs"},
  },
  fractalhq: {
    name: "FractalHQ",
    description: "Your vision goes black and you crumple to the floor.\nYou open your eyes slowly, wincing at the bright lights. You're in a white room with strange machines and monitors displaying undecipherable data. You are on a reclining bed. There is a thick black wire inserted into your forearm connecting you to what looks like a giant pyramid with a digital panel on one side.\n\nA tall man in a white lab coat and thick horn-rimmed glasses is sitting at a terminal to your left, just slightly out of view. You try to turn your head to get a better look at him but find it hard to move your neck.\n\n“Awake?” The man asks. You recognize his voice as the one from the phone.\n“You don't have to answer that. It was a rhetorical question. We're in the process of unplugging you right now. You can try to talk if you want to, but it's going to slow down the unplug if you waste Dark Matter on processing speech.”\nHe gets up from his chair and stands over you, examining your face carefully.\n“We were worried you wouldn't reach the extraction point in time. Turns out there were ah… let's just say, unexpected bugs in this module.”\n\nYou open your mouth but find that your voice is almost gone. Your throat is raw and your tongue feels swollen.\nYOU: “I… have some questions…”",
    items: [],
    objects: {},
    exits: {},
    npc: "Man",
  },
  dock: {
    name: "Dock",
    description: "You stride down a brightly lit walkway until you reach a large open area with loading docks.\n\nNo one seems to be around, and all of the transport machines seem to have been shut off. There are stacks and stacks of boxes here. None of them are marked or labeled so it's impossible to know what's inside them. ",
    items: [],
    objects: {box: {id: "box", descriptionId: "boxDescription"}, boxes: {id: "box", descriptionId: "boxDescription"},boxs:{id: "box", descriptionId: "boxDescription"}, dog: {id: "dog", descriptionId: "dogDescription"}, robot: {id: "dog", descriptionId: "dogDescription"}, F1DO:{id: "dog", descriptionId: "dogDescription"}, FIDO:{id: "dog", descriptionId: "dogDescription"}, f1do:{id: "dog", descriptionId: "dogDescription"},fido:{id: "dog", descriptionId: "dogDescription"}},
    exits: {door: "sentrysoft", west: "sentrysoft" },
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
  tulipDescription: { id: "tulipDescription", description: "It's funny. You can't remember your own name but you do remember that the Empress Hahna Kapa's favorite flower was the tulip. " },
  lightpostDescription: { id: "lightpostDescription", description: "Nothing exceptional. Just your standard Brill-o-Watt™ lightpost, found in virtually every city." },
  paintingDescription: { id: "paintingDescription", description: "It's hard to know whether they're good or bad. " },
  menDescription: { id: "menDescription", description: "They seem very engrossed in their conversation. They're talking so quietly that it's impossible to hear what they're saying. " },
  fenceDescription: { id: "fenceDescription", description: "The craftsmanship of the ornate wrought iron fence is undeniable." },
  plaqDescription: { id: "plaqDescription", description: "Nouvelle Park South Entrance: Welcome to The Pride of Newmont" },	
  balconyDescription: { id: "balconyDescription", description: "You can see FRV employees from here. Some are eating, some seem to be just hanging out." },
  beanbagDescription: { id: "beanbagDescription", description: "You are suddenly reminded of playing tag and other childish games like pin-the-weasel for some reason." },
  screenDescription: { id: "screenDescription", description: "You can't tell if the video is playing a prerecorded video or showing you a live feed of the FRV kitchen." },
  buffetDescription: { id: "buffetDescription", description: "Sandwiches, salads, stir-frys, and tons of dessert options are on the table. It looks like today's special is Kyoreu style slopehump dumplings—delicious!" },
  videoDescription: { id: "videoDescription", description: "You watch the video for a few minutes, mesmerized by the hustle and bustle of the kitchen. It strikes you that all of the cooks in the video are humans. Not a single robot to be seen…" },
  doorsDescription: { id: "doorsDescription", description: "The other doors you've seen were all made out of metal. Why is this one made out of wood?" },
  lockDescription: { id: "lockDescription", description: "It's a keypad lock. You can't tell what the code is." },
  knivesDescription: { id: "knivesDescription", description: "You walk over to the extensive selection of knives, all meticulously hung on the walls with small labels affixed to them.\n\nR.Y.F.T. Cleaver Model 012\nR.Y.F.T. Cleaver Model 013\nR.Y.F.T. Cleaver Model 014\n…\n\nThere are so many knives here." },
  rocketDescription: { id: "rocketDescription", description: "R.Y.F.T. Cleaver Blaster Prototype 000\n\nWhat the heck are these weapons for??" },
  gunsDescription: { id: "gunsDescription", description: "You lean over to inspect the guns hanging on the wall. \nR.Y.F.T. Cleaver Model 333\nR.Y.F.T. Cleaver Model 334—\nYou feel a prickle on the back of your neck, as if someone is watching you." },
  fountainDescription: { id: "fountainDescription", description: "It's a very ornate centerpiece, made out of marble. There are three tiers to the fountain, each layer adorned with various carved animals." },
  shelvesDescription:{ id: "shelvesDescription", description: "These shelves are made out of thick, heavy duty steel panels." },
  driveDescription: { id: "driveDescription", description: "They're all labeled, but it's impossible to know what the filing system is. The labels read like nonsense: “SpoiledMilk”, “PinkPumpkinCandle”, “WiperFluid”… They're not in alphabetical order." },
  boxDescription: {id: "boxDescription", description: "Curiosity gets the best of you and you decide to peek into one of the unmarked boxes.\nIt contains at least a dozen robot dogs. They look rather menacing.\n\nYou gingerly turn one of the bots over to take a closer look. Its underbelly has the words “F1DO by SentrySoft” imprinted onto the shiny plastic shell. Also affixed to the bottom is a red and white warning label: “DANGER: RECALLED ITEM”\n\nYou hear footsteps from a distance and decide to close the box. "},
  dogDescription: { id: "dogDescription", description: "According to the imprint on its underbelly, the robot dogs are called F1DO, by SentrySoft. The dogs look more like attack machines than a home device. They have hinged jaws with pointed fangs--definitely not a family friendly design.\nYou better not take that. It looks dangerous. " },
  terminal2Description: { id: "terminal2Description", description: "You wonder if valid passwords could be related to Dahae's products..." },
};
//create a function "23QPX6" taht returns a string. This function must be called writing exactly 23QPX6.
export const Q23QPX6 = (): Promise<string> => {
  if (currentLocation === locations.terminal) {
  return Promise.resolve(`TERMINAL: Welcome back, Final Development Team member! You now have access to FDT common files. Enter your ID and password to access your personal files.

  You click around but don't find anything particularly interesting other than a spreadsheet that seems to detail prototype models for Dahae's “BuddyBot”. 
  
  An internal memo pops up: “ATTN: FDT AND FST! The rumors about BB's direct optic data feeds are categorically FALSE. Please do everything you can to discourage this type of gossip. Not only does it call Dahae's integrity into question but it is extremely insulting to everyone who worked to make BuddyBot the best PB on the market. We strongly encourage you to report any and ALL team members to Internal Investigations if you suspect them of spreading malicious rumors about Dahae. Your report will be handled anonymously. If your report proves to be correct, you will be awarded double your Winter Solstice bonus at the end-of-year. We are Dahae FAMILY and we must protect our own!”`);
}
else {
  return Promise.resolve(`You remember the etching on your AR BuddyBot. You don't find any way to use that here...`);
}};
export const q23qpx6 = (): Promise<string> => {
  if (currentLocation === locations.terminal) {
    return Promise.resolve(`TERMINAL: Welcome back, Final Development Team member! You now have access to FDT common files. Enter your ID and password to access your personal files.
  
    You click around but don't find anything particularly interesting other than a spreadsheet that seems to detail prototype models for Dahae's “BuddyBot”. 
    
    An internal memo pops up: “ATTN: FDT AND FST! The rumors about BB's direct optic data feeds are categorically FALSE. Please do everything you can to discourage this type of gossip. Not only does it call Dahae's integrity into question but it is extremely insulting to everyone who worked to make BuddyBot the best PB on the market. We strongly encourage you to report any and ALL team members to Internal Investigations if you suspect them of spreading malicious rumors about Dahae. Your report will be handled anonymously. If your report proves to be correct, you will be awarded double your Winter Solstice bonus at the end-of-year. We are Dahae FAMILY and we must protect our own!”`);
  }
  else {
    return Promise.resolve(`You remember the etching on your AR BuddyBot. You don't find any way to use that here...`);
  }};
//create a function "okay" that teleports you to fractalHQ
export const ok = (): Promise<string> => {
  return okay();
};
export const OKAY = (): Promise<string> => {
  return okay();
};
export const OK = (): Promise<string> => {
  return okay();
};
export const okay = (): Promise<string> => {
  if (inventory.includes("phone") && currentLocation === locations.weaponsroom) {
    currentLocation = locations.fractalhq;
    return Promise.resolve(displayLocation());
  }
  return Promise.resolve("You can't just say okay and expect something to happen...");
};
export const examine = (args: string[]): Promise<string> => {
  const objectToExamine = args[0];
  if (currentLocation.items.includes(objectToExamine)|| inventory.includes(objectToExamine)) {
    switch (objectToExamine) {
      case "rock":
        return Promise.resolve("You examine the rock and find a strange symbol etched into its surface.");
      case "jello":
        return Promise.resolve("You look at the container of jello. It's an unappetizing dark green color. Yuck!");
      case "magazine":
      return Promise.resolve("“Current Signals” magazine seems to be a tech-focused lifestyle publication. You flip through it and find nothing that interests you. It is mostly written in English with small sections in Kyoreugul.");
      case "coat":
        inventory.push("pass");
        return Promise.resolve("A doctor's hospital pass falls out of the coat!");    
      case "pass":
        return Promise.resolve("This pass belongs to a Dr. Jian Bouchard.");
      case "ID":
      return Promise.resolve("This ID belongs to Nomo Bouchard.");
      case "thumbdrive":
        return Promise.resolve("The device is compact. Its shell is made out of a sturdy matte black plastic. The lanyard attached to it has a company name printed on it: OCELLUS CORP.");
      case "lockpick":
        return Promise.resolve("This looks useful.");
        case "wallet":
         return Promise.resolve("It has some cash inside but nothing else.");
         case "phone":
          return Promise.resolve("You tap on the phone and attempt to unlock it but can't get past the lockscreen. ");  
          case "dumplings":
            return Promise.resolve("Kyoreu style slopehump dumplings—delicious!"); 
            case "card":
              return Promise.resolve("This card belongs to a Jay Leung, who works at SentrySoft.")
            case "soda":
              return Promise.resolve("Le Zeste… Natural orange soda with real pulp. You don't think you've ever seen this brand of soda before.");      
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
      case "securotron":
      return Promise.resolve(`The lobby may be inviting, but he definitely is not. The security bot catches you looking at him and he holds your stare. You can feel his disdain for you.`);
      case "guard":
        return Promise.resolve(`He's wearing a tight-fitting armored uniform that looks futuristic and stylish, but definitely uncomfortable.`);
        case "vendorbot":
          return Promise.resolve(`He has a silly little hat on.`);
      default:
        return Promise.resolve(`There's no ${objectToExamine} here.`);
    }
  }
  if (currentLocation.name === "office" && (objectToExamine.toLowerCase()==="window" || objectToExamine==="window") ){
    return Promise.resolve(`You look out of the window see a serene forest instead of the city. From a distance you can see what looks like a herd of shaggy unicorns.`)
  }
  if (currentLocation.objects[objectToExamine]) {
    //if the inventory contains phone, then >examine guns or >examine gun gives a different response
    if (currentLocation===locations.weaponsroom && inventory.includes("phone") && (objectToExamine.toLowerCase()==="guns" || objectToExamine.toLowerCase()==="gun")){
      return Promise.resolve(`You lean over to inspect the guns hanging on the wall.\n\nR.Y.F.T. Cleaver Model 333\nR.Y.F.T. Cleaver Model 334—\n\nThe phone in your pocket suddenly rings, startling you.\n\nYou answer the phone.\n\nYOU: “Hello? Is this—”\nVOICE: “Operator, please stand by. We are downloading the Cleaver data. We'll be teleporting you to the in-sim Lab shortly.”\nYOU: “Look, I don't know wh—”\nVOICE: “Operator, we are ready to port you out NOW. Say ---OKAY--- to confirm—we don't have much time.”`);
    }
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
  vendorbot: {
    name: "Vendorbot",
    message: "You see a ice cream vendorbot stationed next to the fountain, serving heaping scoops of ice cream to smiling customers. He tips his hat at you before saying, “Don't just stand there staring! You deserve a refreshing treat, don't you think?”",
    dialogOptions: {
      "1": {
        message: "No thanks, I don't want any ice cream.",
        responseMessage: "The vendorbot smiles and shrugs at you before turning to another potential customer."
      },
      "2": { message: "I'm lactose intolerant." ,
           responseMessage: "The vendorbot shakes his head, a wry smile on his face. “That's the saddest thing I've heard all day. What's it like being flavor intolerant?”\n\nYou're not sure if he's being earnest or if you just got sassed by a robot. You open your mouth to reply but he's busy serving a customer and no longer looking at you. "
           },
      "3": { message: "Do you have anything other than ice cream?" ,
           responseMessage: "The vendorbot narrows his eyes. “Why would I?” he asks rhetorically in a rather chilly tone, before turning to greet a new customer."
           },  
    },
  },
  kiosk: {
    name: "Kiosk",
    message: "The kiosk's screen activates when you go near it.",
    dialogOptions: {
      "1": {
        message: "Select “Lost ID”",
        responseMessage: "You feel a slight tingle all over your body and realize that a biometrics scan has been done. You look around to spot the security sensor but don't find it.\nThe kiosk's screen flashes a message: Employee not recognized."
      },
    },
  },
  door: {
    name: "Door",
    message: "The door in front of you has four mechanical locks. What would you like to ---ATTEMPT--- ?",
    dialogOptions: {
      "1": {
        message: "(attempt) Jiggle the first lock.",
        responseMessage: "You wrestle with the lock, trying to pry it open. No amount of fumbling with it will do anything.\n You'll need to find a key that works."
      },
      "2": { message: "(attempt) Jiggle the second lock." ,
           responseMessage: "You wrestle with the lock, trying to pry it open. No amount of fumbling with it will do anything.\n You'll need to find a key that works."
           },
      "3": { message: "(attempt) Jiggle the third lock. " ,
           responseMessage: "You wrestle with the lock, trying to pry it open. No amount of fumbling with it will do anything.\n You'll need to find a key that works."
           },
      "4": { message: "(attempt) Jiggle the fourth lock." ,
           responseMessage: "You wrestle with the lock, trying to pry it open. No amount of fumbling with it will do anything.\n You'll need to find a key that works."
           },     
    },
  },
  guard: {
    name: "Guard",
    message: "A human security guard stands by two flights of stairs, one that leads up and the other heading downstairs. He is holding a small portable fan to his face and looks a bit irritated. “Hey there,” the guard says in a grouchy tone.",
    dialogOptions: {
      "1": {
        message: "Hey…",
        responseMessage: "You give him your friendliest smile. He doesn't seem like he wants to talk to you.\n\nGUARD: “ID please.”\nYou pretend to look for your ID.\n\nYOU: … Looks like I left it at home.\nGUARD: Looks like you have to go and get your ID, then."
      },
      "2": { message: "Excuse me, I need to take the stairs." ,
           responseMessage: "GUARD: “Your ID?”\n\nYOU: “I… don't have it with me. I just need to grab something though…”\nYou awkwardly try to maneuver around him but he doesn't let you step through.\n\nGUARD: “Listen kid, I'm sweating like a pig in this uniform, I have six hours left in my shift, I'm not playing games with you. Go get your ID.”\nYOU: “Okay.”"
           },
      "3": { message: "Whatever they've got upstairs smells great." ,
           responseMessage: "GUARD: “It smells like slopehump. I hate it.”"
           },  
    },
  },
  securotron: {
    name: "Securotron",
    message: "A securotron glides over to you, seemingly out of nowhere, and positions himself directly in front of you. He scans your body before saying in a bored, flat tone: \n“Biometrics not recognized. Please present your identification now or say 'I have an appointment' if you are a scheduled guest.”",
    dialogOptions: {
      "1": {
        message: "I have an appointment.",
        responseMessage: "SECUROTRON: “Please say the name of the party you have a meeting with.”\nYou try to come up with a plausible name. It's worth a shot, right?\n”I'm… I have a meeting with Mr. John.”\nSECUROTRON: “First and last name, please.”\n“Uh… Mr. John… Johnson?”\n…\nThe securotron does not look amused."
      },
      "2": { message: "Can I speak to a human?" ,
           responseMessage: "SECUROTRON:The securotron's expression changes to one of slight annoyance.\nSECUROTRON: “I am more than qualified to address any concerns or questions you may have. Did you have a question?”\nHe seems deeply offended by your question.\nYou smile at him apologetically. “Sorry, I… Uh…” You stammer, trailing off as the securotron's face morphs into a full scowl."
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
        responseMessage: "ROBONURSE: You are in St. Dymphna Behavioral Health Hospital, located in Newmont. We are the highest rated mental health facility in the G.S.A. You are safe here but you MUST GO. BACK. TO. YOUR. ROOM."
           },
      "2": { message: "I don't belong here." ,
           responseMessage: "ROBONURSE: You belong here. You don't have a visitor's pass and you are not a staff member. Therefore, you are an in-patient of our mental health facility. If you don't want a rules violation on your record, you MUST GO BACK TO YOUR ROOM NOW."
           },
      "3": { message: "I'm trying to leave." ,
           responseMessage: "ROBONURSE: You are a patient and you cannot leave without a medical clearance from one of our doctors. For your health and safety, please GO BACK TO YOUR ROOM. "
           },             
    },
  },
  girl: {
    name: "Girl",
    message: "A pretty girl sitting at one of the tables looks up from her studies and smiles at you politely before going back to her notes.",
    dialogOptions: {
      "1": {
        message: "Hey, I'm a little lost…",
        responseMessage: "GIRL: “Okay…?” She says with a hesitant smile. “So can I help you…?”\nShe seems a little creeped out.\n\nYou shake your head and mumble, “Nevermind.”"
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
  man: {
    name: "Man",
    message: "The man looks at the pyramid machine next to you. “I doubt I'll be able to answer more than one question before I lose you. So think carefully about what you want to ask.”",
    dialogOptions: {
      "1": {
        message: "What is this place?",
        responseMessage: "MAN: “Boy, you really don't remember anything, do you? When HQ told me that your memory file had been corrupted, I didn't think it would be this bad.”\nHe looks over at the screen on the pyramid your arm is hooked up to.\n\nMAN: “No point in explaining it here. You'll remember as soon as you're out of the simulation.”\nHe gives you a wry smile. “And if you don't remember once you're unplugged… Well… Guess they'll have to do a special debriefing with you, won't they?”\n\nYour vision goes black again.\n\n"
           },
      "2": { message: "Who are you?" ,
           responseMessage: "MAN: “I'm offended, Operator. Even with a corrupted memory file, I thought you'd remember me. You remembered how to pick locks, but you forgot who I am?”\nHe makes a tsk-ing noise and taps the name tag on his chest: Dr. K.P. Gill\n\nThe name doesn't sound familiar to you in the least.\n\nGILL: “I hope for your sake that you regain your real memories once you're unplugged. I'll see you again soon. Hopefully we won't have to deal with anything like this ever again.”\n\nHe rolls his eyes before continuing, “But knowing how Acheron is, we probably will. Don't tell anyone I said this but she plays things too fast and loose for my liking.”\n\nYour vision goes black again.\n\n"
           },
      "3": { message: "What were those weapons?" ,
           responseMessage: "The man stares at you dumbfounded. “You mean the Cleavers?”\n\nYou nod.\n\nMAN: “The Cleavers. You know, Random Yield Flash Travel machines?”\n...\nMAN: “Boy, you really don't remember anything, do you? When HQ told me that your memory file had been corrupted, I didn't think it would be this bad.”\n\nThe pyramid your arm is hooked up to starts making an obnoxious beeping noise.\n\nMAN: “Looks like our time is up. See you next time, Operator.”\nYour vision goes black again.\n\n"
           },
      "4": { message: "What's happening?" ,
           responseMessage: "MAN: “Standard unplug, don't worry. You're lucky we didn't have to do a manual disconnect. You almost didn't make it to the extraction point in time.”\n\nHe looks over at the screen on the pyramind your arm is hooked up to.\n\nMAN: “Not much time left—what did you see in the room? I've been dying to know what the Cleaver models look like. I don't think anyone expected them to advance to that tech yet.”\n\nThe machine starts making an obnoxious beeping noise.\nMAN: “Ahh… crap.”\nYour vision goes black again.\n\n"
           },
      "5": { message: "Who am I?" ,
           responseMessage: "The man looks at you with a concerned expression.\nMAN: “You don't remember your name?”\n\nYou shake your head.\n\nMAN: “Oh boy, that's not good. The last time someone's memory file was corrupted this badly…”\n\nHe shakes his head and gives you a forced smile. “You'll be okay, Operator. Don't worry. I'm sure you'll get your real memories back once you unplug.”\n…\nThe pyramid your arm is hooked up to starts making an obnoxious beeping noise.\nYour vision goes black again.\n\n"
           },  
      "6": { message: "What is that machine my arm is plugged into?" ,
           responseMessage: "MAN: “You really don't remember anything, huh?”\n\n You weakly shake your head. Even that slight movement exhausts you.\n\n MAN: “It's the DFV Machine. Disconnect From Virtuality—Yeah, I know, it's a bit literal but I'm a scientist, not a nomenclaturist.”\n\nThe DFV Machine to starts making an obnoxious beeping noise.\nMAN: “Looks like our time is up. I'll see you soon—take care of yourself, okay?”\nYour vision goes black again.\n\n"
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
    if (inventory.includes("pass")) {
      npcs.robonurse.dialogOptions["4"] = {
        message: "(hidden option) Show her your hospital ID card.",
        responseMessage: "ROBONURSE: Hello, Dr. Bouchard! You are currently scheduled as OFF DUTY. You have ZERO messages. Have a nice day!"
      };
    } else {
      delete npcs.robonurse.dialogOptions["4"];
    }
  }
  if (currentLocation.npc?.toLowerCase() === "kiosk") {
    if (inventory.includes("card")) {
      npcs.kiosk.dialogOptions["2"] = {
        message: "(hidden option) Select “Swipe SentrySoft card”",
        requiresItem: "card",
        responseMessage: "You swipe the security access card and feel a slight tingle all over your body.\nThe kiosk's screen flashes a message but it's gone before you can read it.\n\nBoth metal doors open up, one south of here and another east of here"
      };
    } else {
      delete npcs.kiosk.dialogOptions["2"];
    }
  }
  if (currentLocation.npc?.toLowerCase() === "vendorbot") {
    if (inventory.includes("wallet")) {
      npcs.vendorbot.dialogOptions["4"] = {
        message: "(hidden option) Sure, I'll take an ice cream.",
        requiresItem: "wallet",
        responseMessage: "The vendorbot takes your cash and hands you a caramel cone.\n\nYOU: “I didn't ask for a caramel cone. I wanted a—”\nVENDORBOT: “Nonsense, you want a caramel cone.”\nHe turns away from you and greets a new customer with a wide smile, “Well hello there!”\n\nLooks like you're stuck with a caramel cone."
      };
    } else {
      delete npcs.robonurse.dialogOptions["4"];
    }
  }
  if (currentLocation.npc?.toLowerCase() === "door") {
    if (inventory.includes("lockpick")) {
      npcs.door.dialogOptions["5"] = {
        message: "(hidden option) (attempt) Use the lockpick set you found on the Ocellus HQ rooftop.",
        requiresItem: "lockpick",
        responseMessage: "You use the lockpick set and manage to undo all three locks with relative ease.\n The door is now unlocked."
      };
    } else {
      delete npcs.door.dialogOptions["5"];
    }
  }
  if (currentLocation.npc?.toLowerCase() === "securotron") {
    if (inventory.includes("thumbdrive")) {
      npcs.securotron.dialogOptions["3"] = {
        message: "(hidden option) Show him the Ocellus thumb drive you found.",
        requiresItem: "thumbdrive",
        responseMessage: "You dig through your pocket and pull out the thumb drive you found at the park. The bot takes it from you and inserts it into a port on the side of his head. \nSECURITY BOT: “Welcome back, Mr. Johnson. You are cleared to go upstairs.”"
      };
    } else {
      delete npcs.securotron.dialogOptions["3"];
    }
  }

  //girlcheck
  if (currentLocation.npc?.toLowerCase() === "girl") {
    if (inventory.includes("ID")) {
      npcs.girl.dialogOptions["4"] = {
        message: "(hidden option) Show her Nomo Bouchard's student ID card.",
        requiresItem: "ID",
        responseMessage: "GIRL: “Oh my gosh!” she exclaims, drawing some irritated looks from the other students. “This is my friend's card. I'm sorry, do you know Nomo?”\n\nYou lie and say that you do.\nYou can tell that she can tell that you're lying.\n\nGIRL: “O-okay… well, I'll just take this,” she takes the ID card from your hand. “He and I both intern at FRV, so I'll give it to him later today when I see him.”\nThe two of you stare at each other in awkward silence.\n\nGIRL: “Thanks,” she says, then turns away."
      };
    } else {
      delete npcs.girl.dialogOptions["4"];
    }
  }

  //guardcheck
  if (currentLocation.npc?.toLowerCase() === "guard") {
    if (inventory.includes("icecream")) {
      npcs.guard.dialogOptions["4"] = {
        message: "(hidden option) “Do you want this ice cream?” (gives you access to the stairs)",
        requiresItem: "icecream",
        responseMessage: "You offer him the ice cream you bought at the park to the guard. The guard's expression changes to one of delight.\n\nGUARD: “Is that a cone from Gelattobot? You sure I can have this?”\nYOU: “Yeah, of course. You enjoy it while I go to my office and get something real fast.”\nHe eagerly takes the ice cream from your hand.\n\nGUARD: “Okay, but be quick. I'm not supposed to let anyone in without their ID. Not even Larry.” "
      };
    } else {
      delete npcs.guard.dialogOptions["4"];
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
 // output += "\nExits:";
 // for (const direction in currentLocation.exits) {
   // output += `\n  ${direction}: ${currentLocation.exits[direction]}`;
  //}
  return output;
};
let manTalkedTo = false;
export const talk = (option: string): Promise<string> => {
  if (manTalkedTo) {
    return Promise.resolve(`
     ########:'########:::::'###:::::'######::'########::::'###::::'##:::::::
     ##.....:: ##.... ##:::'## ##:::'##... ##:... ##..::::'## ##::: ##:::::::
     ##::::::: ##:::: ##::'##:. ##:: ##:::..::::: ##:::::'##:. ##:: ##:::::::
     ######::: ########::'##:::. ##: ##:::::::::: ##::::'##:::. ##: ##:::::::
     ##...:::: ##.. ##::: #########: ##:::::::::: ##:::: #########: ##:::::::
     ##::::::: ##::. ##:: ##.... ##: ##::: ##:::: ##:::: ##.... ##: ##:::::::
     ##::::::: ##:::. ##: ##:::: ##:. ######::::: ##:::: ##:::: ##: ########:
    ..::::::::..:::::..::..:::::..:::......::::::..:::::..:::::..::........::`);
  }
  const npc = npcs[currentLocation.npc?.toLowerCase()];
  if (!npc) {
    return Promise.resolve("There is no one to talk to here.");
  }

    // Set the `manTalkedTo` flag to true after the player talks to the "Man" NPC
    if (npc === npcs.man) {
      manTalkedTo = true;
      const dialogOption = npc.dialogOptions[option];
      const discordLink = "https://discord.gg/fractallabs";
      dialogOption.responseMessage += `
      ########:'########:::::'###:::::'######::'########::::'###::::'##:::::::
      ##.....:: ##.... ##:::'## ##:::'##... ##:... ##..::::'## ##::: ##:::::::
      ##::::::: ##:::: ##::'##:. ##:: ##:::..::::: ##:::::'##:. ##:: ##:::::::
      ######::: ########::'##:::. ##: ##:::::::::: ##::::'##:::. ##: ##:::::::
      ##...:::: ##.. ##::: #########: ##:::::::::: ##:::: #########: ##:::::::
      ##::::::: ##::. ##:: ##.... ##: ##::: ##:::: ##:::: ##.... ##: ##:::::::
      ##::::::: ##:::. ##: ##:::: ##:. ######::::: ##:::: ##:::: ##: ########:
     ..::::::::..:::::..::..:::::..:::......::::::..:::::..:::::..::........::
                          
      <a href="${discordLink}">${discordLink}</a>`;
      
      return Promise.resolve(dialogOption.responseMessage);
    }
    

  const dialogOption = npc.dialogOptions[option];
  if (!dialogOption) {
    return Promise.resolve("Invalid dialog option. Please try again.");
  } 
  if (dialogOption.requiresItem) {
    const result = handleItemExchange(dialogOption.requiresItem, dialogOption.responseMessage);
    if (result) {
      return Promise.resolve(result);
    }
  }

  return Promise.resolve(dialogOption.responseMessage);
};
export const select = (option: string): Promise<string> => {
  return talk(option);
};
//create an alias for talk named speak that returns the same thing as talk
export const speak = (option: string): Promise<string> => {
  return talk(option);
};
export const attempt = (option: string): Promise<string> => {
  return talk(option);
};

export const ATTEMPT = (option: string): Promise<string> => {
  return talk(option);
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
  if (item === "wallet") {
    const index = inventory.indexOf("wallet");
    if (index === -1) {
      return `You don't have the necessary item to select that option.`;
    }
    inventory.splice(index, 1);
    inventory.push("icecream");
    return responseMessage;
  }
  if (item === "lockpick") {
    const index = inventory.indexOf("lockpick");
    if (index === -1) {
      return `You don't have the necessary item to select that option.`;
    }
    inventory.splice(index, 1);
    inventory.push("dooraccess");
    return responseMessage;
  }
  if (item === "card") {
    const index = inventory.indexOf("card");
    if (index === -1) {
      return `You don't have the necessary item to select that option.`;
    }
    inventory.push("sentrysoftaccess");
    return responseMessage;
  }

  if (item === "ID") {
    const index = inventory.indexOf("ID");
    if (index === -1) {
      return `You don't have the necessary item to select that option.`;
    }
    inventory.splice(index, 1);
    return responseMessage;
  }
  if (item === "thumbdrive") {
    const index = inventory.indexOf("thumbdrive");
    if (index === -1) {
      return `You don't have the necessary item to select that option.`;
    }
    inventory.push("roofaccess");
    inventory.splice(index, 1);
    return responseMessage;
  }
  if (item === "icecream") {
    const index = inventory.indexOf("icecream");
    if (index === -1) {
      return `You don't have the necessary item to select that option.`;
    }
    inventory.push("stairsaccess");
    inventory.splice(index, 1);
    return responseMessage;
  }
  return undefined;
};
//so open door works and can go to the next room
export const open = (direction: string): string => {
  return go(direction);
};

export const go = (direction: string): string => {
// Define a global boolean variable to keep track of whether the player has visited the weapons room before

// Check if the player is entering the weapons room for the first time
if (currentLocation.exits[direction] === "weaponsroom" && currentLocation === locations.downstairs && inventory.includes("phone")) {
  //change the locations.weaponsroom.description to the following
  locations.weaponsroom.description = "You step through the door, unsure of what to expect. The space suddenly floods with light.\n\nYou are in a completely wooden room, wall to wall with weapons. Most of them seem to be knives, though there are a few guns and what looks like a rocket launcher.\n\nThis must be the weapons room the mysterious voice on the phone instructed you to find.\n\n...\n\n But now What? ";
  
}

  //make sure the player can't leave the hospital without the ID card
  if (currentLocation.exits[direction] === "sidewalk1" && currentLocation===locations.lobby && !inventory.includes("pass")) {
    return "You cannot exit the hospital. The robot nurse is watching you closely.";
  }
  if (currentLocation.exits[direction] === "rooftop" && currentLocation===locations.ocellus && !inventory.includes("roofaccess")) {
    return "You can't go up, the securotron won't let you.";
  }
  if (currentLocation.exits[direction] === "dock" && currentLocation===locations.sentrysoft && !inventory.includes("sentrysoftaccess")) {
    return "The metal door is much too heavy to open.";
  }
  if (currentLocation.exits[direction] === "recordsroom" && currentLocation===locations.sentrysoft && !inventory.includes("sentrysoftaccess")) {
    return "The metal door is much too heavy to open.";
  }
  if (currentLocation.exits[direction] === "weaponsroom" && currentLocation===locations.downstairs && !inventory.includes("dooraccess")) {
    return "You can't open the door, it's locked.";
  }
  if (currentLocation.exits[direction] === "upstairs" && currentLocation===locations.frv && !inventory.includes("stairsaccess")) {
    return "You can't go upstairs, the guard won't let you.";
  }
  if (currentLocation.exits[direction] === "downstairs" && currentLocation===locations.frv && !inventory.includes("stairsaccess")) {
    return "You can't go downstairs, the guard won't let you.";
  }
  
  if (!currentLocation.exits[direction]) {
    return "You can't go that way.";
  }

  currentLocation = locations[currentLocation.exits[direction]];
  return displayLocation();
};

let phonePickedUp = false;
export const grab = (args: string[]): Promise<string> => {
  return take(args);
};
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


export const fight = (args: string[]): Promise<string> => {

  if (args.length === 0) {
    return Promise.resolve(`You can only fight NPCs`);
  }
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
          case "securotron":
            return Promise.resolve(`You muster up the courage and rush toward the robot.\nIt turns to look at you and its eyes flash green. You feel a brain splitting headache and fall to your knees, clutching your head.\nIt takes you a minute before you can stand back up. You're not sure what just happened.\nYou look cautiously at the robot. It stares you down but doesn't move from its position.\n\nYou better not try that again.`);
            case "vendorbot":
              return Promise.resolve(`It's such a nice day. And this is a beautiful park. There are children around. Don't let the intrusive thoughts win.\n\nYou unclench your jaw and decide not to fight the vendorbot. `);
          default:
        return Promise.resolve(`There's no ${objectTofight} here.`);
    }
  }
  return Promise.resolve(`You can only fight NPCs`);
};

export const distract = (args: string[]): Promise<string> => {
  return sneak(args);
};
export const sneak = (args: string[]): Promise<string> => {
 
  if (args.length === 0) {
    return Promise.resolve(`You can only sneak past NPCs`);
  }

  const objectTosneak = args[0];

  if (currentLocation.npc?.toLowerCase() === objectTosneak.toLowerCase()) {
    const npce = npcs[currentLocation.npc.toLowerCase()];
    switch (currentLocation.npc.toLowerCase()) {

      case "robonurse":
        return Promise.resolve(`The robot nurse rapidly wheels up to you and puts both of her hands on your shoulders\nNURSE: You don't want a rules violation on your record now, do you? GO. BACK. TO. YOUR. ROOM. `);
        case "girl":
        return Promise.resolve(`What point in sneaking past her? She clearly doesn't want you here anyway..`);
        case "patrolbot":
          return Promise.resolve(`He is keenly aware of your presence. Your only option is to FIGHT`);
          case "securotron":
            return Promise.resolve(`He is keenly aware of your presence. Your only option is to FIGHT`);
            case "guard":
              locations.frv.npc = undefined;
              inventory.push("stairsaccess");
              currentLocation.description +="\nYou can see the guard's feet poking behind the beanbag...\n\n Better not stay here too long";
              return Promise.resolve(`YOU: “Hey… is that an ice cold can of Le Zeste over there?”\n\nYou point towards an unopened can of soda someone left behind. The parched guard sees it and lunges towards it, as if he's worried about its rightful owner coming back to reclaim it. In his haste, he slips on the tile floor and lands on his head with a thud.\n\nYou had intended to sneak past him but it looks like he's out cold.\nYou push one of the beanbags in front of the unconscious guard to hide his limp body, then make your way to the stairs.`);
          default:
        return Promise.resolve(`There's no point sneaking past ${npce.name}`);
    }
  }
  return Promise.resolve(`You can only sneak past NPCs`);
};
