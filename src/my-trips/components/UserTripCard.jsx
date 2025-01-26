import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { GetPlaceDetails, PHOTO_REF_URL } from '@/service/GlobalApi';
import React, { useEffect, useState } from 'react'

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

function UserTripCard({ trip }) {
  const [photoUrl, setPhotoUrl] = useState();

  useEffect(() => {
    trip && GetPlaceImg();
  }, [trip])

  const GetPlaceImg = async () => {
    const data = {
      textQuery: trip?.userSelection?.location
    }
    await GetPlaceDetails(data).then(resp => {
      const PhotoUrl = PHOTO_REF_URL.replace('{NAME}', resp.data.places[0].photos[3].name)
      setPhotoUrl(PhotoUrl);
    })
  }

  return (
    <Link to={'/view-trip/' + trip?.id}>
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover={{ scale: 1.05 }}
        className='relative group'
      >
        <div className='border-2 rounded-xl overflow-hidden transition-all shadow-lg hover:shadow-xl hover:border-[#7C3AED]/40'>
          <img 
            src={photoUrl}  
            className='h-[200px] w-full object-cover bg-gray-100'
            alt={trip?.userSelection?.location}
          />
          
          <div className='p-4 bg-white'>
            <h2 className='font-bold text-xl bg-gradient-to-r from-[#7C3AED] to-[#EC4899] bg-clip-text text-transparent'>
              {trip?.userSelection?.location}
            </h2>
            <p className="text-gray-600 mt-2">
              <span className='font-semibold text-[#7C3AED]'>{trip?.userSelection?.totalDays}</span> Days of{' '}
              <span className='font-medium text-[#EC4899]'>{trip?.userSelection?.travelStyle}</span> adventures
            </p>
            <div className='mt-3 flex gap-2'>
              <span className='px-3 py-1 rounded-full bg-[#7C3AED]/10 text-[#7C3AED] text-sm'>
                {trip?.userSelection?.budget}
              </span>
              <span className='px-3 py-1 rounded-full bg-[#EC4899]/10 text-[#EC4899] text-sm'>
                {trip?.userSelection?.accommodation}
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  )
}

export default UserTripCard