import { useState } from 'react';
import { Flower2 } from 'lucide-react';

interface SpaImageProps {
  src: string;
  alt: string;
  className?: string;
  loading?: 'lazy' | 'eager';
  fetchPriority?: 'high' | 'low' | 'auto';
}

export function SpaImage({
  src,
  alt,
  className = '',
  loading = 'lazy',
  fetchPriority = 'auto',
}: SpaImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-[#EFE7D8] via-[#E5DAC5] to-[#D6C5A7] text-[#6B5735] p-6 text-center ${className}`}
      >
        <Flower2 className="w-8 h-8 mb-2 opacity-70 stroke-[1.5]" aria-hidden="true" />
        <span className="font-serif text-base italic opacity-85">{alt}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading={loading}
      fetchPriority={fetchPriority}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={className}
    />
  );
}
