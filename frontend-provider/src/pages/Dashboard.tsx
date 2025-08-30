import { SectionCards } from '@/components/section-cards'
import useCompanyStore from '@/store/store';
import { Link } from 'react-router';

function Dashboard() {
  const { company } = useCompanyStore();

  if(!company) return <div className='flex gap-2 h-screen w-full items-center justify-center'>Please Login to View <Link className='text-primary font-bold' to='/login'>Login</Link> </div>

  return (
    <div>
        <SectionCards/>
      <div className="mt-6 bg-white rounded-lg overflow-hidden border-2 border-blue-400">
        Hello, {company.username}
      </div>
      <div className="mt-2 bg-white rounded-lg shadow-xl overflow-hidden border-2 border-red-400">
        <p className='text-center text-gray-400'>Video Demo</p>
        <p className='text-center text-gray-400'>{company.email}</p>
        {/* <video alt='video-demo' controls src={} className='w-full' autoPlay>
        Video
     </video> */}
     <div className='flex w-full items-center justify-center'>Video-src</div>
      </div>
    </div>
  )
}

export default Dashboard
