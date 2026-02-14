/**
 * Generates a unique, alphanumeric client code.
 * Prioritizes first letters of multiple words (Initials).
 * Format: 3 Uppercase characters + 3 Digits (e.g., TGM001).
 * * @param {string} name - The display name of the client.
 * @param {number} [existingCount=0] - The number of existing clients with this prefix.
 * @returns {string} A 6-character alphanumeric code.
 */
export function generateClientCode(name, existingCount = 0) {
    if (!name || name.trim().length === 0) return "";

    // 1. Split by spaces and filter out empty strings
    const words = name.trim().split(/\s+/);
    let alphaPart = "";

    if (words.length >= 3) {
        // Case: "Thabang Gideon Magaola" -> TGM
        alphaPart = words[0][0] + words[1][0] + words[2][0];
    } else if (words.length === 2) {
        // Case: "First National" -> FIN (First char of 1st word + first two of 2nd)
        // Or simply take first two of first word and first of second
        alphaPart = (words[0][0] + words[1].substring(0, 2));
    } else {
        // Case: "Protea" -> PRO or "IT" -> ITA
        let cleanName = words[0].replace(/[^a-zA-Z]/g, '');
        alphaPart = cleanName.substring(0, 3).padEnd(3, 'A');
    }

    // Ensure final alpha part is uppercase and exactly 3 chars
    alphaPart = alphaPart.toUpperCase().substring(0, 3);

    // 2. Handle Numeric part (3 chars, starting at 001)
    const numericValue = existingCount + 1;
    const numericPart = numericValue.toString().padStart(3, '0');

    return `${alphaPart}${numericPart}`;
}