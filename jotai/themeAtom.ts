import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import { AppState, Appearance } from 'react-native'

import tw from '@/utils/tw'

import { storage } from './storage'
import { store } from './store'

export type ThemeScheme = 'light' | 'dark' | 'system'

const baseThemeAtom = atomWithStorage<ThemeScheme>('theme', 'system', storage)

export const themeAtom = atom(
  get => get(baseThemeAtom),
  (get, set, update) => {
    const nextValue =
      typeof update === 'function' ? update(get(baseThemeAtom)) : update
    tw.setColorScheme(getColorScheme(nextValue))
    set(baseThemeAtom, nextValue)
  }
)

const forceUpdateColorSchemeAtom = atom(0)

export const colorSchemeAtom = atom<'light' | 'dark'>(get => {
  get(forceUpdateColorSchemeAtom)
  return getColorScheme(get(baseThemeAtom))
})

function getColorScheme(theme: ThemeScheme) {
  return theme === 'system' ? Appearance.getColorScheme() || 'light' : theme
}

function handleColorSchemeChange() {
  const systemColorScheme = Appearance.getColorScheme()
  const theme = store.get(themeAtom)
  const colorScheme = store.get(colorSchemeAtom)

  if (
    AppState.currentState !== 'background' &&
    theme === 'system' &&
    colorScheme !== systemColorScheme
  ) {
    tw.setColorScheme(getColorScheme(store.get(baseThemeAtom)!))
    store.set(forceUpdateColorSchemeAtom, prev => ++prev)
  }
}

Appearance.addChangeListener(handleColorSchemeChange)
AppState.addEventListener('change', handleColorSchemeChange)
