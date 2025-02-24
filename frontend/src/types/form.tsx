export type RegisterFormValues = {
  name: string
  email: string
  password: string
  confirmPassword: string
}

export type LoginFormValues = {
  email: string
  password: string
}

export type ForgetPasswordFormValues = {
  email: string
}

export type ResetPasswordFormValues = {
  password: string
}

export type MedicationFormValues = {
  name: string
  composition?: string
  type?: string
  dailyFrequency: number
  timings?: string[]
  dosage?: number
}

export type ProfileFormValues = {
  name: string
  relation: string
  medications: MedicationFormValues[]
}
