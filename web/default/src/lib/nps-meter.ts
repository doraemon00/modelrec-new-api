/*
Copyright (C) 2023-2026 QuantumNous

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.

For commercial licensing, please contact support@quantumnous.com
*/
import { useAuthStore } from '@/stores/auth-store'

const NPS_KEY = 'e6da5062ad4111b1'
const NPS_SCRIPT_SRC = 'https://static.npsmeter.cn/npsmeter'
const NPS_SV = '1.02'

interface NpsMeterQueue {
  (...args: unknown[]): void
  q?: unknown[]
}

let scriptLoaded = false

function loadNpsScript() {
  if (scriptLoaded) return
  scriptLoaded = true

  const w = window as unknown as Record<string, NpsMeterQueue>
  const d = document

  w.npsmeter =
    w.npsmeter ||
    function (...args: unknown[]) {
      ;(w.npsmeter.q = w.npsmeter.q || []).push(args)
    }
  ;(window as unknown as { _npsSettings: Record<string, string> })._npsSettings =
    { npssv: NPS_SV }

  const head = d.getElementsByTagName('head')[0]
  const script = d.createElement('script')
  script.async = 1
  script.src =
    NPS_SCRIPT_SRC +
    '.js?sv=' +
    (window as unknown as { _npsSettings: Record<string, string> })._npsSettings
      .npssv +
    '&npsid=' +
    (window as unknown as { _npsSettings: Record<string, string> })._npsSettings
      .npsid
  head.appendChild(script)
}

// Loads the NPS meter (用户调研) script once and triggers the survey with
// the current user's identity when available.
export function initNpsMeter() {
  if (typeof window === 'undefined' || typeof document === 'undefined') return

  loadNpsScript()

  const w = window as unknown as { npsmeter?: NpsMeterQueue }
  const user = useAuthStore.getState().auth.user
  w.npsmeter?.({
    key: NPS_KEY,
    user_id: user?.id != null ? String(user.id) : '',
    user_name: user?.display_name || user?.username || '',
  })
}
