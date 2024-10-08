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

    const notices: NoticeDbObject[] = await getNotices(env.VERSION, seenNotices || '');
    notices.push({ // TODO Remove when done testing
      id: 'test',
      version: '2.0.4',
      created: new Date(),
      last_updated: new Date(),
      type: 'feature',
      title: "What's New?",
      content: "Hold down your day when you're all done, to move to the next!",
      image_url: 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.slideshare.net%2Fslideshow%2F4x3-slide-test%2F79261450&psig=AOvVaw156AiWDxJUUtZBMwBJxG8H&ust=1728469431137000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCODR-MXI_ogDFQAAAAAdAAAAABAK'
    })
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
