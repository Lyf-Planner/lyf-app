import { useCallback, useEffect, useRef } from 'react';
import { Keyboard, Platform, Pressable, StyleSheet } from 'react-native';

import { BottomSheetModal, BottomSheetModalProvider, BottomSheetView } from '@gorhom/bottom-sheet';
import Animated, { FadeIn } from 'react-native-reanimated';

import { Noticeboard } from '@/containers/Noticeboard';
import { TutorialOverlay } from '@/pages/Tutorial';
import { useDrawer } from '@/shell/useDrawer';
import { useModal } from '@/shell/useModal';
import { useNoticeboard } from '@/shell/useNoticeboard';
import { useTutorial } from '@/shell/useTutorial';
import { black, blackWithOpacity } from '@/utils/colours';

type Props = {
  children: JSX.Element;
}

// this layer enables the components providers to refer to each other
// without concern for which one wraps the other.
//
// for example, if i mount a modal beside the children in the ModalProvider
// any call inside that Modal to say, a drawer, would be calling on a hook that is not yet provided.
// this layer ensures that hooks are always available within those root components,
// as all providers are present.

export const RootInjectionLayer = ({ children }: Props) => {
  const { drawer, minHeight } = useDrawer();
  const { modal, updateModal } = useModal();
  const { checkNoticeboard } = useNoticeboard();
  const { tutorial } = useTutorial();

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

  // Check the noticeboard
  useEffect(() => {
    checkNoticeboard({
      openNoticeboard: () => updateModal(<Noticeboard />)
    });
  }, []);

  return (
    <BottomSheetModalProvider>
      {tutorial ? <TutorialOverlay /> : children}

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
    shadowColor: black,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.8,
    shadowRadius: 10
  },
  modalMobilePositioning: {
    alignItems: 'center',
    backgroundColor: blackWithOpacity(0.4),
    bottom: 0,
    justifyContent: 'center',
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 50
  },
  modalWebPositioning: {
    alignItems: 'center',
    backgroundColor: blackWithOpacity(0.4),
    flex: 1,
    justifyContent: 'center'
  },
  modalWebWrapper: {
    bottom: 0,
    cursor: 'auto',
    flex: 1,
    flexDirection: 'column',
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 40
  }
});
