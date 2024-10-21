import React from 'react';
import { format, addMinutes, parse } from 'date-fns';

interface Employee {
  id: string;
  name: string;
  schedule: {
    [key: string]: string;
  };
}

interface PrintableScheduleProps {
  employees: Employee[];
}

const PrintableSchedule: React.FC<PrintableScheduleProps> = ({ employees }) => {
  const timeSlots = Array.from({ length: 96 }, (_, i) => {
    const time = addMinutes(new Date(2024, 0, 1, 8, 30), i * 5);
    return format(time, 'h:mm a');
  });

  const simplifySchedule = (schedule: { [key: string]: string }) => {
    const simplifiedSchedule: { startTime: string; endTime: string; task: string }[] = [];
    let currentTask = '';
    let startTime = '';

    Object.entries(schedule).forEach(([time, task], index, arr) => {
      if (task !== currentTask) {
        if (currentTask) {
          simplifiedSchedule.push({
            startTime,
            endTime: time,
            task: currentTask,
          });
        }
        currentTask = task;
        startTime = time;
      }

      if (index === arr.length - 1) {
        simplifiedSchedule.push({
          startTime,
          endTime: time,
          task: currentTask,
        });
      }
    });

    return simplifiedSchedule;
  };

  return (
    <table style={{ borderCollapse: 'collapse', width: '100%' }}>
      <thead>
        <tr>
          <th style={{ border: '1px solid black', padding: '5px' }}>Time</th>
          {employees.map((employee) => (
            <th key={employee.id} style={{ border: '1px solid black', padding: '5px' }}>{employee.name}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {timeSlots.map((slot) => (
          <tr key={slot}>
            <td style={{ border: '1px solid black', padding: '5px' }}>{slot}</td>
            {employees.map((employee) => {
              const simplifiedSchedule = simplifySchedule(employee.schedule);
              const scheduleItem = simplifiedSchedule.find(
                (item) =>
                  parse(slot, 'h:mm a', new Date()) >= parse(item.startTime, 'h:mm a', new Date()) &&
                  parse(slot, 'h:mm a', new Date()) < parse(item.endTime, 'h:mm a', new Date())
              );
              return (
                <td key={`${employee.id}-${slot}`} style={{ border: '1px solid black', padding: '5px' }}>
                  {scheduleItem && slot === scheduleItem.startTime && (
                    <>
                      {`${scheduleItem.startTime} - ${scheduleItem.endTime}`}
                      <br />
                      {scheduleItem.task}
                    </>
                  )}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default PrintableSchedule;