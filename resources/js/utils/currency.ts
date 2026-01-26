/**
 * Formats a number as a currency string.
 * Currently standardizes on the "$" symbol at the end.
 */
export function formatCurrency(
    amount: number | string,
    decimals: number = 2
): string {
    const numericAmount =
        typeof amount === 'string' ? parseFloat(amount) : amount;

    if (isNaN(numericAmount)) return '-';

    return `${numericAmount.toLocaleString('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    })} $`;
}

