import { StyleSheet, TouchableHighlight } from 'react-native';

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { deepBlue } from 'utils/colours';

type Props = {
  onPress: () => void,
  open: boolean
}

export const ProfileHeaderButton = ({ onPress, open }: Props) => {
  return (
    <TouchableHighlight
      underlayColor={'rgba(0,0,0,0.4)'}
      style={[
        styles.wrapper,
        {
          backgroundColor: open ? deepBlue : 'white'
        }
      ]}
      onPress={onPress}
    >
      <FontAwesome name="user" size={30} color={open ? 'white' : 'black'} />
    </TouchableHighlight>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    borderColor: 'rgba(0,0,0,0.1)',
    borderRadius: 100,
    borderWidth: 0.5,
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 5,
    width: 50
  }
});
