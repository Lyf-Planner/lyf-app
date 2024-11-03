import { MenuProvider } from 'react-native-popup-menu';
import {  useModal } from './useModal';
import { useDrawer } from './useDrawer';
import { BottomSheetModal, BottomSheetModalProvider, BottomSheetView } from '@gorhom/bottom-sheet';
import { useCallback, useEffect, useRef } from 'react';
import { Keyboard, Platform, Pressable, StyleSheet } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

type Props = {
  children: JSX.Element;
}

export const OverlayInjectionLayer = ({ children }: Props) => {
  const { drawer, minHeight } = useDrawer();
  const { modal, updateModal } = useModal();

  const bottomSheetRef = useRef<BottomSheetModal>(null);

  // callbacks
  const handlePresentModalPress = useCallback(() => {
    bottomSheetRef.current?.present();
  }, [bottomSheetRef]);
  const handleSheetChanges = useCallback((index: number) => {}, []);

  useEffect(() => {
    if (drawer) {
      handlePresentModalPress();
    }
    Keyboard.dismiss();
  }, [drawer]);

  return (
    <BottomSheetModalProvider>
      {children}

      {drawer && (
        <BottomSheetModal
          ref={bottomSheetRef}
          enableDynamicSizing
          index={1}
          snapPoints={['35%']}
          onChange={handleSheetChanges}
          enablePanDownToClose
          style={styles.bottomSheetWrapper}
        >
          <BottomSheetView style={{ minHeight }}>
            {drawer}
          </BottomSheetView>
        </BottomSheetModal>
      )}

      {modal && Platform.OS === 'web' && (
        <Pressable 
          style={styles.modalWebWrapper}
          onPress={() => updateModal(undefined)}
        >
          <Animated.View 
            style={styles.modalWebPositioning}
            entering={FadeIn.duration(150)}
          >
            {modal}
          </Animated.View>
        </Pressable>
      )}

      {modal && Platform.OS !== 'web' && (
        <Animated.View 
          style={styles.modalMobilePositioning}
          entering={FadeIn.duration(150)}
        >
          {modal}
        </Animated.View>
      )}
    </BottomSheetModalProvider>
  );
};

const styles = StyleSheet.create({
  bottomSheetWrapper: {
    shadowColor: 'black',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.8,
    shadowRadius: 10
  },
  modalWebWrapper: {
    flex: 1,
    position: 'absolute',
    zIndex: 40,
    flexDirection: 'column',
    top: 0,
    bottom: 0,
    left: 0, 
    right: 0,
    cursor: 'auto'
  },
  modalWebPositioning: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)'
  },
  modalMobilePositioning: {
    zIndex: 50,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)'
  }
});