import React from 'react'

import BadgeCustom from '../badge'

const ListTags = ({ data }: { data: string[] }) => {
  return (
    <>
      {data.map((tag) => (
        <BadgeCustom key={tag} label={tag} />
      ))}
    </>
  )
}

export default ListTags
