import React from 'react';
import { cn } from '@/shared/utils/cn';

interface BadgeProps {
    children: React.ReactNode;
    variant?: 'success' | 'danger' | 'warning' | 'info' | 'default';
    className?: string;
}

const variantStyles = {
    success: 'bg-success/20 text-success-light border-success/30',
    danger: 'bg-danger/20 text-danger-light border-danger/30',
    warning: 'bg-warning/20 text-warning-light border-warning/30',
    info: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    default: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
};

export function Badge({ children, variant = 'default', className }: BadgeProps) {
    return (
        <span
            className={cn(
                'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
                'transition-all duration-200',
                variantStyles[variant],
                className
            )}
        >
            {children}
        </span>
    );
}
