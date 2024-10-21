import React from 'react';
import styles from './ScheduleCreator.module.css';

interface TimeSlotGridProps {
  timeSlots: string[];
  selectedTimeSlots: string[];
  onToggleTimeSlot: (timeSlot: string) => void;
}

const TimeSlotGrid: React.FC<TimeSlotGridProps> = ({
  timeSlots,
  selectedTimeSlots,
  onToggleTimeSlot,
}) => {
  return (
    <div className={styles.timeSlotGrid}>
      {timeSlots.map(slot => (
        <button
          key={slot}
          onClick={() => onToggleTimeSlot(slot)}
          className={`${styles.timeSlotButton} ${selectedTimeSlots.includes(slot) ? styles.selectedTimeSlot : ''}`}
        >
          {slot}
        </button>
      ))}
    </div>
  );
};

export default React.memo(TimeSlotGrid);