import { Suspense } from 'react'
import Client from './client'

 
export default function Page() {
  return (
    <Suspense>
      <Client />
    </Suspense>
  )
}