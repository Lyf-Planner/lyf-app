import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useAuth } from "../authorisation/AuthProvider";
import {
  createItem,
  deleteItem,
  getItems,
  updateItem as updateRemoteItem,
  updateItemSocial as updateRemoteItemSocial,
} from "../rest/items";
import { ItemStatus, ListItemType } from "../components/list/constants";
import { v4 as uuid } from "uuid";
import { formatDateData, getStartOfCurrentWeek } from "../utils/dates";
import "react-native-get-random-values";
import { SocialAction } from "../utils/constants";

// Assisted state management via provider
export const ItemsProvider = ({ children }) => {
  const [initialised, setInitialised] = useState(false);
  const [items, setItems] = useState([]);
  const { user, updateUser } = useAuth();

  // Timetable needs to fetch all the list item ids before anything else
  useEffect(() => {
    if (!initialised) {
      const invites = user.timetable.invited_items.map((x) => {
        return {
          id: x,
        };
      });
      getItems(user.timetable.items.concat(invites).map((x) => x.id)).then(
        (results) => {
          // Sort by created
          results.sort((a, b) =>
            a.created ? a.created.localeCompare(b.created) : 1
          );

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
        }
      );
    }
  }, [user]);

  const updateItem = useCallback(
    async (item, updateRemote = true) => {
      const invited =
        item.invited_users && item.invited_users.find((x) => x === user.id);
      if (invited) return;

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
      const before = tmp[i];
      tmp[i] = item;
      setItems(tmp);

      if (updateRemote) {
        let success = await updateRemoteItem(item);
        if (!success) {
          tmp[i] = before;
          setItems(tmp);
        }
      }
    },
    [items, user]
  );

  const addItem = useCallback(
    async (
      title: string,
      type: ListItemType,
      date: string,
      day: string,
      status: ItemStatus = ItemStatus.Upcoming,
      template_instance?: TemplateInstance
    ) => {
      var newItem = {
        id: template_instance ? template_instance.id : uuid(),
        title,
        type,
        date,
        day,
        permitted_users: [{ user_id: user.id, permissions: "Owner" }],
        notifications: [],
        status,
      } as any;

      // Conditional properties
      if (title[title.length - 1] === "?")
        newItem.status = ItemStatus.Tentative;
      if (template_instance) {
        newItem.template_id = template_instance.template_id;
        newItem.time = template_instance.time;
      }

      // Add to store
      var tmp = [...items];
      tmp.push(newItem);
      setItems(tmp);

      // Add ref to user
      tmp = user;
      user.timetable.items.push({ id: newItem.id });
      updateUser(user);

      // Upload in background
      createItem(newItem);
    },
    [items, user]
  );

  const updateItemSocial = useCallback(
    async (item, user_id, action) => {
      let result = await updateRemoteItemSocial(item.id, user_id, action);
      if (!result) return;

      // If user removed themselves, delete from linked items
      if (
        (action === SocialAction.Remove || action === SocialAction.Decline) &&
        user_id === user.id
      ) {
        // Remove from items and user
        removeItem(item, false);
      } else {
        updateItem({ ...item, ...result }, false);
      }
    },
    [user]
  );

  const removeItem = useCallback(
    async (item, deleteRemote = true) => {
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

      if (deleteRemote) await deleteItem(id);
    },
    [items, user]
  );

  const EXPOSED = {
    initialised,
    items,
    updateItem,
    updateItemSocial,
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
