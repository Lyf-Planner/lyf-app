import { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Text, TouchableHighlight, Platform, Pressable } from 'react-native';

import Animated, { FadeIn } from 'react-native-reanimated';
import Carousel from 'react-native-snap-carousel';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Octicons from 'react-native-vector-icons/Octicons';

import { Notice } from '@/components/Notice';
import { NoticeDbObject } from '@/schema/database/notices';
import { useModal } from '@/shell/useModal'
import { useNoticeboard } from '@/shell/useNoticeboard';
import { black, blackWithOpacity, white } from '@/utils/colours';

const NOTICEBOARD_WIDTH = 350;
const NOTICEBOARD_PADDING = 15;

export const Noticeboard = () => {
  const { notices } = useNoticeboard();
  const { updateModal } = useModal();
  const [page, setPage] = useState(0);
  const carouselRef = useRef<Carousel<NoticeDbObject>>(null);

  useEffect(() => {
    if (Platform.OS === 'web') {
      carouselRef.current?.snapToItem(page)
    }
  }, [page]);

  const Wrapper = Platform.OS === 'web' ? Pressable : View

  return (
    <Wrapper
      style={styles.main}
      onPress={() => {
        if (Platform.OS !== 'web') {
          return;
        }

        if (page === notices.length - 1) {
          updateModal(undefined);
        }

        setPage((page + 1) % notices.length)
      }}
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

        <Carousel
          ref={carouselRef}
          scrollEnabled
          data={notices}
          renderItem={({ item }) => <Notice key={item.id} notice={item} />}
          vertical={false}
          onScrollIndexChanged={(index: number) => setPage(index)}
          itemWidth={NOTICEBOARD_WIDTH - 2 * NOTICEBOARD_PADDING}
          sliderWidth={NOTICEBOARD_WIDTH - 2 * NOTICEBOARD_PADDING}
        />

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
    </Wrapper>
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
    justifyContent: 'center',
    position: 'absolute',
    shadowColor: black,

    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    width: NOTICEBOARD_WIDTH
  },
  mainInternal: {
    backgroundColor: white,
    borderColor: blackWithOpacity(0.5),
    borderRadius: 10,
    borderWidth: 2,
    flexDirection: 'column',
    gap: 16,

    overflow: 'hidden',
    padding: NOTICEBOARD_PADDING
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
