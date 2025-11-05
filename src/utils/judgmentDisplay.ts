import type { JudgmentType } from '../types/dice';

export interface JudgmentDisplayConfig {
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
  icon: string;
}

export function getJudgmentDisplay(judgment: JudgmentType): JudgmentDisplayConfig {
  switch (judgment) {
    case 'critical-success':
      return {
        label: 'Critical Success',
        color: 'text-green-400',
        bgColor: 'bg-green-900/30',
        borderColor: 'border-green-600',
        icon: '★',
      };
    case 'success':
      return {
        label: 'Success',
        color: 'text-green-300',
        bgColor: 'bg-green-800/20',
        borderColor: 'border-green-700',
        icon: '✓',
      };
    case 'failure':
      return {
        label: 'Failure',
        color: 'text-red-300',
        bgColor: 'bg-red-800/20',
        borderColor: 'border-red-700',
        icon: '✗',
      };
    case 'critical-failure':
      return {
        label: 'Critical Failure',
        color: 'text-red-400',
        bgColor: 'bg-red-900/30',
        borderColor: 'border-red-600',
        icon: '☠',
      };
    case 'neutral':
    default:
      return {
        label: 'Roll',
        color: 'text-gray-300',
        bgColor: 'bg-gray-800/20',
        borderColor: 'border-gray-600',
        icon: '●',
      };
  }
}
