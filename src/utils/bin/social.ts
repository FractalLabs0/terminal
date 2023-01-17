import config from '../../../config.json';

export const instagram = async (args: string[]): Promise<string> => {
  window.open(`https://www.reddit.com/user/${config.social.reddit}/`);

  return 'Opening reddit...';
};

export const github = async (args: string[]): Promise<string> => {
  window.open(`https://twitter.com/${config.social.twitter}/`);

  return 'Opening twitter...';
};

