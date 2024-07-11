import { View, Text, StyleSheet } from 'react-native';
import { Timetable } from './timetable/TimetableWidget';
import { useAuth } from '../authorisation/AuthProvider';
import { Horizontal } from '../components/general/MiscComponents';
import { AccountWidget } from './profile/AccountWidget';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Notes } from './notes/NotesWidget';
import { BouncyPressable } from '../components/pressables/BouncyPressable';
import { deepBlue } from '../utils/constants';
import { AccountHeaderButton } from './profile/AccountHeaderButton';
import { TutorialHeaderButton } from './tutorial/TutorialHeaderButton';
import { useTutorial } from '../providers/useTutorial';
import {
  AllWidgets,
  DisplayedWidgets,
  useWidgetNavigator
} from '../providers/useWidgetNavigator';

export const WidgetContainer = () => {
  const { logout, deleteMe } = useAuth();
  const { activeWidget, setWidget } = useWidgetNavigator();

  const WIDGETS = {
    Schedule: <Timetable />,
    Account: <AccountWidget logout={logout} deleteMe={deleteMe} />,
    Lists: <Notes />,
    Tutorial: null
  };

  return (
    <KeyboardAwareScrollView enableResetScrollToCoords={false}>
      <View style={styles.container}>
        <AppHeaderMenu selected={activeWidget} updateSelected={setWidget} />
        <Horizontal style={styles.headerSeperator} />
        {WIDGETS[activeWidget]}
      </View>
    </KeyboardAwareScrollView>
  );
};

const AppHeaderMenu = ({ selected, updateSelected }) => {
  const { updateTutorial } = useTutorial();

  return (
    <View style={styles.header}>
      {Object.keys(DisplayedWidgets).map((x) => (
        <MenuWidgetButton
          key={x}
          selected={selected}
          onSelect={() => updateSelected(x)}
          title={x}
        />
      ))}
      <TutorialHeaderButton onPress={() => updateTutorial(true)} open={false} />
      <AccountHeaderButton
        onPress={() => updateSelected(AllWidgets.Account)}
        open={selected === AllWidgets.Account}
      />
    </View>
  );
};

export const MenuWidgetButton = ({ selected, onSelect, title }) => {
  return (
    <BouncyPressable
      style={styles.headerTextContainer}
      useTouchableHighlight
      conditionalStyles={
        selected === title && styles.highlightedHeaderTextContainer
      }
      onPress={onSelect}
    >
      <Text
        style={[
          styles.headerText,
          selected === title && styles.highlightedHeaderText
        ]}
      >
        {title}
      </Text>
    </BouncyPressable>
  );
};

const styles = StyleSheet.create({
  container: {
    maxWidth: 800,
    marginVertical: 55,
    marginHorizontal: 10,
    borderRadius: 10,
    shadowColor: 'black',
    shadowRadius: 5,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.8,
    flex: 1,
    paddingVertical: 12,
    backgroundColor: 'rgba(255,255,255,1)',

    flexDirection: 'column'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    height: 50,
    paddingHorizontal: 12,
    gap: 6
  },
  headerSeperator: {
    marginTop: 10,
    borderWidth: 4,
    borderRadius: 20,
    marginHorizontal: 12
  },
  widgetSelect: {},
  headerTextContainer: {
    borderRadius: 10,
    paddingVertical: 4,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    borderColor: 'rgba(50,50,50,0.25)',
    backgroundColor: 'white',
    borderWidth: 1
  },
  highlightedHeaderTextContainer: {
    backgroundColor: deepBlue
  },
  highlightedHeaderText: {
    color: 'white'
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'InterSemi'
  }
});
