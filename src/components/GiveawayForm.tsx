import { useState } from 'react'
import './GiveawayForm.css'
import { FaCheck } from 'react-icons/fa6'
import { addDoc, collection } from 'firebase/firestore'
import { db } from '../firebase'

interface FormData {
  vorname: string
  nachname: string
  email: string
  telefon: string
  zielort: string
  zustimmung: boolean
}

const GiveawayForm = () => {
  const [formData, setFormData] = useState<FormData>({
    vorname: '',
    nachname: '',
    email: '',
    telefon: '',
    zielort: '',
    zustimmung: false
  })

  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitError, setSubmitError] = useState<string>('')

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.vorname.trim()) {
      newErrors.vorname = 'Vorname ist erforderlich'
    }

    if (!formData.nachname.trim()) {
      newErrors.nachname = 'Nachname ist erforderlich'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'E-Mail ist erforderlich'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'E-Mail ist ungültig'
    }

    if (!formData.zielort.trim()) {
      newErrors.zielort = 'Reise Ort/Ziel Ort ist erforderlich'
    }

    if (!formData.zustimmung) {
      newErrors.zustimmung = 'Sie müssen den AGB und Datenschutz zustimmen'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const formatTimestamp = () => {
    const now = new Date()
    const pad = (n: number) => n.toString().padStart(2, '0')
    return `${pad(now.getDate())}.${pad(now.getMonth() + 1)}.${now.getFullYear()} ${pad(now.getHours())}:${pad(now.getMinutes())}`
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const checked = 'checked' in e.target ? e.target.checked : false
    
    let processedValue = value
    if (name === 'telefon') {
      // Erlaube nur Zahlen, +, Leerzeichen und Bindestriche
      processedValue = value.replace(/[^\d+\s-]/g, '')
    } else if (name === 'zielort') {
      // KEINE Zahlen erlauben! Nur Buchstaben, Leerzeichen, Bindestriche, Punkte
      processedValue = value.replace(/[\d]/g, '')
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : processedValue
    }))

    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitError('')

    if (!validateForm()) return

    setIsSubmitting(true)
    try {
      const uploadsRef = collection(db, 'buses', 'WEB_PORTAL', 'uploads')
      await addDoc(uploadsRef, {
        uploadedAt: formatTimestamp(),
        teilnehmer: [
          {
            vorname: formData.vorname.trim(),
            nachname: formData.nachname.trim(),
            email: formData.email.trim(),
            telefon: formData.telefon.trim(),
            reiseziel: formData.zielort.trim(),
            zustimmung: formData.zustimmung
          }
        ]
      })
      setIsSubmitting(false)
      setIsSubmitted(true)
    } catch (err) {
      console.error('Firestore Upload fehlgeschlagen:', err)
      setIsSubmitting(false)
      setSubmitError(
        'Speichern fehlgeschlagen. Bitte überprüfe deine Internetverbindung und versuche es erneut.'
      )
    }
  }

  const handleReset = () => {
    setFormData({
      vorname: '',
      nachname: '',
      email: '',
      telefon: '',
      zielort: '',
      zustimmung: false
    })
    setErrors({})
    setSubmitError('')
    setIsSubmitted(false)
  }

  if (isSubmitting) {
    return (
      <div className="form-container submitting-container">
        <div className="submitting-card">
          <div className="loading-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <h2>Teilnahme wird gespeichert...</h2>
        </div>
      </div>
    )
  }

  if (isSubmitted) {
    return (
      <div className="success-container">
        <div className="success-card">
          <div className="success-icon">
            <div className="checkmark-circle">
              <FaCheck className="checkmark" />
            </div>
          </div>
          <h2>Vielen Dank!</h2>
          <p>Ihre Teilnahme am Gewinnspiel wurde erfolgreich gespeichert.</p>
          <button onClick={handleReset} className="reset-button">
            Nochmal teilnehmen
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="form-container">
      <div className="form-header">
        <h2>Gewinnspiel Teilnahme</h2>
        <p>Füllen Sie das Formular aus und nehmen Sie am Gewinnspiel teil!</p>
      </div>
      <form onSubmit={handleSubmit} className="giveaway-form">
        <div className="form-group">
          <label htmlFor="vorname">Vorname *</label>
          <input
            type="text"
            id="vorname"
            name="vorname"
            value={formData.vorname}
            onChange={handleChange}
            placeholder="Ihr Vorname"
            className={errors.vorname ? 'input-error' : ''}
          />
          {errors.vorname && <span className="error-message">{errors.vorname}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="nachname">Nachname *</label>
          <input
            type="text"
            id="nachname"
            name="nachname"
            value={formData.nachname}
            onChange={handleChange}
            placeholder="Ihr Nachname"
            className={errors.nachname ? 'input-error' : ''}
          />
          {errors.nachname && <span className="error-message">{errors.nachname}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="email">E-Mail *</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="ihre@email.de"
            className={errors.email ? 'input-error' : ''}
          />
          {errors.email && <span className="error-message">{errors.email}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="telefon">Telefonnummer (optional)</label>
          <input
            type="tel"
            id="telefon"
            name="telefon"
            value={formData.telefon}
            onChange={handleChange}
            placeholder="+49 123 4567890"
            pattern="[0-9+\s-]*"
            inputMode="tel"
          />
        </div>

        <div className="form-group">
          <label htmlFor="zielort">Ziel Ort *</label>
          <input
            type="text"
            id="zielort"
            name="zielort"
            value={formData.zielort}
            onChange={handleChange}
            placeholder="Ziel Ort dieser Reise"
            className={errors.zielort ? 'input-error' : ''}
          />
          {errors.zielort && <span className="error-message">{errors.zielort}</span>}
        </div>

        <div className="form-group checkbox-group">
          <input
            type="checkbox"
            id="zustimmung"
            name="zustimmung"
            checked={formData.zustimmung}
            onChange={handleChange}
            className={errors.zustimmung ? 'input-error' : ''}
          />
          <label htmlFor="zustimmung">
            Ich stimme den <span className="highlight">AGB</span> und dem <span className="highlight">Datenschutz</span> zu *
          </label>
        </div>
        {errors.zustimmung && <span className="error-message">{errors.zustimmung}</span>}

        <button type="submit" className="submit-button">
          Teilnehmen
        </button>

        {submitError && (
          <div className="form-error-banner">
          {submitError}
        </div>
        )}
      </form>
    </div>
  )
}

export default GiveawayForm
