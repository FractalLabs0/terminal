import packageJson from '../../../package.json';
import * as bin from './index';


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
Type 'help' to see list of available commands.

`};
interface Location {
  name: string;
  description: string;
  items: string[];
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
    description: "You are standing in the midst of a beautiful and serene landscape.",
    items: ["rock"],
    exits: { east: "lobby" },
    npc: "Jenny",
  },
  lobby: {
    name: "Hospital Lobby",
    description: "You find yourself in a vast underground facility.",
    items: ["datapad"],
    exits: { west: "bedroom", south: "dahae" },
    npc: "RoboNurse",
  },
  dahae: {
    name: "Dahae",
    description: "You have unplugged and entered a new world!",
    items: [],
    exits: { north: "bedroom" },
  },
};

const npcs: { [key: string]: NPC } = {
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
    message: "GO. BACK. TO. YOUR. ROOM.",
    dialogOptions: {
      "1": {
        message: "Hello, where am I?",
        responseMessage: "You are in Newmont's top mental facility. You're safe here as long as you GO. BACK. TO. YOUR. ROOM."
      },
      "2": { message: "Why can't I just walk out of here?" ,
           responseMessage: "NO. ID. CARD. DETECTED."
           },
      
    },
  },
};

let currentLocation = locations.bedroom;
let inventory: string[] = [];
const takenItems = new Set<string>();

const displayLocation = (): string => {
  let output = `You are in ${currentLocation.name}. ${currentLocation.description}`;
  const items = currentLocation.items.filter((item) => !takenItems.has(item));
  if (items.length > 0) {
    output += `\nYou see the following items here: ${items.join(", ")}`;
  }
  if (currentLocation.npc) {
    const npc = npcs[currentLocation.npc.toLowerCase()];
    output += `\n${npc.name} says: ${npc.message}\n`;
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
  if (dialogOption.requiresItem && !inventory.includes(dialogOption.requiresItem)) {
    return Promise.resolve(`You don't have the necessary item to select that option.`);
  }

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
  return undefined;
};

export const go = (direction: string): string => {
  if (currentLocation.name === "lobby" && direction === "south" && !inventory.includes("rock")) {
    return "You can't get out of the hopital without the rock.";
  }
  if (!currentLocation.exits[direction]) {
    return "You can't go that way.";
  }
  currentLocation = locations[currentLocation.exits[direction]];
  return displayLocation();
};


export const take = (args: string[]): Promise<string> => {
  const index = currentLocation.items.indexOf(args[0]);
  if (index === -1) {
    return Promise.resolve("That item isn't here. Current location: " + currentLocation.name);
  }
  takenItems.add(currentLocation.items[index]);
  inventory.push(currentLocation.items[index]);
  currentLocation.items.splice(index, 1);
  
  if (currentLocation.npc.toLowerCase() === "jenny" && inventory.includes("rock")) {
    return Promise.resolve("You took the rock, but Jenny doesn't seem interested in it.");
  }
  if (currentLocation.npc.toLowerCase() === "jenny" && !inventory.includes("rock")) {
    return Promise.resolve("You took the item, but Jenny seems to be eyeing your rock...");
  }
  return Promise.resolve(`You took ${args[0]}.`);
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





//MAYBE USEFUL FUNCTIONS, STANDALONE
export const unplug = (): Promise<string> => {
  if (inventory.includes("datapad")) {
    currentLocation = locations.dahae;
    return Promise.resolve(displayLocation());
  }
  return Promise.resolve("You need the datapad to unplug.");
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