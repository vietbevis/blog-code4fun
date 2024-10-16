import tinydate from 'tinydate'

export function formatDate(date: string) {
  const template = tinydate('{MMMM} {DD}, {YYYY}', {
    MMMM: (d) => d.toLocaleString('en-US', { month: 'long' }),
    DD: (d) => d.getDate()
  })
  return template(new Date(date))
}
