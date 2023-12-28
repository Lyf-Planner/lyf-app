import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "../authorisation/AuthProvider";
import {
  createItem,
  deleteItem,
  getItems,
  updateItem as updateRemoteItem,
} from "../rest/items";
import { ItemStatus, ListItemType } from "../components/list/constants";
import "react-native-get-random-values";
import { v4 as uuid } from "uuid";
import { formatDateData, getStartOfCurrentWeek } from "../utils/dates";

// Assisted state management via provider
export const ItemsProvider = ({ children }) => {
  const [initialised, setInitialised] = useState(false);
  const [items, setItems] = useState([]);
  const { user, updateUser } = useAuth();

  // Timetable needs to fetch all the list item ids before anything else
  useEffect(() => {
    if (!initialised) {
      getItems(user.timetable.items.map((x) => x.id)).then((results) => {
        // Filter out any old items
        var start = formatDateData(getStartOfCurrentWeek());
        var relevant = results.filter((x) => {
          return !x.date || x.date.localeCompare(start) >= 0;
        });
        setItems(relevant);
        setInitialised(true);

        // Remove items from user that no longer exist or are old - appears as a background task        
        if (user.timetable.items.length !== relevant.length) {
          console.warn("User lost some items!");
          const relevant_ids = relevant.map((x) => x.id);
          var fresh_items = user.timetable.items.filter((x) => {
            relevant_ids.includes(x.id);
          });

          
          updateUser({
            ...user,
            timetable: { ...user.timetable, items: fresh_items },
          });
        }
      });
    }
  }, []);

  const updateItem = (item: any, updateRemote = true) => {
    console.log("Updating item", item.id, "to", item);
    // Update store
    var tmp = [...items];
    var i = tmp.findIndex((x) => x.id === item.id);
    tmp[i] = item;
    setItems(tmp);

    if (updateRemote)
      updateRemoteItem(item).catch(() => {
        // Revert to original if update failed (user will get an Alert)
        console.log("Reverting item to original");
        updateItem(item, false);
      });
  };

  const addItem = async (
    title: string,
    type: ListItemType,
    date: string,
    day: string
  ) => {
    const newItem = {
      id: uuid(),
      title,
      type,
      date,
      day,
      permitted_users: [{ user_id: user.id, permissions: "Owner" }],
      status: ItemStatus.Upcoming,
    };

    // Add to store
    var tmp = [...items];
    tmp.push(newItem);
    setItems(tmp);
    console.log("updated items from addItem");

    // Add ref to user
    tmp = user;
    user.timetable.items.push({ id: newItem.id });
    updateUser(user);
    console.log("updated user from addItem");

    // Upload in background
    createItem(newItem);
  };

  const removeItem = (id: string, deleteRemote = true) => {
    // Remove from this store
    var tmp = [...items] as any;
    var i = tmp.findIndex((x) => x.id === id);
    tmp.splice(i, 1);
    setItems(tmp);

    // Remove ref from user
    tmp = user;
    console.log("user items before removal", tmp.timetable.items);
    i = tmp.timetable.items.findIndex((x) => x.id === id);
    console.log("found item to remove", id, "at index", i);
    tmp.timetable.items.splice(i, 1);
    updateUser(tmp);

    if (deleteRemote) deleteItem(id);
  };

  const EXPOSED = {
    initialised,
    items,
    updateItem,
    addItem,
    removeItem,
  };

  return (
    <ItemsContext.Provider value={EXPOSED}>{children}</ItemsContext.Provider>
  );
};

const ItemsContext = createContext(null);

export const useItems = () => {
  return useContext(ItemsContext);
};
