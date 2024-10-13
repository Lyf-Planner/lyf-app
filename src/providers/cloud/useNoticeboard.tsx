import { createContext, useContext, useEffect, useState } from 'react';
import { getAsyncData, storeAsyncData } from 'utils/asyncStorage';
import env from 'envManager';
import { getNotices } from 'rest/public';
import { NoticeDbObject } from 'schema/database/notices';

type Props = {
  children: JSX.Element;
}

interface CheckNoticeboardArgs {
  openNoticeboard: () => void;
};

interface NoticeboardHooks {
  notices: NoticeDbObject[];
  checkNoticeboard: (args: CheckNoticeboardArgs) => Promise<void>;
}

export const NoticeboardProvider = ({ children }: Props) => {
  const [notices, setNotices] = useState<NoticeDbObject[]>([]);

  const getSeenNotices = async () => { 
    return getAsyncData(`${env.VERSION}-notices`);
  }
  
  const checkNoticeboard = ({ openNoticeboard }: CheckNoticeboardArgs) => getSeenNotices().then(async (seenNotices) => {
    console.debug('SEEN NOTICES ARE', seenNotices);

    // Change this to '' to see all notices for the current version.
    const excludedNotices = seenNotices || '';
    const notices: NoticeDbObject[] = await getNotices(env.VERSION, excludedNotices);
    console.debug('RECEIVED NOTICES', notices);
    setNotices(notices);

    if (notices.length > 0) {
      console.debug('OPENING NOTICEBOARD');
      openNoticeboard();
    } 

    const parsedNotices = seenNotices ? seenNotices.split(',') : [];
    notices.forEach((notice) => {
      if (!parsedNotices.includes(notice.id)) {
        parsedNotices.push(notice.id);
      }
    })

    const serialisedNotices = parsedNotices.join(',');
    console.debug('SETTING SEEN NOTICES AS', serialisedNotices);
    await storeAsyncData(`${env.VERSION}-notices`, serialisedNotices);
  });

  const exposed: NoticeboardHooks = {
    notices,
    checkNoticeboard,
  };

  return (
    <NoticeboardContext.Provider value={exposed}>
      {children}
    </NoticeboardContext.Provider>
  );
};

const NoticeboardContext = createContext<NoticeboardHooks>(undefined as any);

export const useNoticeboard = () => {
  return useContext(NoticeboardContext);
};
