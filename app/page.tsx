import Form from '@/components/form'
import { ModeToggle } from '@/components/mode-toggle'

export default function Home() {
  return (
    <div className='max-w-xl w-screen p-4  object-center'>
      <div className='mt-1 pb-3 text-center	'>
        <h1 className='text-1xl p-3 '><img src="/logo.png"/></h1>
        <p className='text-gray-100 font-large text-xl pb-5'>
        Get Your Muslim Travel Itinerary In Seconds - Powered By OpenAI & Irhal.com
        </p>
      </div>
      <div>
        {/* <h2 className='text-2xl pt-12 pb-3'>Enter your itinerary details</h2> */}
        <Form />
      </div>
    </div>
  )
}
