"use client";

import React, { forwardRef } from "react";

interface FuriganaInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value?: string;
  onChange?: (value: string) => void;
}

const FuriganaInput = forwardRef<HTMLInputElement, FuriganaInputProps>(
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

FuriganaInput.displayName = "FuriganaInput";

export default FuriganaInput;
