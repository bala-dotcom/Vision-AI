// Currency conversion utility
// USD to INR conversion rate (approximate)
const USD_TO_INR_RATE = 83.0;

/**
 * Convert USD to INR
 * @param {number|string} usdAmount - Amount in USD
 * @returns {number} - Amount in INR
 */
export const usdToInr = (usdAmount) => {
    const usd = typeof usdAmount === 'string' ? parseFloat(usdAmount) : usdAmount;
    return usd * USD_TO_INR_RATE;
};

/**
 * Format amount as INR currency
 * @param {number|string} amount - Amount in USD
 * @returns {string} - Formatted string like "₹1,234.56"
 */
export const formatInr = (amount) => {
    const inr = usdToInr(amount);
    return `₹${inr.toFixed(2)}`;
};

/**
 * Format amount as INR currency without symbol (for display)
 * @param {number|string} amount - Amount in USD
 * @returns {string} - Formatted string like "1,234.56"
 */
export const formatInrAmount = (amount) => {
    const inr = usdToInr(amount);
    return inr.toFixed(2);
};

