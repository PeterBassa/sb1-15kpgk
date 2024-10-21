import React from 'react';
import { Trash2, AlertTriangle, CheckCircle } from 'lucide-react';
import { Employee } from '../context/EmployeeContext';
import styles from './ScheduleCreator.module.css';

interface EmployeeCardProps {
  employee: Employee;
  onDelete: (id: string) => void;
  onToggleTier3: (id: string) => void;
  onDeleteScheduledTime: (employeeId: string, timeSlot: string) => void;
}

const EmployeeCard: React.FC<EmployeeCardProps> = ({
  employee,
  onDelete,
  onToggleTier3,
  onDeleteScheduledTime,
}) => {
  const renderEmployeeSchedule = (schedule: { [key: string]: string }) => {
    const sortedEntries = Object.entries(schedule).sort(([a], [b]) => {
      const timeA = new Date(`1970/01/01 ${a}`);
      const timeB = new Date(`1970/01/01 ${b}`);
      return timeA.getTime() - timeB.getTime();
    });
    
    let currentTask = '';
    let startTime = '';
    let result = [];

    for (let i = 0; i < sortedEntries.length; i++) {
      const [time, task] = sortedEntries[i];
      
      if (task !== currentTask || i === sortedEntries.length - 1) {
        if (currentTask) {
          const endTime = i === sortedEntries.length - 1 ? time : sortedEntries[i][0];
          result.push(`${startTime} - ${endTime} ${currentTask}`);
        }
        currentTask = task;
        startTime = time;
      }
    }

    return result;
  };

  const countBreaksNeeded = (employee: Employee) => {
    if (!employee.workingWithTier3) return 0;
    const breaksCovered = Object.values(employee.schedule).filter(task => task.startsWith('Break Coverage')).length;
    return Math.max(0, 3 - breaksCovered);
  };

  return (
    <div className={styles.employeeCard}>
      <div className={styles.employeeHeader}>
        <h3 className={styles.employeeName}>{employee.name}</h3>
        <button onClick={() => onDelete(employee.id)} className={styles.deleteButton}>
          <Trash2 />
        </button>
      </div>
      <div className={styles.scheduleBox}>
        {renderEmployeeSchedule(employee.schedule).map((scheduleItem, index) => (
          <div key={index} className={styles.scheduleItem}>
            {scheduleItem}
            <button
              onClick={() => onDeleteScheduledTime(employee.id, scheduleItem.split(' ')[0])}
              className={styles.deleteTimeButton}
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>
      <div className={styles.tier3Section}>
        <label className={styles.tier3Label}>
          <input
            type="checkbox"
            checked={employee.workingWithTier3}
            onChange={() => onToggleTier3(employee.id)}
            className={styles.tier3Checkbox}
          />
          Working with Tier 3 Student
        </label>
      </div>
      {employee.workingWithTier3 && (
        countBreaksNeeded(employee) > 0 ? (
          <div className={styles.breaksNeeded}>
            <AlertTriangle className="mr-2" />
            {countBreaksNeeded(employee)} breaks need coverage
          </div>
        ) : (
          <div className={styles.breaksCovered}>
            <CheckCircle className="mr-2" />
            Breaks covered
          </div>
        )
      )}
    </div>
  );
};

export default React.memo(EmployeeCard);