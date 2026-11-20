
/** "+92 300 1234567", "0300-1234567" and "3001234567" all become "03001234567". Returns null when invalid */
export const normalizePhone = (input: string): string | null => {
  let digits = input.replace(/\D/g, "");
  if (digits.startsWith("92")) digits = digits.slice(2);
  else if (digits.startsWith("0")) digits = digits.slice(1);
  return /^3\d{9}$/.test(digits) ? `0${digits}` : null;
};

/** "03001234567" becomes "0300 ••• 4567" */
export const maskPhone = (phone: string) =>
  phone.length === 11 ? `${phone.slice(0, 4)} ••• ${phone.slice(-4)}` : phone;
