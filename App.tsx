import { ActionSheetProvider } from '@expo/react-native-action-sheet'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import * as SplashScreen from 'expo-splash-screen'
import { StatusBar } from 'expo-status-bar'
import { Provider, useAtom, useAtomValue } from 'jotai'
import { waitForAll } from 'jotai/utils'
import { ReactElement, ReactNode, Suspense, useMemo } from 'react'
import { LogBox } from 'react-native'
import 'react-native-gesture-handler'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import Toast from 'react-native-toast-message'
import { useDeviceContext } from 'twrnc'

import StyledImageViewer from './components/StyledImageViewer'
import StyledToast from './components/StyledToast'
import { deviceTypeAtom } from './jotai/deviceTypeAtom'
import { enabledAutoCheckinAtom } from './jotai/enabledAutoCheckinAtom'
import { enabledMsgPushAtom } from './jotai/enabledMsgPushAtom'
import { enabledParseContentAtom } from './jotai/enabledParseContent'
import { fontScaleAtom } from './jotai/fontSacleAtom'
import { imageViewerAtom } from './jotai/imageViewerAtom'
import { profileAtom } from './jotai/profileAtom'
import { store } from './jotai/store'
import { colorSchemeAtom } from './jotai/themeAtom'
import Navigation, { isReadyNavigation } from './navigation'
import { useCheckin } from './servicies/member'
import { useNodes } from './servicies/node'
import './utils/dayjsPlugins'
// import { enabledNetworkInspect } from './utils/enabledNetworkInspect'
import { asyncStoragePersister, queryClient } from './utils/query'
import tw from './utils/tw'

SplashScreen.preventAutoHideAsync()

LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
  'Sending',
])

// enabledNetworkInspect()

export default function AppWithSuspense() {
  return (
    <Suspense>
      <App />
    </Suspense>
  )
}

function App() {
  return (
    <ActionSheetProvider>
      <Provider unstable_createStore={() => store}>
        <PersistQueryClientProvider
          client={queryClient}
          persistOptions={{ persister: asyncStoragePersister }}
          onSuccess={() => isReadyNavigation.then(SplashScreen.hideAsync)}
        >
          <SafeAreaProvider>
            <Suspense>
              <AppInitializer>
                <Navigation />
                <StatusBar />
                <GlobalImageViewer />
              </AppInitializer>
            </Suspense>

            <StyledToast />
          </SafeAreaProvider>
        </PersistQueryClientProvider>
      </Provider>
    </ActionSheetProvider>
  )
}

function AppInitializer({ children }: { children: ReactNode }) {
  const [colorScheme, profile, enabledAutoCheckin] = useAtomValue(
    waitForAll([
      colorSchemeAtom,
      profileAtom,
      enabledAutoCheckinAtom,
      enabledMsgPushAtom,
      fontScaleAtom,
      enabledParseContentAtom,
      deviceTypeAtom,
    ])
  )

  useMemo(() => {
    tw.setColorScheme(colorScheme)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useDeviceContext(tw, { withDeviceColorScheme: false })

  useCheckin({
    onSuccess(amount = 0) {
      if (amount > 0) {
        Toast.show({
          type: 'success',
          text1: `自动签到成功`,
          text2: `已领取 ${amount} 铜币`,
        })
      }
    },
    enabled: !!profile && enabledAutoCheckin,
  })

  useNodes()

  return children as ReactElement
}

function GlobalImageViewer() {
  const [imageViewer, setImageViewer] = useAtom(imageViewerAtom)
  return (
    <StyledImageViewer
      {...imageViewer}
      onClose={() =>
        setImageViewer({ visible: false, index: 0, imageUrls: [] })
      }
    />
  )
}
