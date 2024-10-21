import React, { useState } from 'react';
import { Employee } from '../context/EmployeeContext';
import styles from './ScheduleCreator.module.css';

interface BreakCoverageModalProps {
  employees: Employee[];
  onConfirm: (employeeName: string) => void;
  onCancel: () => void;
}

const BreakCoverageModal: React.FC<BreakCoverageModalProps> = ({
  employees,
  onConfirm,
  onCancel,
}) => {
  const [selectedEmployee, setSelectedEmployee] = useState<string>('');

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <h3 className={styles.modalTitle}>Select Employee for Break Coverage</h3>
        <select
          value={selectedEmployee}
          onChange={(e) => setSelectedEmployee(e.target.value)}
          className={styles.select}
        >
          <option value="">Select an employee</option>
          {employees.map(emp => (
            <option key={emp.id} value={emp.name}>{emp.name}</option>
          ))}
        </select>
        <div className={styles.modalButtons}>
          <button
            onClick={() => onConfirm(selectedEmployee)}
            className={styles.confirmButton}
            disabled={!selectedEmployee}
          >
            Confirm
          </button>
          <button
            onClick={onCancel}
            className={styles.cancelButton}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(BreakCoverageModal);