
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter as Router} from 'react-router-dom'
import {WebSocketProvider} from './utils/WebSocketContext.jsx'
import {userStore} from "./utils/UserRedux/UserStore.jsx"
import { Provider } from 'react-redux';
import { CurrentChatProvider } from './utils/CurrentChatContext.jsx'
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
const queryClient= new QueryClient();
createRoot(document.getElementById('root')).render(
 
 
    <Router>
     
          <QueryClientProvider client={queryClient}>
      <Provider store={userStore}>
      <WebSocketProvider >
      <CurrentChatProvider>
    <App />
    <ReactQueryDevtools initialIsOpen={false} />
</CurrentChatProvider>
</WebSocketProvider>
  </Provider>
      </QueryClientProvider>
    </Router>
 
)
