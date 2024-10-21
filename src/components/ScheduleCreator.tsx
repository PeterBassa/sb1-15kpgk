import React, { useState, useContext, useCallback, useMemo } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useEmployees, Employee } from '../context/EmployeeContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, LayoutDashboard, UserPlus, Trash2, AlertTriangle, CheckCircle } from 'lucide-react';
import { format, addMinutes, parse, isBefore } from 'date-fns';
import styles from './ScheduleCreator.module.css';
import '../styles/variables.css';
import Dashboard from './Dashboard';
import EmployeeCard from './EmployeeCard';
import TaskAssignment from './TaskAssignment';
import TimeSlotGrid from './TimeSlotGrid';
import BreakCoverageModal from './BreakCoverageModal';

const timeSlots = Array.from({ length: 192 }, (_, i) => {
  const time = addMinutes(new Date(2024, 0, 1, 8, 30), i * 5);
  return format(time, 'h:mm a');
});

export const tasks = ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8', 'AM Recess Duty', 'PM Recess Duty', 'Break Coverage', 'Break'];

const ScheduleCreator: React.FC = () => {
  const [newEmployeeName, setNewEmployeeName] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<string[]>([]);
  const [selectedTask, setSelectedTask] = useState<string>('');
  const [showDashboard, setShowDashboard] = useState(false);
  const [showBreakCoverageModal, setShowBreakCoverageModal] = useState(false);
  const [employeeToCover, setEmployeeToCover] = useState<string | null>(null);

  const { currentUser, logout } = useContext(AuthContext);
  const { state: { employees }, dispatch } = useEmployees();
  const navigate = useNavigate();

  const handleLogout = useCallback(() => {
    logout();
    navigate('/');
  }, [logout, navigate]);

  const addEmployee = useCallback(() => {
    if (newEmployeeName.trim()) {
      const newEmployee: Employee = {
        id: `employee-${employees.length + 1}`,
        name: newEmployeeName.trim(),
        schedule: {},
        workingWithTier3: false,
      };
      dispatch({ type: 'ADD_EMPLOYEE', payload: newEmployee });
      setNewEmployeeName('');
    }
  }, [newEmployeeName, employees.length, dispatch]);

  const deleteEmployee = useCallback((id: string) => {
    dispatch({ type: 'DELETE_EMPLOYEE', payload: id });
  }, [dispatch]);

  const handleTaskAssignment = useCallback(() => {
    if (selectedEmployee && selectedTask && selectedTimeSlots.length > 0) {
      if (selectedTask === 'Break Coverage' && !employeeToCover) {
        setShowBreakCoverageModal(true);
        return;
      }

      selectedTimeSlots.forEach(timeSlot => {
        dispatch({
          type: 'ASSIGN_TASK',
          payload: {
            employeeId: selectedEmployee,
            timeSlot,
            task: selectedTask === 'Break Coverage' ? `Break Coverage (${employeeToCover})` : selectedTask,
          },
        });
      });

      setSelectedTimeSlots([]);
      setSelectedTask('');
      setEmployeeToCover(null);
    }
  }, [selectedEmployee, selectedTask, selectedTimeSlots, employeeToCover, dispatch]);

  const toggleTimeSlot = useCallback((timeSlot: string) => {
    setSelectedTimeSlots(prev => 
      prev.includes(timeSlot) 
        ? prev.filter(slot => slot !== timeSlot)
        : [...prev, timeSlot]
    );
  }, []);

  const toggleTier3 = useCallback((employeeId: string) => {
    dispatch({ type: 'TOGGLE_TIER3', payload: employeeId });
  }, [dispatch]);

  const deleteScheduledTime = useCallback((employeeId: string, timeSlot: string) => {
    dispatch({ type: 'DELETE_TASK', payload: { employeeId, timeSlot } });
  }, [dispatch]);

  const memoizedEmployees = useMemo(() => employees, [employees]);

  return (
    <div className={styles.scheduleCreator}>
      <header className={styles.header}>
        <h1 className={styles.welcomeMessage}>Welcome, {currentUser}</h1>
        <div className={styles.headerButtons}>
          <button onClick={() => setShowDashboard(!showDashboard)} className={styles.dashboardButton}>
            <LayoutDashboard className="mr-2" /> {showDashboard ? 'Hide' : 'Show'} Dashboard
          </button>
          <button onClick={handleLogout} className={styles.logoutButton}>
            <LogOut className="mr-2" /> Logout
          </button>
        </div>
      </header>

      {showDashboard && <Dashboard employees={memoizedEmployees} />}

      <div className={styles.scheduleContent}>
        <div className={styles.addEmployeeForm}>
          <input
            type="text"
            value={newEmployeeName}
            onChange={(e) => setNewEmployeeName(e.target.value)}
            placeholder="Enter E.A. name"
            className={styles.input}
          />
          <button onClick={addEmployee} className={styles.addButton}>
            <UserPlus className="mr-2" /> Add E.A.
          </button>
        </div>

        <div className={styles.employeeGrid}>
          {memoizedEmployees.map(employee => (
            <EmployeeCard
              key={employee.id}
              employee={employee}
              onDelete={deleteEmployee}
              onToggleTier3={toggleTier3}
              onDeleteScheduledTime={deleteScheduledTime}
            />
          ))}
        </div>

        <TaskAssignment
          employees={memoizedEmployees}
          selectedEmployee={selectedEmployee}
          selectedTask={selectedTask}
          onEmployeeSelect={setSelectedEmployee}
          onTaskSelect={setSelectedTask}
          onAssign={handleTaskAssignment}
        />

        <TimeSlotGrid
          timeSlots={timeSlots}
          selectedTimeSlots={selectedTimeSlots}
          onToggleTimeSlot={toggleTimeSlot}
        />
      </div>

      {showBreakCoverageModal && (
        <BreakCoverageModal
          employees={memoizedEmployees.filter(emp => emp.workingWithTier3)}
          onConfirm={(employeeName) => {
            setEmployeeToCover(employeeName);
            handleTaskAssignment();
            setShowBreakCoverageModal(false);
          }}
          onCancel={() => setShowBreakCoverageModal(false)}
        />
      )}
    </div>
  );
};

export default ScheduleCreator;