const { CohereClientV2 } = require('cohere-ai');

const cohere = new CohereClientV2({
  token: 'C39U8CpKcDnQkA2Dij6m4yr7AKcRlKcKHV8ruvFL',
});

(async () => {
  const response = await cohere.chat({
    model: 'command-r-plus',
    messages: [
      {
        role: 'user',
        content: 'hello world!',
      },
    ],
  });

  console.dir(response, { depth: null });
})();

