// import fetch from 'node-fetch'

export const handler = async function (event, _context) {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }

  try {
    // Parse the request body
    const body = JSON.parse(event.body)
    const { content, personalization } = body

    if (!content) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Content is required' }),
      }
    }

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content:
              'You are a content personalizer. Transform the provided text according to the given style instruction. Keep the same meaning and sentence length, but change the style, tone, and word choice. Keep all proper nouns, names, dates and numbers the same. Do not add or remove any information. Do not change the structure of the text. Do not add any additional information or context.',
          },
          {
            role: 'user',
            content: `${personalization}:\n\n${content}`,
          },
        ],
        max_tokens: 2000,
        temperature: 0.7,
      }),
    })

    const data = await response.json()

    // Return the generated content
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personalizedContent: data.choices[0].message.content,
      }),
    }
  } catch (error) {
    console.error('Error:', error)
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to process request' }),
    }
  }
}
