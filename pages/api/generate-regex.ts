import { OpenAIStream, OpenAIStreamPayload } from '@/utils/OpenAIStream'

type RequestData = {
  input: string,
  duration: string, 
  tripDate: Date, 
  budgetType: string
}

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing env var from OpenAI')
}

export const runtime = 'edge'

export default async function handler(request: Request) {
  const { input, duration, tripDate, budgetType } = (await request.json()) as RequestData

  function generatePrompt(data: string) {
  //   const prompt = `
  //   You are a travel guide that knows everything about ${input}. I am a muslim tourist who has never visited ${input}. Create a detailed and informative itinerary for the destination ${input} starting from the date ${tripDate} for the duration of ${duration} days on a travel budget of ${budgetType} which is clear and organized. 
  //   Use a day-by-day format, where each day has a header with the day counter, date, and a short summary. 
  //   Define each day's activities in detail, and add italicized historical information. 
  //   Highlight places and activities with bold text of blue color and put a hyperlink to it. Add transport, and accomondation recommendations.
    
  //   Other rules: 
  //   - use only public transport and apps like Uber or local car pooling apps.
    
  //   Things I want to see/experience: 
  //   - Experience local culture
  //   - Famous places to visit
  
  //   Foods/drinks I want to try(give place recomendations):
  //   - Halal Restaurants
  //   - Vegeterian 
  //   - Seafood
  
  //  At the end of the itenary, include the followings:
  //   - 5 Daily prayers timings
  //   - Famous halal restaurants
  //   - Emergency and important phone numbers
  //   - Dangerous areas on my destinations
  //   - Possible dangers
  //   - Good accomondations
  //   - Information about the local gastronomy
  //   - Local customs, rules to be aware of
  //   - Any extra tips to have a great holiday
  //   - Short summary from the places not made it to the itenary, but could`


 const prompt = `As a travel guide with extensive knowledge about ${input}, I'm thrilled to create a comprehensive itinerary for you, a Muslim tourist who has never visited ${input}. Our trip will begin on ${tripDate} and last for ${duration} days, with a travel budget of ${budgetType}.

 To ensure that our itinerary is clear and organized, we will use a day-by-day format. Each day will have a header with the day counter, date, and a brief summary. The activities for each day will be defined in detail, with italicized historical information included. We will also highlight places and activities with bold text in blue color and provide hyperlinks to help you navigate your way around ${input}.
 
 Since we will be using only public transport and apps like Uber or local car pooling apps, transportation recommendations will be provided for each day. Additionally, accommodation recommendations will be given, taking into account your budget and preferences.
 
 To make the most out of your trip, here are some things you mentioned you'd like to experience:
 
 Experience local culture
 Visit famous places
 You also mentioned that you'd like to try the following foods and drinks (with place recommendations):
 
 Halal restaurants
 Vegetarian options
 Seafood
 At the end of our itinerary, I will include the following information to ensure that you have a safe and enjoyable trip:
 
 5 daily prayer timings
 Famous halal restaurants
 Emergency and important phone numbers
 Dangerous areas in ${input}
 Possible dangers to be aware of
 Good accommodations that meet your budget and preferences
 Information about the local gastronomy
 Local customs and rules to be aware of
 Extra tips to help you have a great holiday
 Lastly, I will provide a short summary of other places that didn't make it into our itinerary but could be worth visiting.
 
 I can't wait to show you the wonders of ${input} and help you create unforgettable memories.`;
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
    max_tokens: 800,
    stream: true,
    n: 1,
  }

  const stream = await OpenAIStream(payload)
  return new Response(stream)
}
