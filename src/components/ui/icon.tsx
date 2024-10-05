import { icons } from 'lucide-react'

import { cn } from '@/lib/utils'

export type IconProps = {
  name: keyof typeof icons
  className?: string
  strokeWidth?: number
  url?: string
}

const Icon = ({ name, className, strokeWidth }: IconProps) => {
  const IconComponent = icons[name]

  if (!IconComponent) {
    return null
  }

  return (
    <IconComponent
      className={cn('size-6', className)}
      strokeWidth={strokeWidth || 2}
    />
  )
}

Icon.displayName = 'Icon'

export default Icon
