import { AtSign, Facebook, Globe2, Instagram, Music2, Youtube } from 'lucide-react';

type SocialLink = { label: string; url: string };

const icons: Record<string, typeof Facebook> = {
  facebook: Facebook,
  instagram: Instagram,
  tiktok: Music2,
  threads: AtSign,
  youtube: Youtube,
};

/** Tautan sosial ikon-saja, dengan label yang tetap bisa dibaca pembaca layar. */
export default function SocialIconLinks({ links, className = '' }: { links: SocialLink[]; className?: string }) {
  if (!links.length) return null;

  return (
    <div className={`client-social-icons flex flex-wrap items-center gap-2 ${className}`} aria-label="Media sosial">
      {links.map(({ label, url }) => {
        const Icon = icons[label.toLowerCase()] || Globe2;
        return (
          <a
            key={`${label}-${url}`}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            title={`Buka ${label}`}
            aria-label={`Buka ${label} di tab baru`}
            className="client-social-icon flex h-11 w-11 items-center justify-center rounded-full transition duration-200 hover:-translate-y-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            <Icon size={21} strokeWidth={2.1} aria-hidden="true" />
          </a>
        );
      })}
    </div>
  );
}
