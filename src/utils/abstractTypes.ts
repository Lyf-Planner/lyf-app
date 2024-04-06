import { ReactNode } from "react";
import { SharedValue } from "react-native-reanimated";

export type LyfElement = ReactNode | SharedValue<ReactNode>

export type ListItem = any;