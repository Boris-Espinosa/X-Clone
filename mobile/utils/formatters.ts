import { differenceInMinutes, differenceInHours, differenceInDays } from 'date-fns';

export const formatNumber = (num: number): string => {
    if (num >=1000) return Math.floor(num / 1000) + 'K';
    return num.toString();
}

export const FormatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();

    const minutesDiff = differenceInMinutes(now, date);
    const hoursDiff = differenceInHours(now, date);
    const daysDiff = differenceInDays(now, date);

    if (minutesDiff < 1) return 'Just now';
    if (minutesDiff < 60) return `${minutesDiff}m`;
    if (hoursDiff < 24) return `${hoursDiff}h`;
    if (daysDiff < 7) return `${daysDiff}d`;
    return Math.floor(daysDiff / 7) + 'w';
}