import packageJson from '../../../package.json';
import * as bin from './index';
import imageToAdd from './../assets/images/woofv1.png';
import * as readline from 'readline';

export function startAdventure() {
  console.log("Welcome to the Text Adventure Game!");
  console.log("You find yourself in a dark forest, and you need to find a way out.");
  console.log("You can go 'left', 'right', 'forward', or 'back'");

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question("Which way do you want to go? ", (answer) => {
    switch (answer.toLowerCase()) {
      case "left":
        console.log("You came across a river. You need to find a way to cross it.");
        break;
      case "right":
        console.log("You found a hidden path! You follow it and eventually reach a castle.");
        break;
      case "forward":
        console.log("You walked into a clearing and found a mysterious object.");
        break;
      case "back":
        console.log("You went back and found a village. You decide to ask for help.");
        break;
      default:
        console.log("Invalid direction. Please try again.");
        break;
    }
    rl.close();
  });
}

export const help = async (args: string[]): Promise<string> => {
  const commands = Object.keys(bin).sort().join('\n ');

  return `Available commands:\n${commands}\n\n[tab]\t trigger completion.\n[ctrl+l] clear terminal.\n[ctrl+c] cancel command.`;
};

export const sudo = async (args?: string[]): Promise<string> => {
   return 'The Fractal Labs simulation size is limited by the organisation ressources. The simulation grows as Fractal Labs augments its capacities';
};

export const whoami = async (args: string[]): Promise<string> => {
  return `You are logged in to the Fractal Labs console via remote access. Your clearance level is: Operator: Department. Please access a Fractal Labs console to verify identity.
This action cannot be performed remotely.`;
};


export const email = async (args: string[]): Promise<string> => {
  window.open('mailto:portal@fractallabs.org');

  return 'Opening mailto:portal@fractallabs.org...';
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

`;


};
