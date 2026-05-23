import { AppRouter } from "./routes/AppRouter";
import { useAuth } from "./hooks/useAuth";
import Loader from "./components/Loader";
import { useEffect } from "react";
import { initSocket, disconnectSocket } from "./services/socket.service";
import { useCallStore } from "./utils/call.store";
import { CallPage } from "./pages/CallPage";

function App() {
  const { loading, user } = useAuth();

  const incomingCall = useCallStore((s) => s.incomingCall);
  const callAccepted = useCallStore((s) => s.callAccepted);
  const isCalling = useCallStore((s) => s.isCalling);

  useEffect(() => {
    if (user?._id) {
      initSocket(user._id);
    }

    return () => {
      disconnectSocket();
    };
  }, [user?._id]);

  if (loading) {
    return <Loader />;
  }

  const showCall = incomingCall || callAccepted || isCalling;

  return (
    <>
      <AppRouter />
      {showCall && <CallPage />}
    </>
  );
}

export default App;
