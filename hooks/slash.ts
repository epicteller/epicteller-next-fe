import { useRouter } from 'next/router';
import { NextRouter } from 'next/dist/client/router';
import _ from 'lodash';

const useSlashRouter = (): NextRouter => {
  const router = useRouter();
  if (!router.isReady) {
    return router;
  }
  const pathNames = router.pathname.split('/');
  if (pathNames.length === 0) {
    return router;
  }
  const regex = /^\[\[?\.\.\.(\w+)]]?$/;
  const match = pathNames[pathNames.length - 1].match(regex);
  if (!match?.length || match?.length < 2) {
    return router;
  }
  const paramKey = match[1];
  const paramValues = router.query[paramKey];
  if (!(paramValues instanceof Array)) {
    return router;
  }
  if (paramValues.length % 2 !== 0) {
    paramValues.push('');
  }
  const chunked = _.chunk(paramValues, 2);
  router.query = { ...router.query, ..._.fromPairs(chunked) };

  return router;
};

export default useSlashRouter;
