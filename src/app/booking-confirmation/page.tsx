'use client'

import { Suspense } from 'react'
import { BookingConfirmationContent } from './BookingConfirmationContent'

export default function BookingConfirmationPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Cargando reserva...</div>}>
      <BookingConfirmationContent />
    </Suspense>
  )
}
