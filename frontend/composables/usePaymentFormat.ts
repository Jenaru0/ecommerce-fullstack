// frontend/composables/usePaymentFormat.ts
export function usePaymentFormat() {
  // Formatear número de tarjeta (agregar espacios cada 4 dígitos)
  const formatCardNumber = (value: string): string => {
    if (!value) return "";
    const digits = value.replace(/\D/g, "");
    const groups = [];

    for (let i = 0; i < digits.length; i += 4) {
      groups.push(digits.substring(i, i + 4));
    }

    return groups.join(" ").substring(0, 19); // 16 dígitos + 3 espacios
  };

  // Formatear fecha de expiración (MM/AA)
  const formatExpiryDate = (value: string): string => {
    if (!value) return "";
    const digits = value.replace(/\D/g, "");

    if (digits.length <= 2) {
      return digits;
    }

    return `${digits.substring(0, 2)}/${digits.substring(2, 4)}`;
  };

  return {
    formatCardNumber,
    formatExpiryDate,
  };
}
