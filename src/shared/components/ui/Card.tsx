import React from 'react';
import { cn } from '@/shared/utils/cn';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    variant?: 'default' | 'glass';
}

export function Card({ children, className, variant = 'glass' }: CardProps) {
    return (
        <div
            className={cn(
                'rounded-2xl p-6 transition-all duration-300',
                variant === 'glass' && [
                    'bg-white/5 backdrop-blur-xl',
                    'border border-white/10',
                    'shadow-xl shadow-black/5',
                    'hover:bg-white/10 hover:border-white/20',
                ],
                variant === 'default' && [
                    'bg-gray-900/50',
                    'border border-gray-800',
                ],
                className
            )}
        >
            {children}
        </div>
    );
}

interface CardHeaderProps {
    children: React.ReactNode;
    className?: string;
}

export function CardHeader({ children, className }: CardHeaderProps) {
    return (
        <div className={cn('mb-4', className)}>
            {children}
        </div>
    );
}

interface CardTitleProps {
    children: React.ReactNode;
    className?: string;
}

export function CardTitle({ children, className }: CardTitleProps) {
    return (
        <h3 className={cn('text-lg font-semibold text-white', className)}>
            {children}
        </h3>
    );
}

interface CardContentProps {
    children: React.ReactNode;
    className?: string;
}

export function CardContent({ children, className }: CardContentProps) {
    return (
        <div className={cn(className)}>
            {children}
        </div>
    );
}
