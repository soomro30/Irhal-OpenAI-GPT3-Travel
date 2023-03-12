import { OpenAIStream, OpenAIStreamPayload } from '@/utils/OpenAIStream'

type RequestData = {
  input: string
}

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing env var from OpenAI')
}

export const runtime = 'edge'

export async function POST(request: Request) {
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
    End date: 2023.11.04 10:00
    Travel method: Air
    Destination: Mexico
    Entry point: Mexico City
    Travel buget: Medium
    
    Things I want to see/experience: 
    - Experience local culture
    
    Foods/drinks I want to try(give place recomendations):
     - Tacos
     - Tequila
    
    Additional traveling:
    - Mexico City to Cancun by air on 2023.10.25
    - Cancun to Oaxaca by air on 2023.10.31
    - Oaxaca to Mexico City on 2023.11.03
    
    In Mexico City i want to see/experience the followings: 
    - Lucha Libre
    - National Museum of Anthropology
    - Teotihuacan 
    - Eat taco
    - Mariachi
    - Food and street markets
    - Street art
    In Cancun i want to see/experience the followings: 
    - Stay at Tulum
    - Swim in Cenotes and Visit Chichen Itza
    - Swim with turtles and stingray
    - Jungle
    - Ruins
    - Nice beaches
    - Relax
    In Oaxaca i want to see/experience the followings: 
    - Day of the Dead
    - Hike
    - See the best things in Oaxaca
    
    At the end of the itenary, include the followings:
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
    max_tokens: 200,
    stream: true,
    n: 1,
  }

  const stream = await OpenAIStream(payload)
  return new Response(stream)
}
