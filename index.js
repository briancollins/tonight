const {Client, LocalAuth} = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const {setup, registerForTonight, usersForTonight, unregisterUser} = require('./db');
const {gpt} = require('./gpt');

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

const inputs = [];
const handleMessage = async (message) => {
  const user = await message.getContact();

  if (message.body === '!tonight') {
    const registered = await registerForTonight(user.id.user);
    if (registered !== null) {
      await message.reply(`you are ${registered}/x for tonight`);
    }
  }

  if (message.body === '!nottonight' || message.body === '!imout') {
    await unregisterUser(user.id.user);
    await message.reply(`You are unregistered for tonight`);
  }

  if (message.body === '!whosin') {
    const users = await usersForTonight();
    if (users.length === 0) {
      await message.reply(`Nobody's in for tonight yet`);
    } else {
      const mentions = users.map((userId) => `${userId}@c.us`);
      const usersForTonight = users.map((userId) => `@${userId}`).join('\n');
      console.log(usersForTonight);
      const chat = await message.getChat();
      await chat.sendMessage(`In for tonight:\n\n${usersForTonight}`, {mentions});
    }
  }

  const match = message.body.match(/^!gpt (.*)/);
  if (match !== null) {
    inputs.push({
      role: 'user',
      content: `${user.name}: ${message.content}`
    });

    inputs.push({user: user.name, content: match[1]});
    const completion = await gpt(inputs);
    inputs.push({role: 'assistant', content: completion});
    while (inputs.length > 20) {
      inputs.shift();
    }

    await message.reply(completion);
  }
};
client.on('message_create', handleMessage);

setup();
client.initialize();
