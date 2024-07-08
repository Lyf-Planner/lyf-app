// import { StyleSheet, Text, View, TouchableHighlight } from 'react-native';
// import { useModal } from 'providers/overlays/useModal';
// import { useAuth } from 'providers/cloud/useAuth';
// import { useState } from 'react';
// import { Horizontal } from '../../general/MiscComponents';
// import { FetchUserList } from '../../users/UserList';
// import { UserListContext } from '../../../utils/constants';
// import { SimpleSearch } from '../../fields/SimpleSearch';
// import { ScrollView } from 'react-native-gesture-handler';
// import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
// import AntDesign from 'react-native-vector-icons/AntDesign';
// import { ID } from 'schema/database/abstract';

// type Props = {
//   item_id: ID
// }

// export const AddFriendsModal = ({ item_id }: Props) => {
//   const { user } = useAuth();
//   const { updateModal } = useModal();

//   const [filter, setFilter] = useState(null);

//   const closeModal = () => updateModal(undefined);

//   return (
//     <View style={styles.mainContainer}>
//       <TouchableHighlight
//         style={styles.touchable}
//         onPress={closeModal}
//         underlayColor={'rgba(0,0,0,0.5)'}
//       >
//         <AntDesign name="close" color="rgba(0,0,0,0.5)" size={18} />
//       </TouchableHighlight>
//       <View style={styles.header}>
//         <FontAwesome5Icon name="user-plus" size={40} />
//         <Text style={styles.title}>Invite Friends</Text>
//       </View>
//       <Horizontal style={styles.firstSeperator} />

//       <SimpleSearch search={filter} setSearch={setFilter} />
//       <ScrollView style={styles.userScroll}>
//         <FetchUserList
//           users={user.social.friends}
//           emptyText={
//             filter
//               ? 'No friends match this search :)'
//               : 'Add friends from your profile page :)'
//           }
//           context={UserListContext.Item}
//           item={item}
//         />
//       </ScrollView>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   mainContainer: {
//     backgroundColor: 'white',
//     paddingHorizontal: 20,
//     paddingTop: 20,
//     marginHorizontal: 20,
//     borderColor: 'rgba(0,0,0,0.5)',
//     borderWidth: 1,
//     borderRadius: 10,
//     gap: 10,
//     shadowColor: 'black',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.8,
//     shadowRadius: 10
//   },
//   touchable: { 
//     marginLeft: 'auto', 
//     padding: 4, 
//     borderRadius: 5 
//   },
//   header: {
//     flexDirection: 'column',
//     justifyContent: 'center',
//     alignItems: 'center',
//     gap: 4,
//     marginBottom: 4
//   },
//   firstSeperator: {
//     opacity: 0.25,
//     marginTop: 10,
//     marginBottom: 4,
//     borderWidth: 2
//   },
//   userScroll: { 
//     maxHeight: 250, 
//     padding: 4 
//   },
//   title: { fontSize: 22, fontWeight: '700' },
//   subtitle: {
//     textAlign: 'center',
//     opacity: 0.6,
//     fontWeight: '600',
//     fontSize: 15
//   }
// });
