import Image from 'next/image'

export function BrandLogo({ light = false }: { light?: boolean }) {
  return <Image src={light ? '/brand/posiblo-logo-white-wordmark.svg' : '/brand/posiblo-logo.svg'} alt="Posiblo" width={925} height={780} className="brand-logo" unoptimized />
}
