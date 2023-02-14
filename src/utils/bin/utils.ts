import packageJson from '../../../package.json';
import * as bin from './index';


export const help = async (args: string[]): Promise<string> => {
  const commands = Object.keys(bin).sort().join('\n ');

  return `Available commands:\n${commands}\n\n[tab]\t trigger completion.\n[ctrl+l] clear terminal.\n[ctrl+c] cancel command.`;
};

export const whoami = async (args: string[]): Promise<string> => {
  return `You are logged in to the Fractal Labs console via remote access. Your clearance level is: Operator: Department. Please access a Fractal Labs console to verify identity.
This action cannot be performed remotely.`;
};


export const map = (args?: string[]): string => {
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
}

const locations: { [key: string]: Location } = {
  homeworld: {
    name: "Nomo's Homeworld",
    description: "You are standing in the midst of a beautiful and serene landscape.",
    items: ["rock"],
    exits: { east: "dept33" },
  },
  dept33: {
    name: "Department 33",
    description: "You find yourself in a vast underground facility.",
    items: ["datapad"],
    exits: { west: "homeworld" },
  },
  dahae: {
    name: "Dahae",
    description: "You have unplugged and entered a new world!",
    items: [],
    exits: { north: "homeworld" },
  },
};

let currentLocation = locations.homeworld;
let inventory: string[] = [];
const takenItems = new Set<string>();

const displayLocation = (): string => {
  let output = `You are in ${currentLocation.name}. ${currentLocation.description}`;
  const items = currentLocation.items.filter(item => !takenItems.has(item));
  if (items.length > 0) {
    output += `\nYou see the following items here: ${items.join(", ")}`;
  }
  output += "\nExits:";
  for (const direction in currentLocation.exits) {
    output += `\n  ${direction}: ${currentLocation.exits[direction]}`;
  }
  return output;
};

export const go = (direction: string): string => {
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

const unplug = (): Promise<string> => {
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
- unplug (ex: adventure unplug)

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