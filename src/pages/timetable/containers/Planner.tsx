// import { useEffect, useMemo, useState } from 'react';
// import { View, Text, StyleSheet, Alert, Pressable } from 'react-native';
// import { dayFromDateString, extendByWeek, formatDate, formatDateData, localisedMoment, parseDateString, upcomingWeek } from '../../../utils/dates';
// import { deepBlue, primaryGreen } from '../../../utils/colours';
// import { BouncyPressable } from '../../../components/pressables/BouncyPressable';
// import { useAuth } from '../../../authorisation/AuthProvider';
// import Entypo from 'react-native-vector-icons/Entypo';
// import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
// import { LocalItem } from 'schema/items';
// import { DayDisplay } from './DayDisplay';
// import { WeekDays } from 'schema/util/dates';

// type Props = {
//   items: LocalItem[]
// }

// export const Planner = ({ items }: Props) => {
//   const { user, updateUser } = useAuth();
  

//   return (
//     <View style={styles.main}>
   

//       {updatingTemplate ? (
        
//       ) : (
//         <View style={styles.weekDaysWrapperView}>
          
//         </View>
//       )}

//       {!updatingTemplate && (
       
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
  
//   infoPressable: {
//     marginLeft: 2,
//     flexDirection: 'row',
//     alignItems: 'center'
//   },
  
   

  
// });
