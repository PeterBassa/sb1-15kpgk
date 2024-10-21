import React from 'react';
import { format, addMinutes, parse } from 'date-fns';
import styles from './Dashboard.module.css';
import PrintableSchedule from './PrintableSchedule';

interface Employee {
  id: string;
  name: string;
  schedule: {
    [key: string]: string;
  };
}

interface DashboardProps {
  employees: Employee[];
}

const timeSlots = Array.from({ length: 96 }, (_, i) => {
  const time = addMinutes(new Date(2024, 0, 1, 8, 30), i * 5);
  return format(time, 'h:mm a');
});

const Dashboard: React.FC<DashboardProps> = ({ employees }) => {
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

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write('<html><head><title>Employee Schedule</title>');
      printWindow.document.write('<style>body { font-family: Arial, sans-serif; }</style>');
      printWindow.document.write('</head><body>');
      printWindow.document.write('<h1>Employee Schedule</h1>');
      printWindow.document.write(ReactDOMServer.renderToString(<PrintableSchedule employees={employees} />));
      printWindow.document.write('</body></html>');
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <div className={styles.dashboard}>
      <div className={styles.dashboardHeader}>
        <h2 className={styles.dashboardTitle}>Employee Schedule Dashboard</h2>
        <button onClick={handlePrint} className={styles.printButton}>Print Schedule</button>
      </div>
      <div className={styles.scheduleGrid}>
        <div className={styles.timeColumn}>
          <div className={styles.employeeName}>Time</div>
          {timeSlots.map((slot) => (
            <div key={slot} className={styles.timeSlot}>
              {slot}
            </div>
          ))}
        </div>
        {employees.map((employee) => {
          const simplifiedSchedule = simplifySchedule(employee.schedule);
          return (
            <div key={employee.id} className={styles.employeeColumn}>
              <div className={styles.employeeName}>{employee.name}</div>
              {timeSlots.map((slot) => {
                const scheduleItem = simplifiedSchedule.find(
                  (item) =>
                    parse(slot, 'h:mm a', new Date()) >= parse(item.startTime, 'h:mm a', new Date()) &&
                    parse(slot, 'h:mm a', new Date()) < parse(item.endTime, 'h:mm a', new Date())
                );
                return (
                  <div
                    key={`${employee.id}-${slot}`}
                    className={`${styles.scheduleCell} ${scheduleItem ? styles.hasTask : ''}`}
                  >
                    {scheduleItem && slot === scheduleItem.startTime && (
                      <div className={styles.taskInfo}>
                        {`${scheduleItem.startTime} - ${scheduleItem.endTime}`}
                        <br />
                        {scheduleItem.task}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Dashboard;