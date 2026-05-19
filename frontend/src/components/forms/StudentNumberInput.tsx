"use client";

import React, { forwardRef } from 'react';
import { normalizeStudentId } from '@/lib/validation';

interface StudentNumberInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value?: string;
  onChange?: (value: string) => void;
}

const StudentNumberInput = forwardRef<HTMLInputElement, StudentNumberInputProps>(
  ({ value, onChange, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = normalizeStudentId(e.target.value);
      onChange?.(newValue);
    };

    return (
      <input
        ref={ref}
        type="text"
        {...props}
        value={value}
        onChange={handleChange}
        maxLength={8}
      />
    );
  }
);

StudentNumberInput.displayName = 'StudentNumberInput';

export default StudentNumberInput;
