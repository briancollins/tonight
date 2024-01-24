const {Client, LocalAuth} = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const {setup, registerForTonight, usersForTonight, unregisterUser} = require('./db');

const client = new Client({
  puppeteer: {
    args: ['--no-sandbox'],
  },
  authStrategy: new LocalAuth({
    dataPath: '/var/whatsapp'
  })
});

client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('Client is ready!');
});

const handleMessage = async (message) => {
  const user = await message.getContact();

  if (message.body === '!tonight') {
    const registered = await registerForTonight(user.id.user);
    if (registered !== null) {
      await message.reply(`you are ${registered}/x for tonight`);
    }
  }

  if (message.body === '!nottonight') {
    await unregisterUser(user.id.user);
    await message.reply(`You are unregistered for tonight`);
  }

  if (message.body === '!whosin') {
    const users = await usersForTonight();
    if (users.length === 0) {
      await message.reply(`Nobody's in for tonight yet`);
    } else {
      const usersForTonight = users.map((userId) => `@${userId}`).join(', ');
      await message.reply(`In for tonight: ${usersForTonight}`);
    }
  }
};
client.on('message', handleMessage);
client.on('message_create', handleMessage);

setup();
client.initialize();

