import { Ionicons } from '@expo/vector-icons'
import { pick } from 'lodash-es'
import {
  Pressable,
  PressableProps,
  TextInput,
  TextInputProps,
  ViewStyle,
} from 'react-native'

import { getFontSize } from '@/jotai/fontSacleAtom'
import tw from '@/utils/tw'

export default function SearchBar({
  style,
  editable = true,
  onPress,
  value,
  onChangeText,
  onSubmitEditing,
  autoFocus,
  placeholder,
}: {
  style?: ViewStyle
  editable?: boolean
  onPress?: PressableProps['onPress']
  value?: string
  onChangeText?: TextInputProps['onChangeText']
  onSubmitEditing?: TextInputProps['onSubmitEditing']
  autoFocus?: boolean
  placeholder?: string
}) {
  return (
    <Pressable
      style={tw.style(`flex-row items-center h-9 bg-input rounded-full`, style)}
      onPress={onPress}
    >
      <Ionicons
        name="search"
        size={18}
        color={tw.color(`text-tint-secondary`)}
        style={tw`pl-3`}
      />
      <TextInput
        placeholder={placeholder || '搜索V2EX内容'}
        placeholderTextColor={tw.color(`text-tint-secondary`)}
        style={tw.style(`text-tint-primary px-3 py-1 flex-1`, {
          ...pick(tw.style(getFontSize(5)), ['fontSize']),
          paddingVertical: 0,
        })}
        textAlignVertical="center"
        pointerEvents={editable ? 'auto' : 'none'}
        editable={editable}
        value={value}
        onChangeText={onChangeText}
        autoFocus={autoFocus}
        returnKeyType="search"
        onSubmitEditing={onSubmitEditing}
        autoCapitalize="none"
      />
      {editable && !!value && (
        <Pressable
          onPress={() => {
            onChangeText?.('')
          }}
          style={({ pressed }) =>
            tw.style(
              `h-4 w-4 items-center justify-center rounded-full mr-3`,
              pressed ? `bg-primary` : `bg-primary-focus`
            )
          }
        >
          <Ionicons
            name="close-sharp"
            size={14}
            color={'#fff'}
            style={tw`ml-0.5`}
          />
        </Pressable>
      )}
    </Pressable>
  )
}
