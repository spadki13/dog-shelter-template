import { render } from '@react-email/render'
import type { ReactElement } from 'react'

export const renderEmail = async (element: ReactElement) => ({
  html: await render(element),
  text: await render(element, { plainText: true }),
})
