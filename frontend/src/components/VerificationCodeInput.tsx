import React, { useRef, useState, KeyboardEvent } from 'react';

interface VerificationCodeInputProps {
  onComplete: (code: string) => void;
}

export function VerificationCodeInput({ onComplete }: VerificationCodeInputProps) {
  const [code, setCode] = useState<string[]>(Array(6).fill(''));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);

      // Move to next input if value is entered
      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }

      // Check if code is complete
      if (newCode.every(digit => digit) && newCode.join('').length === 6) {
        onComplete(newCode.join(''));
      }
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      // Move to previous input on backspace if current input is empty
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    if (/^\d+$/.test(pastedData)) {
      const newCode = [...code];
      pastedData.split('').forEach((digit, index) => {
        if (index < 6) newCode[index] = digit;
      });
      setCode(newCode);
      
      // Focus the next empty input or the last input
      const nextEmptyIndex = newCode.findIndex(digit => !digit);
      if (nextEmptyIndex !== -1) {
        inputRefs.current[nextEmptyIndex]?.focus();
      } else {
        inputRefs.current[5]?.focus();
      }

      if (newCode.every(digit => digit)) {
        onComplete(newCode.join(''));
      }
    }
  };

  return (
    <div className="flex gap-2 justify-center">
      {code.map((digit, index) => (
        <input
          key={index}
          type="text"
          maxLength={1}
          value={digit}
          ref={el => inputRefs.current[index] = el}
          onChange={e => handleChange(index, e.target.value)}
          onKeyDown={e => handleKeyDown(index, e)}
          onPaste={handlePaste}
          className="w-12 h-12 text-center text-xl font-semibold border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none"
          aria-label={`Digit ${index + 1}`}
        />
      ))}
    </div>
  );
} 