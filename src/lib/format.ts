import { useMemo } from 'react'
import tinydate from 'tinydate'

export function formatDate(date: string) {
  const template = tinydate('{MMMM} {DD}, {YYYY}', {
    MMMM: (d) => d.toLocaleString('en-US', { month: 'long' }),
    DD: (d) => d.getDate()
  })
  return template(new Date(date))
}

export function useFormatDate(dateString: string) {
  return useMemo(() => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) {
      return `${diffInSeconds} seconds ago`
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60)
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes ago`
    }

    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) {
      return `${diffInHours} hours ago`
    }

    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) {
      return `${diffInDays} days ago`
    }

    if (diffInDays < 30) {
      return `${Math.floor(diffInDays / 7)} weeks ago`
    }

    if (diffInDays < 365) {
      return `${Math.floor(diffInDays / 30)} months ago`
    }

    // If the date is more than a year ago, return a formatted date
    return formatDate(dateString)
  }, [dateString])
}
