'use client'

import { Trash2 } from 'lucide-react'
import { useTransition } from 'react'

export default function DeleteButton({ 
  id, 
  deleteAction 
}: { 
  id: string, 
  deleteAction: (id: string) => Promise<void> 
}) {
  const [isPending, startTransition] = useTransition()

  const handleDelete = () => {
    // Show the confirmation popup
    if (window.confirm('Are you sure you want to delete this enquiry? This cannot be undone.')) {
      startTransition(() => {
        deleteAction(id)
      })
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className={`p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors ${
        isPending ? 'opacity-50 cursor-not-allowed' : ''
      }`}
      title="Delete Enquiry"
    >
      <Trash2 size={16} />
    </button>
  )
}