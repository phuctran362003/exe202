import './Loading.css'
export default function Loading() {
  return (
    <div className='w-full flex justify-center min-h-32 items-center'>
      <div className='spinner'>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  )
}
