'use client'

import * as Sentry from '@sentry/nextjs'
import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    Sentry.captureException(error)
  }, [error])

  return (
    <html>
      <body>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          fontFamily: 'sans-serif',
          backgroundColor: '#09090b',
          color: '#f4f4f5',
          gap: '16px',
        }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Something went wrong</h2>
          <p style={{ color: '#71717a', fontSize: '0.875rem' }}>
            {error.digest ? `Error ID: ${error.digest}` : '發生未預期錯誤'}
          </p>
          <button
            onClick={reset}
            style={{
              padding: '8px 20px',
              borderRadius: '6px',
              border: '1px solid #3f3f46',
              background: '#18181b',
              color: '#f4f4f5',
              cursor: 'pointer',
              fontSize: '0.875rem',
            }}
          >
            重試
          </button>
        </div>
      </body>
    </html>
  )
}
