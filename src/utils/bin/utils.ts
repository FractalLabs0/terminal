import packageJson from '../../../package.json';
import * as bin from './index';
import imageToAdd from "./../assets/images/woofv1.png";;

export const help = async (args: string[]): Promise<string> => {
  const commands = Object.keys(bin).sort().join('\n ');

  return `Available commands:\n${commands}\n\n[tab]\t trigger completion.\n[ctrl+l] clear terminal.\n[ctrl+c] cancel command.`;
};

export const sudo = async (args?: string[]): Promise<string> => {
   return 'The FractalLabs simulation size is limited by the organisation''s ressources. The simulation grows as Fractal Labs augments its capacities';
};

export const whoami = async (args: string[]): Promise<string> => {
  return 'adventurer';
};

export const date = async (args: string[]): Promise<string> => {
  return new Date().toString();
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

Type 'help' to see list of available commands.

`;
};
