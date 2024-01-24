const {OpenAI} = require('openai');

exports.gpt = async (messages) => {
  const openai = new OpenAI();


  for (message in inputs) {
    messages.push(message);
  }
  const completion = await openai.chat.completions.create({
    messages,
    model: "gpt-3.5-turbo",
    max_tokens: 200,
  });

  return completion.choices[0].message.content;
};
