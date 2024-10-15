import React from 'react'

import { replaceSpecialChars } from '@/lib/utils'

import BadgeCustom from '../badge'

const ListTags = ({ data }: { data: string[] }) => {
  return (
    <>
      {data.map((tag) => (
        <BadgeCustom key={tag} label={tag} href={`/tag/${replaceSpecialChars(tag)}`} />
      ))}
    </>
  )
}

export default ListTags
