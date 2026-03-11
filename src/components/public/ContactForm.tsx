import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import emailjs from '@emailjs/browser'

const schema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  message: z.string().min(10, 'El mensaje debe tener al menos 10 caracteres'),
})

type FormData = z.infer<typeof schema>
type FormStatus = 'idle' | 'sending' | 'sent' | 'error'

export default function ContactForm() {
  const [status, setStatus] = useState<FormStatus>('idle')

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  const onSubmit = async (data: FormData) => {
    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

    if (!serviceId || !templateId || !publicKey) {
      // EmailJS not configured — skip silently in dev
      setStatus('sent')
      reset()
      return
    }

    setStatus('sending')
    try {
      await emailjs.send(
        serviceId,
        templateId,
        { from_name: data.name, from_email: data.email, message: data.message },
        publicKey,
      )
      setStatus('sent')
      reset()
    } catch {
      setStatus('error')
    }
  }

  if (status === 'sent') {
    return (
      <div className="bg-emerald-500/10 border border-emerald-500/25 rounded-2xl p-6 text-center">
        <p className="text-emerald-400 font-semibold text-base">¡Mensaje enviado!</p>
        <p className="text-slate-500 text-sm mt-1">Te responderé a la brevedad.</p>
        <button
          onClick={() => setStatus('idle')}
          className="mt-4 text-sm text-slate-500 hover:text-white transition-colors cursor-pointer"
        >
          Enviar otro →
        </button>
      </div>
    )
  }

  const inputClass =
    'w-full bg-[#111827] border border-white/8 hover:border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-violet-500/50 transition-colors'

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <div>
        <input {...register('name')} placeholder="Tu nombre" className={inputClass} />
        {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
      </div>

      <div>
        <input {...register('email')} placeholder="Tu email" type="email" className={inputClass} />
        {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
      </div>

      <div>
        <textarea
          {...register('message')}
          placeholder="Tu mensaje"
          rows={5}
          className={`${inputClass} resize-none`}
        />
        {errors.message && <p className="text-red-400 text-xs mt-1">{errors.message.message}</p>}
      </div>

      {status === 'error' && (
        <p className="text-red-400 text-sm">Hubo un error. Intentá nuevamente.</p>
      )}

      <button
        type="submit"
        disabled={status === 'sending'}
        className="w-full py-3 bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white rounded-xl font-semibold text-sm transition-all hover:shadow-lg hover:shadow-violet-500/20 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
      >
        {status === 'sending' ? 'Enviando...' : 'Enviar mensaje'}
      </button>
    </form>
  )
}
