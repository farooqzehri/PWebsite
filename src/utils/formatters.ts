// PKR Currency and formatting utilities with Pakistani naming conventions (Crore / Lac / Thousand)

export function formatPrice(amount: number, purpose: string = 'sale'): string {
  if (!amount || isNaN(amount)) return 'Price on Inquiry';

  let unitText = '';
  if (purpose === 'rent') {
    unitText = ' / month';
  }

  // Pakistani naming conventions for display
  if (amount >= 10000000) {
    const crore = (amount / 10000000).toFixed(2).replace(/\.00$/, '');
    return `PKR ${crore} Crore${unitText}`;
  } else if (amount >= 100000) {
    const lac = (amount / 100000).toFixed(2).replace(/\.00$/, '');
    return `PKR ${lac} Lac${unitText}`;
  } else if (amount >= 1000) {
    return `PKR ${amount.toLocaleString('en-PK')}${unitText}`;
  }

  return `PKR ${amount}${unitText}`;
}

export function formatExactPrice(amount: number): string {
  if (!amount || isNaN(amount)) return 'PKR 0';
  return `PKR ${amount.toLocaleString('en-PK')}`;
}

export function formatArea(area: number, unit: string = 'Marla'): string {
  if (!area) return '';
  return `${area} ${unit}`;
}

export function generateWhatsAppLink(
  phoneNumber: string = '+923128001533',
  propertyTitle?: string,
  propertyId?: string,
  propertyUrl?: string
): string {
  // Clean phone number: remove spaces, dashes, plus
  const cleanPhone = phoneNumber.replace(/[^0-9]/g, '');

  let text = 'Assalamualaikum, I am contacting Bismillah State Agency.';
  if (propertyId && propertyTitle) {
    text = `Assalamualaikum, I am interested in Property ID ${propertyId} – ${propertyTitle} in Quetta. Could you please share more details, documentation, and when I can view the property?`;
  } else if (propertyTitle) {
    text = `Assalamualaikum, I am interested in ${propertyTitle} in Quetta. Could you please share more details?`;
  }

  if (propertyUrl) {
    text += `\nReference: ${propertyUrl}`;
  }

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
}

export function generateCallLink(phoneNumber: string = '+923128001533'): string {
  return `tel:${phoneNumber.replace(/[^0-9+]/g, '')}`;
}

export function formatDate(isoString: string): string {
  if (!isoString) return '';
  const date = new Date(isoString);
  return date.toLocaleDateString('en-PK', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}
