import { OpenAIStream, OpenAIStreamPayload } from '@/utils/OpenAIStream'

type RequestData = {
  input: string
}

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing env var from OpenAI')
}

export const runtime = 'edge'

export default async function handler(request: Request) {
  const { input } = (await request.json()) as RequestData

  function generatePrompt(data: string) {
    const prompt = `
    Create a detailed and informative itenary, which is clear and organized. 
    Use a day-by-day format, where each day has a header with the day counter, date, and a short summary. 
    Define each day's activities in detail, and add italicized historical information. 
    Highlight places and activities with bold text. Add transport, and accomondation recomondations.
    
    Other rules: 
    - use only public transport and apps like Uber
    
    Create a travel itenary, based on the following:
    Start date: 2023.10.21 21:00
    Trip Duration: 2 days
    Travel method: Air
    Destination: London
    Travel buget: Medium
    
    Things I want to see/experience: 
    - Experience local culture
    - Famous places to visit
  
    Foods/drinks I want to try(give place recomendations):
    - Halal Restaurants
    - Vegeterian 
    - Seafood
  
   At the end of the itenary, include the followings:
    - 5 Daily prayers timings
    - Famous halal restaurants
    - Emergency and important phone numbers
    - Dangerous areas on my destinations
    - Possible dangers
    - Good accomondations
    - Information about the local gastronomy
    - Local customs, rules to be aware of
    - Any extra tips to have a great holiday
    - Short summary from the places not made it to the itenary, but could
  `
    return prompt
  }

  const data = generatePrompt(input)

  if (!data) {
    return new Response('No data in the request', { status: 400 })
  }

  const payload: OpenAIStreamPayload = {
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: data }],
    temperature: 0.7,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    max_tokens: 1,
    stream: true,
    n: 1,
  }

  const stream = await OpenAIStream(payload)
  return new Response(stream)
}
