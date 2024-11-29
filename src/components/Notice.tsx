import { View, Text, Image, StyleSheet } from 'react-native'

import { NoticeDbObject } from '@/schema/database/notices'

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
  content: {
    fontFamily: 'Lexend',
    fontSize: 16,
    paddingHorizontal: 8
  },

  image: {
    alignSelf: 'center',
    borderRadius: 10,
    height: 160,
    width: 160 * 2
  },

  main: {
    flexDirection: 'column',
    gap: 16
  }
})
