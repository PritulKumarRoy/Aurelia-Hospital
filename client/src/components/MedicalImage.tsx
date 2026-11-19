import { useState } from 'react';
import { Building2 } from 'lucide-react';

interface MedicalImageProps {
  src: string;
  alt: string;
  className?: string;
  aspectClassName?: string;
  priority?: boolean;
}

export function MedicalImage({
  src,
  alt,
  className = '',
  aspectClassName = '',
  priority = false,
}: MedicalImageProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex flex-col items-center justify-center bg-[var(--color-surface-tinted)] text-[var(--color-primary)] p-[var(--space-6)] text-center ${aspectClassName} ${className}`}
      >
        <Building2
          className="w-8 h-8 mb-[var(--space-2)] opacity-60"
          strokeWidth={1.4}
          aria-hidden="true"
        />
        <span
          className="font-serif font-medium text-[var(--color-ink)] max-w-xs"
          style={{ fontSize: 'var(--type-base-size)', lineHeight: 'var(--type-base-leading)' }}
        >
          {alt}
        </span>
      </div>
    );
  }

  return (
    <div className={`overflow-hidden bg-[var(--color-surface-tinted)] ${aspectClassName} ${className}`}>
      <img
        src={src}
        alt={alt}
        referrerPolicy="no-referrer"
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : undefined}
        decoding={priority ? undefined : 'async'}
        onError={() => setHasError(true)}
        className="w-full h-full object-cover object-center"
      />
    </div>
  );
}
