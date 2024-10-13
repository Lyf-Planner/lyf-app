import { useNotifications } from "providers/cloud/useNotifications"
import { useModal } from "providers/overlays/useModal"
import { deepBlue, primaryGreen, white } from 'utils/colours';
import { useMemo, useRef, useState } from 'react';
import { DateString } from 'schema/util/dates';
import { formatDateData, localisedFormattedMoment, parseDateString } from 'utils/dates';
import { Notification } from 'schema/notifications';
import PagerView from 'react-native-pager-view';
import { useNoticeboard } from 'providers/cloud/useNoticeboard';
import { View, StyleSheet, Text, Image, TouchableHighlight } from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";
import { Notice } from "./Notice";
import { BouncyPressable } from "components/pressables/BouncyPressable";
import Octicons from "react-native-vector-icons/Octicons";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

export const Noticeboard = () => {
  const { notices } = useNoticeboard();
  const { updateModal } = useModal();
  const [page, updatePage] = useState(0);
  const pagerRef = useRef<any>();

  return (
    <BouncyPressable 
      onPress={() => {
        pagerRef.current.setPage((page + 1) % notices.length)
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
          exiting={FadeOut}
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
            <Notice notice={notice} />
          ))}
        </PagerView>
        <View style={styles.pageIndicatorRow}>
          {notices.map((_notice, index)=> (
            <Octicons
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
  main: {
    position: 'absolute',
    width: 325,

    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 10
  },
  mainInternal: {
    overflow: 'hidden',
    backgroundColor: white,
    flexDirection: 'column',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'rgba(0,0,0,0.5)',

    padding: 16,
    gap: 16,
  },

  header: {
    flexDirection: 'row',
    paddingLeft: 4,
  },
  title: {
    fontFamily: 'Lexend',
    fontWeight: '600',
    fontSize: 22,
  },
  closeButton: {
    marginLeft: 'auto',
    padding: 4,
    borderRadius: 8
  },

  pageIndicatorRow: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
  }
})