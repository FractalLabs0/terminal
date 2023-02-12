import readline from 'readline';
export const textAdventure = async (): Promise<string> => {
 const exitMessage = "Thanks for playing!";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const waitForUserInput = (): Promise<string> => {
  return new Promise((resolve) => {
    rl.question('> ', (answer) => {
      resolve(answer);
    });
  });
};

interface Room {
  name: string;
  description: string;
  directions: {
    north?: string;
    south?: string;
    east?: string;
    west?: string;
  };
}

const rooms: { [key: string]: Room } = {
  'living-room': {
    name: 'Living Room',
    description: 'You are in the living room. There is a sofa and a TV.',
    directions: {
      north: 'kitchen',
    },
  },
  kitchen: {
    name: 'Kitchen',
    description: 'You are in the kitchen. There is a table and some chairs.',
    directions: {
      south: 'living-room',
      east: 'garden',
    },
  },
  garden: {
    name: 'Garden',
    description: 'You are in the garden. There are some trees and flowers.',
    directions: {
      west: 'kitchen',
    },
  },
};

let currentRoom = rooms['living-room'];

const look = async (): Promise<string> => {
  return currentRoom.description;
};

const move = async (args: string[]): Promise<string> => {
  const direction = args[0];

  if (!direction) {
    return 'Please specify a direction.';
  }

  if (!currentRoom.directions[direction]) {
    return 'You cannot go in that direction.';
  }

  currentRoom = rooms[currentRoom.directions[direction]];
  return `You are now in the ${currentRoom.name}. ${currentRoom.description}`;
};

const play = async (): Promise<void> => {
  console.log('Welcome to the game! Type "help" for a list of commands.');

  while (true) {
    const input = await waitForUserInput();
    const args = input.trim().split(' ');
    const command = args.shift()?.toLowerCase();

    switch (command) {
      case 'help':
        console.log('Available commands: look, move, quit');
        break;
      case 'look':
        console.log(await look());
        break;
      case 'move':
        console.log(await move(args));
        break;
      case 'quit':
        console.log('Goodbye!');
        rl.close();
       return exitMessage;
      default:
        console.log(`Unknown command: ${command}. Type "help" for a list of commands.`);
        break;
    }
  }
};

play();
};
