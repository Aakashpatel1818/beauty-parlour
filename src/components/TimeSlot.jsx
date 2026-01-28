// frontend/src/components/TimeSlot.jsx

import React from 'react';
import { formatTime12Hour } from '../utils/timeSlots'; // Changed from validation.js
import '../styles/TimeSlot.css';

const TimeSlot = ({ 
  time, 
  isBooked, 
  isPast, 
  isSelected, 
  onClick, 
  minutesUntilClose,
  isToday 
}) => {
  const handleClick = () => {
    // Don't allow clicking if slot is booked or in the past
    if (!isBooked && !isPast) {
      onClick(time);
    }
  };

  const getSlotClassName = () => {
    const classes = ['time-slot'];
    
    if (isPast || isBooked) {
      classes.push('disabled');
    } else if (isSelected) {
      classes.push('selected');
    } else {
      classes.push('available');
    }
    
    // Add closing-soon class if less than 15 minutes until close
    if (isToday && minutesUntilClose !== null && minutesUntilClose < 15 && minutesUntilClose >= 0) {
      classes.push('closing-soon');
    }
    
    return classes.join(' ');
  };

  const formatCountdown = (minutes) => {
    if (minutes === null || minutes < 0) return null;
    
    if (minutes < 1) {
      return 'Closing now';
    }
    
    return `${minutes}m left`;
  };

  // Convert time to 12-hour format for display
  const displayTime = formatTime12Hour(time);

  return (
    <button
      type="button"
      className={getSlotClassName()}
      onClick={handleClick}
      disabled={isBooked || isPast}
      aria-label={`${displayTime} ${isBooked ? 'booked' : isPast ? 'closed' : isSelected ? 'selected' : 'available'}`}
    >
      <span className="slot-time">{displayTime}</span>
      
      {(isPast || isBooked) && (
        <span className="slot-status">
          {isPast ? 'Closed' : 'Booked'}
        </span>
      )}
      
      {isToday && !isPast && !isBooked && minutesUntilClose !== null && minutesUntilClose < 30 && (
        <span className="slot-countdown">
          {formatCountdown(minutesUntilClose)}
        </span>
      )}
      
      {isSelected && (
        <span className="slot-checkmark">✓</span>
      )}
    </button>
  );
};

export default TimeSlot;