import Link from 'next/link'
import React from 'react'

import { cn } from '@/lib/utils'

const CustomColor = [
  {
    label: 'Devops',
    className: 'text-blue-500 border-blue-500 bg-blue-500/20'
  },
  {
    label: 'Java',
    className: 'text-green-500 border-green-500 bg-green-500/20'
  },
  {
    label: 'JavaScript',
    className: 'text-orange-500 border-orange-500 bg-orange-500/20'
  },
  {
    label: 'WEB',
    className: 'text-yellow-500 border-yellow-500 bg-yellow-500/20'
  },
  {
    label: 'INFORMATION',
    className: 'text-red-500 border-red-500 bg-red-500/20'
  },
  {
    label: 'TECHNOLOGY',
    className: 'text-indigo-500 border-indigo-500 bg-indigo-500/20'
  },
  {
    label: 'MOBILE',
    className: 'text-purple-500 border-purple-500 bg-purple-500/20'
  },
  {
    label: 'AI',
    className: 'text-pink-500 border-pink-500 bg-pink-500/20'
  }
]

export const getClassName = (label: string) => {
  const color = CustomColor.find((item) => item.label === label)
  if (color) {
    return color.className
  }
  return 'text-indigo-500 border-indigo-500 bg-indigo-500/20'
}

const BadgeCustom = ({
  label,
  className,
  href
}: {
  label: string
  className?: string
  href?: string
}) => {
  if (href) {
    return (
      <Link
        href={href}
        className={cn(
          'inline-block cursor-pointer rounded-full border px-2 py-1 text-xs font-medium',
          // getClassName(label),
          className
        )}
      >
        #{label}
      </Link>
    )
  }
  return (
    <span
      className={cn(
        'inline-block cursor-pointer rounded-full border px-2 py-1 text-xs font-medium',
        // getClassName(label),
        className
      )}
    >
      #{label}
    </span>
  )
}

export default BadgeCustom
