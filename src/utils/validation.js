// src/utils/validation.js

export const validatePhone = (phone) => {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Check if it's a valid 10-digit phone number
  if (cleaned.length === 10) {
    return true;
  }
  
  return false;
};

export const validateName = (name) => {
  // Check if name is at least 2 characters and contains only letters and spaces
  const nameRegex = /^[a-zA-Z\s]{2,}$/;
  return nameRegex.test(name.trim());
};

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Generate time slots from 9 AM to 6 PM with 30-minute intervals
export const generateTimeSlots = (startHour = 9, endHour = 18, interval = 30) => {
  const slots = [];
  for (let hour = startHour; hour < endHour; hour++) {
    for (let minute = 0; minute < 60; minute += interval) {
      const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      slots.push(time);
    }
  }
  return slots;
};

// Check if a time slot is booked
export const isSlotBooked = (slot, bookedSlots) => {
  return bookedSlots.includes(slot);
};

// Format date to YYYY-MM-DD
export const formatDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Get display text for date
export const getDateDisplayText = (date) => {
  if (!date) return '';
  
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const selectedDate = new Date(date);
  
  // Reset time parts for comparison
  today.setHours(0, 0, 0, 0);
  tomorrow.setHours(0, 0, 0, 0);
  selectedDate.setHours(0, 0, 0, 0);
  
  if (selectedDate.getTime() === today.getTime()) {
    return 'Today';
  } else if (selectedDate.getTime() === tomorrow.getTime()) {
    return 'Tomorrow';
  } else {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return selectedDate.toLocaleDateString('en-US', options);
  }
};

// Check if a time slot is in the past
export const isSlotInPast = (timeSlot, selectedDate, currentTime) => {
  const [hours, minutes] = timeSlot.split(':').map(Number);
  const slotDate = new Date(selectedDate);
  slotDate.setHours(hours, minutes, 0, 0);
  
  return slotDate < currentTime;
};

// Get minutes until a time slot closes
export const getMinutesUntilSlotCloses = (timeSlot, selectedDate, currentTime) => {
  const today = new Date();
  const selectedDateStr = formatDate(selectedDate);
  const todayStr = formatDate(today);
  
  // Only calculate for today
  if (selectedDateStr !== todayStr) {
    return null;
  }
  
  const [hours, minutes] = timeSlot.split(':').map(Number);
  const slotDate = new Date(selectedDate);
  slotDate.setHours(hours, minutes, 0, 0);
  
  const diffMs = slotDate - currentTime;
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  
  return diffMinutes;
};