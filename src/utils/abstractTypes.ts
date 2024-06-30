import { ReactNode } from 'react';
import { SharedValue } from 'react-native-reanimated';

export type LyfElement = ReactNode | SharedValue<ReactNode>

export type ListItem = any;

export type Nullable<T> = {
  [K in keyof T]: T[K] | null | undefined
}

