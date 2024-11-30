import { createContext, useContext, useState } from 'react';

import env from '@/envManager';
import { getNotices } from '@/rest/public';
import { NoticeDbObject } from '@/schema/database/notices';
import { getAsyncData, storeAsyncData } from '@/utils/asyncStorage';

type Props = {
  children: JSX.Element;
}

interface OpenNoticeboardArgs {
  openNoticeboard: () => void;
}

interface NoticeboardHooks {
  notices: NoticeDbObject[];
  currentVersionNoticeboard: (args: OpenNoticeboardArgs) => Promise<void>;
  checkNoticeboard: (args: OpenNoticeboardArgs) => Promise<void>;
}

export const NoticeboardProvider = ({ children }: Props) => {
  const [notices, setNotices] = useState<NoticeDbObject[]>([]);

  const getSeenNotices = async () => {
    return getAsyncData(`${env.VERSION}-notices`);
  }

  const currentVersionNoticeboard = async ({ openNoticeboard }: OpenNoticeboardArgs) => {
    const notices = await getNotices(env.VERSION, '');
    setNotices(notices);
    if (notices.length) {
      openNoticeboard();
    }
  }

  const checkNoticeboard = ({ openNoticeboard }: OpenNoticeboardArgs) => getSeenNotices().then(async (seenNotices) => {
    // Change this to '' to see all notices for the current version.
    const excludedNotices = seenNotices || '';
    const notices: NoticeDbObject[] = await getNotices(env.VERSION, excludedNotices);

    // Sort warnings to the front, as they will almost always be added after features / version bumps
    const warningFirstNotices = notices.sort((a, b) => a.type === 'warning' ? -1 : 1)
    setNotices(warningFirstNotices);

    if (notices.length > 0) {
      openNoticeboard();
    }

    // Add any unseen notices we just queried to the seen pile.
    const parsedNotices = seenNotices ? seenNotices.split(',') : [];
    notices.forEach((notice) => {
      if (!parsedNotices.includes(notice.id)) {
        parsedNotices.push(notice.id);
      }
    })

    const serialisedNotices = parsedNotices.join(',');
    await storeAsyncData(`${env.VERSION}-notices`, serialisedNotices);
  });

  const exposed: NoticeboardHooks = {
    notices,
    currentVersionNoticeboard,
    checkNoticeboard
  };

  return (
    <NoticeboardContext.Provider value={exposed}>
      {children}
    </NoticeboardContext.Provider>
  );
};

const NoticeboardContext = createContext<NoticeboardHooks>(undefined as never);

export const useNoticeboard = () => {
  return useContext(NoticeboardContext);
};
