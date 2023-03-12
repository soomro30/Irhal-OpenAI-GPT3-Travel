'use client'
import { useRef, useState } from 'react'
import { Icons } from './icons'
import { Button } from './ui/button'
import { FaWhatsapp, FaEnvelope, FaTwitter } from 'react-icons/fa';
import parse from 'html-react-parser';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


const Form = () => {
  const inputRef = useRef<HTMLInputElement>(null)
  const inputRef1 = useRef<HTMLInputElement>(null)
  const inputRef2 = useRef<HTMLSelectElement>(null)
  const inputRef3 = useRef<HTMLInputElement>(null)
  const [response, setResponse] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasCopied, setHasCopied] = useState(false)
  const [message, setMessage] = useState("")
  const [startDate, setStartDate] = useState(new Date());
  const ref = useRef();

  let html = ``;
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log(inputRef.current!.value, inputRef1.current!.value, inputRef2.current!.value)

    const response = await fetch('/api/generate-regex', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        input: inputRef.current!.value,
        duration: inputRef1.current!.value,
        tripDate: startDate,
        budgetType: inputRef2.current!.value,
      }),
    })

    console.log('Edge function returned.')

    console.log(response)

    if (!response.ok) {
      throw new Error(response.statusText)
    }

    const data = response.body
    if (!data) {
      return
    }
    setMessage('<code  className="whitespace-pre-wrap text-lg" >Here is your <span className="no-underline font-bold text-slate-50">'+ inputRef1.current!.value+'</span> days muslim travel friendly itinerary to <a className="no-underline font-bold text-slate-50 hover:underline" href="https://irhal.org/travel-guide/'+inputRef.current!.value+'">'+inputRef.current!.value+'</a></code><br/><br/>');
    html = `
  <p id="main">
    <span class="prettify">
      keep me and make me pretty!
    </span>
  </p>
`;
    const reader = data.getReader()
    const decoder = new TextDecoder()
    let done = false

    let currentResponse: string[] = []
    while (!done) {
      const { value, done: doneReading } = await reader.read()
      done = doneReading
      const chunkValue = decoder.decode(value)
      currentResponse = [...currentResponse, chunkValue]
      setResponse(currentResponse)
    }
    setIsLoading(false)
  }

  const handleCopy = () => {
    if (!response.length) return
    const textToCopy = response.join('')
    navigator.clipboard.writeText(textToCopy)
    setHasCopied(true)
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input
          name='prompt'
          type='text'
          placeholder='city name e.g London, New York, Oslo'
          className='w-full rounded-md bg-slate-400 text-slate-500 dark:placeholder-slate-500 dark:bg-slate-200 px-2 py-5 outline-4 placeholder-slate-700	'
          ref={inputRef}
          required
        />
       <input
          name='duration'
          type='number'
          placeholder='# of days '
          className='w-full mt-4 rounded-md bg-slate-400 text-slate-500 dark:placeholder-slate-500 dark:bg-slate-200 px-2 py-5 outline-none placeholder-slate-700'
          ref={inputRef1}
          required
        />

      
         <DatePicker className='w-full mt-4 rounded-md bg-slate-400 text-slate-500 dark:placeholder-slate-500 dark:bg-slate-200 px-2 py-5 outline-none placeholder-slate-700' selected={startDate} onChange={(date: Date) => setStartDate(date!)} />

          <select 
             className='w-full mt-4 rounded-md bg-slate-400 text-slate-500 dark:placeholder-slate-500 dark:bg-slate-200 px-2 py-5 outline-none placeholder-slate-700 pt-6 pb-6'
             ref={inputRef2}
             required
             placeholder='Trip Budget '
            // value={accommodationType}
            // onChange={(e) => setAccommodationType(e.target.value)}
            >
            <option value="">Select budget type</option>
            <option value="Expensive">Expensive</option>
            <option value="Moderate">Moderate</option>
            <option value="Budget">Budget</option>
            
          </select>
        <button
          type='submit'
          className='mt-4 w-full rounded-md bg-slate-300 dark:bg-slate-700 px-8 py-2.5 text-base dark:hover:bg-gray-800 focus:outline-none focus:ring-1 focus:ring-zinc-600 disabled:cursor-not-allowed disabled:opacity-50'
        >
          Generate itinerary
        </button>
      </form>
      <div className='w-full rounded-md bg-slate-400 dark:placeholder-slate-300 dark:bg-slate-800 px-2 py-4 outline-none placeholder-slate-700 flex flex-row justify-between mt-4'>
  
    <div className="p-4">
    {response && (parse(message) )}
      <code className='text-md whitespace-pre-wrap'>{parse(response.join(''))}</code>
      {/* <code  className="whitespace-pre-wrap text-lg ">
        <br/><br/>
        Visit <a className="no-underline font-bold text-slate-50 hover:underline "  href={`https://irhal.org/`} >Irhal</a> for Muslim travelers friendly information.
      </code > */}
      <div className='flex flex-row justify-between mt-4'>
        <Button variant='ghost' size='sm' onClick={handleCopy}>
          {hasCopied ? <Icons.check className='text-3xl text-green-500 hover:text-green-600 cursor-pointer' /> : <Icons.copy className='text-3xl text-gray-500 hover:text-gray-600 cursor-pointer' />}
        </Button>
        <div className='flex flex-row'>
          <a className='text-md whitespace-pre-wrap' href={`https://wa.me/?text=${encodeURIComponent(parse(message)+'<br/>'+response.join(''))}`} target='_blank' rel='noreferrer'>
            <FaWhatsapp className='mx-2 text-4xl text-green-500 hover:text-green-600 cursor-pointer' />
          </a>
          <a className='text-md whitespace-pre-wrap' href={`mailto:?subject=Itinerary&body=${encodeURIComponent(parse(message)+'<br/>'+response.join(''))}`} target='_blank' rel='noreferrer'>
            <FaEnvelope className='mx-2 text-4xl text-yellow-500 hover:text-yellow-600 cursor-pointer' />
          </a>
          <a className='text-md whitespace-pre-wrap' href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(parse(message)+'<br/>'+response.join(''))}`} target='_blank' rel='noreferrer'>
            <FaTwitter className='mx-2 text-4xl text-blue-500 hover:text-blue-600 cursor-pointer' />
          </a>
        </div>
      </div>
    </div>
 
</div>
    </>
  )
}

export default Form
