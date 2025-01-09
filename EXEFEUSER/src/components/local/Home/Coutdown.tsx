// CountdownTimer.tsx
import React, { useState, useEffect } from 'react'
import './style.css'

const CountdownTimer: React.FC = () => {
  const calculateTimeLeft = () => {
    const now = new Date()
    const currentDay = now.getDay() // 0 (Sunday) to 6 (Saturday)
    const hours = now.getHours()
    const minutes = now.getMinutes()
    const seconds = now.getSeconds()

    let daysUntilWeekend = 0

    // Determine how many days until the next Saturday (6)
    if (currentDay === 6) {
      // Saturday
      daysUntilWeekend = 0 // It's already Saturday
    } else if (currentDay === 0) {
      // Sunday
      daysUntilWeekend = 6 // Next Saturday
    } else {
      daysUntilWeekend = 6 - currentDay // Calculate days until Saturday
    }

    // Set the end time to the next Saturday at midnight (00:00:00)
    const endTime = new Date(now.getFullYear(), now.getMonth(), now.getDate() + daysUntilWeekend, 0, 0, 0).getTime()
    const distance = endTime - now.getTime()

    const days = Math.floor(distance / (24 * 60 * 60 * 1000))
    const hoursLeft = Math.floor((distance % (24 * 60 * 60 * 1000)) / (3600 * 1000))
    const minutesLeft = Math.floor((distance % (3600 * 1000)) / (60 * 1000))
    const secondsLeft = Math.floor((distance % (60 * 1000)) / 1000)

    return { ngày: days, giờ: hoursLeft, phút: minutesLeft, giây: secondsLeft }
  }

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft())

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className='flex justify-center items-center mt-4'>
      <div className='flex justify-center items-center'>
        {Object.entries(timeLeft).map(([unit, value]) => (
          <div className='flex flex-col gap-4 items-center'>
            <div
              key={unit}
              className='number-countdown bg-white w-16 h-16 flex justify-center items-center shadow-custom rounded-lg text-3xl mx-2 relative'
            >
              {value}
            </div>
            <span className='text-lg'>{unit.charAt(0).toUpperCase() + unit.slice(1)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CountdownTimer
