import Image from 'next/image';
import { imageUnknown } from '@/lib/catalog/labels';
import type { Locale } from '@/lib/catalog/types';

export function Picture({
  src,
  alt,
  locale,
  priority = false,
  className = '',
}: {
  src: string | null;
  alt: string;
  locale: Locale;
  priority?: boolean;
  className?: string;
}) {
  if (!src) {
    return (
      <div className={`grid h-full w-full place-items-center bg-[#EEF0F3] px-4 text-center text-sm text-[#5C6570] ${className}`}>
        {imageUnknown(locale)}
      </div>
    );
  }
  if (src.startsWith('/uploads/')) {
    return <Image src={src} alt={alt} width={960} height={960} unoptimized className={`h-full w-full object-contain ${className}`} />;
  }
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes="(min-width: 1024px) 360px, 100vw"
      className={`object-contain ${className}`}
      priority={priority}
    />
  );
}
