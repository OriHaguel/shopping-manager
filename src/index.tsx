import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom'
// import { Provider } from 'react-redux'
// import { store } from './store/store'
// import * as serviceWorkerRegistration from ''

import './assets/styles/main.scss'
import { RootCmp } from './RootCmp'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
// import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
const queryClient = new QueryClient()
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      {/* <Provider store={store}> */}
      <Router>
        <RootCmp />
        {/* <ReactQueryDevtools /> */}
      </Router>
      {/* </Provider> */}
    </QueryClientProvider>
  </StrictMode>,
)
// serviceWorkerRegistration.register()