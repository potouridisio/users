import React from 'react';
import { RecoilRoot } from 'recoil';
import { SWRConfig } from 'swr';

import CssBaseline from '@material-ui/core/CssBaseline';

import { Home } from './components/Home';
import axios from './utils/axios';

function App() {
  return (
    <React.Fragment>
      <CssBaseline />
      <SWRConfig value={{ fetcher: axios }}>
        <RecoilRoot>
          <Home />
        </RecoilRoot>
      </SWRConfig>
    </React.Fragment>
  );
}

export default App;
