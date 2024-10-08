import { useNotifications } from "providers/cloud/useNotifications"
import { useModal } from "providers/overlays/useModal"
import { deepBlue, primaryGreen, white } from 'utils/colours';
import { useMemo } from 'react';
import { DateString } from 'schema/util/dates';
import { formatDateData, localisedFormattedMoment, parseDateString } from 'utils/dates';
import { Notification } from 'schema/notifications';
import PagerView from 'react-native-pager-view';
import { useNoticeboard } from 'providers/cloud/useNoticeboard';
import { View, StyleSheet, Text, Image, TouchableHighlight } from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";

export const Noticeboard = () => {
  const { notices } = useNoticeboard();
  const { updateModal } = useModal();

  return (
    <View style={styles.main}>
      <View style={styles.mainInternal}>
        <PagerView>
          {notices.map((notice) => (
            <View>
              <View>
                <Text>{notice.title}</Text>
                <TouchableHighlight
                  style={styles.closeButton}
                  onPress={() => updateModal(undefined)}
                  underlayColor={'rgba(0,0,0,0.5)'}
                >
                  <AntDesign name="close" color="white" size={18} />
                </TouchableHighlight>
              </View>
              {notice.image_url && 
                <Image src={notice.image_url} />
              }
              <Text>{notice.content}</Text>
            </View>
          ))}
        </PagerView>
      </View>
    </View>
  )

}

const styles = StyleSheet.create({
  main: {
    position: 'absolute',
    width: 350,

    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 10
  },
  mainInternal: {
    maxHeight: 400,
    overflow: 'hidden',
    backgroundColor: white,
    flexDirection: 'column',
    gap: 8,
    borderRadius: 10,
    borderWidth: 3,
    borderColor: 'white',
  },

  closeButton: {
    marginLeft: 'auto',
    padding: 4,
    borderRadius: 8
  },
})