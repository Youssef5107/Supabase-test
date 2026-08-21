import { useEffect, useState } from "react";
import TasksManger from "./components/TasksManger";
import AuthModal from "./components/authModal";
import { supabase } from "./supabase-client";

export default function App() {
  const [session, setSession] = useState(null);

  const fetchSession = async () => {
    const currentSession = await supabase.auth.getSession();
    console.log(currentSession);
    setSession(currentSession.data.session);
  };

  useEffect(() => {
    setTimeout(() => {
      fetchSession();
    }, 0);
    const { data: authListner } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      },
    );
    return () => {
      authListner.subscription.unsubscribe();
    };
  }, []);

  return <>{session ? <TasksManger session={session} /> : <AuthModal />}</>;
}
