// ./services/ShowAllPiniaChanges.ts
//
// STEP0: In the console in a browser on our site: 
// STEP1: getBackground() 
// STEP2: do anything that will impact one or more of the pinia stores
// STEP3: getForeground() 
// STEP4: see the delta

import { useNavStore } from './../stores/useNavStore'
import { useSignupStore } from './../stores/useSignupStore'
import { useAppointmentStore } from './../stores/useAppointmentStore'
import { useLocationStore } from '../stores/useLocationStore'
import { useDocumentStore } from '@telos/shared-lib'
import { useApplicantInfoStore } from '@telos/shared-lib'

type FlatObject = Record<string, any>

let globalBaseline: FlatObject | null = null

function flattener(obj: any, prefix = '', result: FlatObject = {}): FlatObject {
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key]
      const fullKey = prefix ? `${prefix}.${key}` : key

      if (typeof value === 'function') {
        continue
      }

      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        flattener(value, fullKey, result)
      } else {
        result[fullKey] = value
      }
    }
  }
  return result
}

function getBackground() {
  const nav = useNavStore()
  const signup = useSignupStore()
  const appointment = useAppointmentStore()
  const location = useLocationStore()
  const document = useDocumentStore()
  const applicant = useApplicantInfoStore()

  const allStores = { nav, signup, appointment, location, document, applicant }
  globalBaseline = flattener(allStores)
  console.log('[Background set]')
}

function getForeground() {
  if (!globalBaseline) {
    console.warn('[No background set. Run getBackground() first.]')
    return
  }

  const nav = useNavStore()
  const signup = useSignupStore()
  const appointment = useAppointmentStore()
  const location = useLocationStore()
  const document = useDocumentStore()
  const applicant = useApplicantInfoStore()

  const allStores = { nav, signup, appointment, location, document, applicant }
  const current = flattener(allStores)

  const seenKeys: Set<string> = new Set()

  console.log('%c[Delta Report]', 'color: orange; font-weight: bold;')

  for (const k in current) {
    seenKeys.add(k)
    if (!(k in globalBaseline)) {
      console.log(`[DELTA] %cA ${k} : ${JSON.stringify(current[k])}`, 'color: yellow;')
    } else if (current[k] !== globalBaseline[k]) {
      console.log(`[DELTA] %cC ${k}} : ${JSON.stringify(current[k])}`, 'color: darkgray;')
    }
  }

  for (const k in globalBaseline) {
    if (!seenKeys.has(k) && !(k in current)) {
      console.log(`[DELTA] %cM ${k} (was |${JSON.stringify(globalBaseline[k])})|`, 'color: pink;')
    }
  }
  globalBaseline = current
}

declare global {
  interface Window {
    getBackground: () => void
    getForeground: () => void
  }
}

window.getBackground = getBackground
window.getForeground = getForeground
