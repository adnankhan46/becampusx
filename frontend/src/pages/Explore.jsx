import Navbar from '../components/Navbar'
import BottomBar from '../components/Bottombar'
function Explore() {
  return (
    <div className='overflow-x-hidden flex flex-col items-center h-fit bg-white mb-[120px] font-inter'>
    <Navbar/>
    <div className='relative mt-4 flex flex-col border-2 rounded-xl w-full md:w-1/2 items-center h-fit p-6 px-4'>
    <div className='font-bold font-suse text-lg rounded-lg p-2 w-full h-12 text-[#6a7cff]'>
   Economic Opportunities for Students
    </div>
    <div className='flex flex-col border-2 rounded-lg mb-2 p-2 border-gray-200 w-full h-fit'>
    Introducing Economic Opportunities through small Freelance Gigs, Internships, Research survey for a professor, Ambassdor Programs, etc.
    <div className='flex flex-row justify-between mt-2'>
    <div className='border border-[#6a7cff] p-2 px-3 rounded-lg text-sm'>Participate</div>
    <div className='bg-[#6a7cff] p-2 text-white rounded-2xl text-sm'>Reward <b>₹400</b></div>
    </div>
    </div>
    <div className="absolute inset-x-0 bottom-0 h-4/5 bg-gradient-to-t from-black to-transparent flex items-end justify-center rounded-xl">
          <span className="text-white text-3xl font-bold mb-2 font-outfit">Launching Next Month...</span>
        </div>
    </div>
    <BottomBar/>
    </div>
  )
}

export default Explore
