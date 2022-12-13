import { zodResolver } from '@hookform/resolvers/zod'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useAtomValue } from 'jotai'
import { useForm } from 'react-hook-form'
import { View } from 'react-native'

import FormControl from '@/components/FormControl'
import NavBar from '@/components/NavBar'
import RadioButtonGroup from '@/components/RadioButtonGroup'
import StyledButton from '@/components/StyledButton'
import StyledTextInput from '@/components/StyledTextInput'
import { colorSchemeAtom } from '@/jotai/themeAtom'
import { Sov2exArgs } from '@/servicies/sov2ex'
import { RootStackParamList } from '@/types'
import tw from '@/utils/tw'

export default function SearchOptionsScreen() {
  const { params } = useRoute<RouteProp<RootStackParamList, 'SearchOptions'>>()

  const { control, reset, handleSubmit, watch } = useForm({
    resolver: zodResolver(Sov2exArgs),
    defaultValues: params.defaultValues,
  })

  const sort = watch('sort')

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>()

  const colorScheme = useAtomValue(colorSchemeAtom)

  return (
    <View style={tw`bg-body-1 flex-1`} key={colorScheme}>
      <NavBar title="搜索条件" hideSafeTop />
      <View style={tw`flex-1 p-4`}>
        <FormControl
          control={control}
          name="size"
          label="每页查询数量"
          render={({ field: { onChange, onBlur, value } }) => (
            <StyledTextInput
              onBlur={onBlur}
              onChangeText={onChange}
              value={value?.toString()}
              keyboardType="numeric"
              placeholder="默认每页显示 10 条数据，取值范围在 10 ~ 50"
            />
          )}
        />

        <FormControl
          control={control}
          name="node"
          label="查询节点"
          render={({ field: { onChange, onBlur, value } }) => (
            <StyledTextInput
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="为空时，查询全部节点；支持节点名称与 节点 id"
            />
          )}
        />

        <FormControl
          control={control}
          name="username"
          label="指定主题作者"
          render={({ field: { onChange, onBlur, value } }) => (
            <StyledTextInput
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="为空时，查询所有作者；不区分大小写。"
            />
          )}
        />

        <View style={tw`flex-row`}>
          <FormControl
            style={tw`flex-1`}
            control={control}
            name="gte"
            label="发帖起始日期"
            render={({ field: { onChange, onBlur, value } }) => (
              <StyledTextInput
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholder="格式为 YYYY-MM-DD"
              />
            )}
          />

          <FormControl
            style={tw`flex-1 ml-2`}
            control={control}
            name="lte"
            label="发帖的结束日期"
            render={({ field: { onChange, onBlur, value } }) => (
              <StyledTextInput
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholder="格式为 YYYY-MM-DD"
              />
            )}
          />
        </View>

        <View style={tw`flex-row`}>
          <FormControl
            style={tw`flex-1`}
            control={control}
            name="sort"
            label="查询结果排序"
            render={({ field: { onChange, value } }) => (
              <RadioButtonGroup
                options={[
                  { label: '权重', value: 'sumup' },
                  { label: '发帖时间', value: 'created' },
                ]}
                value={value}
                onChange={onChange}
              />
            )}
          />

          {sort === 'created' && (
            <FormControl
              style={tw`flex-1 ml-2`}
              control={control}
              name="order"
              label="发帖时间"
              render={({ field: { onChange, value } }) => (
                <RadioButtonGroup
                  options={[
                    { label: '降序', value: '0' },
                    { label: '升序', value: '1' },
                  ]}
                  value={value}
                  onChange={onChange}
                />
              )}
            />
          )}
        </View>
      </View>

      <View style={tw`flex-row py-4`}>
        <StyledButton
          style={tw`flex-1`}
          shape="rounded"
          size="large"
          ghost
          onPress={() => {
            reset({
              size: 10,
              sort: 'sumup',
              order: '0',
              gte: '',
              lte: '',
            })
          }}
        >
          重置
        </StyledButton>
        <StyledButton
          onPress={() => {
            handleSubmit(values => {
              params.onSubmit(values)
              navigation.goBack()
            })()
          }}
          style={tw`flex-1 ml-2`}
          shape="rounded"
          size="large"
        >
          提交
        </StyledButton>
      </View>
    </View>
  )
}
