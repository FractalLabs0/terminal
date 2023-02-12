import config from '../../../config.json';

export const instagram = async (args: string[]): Promise<string> => {
  window.open(`https://www.instagram.com/${config.social.instagram}/`);

  return 'Opening instagram...';
};

export const discord = async (args: string[]): Promise<string> => {
  window.open(`https://discord.gg/${config.social.discord}/`);

  return 'Opening discord...';
};

export const twitter = async (args: string[]): Promise<string> => {
  window.open(`https://twitter.com/${config.social.twitter}/`);

  return 'Opening twitter...';
};
