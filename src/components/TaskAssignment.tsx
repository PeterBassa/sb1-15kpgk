import React from 'react';
import { Employee } from '../context/EmployeeContext';
import { tasks } from './ScheduleCreator';
import styles from './ScheduleCreator.module.css';

interface TaskAssignmentProps {
  employees: Employee[];
  selectedEmployee: string | null;
  selectedTask: string;
  onEmployeeSelect: (employeeId: string) => void;
  onTaskSelect: (task: string) => void;
  onAssign: () => void;
}

const TaskAssignment: React.FC<TaskAssignmentProps> = ({
  employees,
  selectedEmployee,
  selectedTask,
  onEmployeeSelect,
  onTaskSelect,
  onAssign,
}) => {
  return (
    <div className={styles.assignTaskSection}>
      <select
        value={selectedEmployee || ''}
        onChange={(e) => onEmployeeSelect(e.target.value)}
        className={styles.select}
      >
        <option value="">Select an E.A.</option>
        {employees.map(emp => (
          <option key={emp.id} value={emp.id}>{emp.name}</option>
        ))}
      </select>
      <select
        value={selectedTask}
        onChange={(e) => onTaskSelect(e.target.value)}
        className={styles.select}
      >
        <option value="">Select a task</option>
        {tasks.map(task => (
          <option key={task} value={task}>{task}</option>
        ))}
      </select>
      <button
        onClick={onAssign}
        className={styles.assignButton}
      >
        Assign Location
      </button>
    </div>
  );
};

export default React.memo(TaskAssignment);