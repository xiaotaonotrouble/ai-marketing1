import React from 'react';

// 定义步骤的类型
interface Step {
  number: number;
  label: string;
}

interface StepSidebarProps {
  steps: Step[];
  currentStep: number;
}

export function StepSidebar({ steps, currentStep }: StepSidebarProps) {
  return (
    <div className="fixed left-0 top-0 bottom-0 w-16 bg-gray-100 flex flex-col items-center pt-24">
      {steps.map((step) => (
        <div
          key={step.number}
          className="relative mb-8 flex flex-col items-center group"
        >
          {/* 步骤数字 */}
          <div
            className={`
              w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium
              ${step.number === currentStep
                ? 'bg-black text-white'
                : 'bg-white text-gray-400 border border-gray-300'
              }
            `}
          >
            {step.number}
          </div>
          
          {/* 步骤标签 - 鼠标悬停时显示 */}
          <div className="absolute left-12 hidden group-hover:block bg-gray-800 text-white text-xs py-1 px-2 rounded whitespace-nowrap">
            {step.label}
          </div>

          {/* 连接线 - 除了最后一个步骤都显示 */}
          {step.number !== steps.length && (
            <div className="w-px h-8 bg-gray-300 mt-2"></div>
          )}
        </div>
      ))}
    </div>
  );
} 