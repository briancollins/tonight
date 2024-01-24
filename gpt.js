const {OpenAI} = require('openai');

exports.gpt = async (inputs) => {
  const openai = new OpenAI();

  const messages = [{ role: "system", content: process.env.GPT_PROMPT }];

  for (message of inputs) {
    messages.push(message);
  }

  const completion = await openai.chat.completions.create({
    messages,
    model: "gpt-3.5-turbo",
    max_tokens: 200,
  });

  return completion.choices[0].message.content;
};
