import * as React from 'react'

type EmailLayoutProps = {
  children: React.ReactNode
  previewText: string
  shelterName: string
}

export const EmailLayout = ({ children, previewText, shelterName }: EmailLayoutProps) => (
  <html>
    <head>
      <meta content="text/html; charset=UTF-8" httpEquiv="Content-Type" />
    </head>
    <body
      style={{
        margin: 0,
        padding: '32px 16px',
        backgroundColor: '#f4f4f5',
        fontFamily: 'system-ui, sans-serif',
        color: '#18181b',
      }}
    >
      <span style={{ display: 'none', opacity: 0, height: 0, overflow: 'hidden' }}>
        {previewText}
      </span>
      <table
        role="presentation"
        width="100%"
        style={{ maxWidth: 480, margin: '0 auto', backgroundColor: '#ffffff', borderRadius: 8 }}
      >
        <tbody>
          <tr>
            <td style={{ padding: 32 }}>
              <p style={{ fontSize: 14, fontWeight: 600, color: '#71717a', margin: '0 0 24px' }}>
                {shelterName}
              </p>
              {children}
            </td>
          </tr>
        </tbody>
      </table>
    </body>
  </html>
)
