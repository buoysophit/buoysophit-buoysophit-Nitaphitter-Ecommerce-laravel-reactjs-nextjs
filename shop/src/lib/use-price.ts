import { useMemo } from "react";
import { useRouter } from "next/router";
import { useSettings } from "@contexts/settings.context";

export function formatPrice({
  amount,
  currencyCode,
  locale,
  fractions,
}: {
  amount: number;
  currencyCode: string;
  locale: string;
  fractions: number;
}) {
  const formatCurrency = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currencyCode,
    maximumFractionDigits: fractions,
  });

  return formatCurrency.format(amount);
}

export function formatVariantPrice({
  amount,
  baseAmount,
  currencyCode,
  locale,
  fractions = 2,
}: {
  baseAmount: number;
  amount: number;
  currencyCode: string;
  locale: string;
  fractions: number;
}) {
  const hasDiscount = baseAmount > amount;
  const formatDiscount = new Intl.NumberFormat(locale, { style: "percent" });
  const discount = hasDiscount
    ? formatDiscount.format((baseAmount - amount) / baseAmount)
    : null;

  const price = formatPrice({ amount, currencyCode, locale, fractions });
  const basePrice = hasDiscount
    ? formatPrice({ amount: baseAmount, currencyCode, locale, fractions })
    : null;

  return { price, basePrice, discount };
}

export default function usePrice(
  data?: {
    amount: number;
    baseAmount?: number;
    currencyCode?: string;
  } | null
) {
  const { currency, currencyOptions } = useSettings();
  const { amount, baseAmount, currencyCode = currency } = data ?? {};
  const { formation = 'en-US', fractions = 2 } = currencyOptions!;
  const { locale } = useRouter();
  const value = useMemo(() => {
    if (typeof amount !== "number" || !currencyCode) return "";
    const currentLocale = formation ? formation : 'en';
    return baseAmount
      ? formatVariantPrice({
        amount,
        baseAmount,
        currencyCode,
        locale: currentLocale,
        fractions
      })
      : formatPrice({ amount, currencyCode, locale: currentLocale, fractions });
  }, [amount, baseAmount, currencyCode, locale]);

  return typeof value === "string"
    ? { price: value, basePrice: null, discount: null }
    : value;
}
