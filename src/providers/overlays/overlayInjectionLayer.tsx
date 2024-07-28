import { MenuProvider } from 'react-native-popup-menu';
import {  useModal } from './useModal';
import { useDrawer } from './useDrawer';
import { BottomSheetModal, BottomSheetModalProvider, BottomSheetView } from '@gorhom/bottom-sheet';
import { useCallback, useEffect, useRef } from 'react';
import { Keyboard, StyleSheet } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

type Props = {
  children: JSX.Element;
}

export const OverlayInjectionLayer = ({ children }: Props) => {
  console.log('rendering overlay injection...')

  const { drawer, minHeight } = useDrawer();
  const { modal } = useModal();

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

  console.log('rendered injection layer')

  return (
    <BottomSheetModalProvider>
      {children}

      {drawer && (
        <BottomSheetModal
          ref={bottomSheetRef}
          enableDynamicSizing
          onChange={handleSheetChanges}
          enablePanDownToClose
          style={styles.bottomSheetWrapper}
        >
          <BottomSheetView style={{ minHeight }}>
            {drawer}
          </BottomSheetView>
        </BottomSheetModal>
      )}

      {modal && (
        <Animated.View 
          style={styles.modalPositioning}
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
  modalPositioning: {
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