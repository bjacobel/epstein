import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';

import { BACKEND_URL, SHOW_DEV_TOOLS } from '../constants';

export default new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({
    uri: BACKEND_URL,
    useGETForQueries: true,
  }),
  connectToDevTools: SHOW_DEV_TOOLS,
});
