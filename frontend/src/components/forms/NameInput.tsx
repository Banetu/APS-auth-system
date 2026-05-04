"use client";

import React, { forwardRef } from 'react';

interface NameInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value?: string;
  onChange?: (value: string) => void;
}

const NameInput = forwardRef<HTMLInputElement, NameInputProps>(
  ({ value, onChange, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(e.target.value);
    };

    return (
      <input
        ref={ref}
        type="text"
        {...props}
        value={value}
        onChange={handleChange}
      />
    );
  }
);

NameInput.displayName = 'NameInput';

export default NameInput;
