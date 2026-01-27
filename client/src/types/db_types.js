/**
 * @typedef {Object} Guest
 * @property {string} id - Unique identifier for the guest.
 * @property {string} name - Full name of the guest.
 * @property {boolean} confirmed - Whether the guest has confirmed presence.
 * @property {number} adults - Number of adults included in this invitation.
 * @property {number} children - Number of children included in this invitation.
 * @property {string} [message] - Optional message for the couple.
 * @property {string} [phone] - Contact phone number.
 */

/**
 * @typedef {Object} Item
 * @property {string} id - Unique identifier for the gift item.
 * @property {string} name - Name of the gift.
 * @property {string} description - Description of the gift.
 * @property {number} price - Price value in currency.
 * @property {string} imageUrl - URL of the gift image.
 * @property {string} category - Category of the item (e.g., 'Cozinha', 'Quarto').
 * @property {boolean} available - Whether the item is still available for purchase.
 * @property {string} [purchasedBy] - Name of the guest who purchased/selected the gift (optional).
 */

export const Types = {};
