'use client';

import { useState, useRef } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './datepicker-custom.css';
import type { Field, InputField } from '@/app/lib/types/chat';
import { CalendarIcon } from '@heroicons/react/24/outline';

interface FieldInputProps {
  field: Field;
  onSubmit: (input: InputField) => void;
  disabled?: boolean;
}

export function FieldInput({ field, onSubmit, disabled }: FieldInputProps) {
  const [value, setValue] = useState<string | string[] | Date | null>(
    field.type === 'checkbox' ? [] : field.type === 'date' ? null : ''
  );
  const datePickerRef = useRef<DatePicker>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let inputField: InputField;

    switch (field.type) {
      case 'text':
        inputField = {
          id: field.id,
          type: 'text',
          value: value as string,
        };
        break;
      case 'number':
        inputField = {
          id: field.id,
          type: 'number',
          value: parseFloat(value as string),
        };
        break;
      case 'date':
        inputField = {
          id: field.id,
          type: 'date',
          value: value instanceof Date ? value.toISOString().split('T')[0] : '',
        };
        break;
      case 'checkbox':
        inputField = {
          id: field.id,
          type: 'checkbox',
          values: value as string[],
        };
        break;
      case 'radio':
        inputField = {
          id: field.id,
          type: 'radio',
          value: value as string,
        };
        break;
    }

    onSubmit(inputField);
  };

  const renderField = () => {
    switch (field.type) {
      case 'text':
        return (
          <input
            type="text"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            placeholder={field.placeholder}
            maxLength={field.max_length}
            value={value as string}
            onChange={(e) => setValue(e.target.value)}
            disabled={disabled}
            required
          />
        );

      case 'number':
        return (
          <input
            type="number"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            value={value as string}
            onChange={(e) => setValue(e.target.value)}
            disabled={disabled}
            required
          />
        );

      case 'date':
        return (
          <div className="relative w-full">
            <DatePicker
              ref={datePickerRef}
              selected={value as Date | null}
              onChange={(date) => setValue(date)}
              dateFormat="yyyy-MM-dd"
              className="w-full rounded-md border border-gray-300 px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={disabled}
              required
              placeholderText="YYYY-MM-DD"
              showYearDropdown
              showMonthDropdown
              dropdownMode="select"
              wrapperClassName="w-full"
            />
            <button
              type="button"
              onClick={() => datePickerRef.current?.setFocus()}
              disabled={disabled}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 disabled:opacity-50"
            >
              <CalendarIcon className="h-5 w-5" />
            </button>
          </div>
        );

      case 'checkbox':
        return (
          <div className="flex flex-col gap-2">
            {field.options.map((option) => {
              const isSelected = (value as string[]).includes(option);
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => {
                    const currentValues = value as string[];
                    if (isSelected) {
                      setValue(currentValues.filter((v) => v !== option));
                    } else {
                      setValue([...currentValues, option]);
                    }
                  }}
                  disabled={disabled}
                  className={`
                    relative w-full rounded-lg border-2 px-4 py-3 text-left text-sm font-medium
                    transition-all duration-200 ease-in-out
                    ${isSelected
                      ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-sm scale-[0.98]'
                      : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50'
                    }
                    ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer active:scale-[0.96]'}
                  `}
                >
                  <span className="flex items-center justify-between">
                    {option}
                    {isSelected && (
                      <span className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-white">
                        <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 12 12">
                          <path d="M10.28 2.28L3.989 8.575 1.695 6.28A1 1 0 00.28 7.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 2.28z" />
                        </svg>
                      </span>
                    )}
                  </span>
                </button>
              );
            })}
          </div>
        );

      case 'radio':
        return (
          <div className="flex flex-col gap-2">
            {field.options.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setValue(option)}
                disabled={disabled}
                className={`
                  relative w-full rounded-lg border-2 px-4 py-3 text-left text-sm font-medium
                  transition-all duration-200 ease-in-out
                  ${value === option
                    ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-sm scale-[0.98]'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50'
                  }
                  ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer active:scale-[0.96]'}
                `}
              >
                <span className="flex items-center justify-between">
                  {option}
                  {value === option && (
                    <span className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-white">
                      <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 12 12">
                        <path d="M10.28 2.28L3.989 8.575 1.695 6.28A1 1 0 00.28 7.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 2.28z" />
                      </svg>
                    </span>
                  )}
                </span>
              </button>
            ))}
          </div>
        );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full md:ml-auto md:w-1/3 rounded-lg border border-blue-300 bg-blue-50 p-4">
      <div className="mb-3">
        {renderField()}
      </div>
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={disabled}
          className="rounded-md bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Submit
        </button>
      </div>
    </form>
  );
}
