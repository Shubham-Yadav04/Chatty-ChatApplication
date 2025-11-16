
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter as Router} from 'react-router-dom'
import {WebSocketProvider} from './utils/WebSocketContext.jsx'
import {userStore} from "./utils/UserRedux/UserStore.jsx"
import { Provider } from 'react-redux';
import { CurrentChatProvider } from './utils/CurrentChatContext.jsx'
createRoot(document.getElementById('root')).render(
 
 
    <Router>
     
        
      <Provider store={userStore}>
      <WebSocketProvider >
      <CurrentChatProvider>
 
    <App />
</CurrentChatProvider>
</WebSocketProvider>
  </Provider>
    
    </Router>
 
)
