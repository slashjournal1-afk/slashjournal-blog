import Image from 'next/image';

const logoSource = '/icon/Minimalist_SJ_monogram_logo_design_202608201741.svg';

export function BrandLogo({ size = 34, className = '' }: { size?: number; className?: string }) {
  return (
    <Image
      src={logoSource}
      alt="SlashJournal"
      width={size}
      height={size}
      priority
      className={`shrink-0 dark:invert ${className}`}
    />
  );
}
