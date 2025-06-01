import AppRoutes from "./routes/AppRoutes"
import { PersistGate } from "redux-persist/integration/react"
import { store,presistor } from "./redux/store/store"
import { Provider } from "react-redux"
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const App = () => {
  return (
    <Provider store={store}>
            <ToastContainer position="top-right" autoClose={3000} theme="colored" />
      <PersistGate loading={null} persistor={presistor}>
        <AppRoutes />
      </PersistGate>
    </Provider>


  )
}

export default App