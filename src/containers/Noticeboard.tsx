import { useRef, useState } from 'react';
import { View, StyleSheet, Text, TouchableHighlight } from 'react-native';

import PagerView from 'react-native-pager-view';
import Animated, { FadeIn } from 'react-native-reanimated';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Octicons from 'react-native-vector-icons/Octicons';

import { BouncyPressable } from '@/components/BouncyPressable';
import { Notice } from '@/components/Notice';
import { useModal } from '@/shell/useModal'
import { useNoticeboard } from '@/shell/useNoticeboard';
import { black, blackWithOpacity, white } from '@/utils/colours';

export const Noticeboard = () => {
  const { notices } = useNoticeboard();
  const { updateModal } = useModal();
  const [page, updatePage] = useState(0);
  const pagerRef = useRef<PagerView>(null);

  return (
    <BouncyPressable
      onPress={() => {
        pagerRef.current?.setPage((page + 1) % notices.length)
      }}
      onLongPress={() => updateModal(undefined)}
      containerStyle={styles.main}
      bounceScale={0.95}
    >
      <View style={styles.mainInternal}>
        <Animated.View
          style={styles.header}
          key={page}
          entering={FadeIn}
        >
          <Text style={styles.title}>
            {notices[page].title}
          </Text>
          <TouchableHighlight
            style={styles.closeButton}
            onPress={() => updateModal(undefined)}
            underlayColor={'rgba(0,0,0,0.5)'}
          >
            <AntDesign name="close" color="black" size={20} />
          </TouchableHighlight>
        </Animated.View>

        <PagerView
          ref={pagerRef}
          initialPage={page}
          onPageSelected={(event) => updatePage(event.nativeEvent.position)}
        >
          {notices.map((notice) => (
            <Notice key={notice.id} notice={notice} />
          ))}
        </PagerView>
        <View style={styles.pageIndicatorRow}>
          {notices.map((notice, index) => (
            <Octicons
              key={notice.id}
              name="dot-fill"
              color={index === page ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.2)'}
              size={index === page ? 22 : 20}
            />
          ))}
        </View>
      </View>
    </BouncyPressable>
  )
}

const styles = StyleSheet.create({
  closeButton: {
    borderRadius: 8,
    marginLeft: 'auto',
    padding: 4
  },
  header: {
    flexDirection: 'row',
    paddingLeft: 4
  },

  main: {
    position: 'absolute',
    shadowColor: black,

    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    width: 325
  },
  mainInternal: {
    backgroundColor: white,
    borderColor: blackWithOpacity(0.5),
    borderRadius: 10,
    borderWidth: 2,
    flexDirection: 'column',
    gap: 16,

    overflow: 'hidden',
    padding: 16
  },
  pageIndicatorRow: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center'
  },

  title: {
    fontFamily: 'Lexend',
    fontSize: 22,
    fontWeight: '600'
  }
})
