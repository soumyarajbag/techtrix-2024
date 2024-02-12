"use client";
import { useParams } from 'next/navigation'
import React, { useEffect, useMemo, useState } from 'react'
import { getEventInfo } from '@/utils/functions/getEventsInfo';
import { getCoordinators } from '@/utils/functions/getCoordinators';
import { PuffLoader } from 'react-spinners';
import RulesModal from '@/components/admin/RulesModal';
import Image from 'next/image';
import EventRegForm from '@/components/events/EventRegForm';
const page = () => {
    const event = useParams().event;
    const [isOpen, setIsOpen] = useState(false);
    const [eventInfo,setEventInfo] = useState({} as any);
    const [loading,setLoading] = useState(true);
    useMemo(()=>{
      const getInfo = async () => {
        const res = await getEventInfo(decodeURIComponent(event.toLocaleString()));
        console.log(res![0]);
        setEventInfo(res![0]);
        setLoading(false);
      }
      getInfo();
    },[event])
    const {roles} = eventInfo;
    const [regOpen,setRegOpen] = useState(false);
    const onClose = () => {setIsOpen(false) ; setRegOpen(false);}

    useEffect(()=>{
      if(isOpen){
        document.body.style.overflow = 'hidden';
      }
      else{
        document.body.style.overflow = 'auto';
      }
    })
  return (
  <div className='flex flex-col items-center mx-auto w-full'>
      <div className='bg-white border-2 rounded-2xl mx-auto justify-center  md:w-[90%] px-5 lg:px-10 py-14 flex flex-row items-center gap-5 lg:gap-10 flex-wrap-reverse'>
      {loading ? <div className='mx-auto max-lg:h-screen w-[100%]'>
        <PuffLoader className='w-full mx-auto' color="#36d7b7" />
        </div>  :<>
         <div className='flex flex-col w-full items-start gap-5 lg:w-1/2'>
        <h1 className='text-black font-bold text-3xl'>{eventInfo.event_name}</h1>
       
        <div dangerouslySetInnerHTML={{__html:eventInfo.desc}}></div>
        <h1>Team Capacity : <span className='font-semibold'>{eventInfo.min_team_member}-{eventInfo.max_team_member}</span></h1>
        <h1>Registration Fees : <span className='font-semibold'>{eventInfo.registration_fees}</span> </h1>
        <h1>Event Date : <span className='font-semibold'>{eventInfo.date}</span></h1>
        <h1>Time : <span className='font-semibold'>{eventInfo.time}</span></h1>
        {
                roles.length > 0 ?
                roles.map((coordinator:any,index:number)=>{
                    return(
                        <div key={index} className='flex flex-col items-start gap-2'>
                            <h1 className='text-lg lg:text-xl'>Coordinators: <span className='font-semibold text-black'>{coordinator?.users?.name}</span></h1>
                            <h1 className='text-lg lg:text-xl'>Contact: <span className='font-semibold text-black'>{coordinator?.users?.phone}</span></h1>
                        </div>
                    )
                })
                :<h1 className='text-red-600 font-semibold'>No Coordinators added yet !</h1>
            }
            
            <button
          onClick={() => setIsOpen(true)}
          className="flex flex-row items-center font-semibold border-2 border-black px-5 py-2 hover:bg-white hover:text-black rounded-xl bg-black text-white gap-2 text-xl "
        >
          Rules
        </button>
       
           
            
        </div>
        
        <div className='flex flex-col items-center gap-10'>
            <img src={eventInfo.event_image_url} alt="" className='w-80 h-80' width={0} height={0} />
            <button
          onClick={() => {setRegOpen(true)}}
          className="flex flex-row items-center font-semibold border-2 border-black px-5 py-2 hover:bg-black hover:text-white rounded-xl bg-white text-black gap-2 text-xl "
        >
          Register Soon !
        </button>
        </div>
        </>
        }
      </div>
      <RulesModal isOpen={isOpen} onClose={onClose} rules={eventInfo.rules} />
      <EventRegForm isOpen={regOpen} onClose={onClose} />
  </div>
  )
}

export default page