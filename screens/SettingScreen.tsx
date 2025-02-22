import {
  Feather,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { sleep } from '@tanstack/query-core/build/lib/utils'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { RESET } from 'jotai/utils'
import { Fragment } from 'react'
import { Platform, ScrollView, Switch, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Toast from 'react-native-toast-message'

import ListItem from '@/components/ListItem'
import NavBar, { useNavBarHeight } from '@/components/NavBar'
import { withQuerySuspense } from '@/components/QuerySuspense'
import RadioButtonGroup from '@/components/RadioButtonGroup'
import StyledBlurView from '@/components/StyledBlurView'
import StyledButton from '@/components/StyledButton'
import StyledImage from '@/components/StyledImage'
import v2exMessage from '@/components/V2exWebview/v2exMessage'
import { deletedNamesAtom } from '@/jotai/deletedNamesAtom'
import { isTabletAtom } from '@/jotai/deviceTypeAtom'
import { enabledAutoCheckinAtom } from '@/jotai/enabledAutoCheckinAtom'
import { enabledMsgPushAtom } from '@/jotai/enabledMsgPushAtom'
import { enabledParseContentAtom } from '@/jotai/enabledParseContent'
import { fontScaleAtom, getFontSize } from '@/jotai/fontSacleAtom'
import { profileAtom } from '@/jotai/profileAtom'
import { store } from '@/jotai/store'
import { colorSchemeAtom, themeAtom } from '@/jotai/themeAtom'
import { useSignout } from '@/servicies/authentication'
import { confirm } from '@/utils/confirm'
import { clearCookie } from '@/utils/cookie'
import { isExpoGo } from '@/utils/isExpoGo'
import { queryClient } from '@/utils/query'
import tw from '@/utils/tw'

export default withQuerySuspense(SettingScreen)

let FastImage: any
if (!isExpoGo) {
  FastImage = require('react-native-fast-image')
}

function SettingScreen() {
  const navbarHeight = useNavBarHeight()

  const profile = useAtomValue(profileAtom)

  const navigation = useNavigation()

  const [enabledAutoCheckin, setEnabledAutoCheckin] = useAtom(
    enabledAutoCheckinAtom
  )

  const [enabledMsgPush, setEnabledMsgPush] = useAtom(enabledMsgPushAtom)

  const [fontScale, setFontScale] = useAtom(fontScaleAtom)

  const [enabledParseContent, setEnabledParseContent] = useAtom(
    enabledParseContentAtom
  )

  const isTablet = useAtomValue(isTabletAtom)

  const colorScheme = useAtomValue(colorSchemeAtom)

  const [theme, setTheme] = useAtom(themeAtom)

  const isSignined = !!profile?.once

  const safeAreaInsets = useSafeAreaInsets()

  return (
    <View style={tw`flex-1`}>
      <ScrollView
        contentContainerStyle={{
          paddingTop: navbarHeight,
        }}
      >
        <View style={tw`px-4 pt-3 pb-3 flex-row`}>
          <StyledImage
            style={tw`w-12 h-12 mr-3 rounded`}
            source={{
              uri: `https://cdn.v2ex.com/navatar/c81e/728d/2_large.png?m=1497247332`,
            }}
          />

          <View style={tw`flex-1`}>
            <Text style={tw`text-tint-primary ${getFontSize(4)} font-semibold`}>
              V2EX
            </Text>
            <Text style={tw`text-tint-primary ${getFontSize(5)} mt-1`}>
              创意工作者们的社区
            </Text>
          </View>
        </View>

        {isSignined && (
          <Fragment>
            <ListItem
              label="自动签到"
              icon={
                <MaterialCommunityIcons
                  color={tw.color(`text-tint-primary`)}
                  size={24}
                  name={'calendar-check'}
                />
              }
              action={
                <Switch
                  value={enabledAutoCheckin}
                  trackColor={
                    Platform.OS === 'android'
                      ? undefined
                      : { true: `rgb(26,140,216)` }
                  }
                  onValueChange={() =>
                    setEnabledAutoCheckin(!enabledAutoCheckin)
                  }
                />
              }
              pressable={false}
            />

            <ListItem
              label="消息通知"
              icon={
                <MaterialCommunityIcons
                  color={tw.color(`text-tint-primary`)}
                  size={24}
                  name={'bell-outline'}
                />
              }
              action={
                <Switch
                  value={enabledMsgPush}
                  trackColor={
                    Platform.OS === 'android'
                      ? undefined
                      : { true: `rgb(26,140,216)` }
                  }
                  onValueChange={() => setEnabledMsgPush(!enabledMsgPush)}
                />
              }
              pressable={false}
            />
          </Fragment>
        )}

        <ListItem
          label="内容解析"
          icon={
            <Feather
              color={tw.color(`text-tint-primary`)}
              size={24}
              name={'image'}
            />
          }
          action={
            <Switch
              value={enabledParseContent}
              trackColor={
                Platform.OS === 'android'
                  ? undefined
                  : { true: `rgb(26,140,216)` }
              }
              onValueChange={async () => {
                try {
                  if (enabledParseContent)
                    await confirm(
                      '内容解析',
                      '关闭后将不会自动解析回复中的Base64和图片URL、![]()、<img />'
                    )
                  setEnabledParseContent(!enabledParseContent)
                } catch (error) {
                  // empty
                }
              }}
            />
          }
          pressable={false}
        />

        <ListItem
          label="字体大小"
          icon={
            <MaterialCommunityIcons
              color={tw.color(`text-tint-primary`)}
              size={24}
              name={'format-font'}
            />
          }
          action={
            <RadioButtonGroup
              options={[
                { label: '小', value: 'small' },
                { label: '中', value: 'medium' },
                { label: '大', value: 'large' },
                { label: '超大', value: 'super' },
              ]}
              value={fontScale}
              onChange={setFontScale}
            />
          }
          pressable={false}
        />

        {isTablet && (
          <ListItem
            label="外观"
            icon={
              <Feather
                color={tw.color(`text-tint-primary`)}
                size={24}
                name={colorScheme === 'light' ? 'sun' : 'moon'}
              />
            }
            action={
              <RadioButtonGroup
                options={[
                  { label: '浅色', value: 'light' },
                  { label: '深色', value: 'dark' },
                  { label: '系统', value: 'system' },
                ]}
                value={theme}
                onChange={setTheme}
              />
            }
          />
        )}

        <ListItem
          label="问题反馈"
          icon={
            <Feather
              color={tw.color(`text-tint-primary`)}
              size={24}
              name="github"
            />
          }
          onPress={() => {
            navigation.navigate('Webview', {
              url: 'https://github.com/liaoliao666/v2ex/issues',
            })
          }}
        />

        <ListItem
          label="社区排行"
          icon={
            <Ionicons
              color={tw.color(`text-tint-primary`)}
              size={24}
              name={'md-analytics-outline'}
            />
          }
          onPress={() => {
            navigation.navigate('Rank')
          }}
        />

        {isSignined && (
          <ListItem
            label="屏蔽列表"
            icon={
              <MaterialIcons
                color={tw.color(`text-tint-primary`)}
                size={24}
                name={'block'}
              />
            }
            onPress={() => {
              navigation.navigate('BlankList')
            }}
          />
        )}

        <ListItem
          label="清除缓存"
          icon={
            <MaterialCommunityIcons
              color={tw.color(`text-tint-primary`)}
              size={24}
              name="delete-empty-outline"
            />
          }
          onPress={async () => {
            try {
              await confirm(`确认清除缓存吗？`, `该动作会导致删除所有缓存数据`)
              queryClient.removeQueries()
              FastImage?.clearDiskCache?.()
              Toast.show({
                type: 'success',
                text1: `清除缓存成功`,
              })
            } catch (error) {
              // empty
            }
          }}
        />

        {isSignined && Platform.OS === 'ios' && (
          <ListItem
            label="注销帐号"
            icon={
              <Feather
                color={tw.color(`text-tint-primary`)}
                size={24}
                name={'delete'}
              />
            }
            onPress={async () => {
              try {
                await confirm(`确定注销当前账号 ${profile.username} 么？`)
                await sleep(500)
                Toast.show({
                  type: 'success',
                  text1: `注销成功`,
                })
                store.set(deletedNamesAtom, prev => [
                  ...new Set([...prev, profile.username]),
                ])
                store.set(profileAtom, RESET)
              } catch (error) {}
            }}
          />
        )}
      </ScrollView>

      <View style={tw`px-4 pt-4 pb-[${Math.max(safeAreaInsets.bottom, 16)}px]`}>
        {isSignined ? (
          <SignoutItem once={profile.once!} />
        ) : (
          <StyledButton
            onPress={() => {
              navigation.navigate('Login')
            }}
            size="large"
            shape="rounded"
          >
            登录
          </StyledButton>
        )}
      </View>

      <View style={tw`absolute top-0 inset-x-0`}>
        <StyledBlurView style={tw`absolute inset-0`} />
        <NavBar title="更多选项" />
      </View>
    </View>
  )
}

function SignoutItem({ once }: { once: string }) {
  const { isLoading, mutateAsync } = useSignout({
    onError: () => {},
  })

  const setProfileAtom = useSetAtom(profileAtom)

  async function logout() {
    try {
      if (isLoading) return
      await mutateAsync({ once })
    } catch (error) {
      // empty
    } finally {
      await clearCookie()
      await setProfileAtom(RESET)
      v2exMessage.reloadWebview()
    }
  }

  return (
    <StyledButton onPress={logout} size="large" shape="rounded">
      退出登录
    </StyledButton>
  )
}
