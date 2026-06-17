import Image from 'next/image'
import { cn } from '@/lib/utils'

interface LogoProps {
  variant?: 'light' | 'dark'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function Logo({ variant = 'dark', size = 'md', className }: LogoProps) {
  const sizes = { sm: 'text-base', md: 'text-xl', lg: 'text-3xl' }
  const imageSizes = {
    sm: { width: 132, height: 82 },
    md: { width: 176, height: 110 },
    lg: { width: 260, height: 162 },
  }
  const textColor = variant === 'light' ? 'text-white' : 'text-brand-navy'
  const accentColor = variant === 'light' ? 'text-brand-gold-light' : 'text-brand-gold'

  if (variant === 'dark') {
    const imageSize = imageSizes[size]

    return (
      <div className={cn('inline-flex items-center', className)}>
        <Image
          src="/brand/logo-questao-certeira.jpeg"
          alt="Questão Certeira Interativo"
          width={imageSize.width}
          height={imageSize.height}
          priority={size === 'lg'}
          className="h-auto w-auto max-w-full mix-blend-multiply"
        />
      </div>
    )
  }

  return (
    <div className={cn('flex flex-col leading-none', sizes[size], textColor, className)}>
      <span className={cn('font-black tracking-tight', sizes[size])}>
        QUESTÃO{' '}
        <span className={accentColor}>CERTEIRA</span>
      </span>
      <span className={cn('font-light tracking-[0.3em] uppercase text-[0.5em] mt-0.5', accentColor)}>
        INTERATIVO
      </span>
    </div>
  )
}
