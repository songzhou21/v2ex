import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

import { storage } from './storage'

export type HomeTab = {
  title: string
  key: string
}

export const allHomeTabs: HomeTab[] = [
  { title: '最近', key: 'recent' },
  { title: '最热', key: 'hot' },
  { title: '技术', key: 'tech' },
  { title: '创意', key: 'creative' },
  { title: '好玩', key: 'play' },
  { title: 'Apple', key: 'apple' },
  { title: '酷工作', key: 'jobs' },
  { title: '交易', key: 'deals' },
  { title: '城市', key: 'city' },
  { title: '问与答', key: 'qna' },
  { title: '全部', key: 'all' },
  { title: 'R2', key: 'r2' },
  { title: '节点', key: 'nodes' },
  { title: '关注', key: 'members' },
  { title: '刚更新', key: 'changes' },
]

export const homeTabsAtom = atomWithStorage<typeof allHomeTabs>(
  'tabs',
  allHomeTabs,
  storage
)

export const homeTabIndexAtom = atom(0)
