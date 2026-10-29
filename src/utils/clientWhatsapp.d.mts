export declare function normalizeClientWhatsapp(value: unknown): string | null;
export declare function clientReferralCode(slug: string): string;
export declare function getClientReferralWhatsappUrl(options: {
  whatsapp?: string;
  ownerName: string;
  contactName?: string;
  referralCode?: string;
  exampleUrl?: string;
}): string | null;
