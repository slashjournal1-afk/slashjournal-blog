import * as OTPAuth from 'otpauth';

export function createTOTPInstance(secret: string, email: string = 'admin@slashjournal.dev') {
  return new OTPAuth.TOTP({
    issuer: 'SlashJournal Admin',
    label: email,
    algorithm: 'SHA1',
    digits: 6,
    period: 30,
    secret: OTPAuth.Secret.fromBase32(secret),
  });
}

export function generateTOTPSecret(): string {
  const secret = new OTPAuth.Secret({ size: 20 });
  return secret.base32;
}

export function verifyTOTPCode(secret: string, token: string): boolean {
  const totp = createTOTPInstance(secret);
  // delta of 1 allows +/- 30s drift window
  const delta = totp.validate({ token: token.trim(), window: 1 });
  return delta !== null;
}

export function verifyBackupCode(backupCodesJson: string | null | undefined, codeInput: string): { valid: boolean; remainingCodesJson?: string } {
  if (!backupCodesJson) return { valid: false };
  try {
    const codes: string[] = JSON.parse(backupCodesJson);
    const normalizedInput = codeInput.trim().toUpperCase();
    const index = codes.findIndex((c) => c.toUpperCase() === normalizedInput);
    if (index !== -1) {
      // Remove used code (single-use)
      codes.splice(index, 1);
      return { valid: true, remainingCodesJson: JSON.stringify(codes) };
    }
  } catch (err) {
    console.error('Failed to parse backup codes:', err);
  }
  return { valid: false };
}
