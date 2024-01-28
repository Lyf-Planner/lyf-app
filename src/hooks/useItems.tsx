import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "../authorisation/AuthProvider";
import {
  createItem,
  deleteItem,
  getItems,
  updateItem as updateRemoteItem,
} from "../rest/items";
import { ItemStatus, ListItemType } from "../components/list/constants";
import { v4 as uuid } from "uuid";
import { formatDateData, getStartOfCurrentWeek } from "../utils/dates";
import { useDrawer } from "./useDrawer";
import { ListItemDrawer } from "../components/list/ListItemDrawer";
import "react-native-get-random-values";

// Assisted state management via provider
export const ItemsProvider = ({ children }) => {
  const [initialised, setInitialised] = useState(false);
  const [items, setItems] = useState([]);
  const { user, updateUser } = useAuth();
  const { updateDrawer, updateDrawerIndex } = useDrawer();

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
          var fresh_items = user.timetable.items.filter((x) =>
            relevant_ids.includes(x.id)
          );

          updateUser({
            ...user,
            timetable: { ...user.timetable, items: fresh_items },
          });
        }
      });
    }
  }, []);

  const updateItem = (item, updateRemote = true) => {
    // We create localised instances of templates in the planner - if this is one of those then create it
    if (item.localised) {
      console.log("Local item will be created instead of updated");
      addItem(item.title, item.type, item.date, null, item.status, {
        id: item.id,
        template_id: item.template_id,
        time: item.time || null,
      });
      return;
    }

    // Update store
    var tmp = [...items];
    var i = tmp.findIndex((x) => x.id === item.id);
    tmp[i] = item;
    setItems(tmp);

    if (updateRemote) updateRemoteItem(item);
  };

  const addItem = async (
    title: string,
    type: ListItemType,
    date: string,
    day: string,
    status = ItemStatus.Upcoming,
    template_instance?: TemplateInstance
  ) => {
    var newItem = {
      id: template_instance ? template_instance.id : uuid(),
      title,
      type,
      date,
      day,
      permitted_users: [{ user_id: user.id, permissions: "Owner" }],
      // Shortcut: Status initialises as tentative when title concludes with "?"
      status: title[title.length - 1] === "?" ? ItemStatus.Tentative : status,
    } as any;

    if (template_instance) {
      newItem.template_id = template_instance.template_id;
      newItem.time = template_instance.time;
    }

    if (
      user.premium?.enabled &&
      user.premium?.notifications?.event_notifications_enabled
    ) {
      newItem.notifications = [
        {
          user_id: user.id,
          minutes_before:
            user.premium?.notifications?.event_notification_minutes_before,
        },
      ];
    }

    // Add to store
    var tmp = [...items];
    tmp.push(newItem);
    setItems(tmp);

    // Add ref to user
    tmp = user;
    user.timetable.items.push({ id: newItem.id });
    updateUser(user);

    if (items.length === 0) {
      updateDrawer(
        <ListItemDrawer
          initialItem={newItem}
          updateRootItem={updateItem}
          removeItem={() => removeItem(newItem)}
          closeModal={() => updateDrawer(null)}
          updateDrawerIndex={updateDrawerIndex}
        />
      );
    }

    // Upload in background
    createItem(newItem);
  };

  const removeItem = (item, deleteRemote = true) => {
    if (item.template_id) {
      // Dont delete if item template is still active (it will look the same) - just mark as cancelled
      const dontDelete = items
        .map((x) => x.id)
        .find((x) => x === item.template_id);
      if (dontDelete) {
        updateItem({ ...item, status: ItemStatus.Cancelled });
        return;
      }
    }

    var id = item.id;
    // Remove from this store
    var tmp = items.filter((x) => x.id !== id) as any;
    setItems(tmp);

    // Remove ref from user
    tmp = user;
    tmp.timetable.items = tmp.timetable.items.filter((x) => x.id !== id);
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

type TemplateInstance = {
  id: string;
  template_id: string;
  time?: string;
};

export const useItems = () => {
  return useContext(ItemsContext);
};
