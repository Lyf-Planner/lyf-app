import { useModal } from "providers/overlays/useModal";
import { View, Text, TouchableHighlight, Image, StyleSheet } from "react-native"
import AntDesign from "react-native-vector-icons/AntDesign"
import { NoticeDbObject } from "schema/database/notices"
import { LyfIcon } from "schema/util/images";

type Props = {
  notice: NoticeDbObject;
}

export const Notice = ({ notice }: Props) => {
  return (
    <View style={styles.main}>
      {notice.image_url && 
        <Image source={{ uri: notice.image_url }} style={styles.image} />
      }
      <Text style={styles.content}>{notice.content}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  main: {
    flexDirection: 'column',
    gap: 16,
  },

  image: {
    alignSelf: 'center',
    borderRadius: 10,
    width: 140 * 2,
    height: 140
  },

  content: {
    fontFamily: 'Lexend',
    fontSize: 16,
    paddingHorizontal: 8
  }
})