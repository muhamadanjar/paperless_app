import clsx, { ClassValue } from "clsx";
import dayjs from "dayjs";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export function formatDate(
	date?: Date,
	format: string = 'DD MMM, YYYY'
): string {
	if (!date) return '';
	return dayjs(date).format(format);
}


export function formatNumber(value: number): string {
	// Check if the value is less than 0
	if (value < 0) {
		// Handle negative values separately and format the absolute value
		const absoluteValue = Math.abs(value);
		return `-${formatNumber(absoluteValue)}`;
	} else if (value >= 1e9) {
		// Format the value in billions
		const formattedValue = value / 1e9;
		return `${formattedValue.toFixed(1)}B`;
	} else if (value >= 1e6) {
		// Check if the value is between 1 million and 1 billion
		// Format the value in millions
		const formattedValue = value / 1e6;
		return `${formattedValue.toFixed(1)}M`;
	} else if (value >= 1000) {
		// Check if the value is between 1 thousand and 1 million
		// Format the value in thousands
		const formattedValue = value / 1000;
		return `${formattedValue.toFixed(1)}K`;
	} else {
		// If the value is less than 1 thousand, return the original value as a string
		return value.toString();
	}
}

