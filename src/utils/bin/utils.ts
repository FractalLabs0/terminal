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
    description: "You are standing in the midst of a beautiful and serene landscape, surrounded by rolling hills and pristine lakes.",
    items: ["rock"],
    exits: { east: "dept33", south: "dahae" },
  },
  dept33: {
    name: "Department 33",
    description: "You find yourself in a vast underground facility, filled with high-tech equipment and staffed by busy technicians.",
    items: ["datapad"],
    exits: { west: "homeworld" },
  },
  dahae: {
    name: "Dahae",
    description: "You find yourself in a bustling city, filled with people going about their business. Towering skyscrapers loom overhead.",
    items: ["map"],
    exits: { north: "homeworld" },
  },
};

let currentLocation = locations.homeworld;
let inventory: string[] = [];

const displayLocation = (): string => {
  let output = `You are in ${currentLocation.name}. ${currentLocation.description}`;
  if (currentLocation.items.length > 0) {
    output += `\nYou see the following items here: ${currentLocation.items.join(", ")}`;
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

export const take = (item: string): string => {
  const index = currentLocation.items.indexOf(item);
  if (index === -1) {
    return "That item isn't here.";
  }
  inventory.push(currentLocation.items.splice(index, 1)[0]);
  return `You took ${item}.`;
};

export const drop = (item: string): string => {
  const index = inventory.indexOf(item);
  if (index === -1) {
    return "You don't have that item.";
  }
  currentLocation.items.push(inventory.splice(index, 1)[0]);
  return `You dropped ${item}.`;
};

export const showInventory = (): string => {
  if (inventory.length === 0) {
    return "Your inventory is empty.";
  }
  return `You have the following items in your inventory: ${inventory.join(", ")}`;
};

export const adventure = async (args?: string[]): Promise<string> => {
  if (!args || args.length === 0) {
    return `Welcome to the adventure game!

Available commands:
- go <direction> (ex: go east)
- take <item> (ex: take datapad)
- drop <item> (ex: drop rock)
- inventory

Start by typing 'adventure go <direction>' to move to a different location.`;
  }
  switch (args[0]) {
    case "go":
      return go(args[1]);
    case "take":
      return take(args[1]);
    case "drop":
      return drop(args[1]);
    case "inventory":
      return showInventory();
  }
};
