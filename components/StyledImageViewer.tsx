import { Ionicons } from '@expo/vector-icons'
import * as Sharing from 'expo-sharing'
import { ComponentProps } from 'react'
import {
  Image,
  Modal,
  Pressable,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native'
import ImageViewer from 'react-native-image-zoom-viewer'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Toast from 'react-native-toast-message'

import { getFontSize } from '@/jotai/fontSacleAtom'
import { isExpoGo } from '@/utils/isExpoGo'
import { savePicture } from '@/utils/savePicture'
import tw from '@/utils/tw'

import { NAV_BAR_HEIGHT } from './NavBar'
import StyledToast from './StyledToast'

export interface StyledImageViewerProps
  extends Omit<ComponentProps<typeof ImageViewer>, 'onCancel'> {
  visible?: boolean
  onClose?: () => void
}

let FastImage = Image
if (!isExpoGo) {
  FastImage = require('react-native-fast-image')
}

export default function StyledImageViewer({
  visible,
  onClose,
  ...props
}: StyledImageViewerProps) {
  const safeAreaInsets = useSafeAreaInsets()

  return (
    <Modal
      // presentationStyle="fullScreen"
      visible={visible}
      onRequestClose={onClose}
      transparent
    >
      <ImageViewer
        enableSwipeDown
        onCancel={onClose}
        menus={({ cancel, saveToLocal }) => (
          <Pressable onPress={cancel} style={tw`bg-mask absolute inset-0`}>
            <View
              style={tw.style(
                `bg-body-1 absolute bottom-0 inset-x-0 rounded-t-[32px] overflow-hidden`,
                {
                  paddingBottom: safeAreaInsets.bottom,
                }
              )}
            >
              {[
                {
                  label: '分享',
                  value: 'share',
                  onPress: async () => {
                    try {
                      const url = await savePicture(
                        props.imageUrls[props.index!].url
                      )
                      await Sharing.shareAsync(url)
                    } catch (error) {
                      Toast.show({
                        type: 'error',
                        text1:
                          error instanceof Error ? error.message : '分享失败',
                      })
                    }
                  },
                },
                {
                  label: '保存',
                  value: 'saveToLocal',
                  onPress: saveToLocal,
                },
                {
                  label: '取消',
                  value: 'cancel',
                  onPress: cancel,
                },
              ].map(item => (
                <Pressable
                  key={item.value}
                  onPress={item.onPress}
                  style={({ pressed }) =>
                    tw.style(
                      `h-[53px] justify-center items-center border-tint-border border-t border-solid`,
                      pressed && `bg-message-press`
                    )
                  }
                >
                  <Text style={tw`${getFontSize(5)} text-tint-primary`}>
                    {item.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </Pressable>
        )}
        onSave={async url => {
          try {
            await savePicture(url)
            Toast.show({
              type: 'success',
              text1: '保存成功',
            })
          } catch (error) {
            Toast.show({
              type: 'error',
              text1: error instanceof Error ? error.message : '保存失败',
            })
          }
        }}
        renderHeader={() => (
          <View
            style={tw`pt-[${safeAreaInsets.top}px] px-4 z-20 absolute top-0 inset-x-0 flex-row justify-end`}
          >
            <TouchableWithoutFeedback
              onPress={onClose}
              style={tw`h-[${NAV_BAR_HEIGHT}px] justify-center items-center`}
            >
              <Ionicons name="close-sharp" size={24} color={'#fff'} />
            </TouchableWithoutFeedback>
          </View>
        )}
        renderIndicator={(currentIndex, allSize) => (
          <View
            style={tw`pt-[${safeAreaInsets.top}px] px-4 z-10 absolute top-0 inset-x-0 flex-row justify-center`}
          >
            <Text style={tw`text-white ${getFontSize(4)}`}>
              {currentIndex + '/' + allSize}
            </Text>
          </View>
        )}
        renderImage={imageProps => <FastImage {...imageProps} />}
        {...props}
      />

      <StyledToast />
    </Modal>
  )
}
