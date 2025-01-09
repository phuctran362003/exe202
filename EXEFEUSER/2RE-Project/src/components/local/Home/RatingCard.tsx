
export default function RatingCard(data: any) {
  return (
    <div className='bg-white shadow-md rounded-lg p-6 flex items-center space-x-4'>
      <img src={data.image} alt={data.author} className='w-24 h-24 rounded-full' />
      <div className='flex flex-col'>
        <p className='text-gray-600 italic'>"{data.quote}"</p>
        <div className='flex text-yellow-400 text-lg mt-2'>
          {Array(5)
            .fill(null)
            .map((_, index) => (
              <span key={index}>★</span>
            ))}
        </div>
        <p className='font-bold mt-2'>{data.author}</p>
        <p className='text-gray-500 text-sm'>{data.title}</p>
      </div>
    </div>
  )
}
