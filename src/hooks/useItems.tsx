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
import { SocialAction, arraysEqualAsSets } from "../utils/constants";
import "react-native-get-random-values";

// Assisted state management via provider
export const ItemsProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [syncing, setSyncing] = useState(true);
  const { user, updateUser } = useAuth();

  // Timetable needs to fetch all the list item ids before anything else
  useEffect(() => {
    if (!user) return;
    let itemIds = user.timetable.items.map((x) => x.id);
    let inviteIds = user.timetable.invited_items;
    // Remove any invites accepted as items from the invite list
    inviteIds = inviteIds.filter((x) => !itemIds.includes(x));
    let fetchedIds = itemIds.concat(inviteIds);
    let storeIds = items.map((x) => x.id);

    const itemChanges = !arraysEqualAsSets(fetchedIds, storeIds);
    console.log("Item Changes Detected?", itemChanges);

    console.log("initialising with items", itemIds);

    if (itemChanges) {
      console.log("Syncing Item Store");
      for (let item of fetchedIds) {
        if (!syncing && !storeIds.includes(item))
          console.warn("User is missing the item", item);
      }
      setSyncing(true);

      getItems(fetchedIds).then((results) => {
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

        purgeIrrelevantItems(relevant, fetchedIds);
        setSyncing(false);
      });
    } else {
      setSyncing(false);
    }
  }, [user]);

  const purgeIrrelevantItems = (relevant, fetchedIds) => {
    // Remove items from user that no longer exist or are old - appears as a background task
    if (
      !arraysEqualAsSets(
        relevant.map((x) => x.id),
        fetchedIds
      )
    ) {
      const relevant_ids = relevant.map((x) => x.id);
      var fresh_items = user.timetable.items.filter((x) =>
        relevant_ids.includes(x.id)
      );
      var fresh_invites = user.timetable.invited_items.filter((x) =>
        relevant_ids.includes(x)
      );

      updateUser({
        ...user,
        timetable: {
          ...user.timetable,
          items: fresh_items,
          invited_items: fresh_invites,
        },
      });
    }
  };

  const updateItem = async (item, updateRemote = true) => {
    const invited =
      item.invited_users && item.invited_users.find((x) => x === user.id);
    if (invited) return;

    // We create localised instances of templates in the planner - if this is one of those then create it
    if (item.localised) {
      console.log("Local item will be created instead of updated");
      addItem(item.title, item.type, item.date, null, item.status, {
        id: item.id,
        template_id: item.template_id,
        permitted_users: item.permitted_users,
        time: item.time || null,
      });
      return;
    }

    // Update store
    var tmp = [...items];
    var i = tmp.findIndex((x) => x.id === item.id);
    const before = tmp[i];
    tmp[i] = item;
    tmp.length === 0 && console.error("UPDATE REMOVING ITEMS");
    setItems(tmp);

    if (updateRemote) {
      let success = await updateRemoteItem(item);
      if (!success) {
        tmp[i] = before;
        setItems(tmp);
      }
    }
  };

  const addItem = async (
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
      permitted_users: [
        {
          user_id: user.id,
          displayed_as: user.details?.name || user.id,
          permissions: "Owner",
        },
      ],
      notifications: [],
      status,
    } as any;

    // Conditional properties
    if (title[title.length - 1] === "?") newItem.status = ItemStatus.Tentative;
    if (template_instance) {
      newItem.template_id = template_instance.template_id;
      newItem.time = template_instance.time;
      newItem.permitted_users = template_instance.permitted_users;
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
  };

  const updateItemSocial = async (item, user_id, action) => {
    let result = await updateRemoteItemSocial(item.id, user_id, action);
    if (!result) return;

    // If user removed themselves, delete from linked items
    if (
      (action === SocialAction.Remove || action === SocialAction.Decline) &&
      user_id === user.id
    ) {
      // Remove from items and user
      await removeItem(item, false);
    } else {
      await updateItem({ ...item, ...result }, false);
    }
  };

  const removeItem = async (item, deleteRemote = true) => {
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
  };

  const resortItems = (priorities: string[]) => {
    console.log("resort called with priorities", priorities);

    const sortedItems = items.sort(
      (a, b) => priorities.indexOf(a.id) - priorities.indexOf(b.id)
    );

    console.log(
      "sorted changed items?",
      JSON.stringify(sortedItems) === JSON.stringify(items)
    );
    setItems(sortedItems);

    updateUser({
      ...user,
      timetable: {
        ...user.timetable,
        items: sortedItems.map((x) => ({ id: x.id })),
      },
    });
  };

  const EXPOSED = {
    syncing,
    items,
    updateItem,
    updateItemSocial,
    addItem,
    removeItem,
    resortItems,
  };

  return (
    <ItemsContext.Provider value={EXPOSED}>{children}</ItemsContext.Provider>
  );
};

const ItemsContext = createContext(null);

type TemplateInstance = {
  id: string;
  template_id: string;
  permitted_users: any[];
  time?: string;
};

export const useItems = () => {
  return useContext(ItemsContext);
};
