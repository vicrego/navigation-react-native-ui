import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../api/supabase";
import { UserConfig } from "../types/config";

interface UserContextType {
  userId: string | null;
  setUserId: (id: string | null) => void;
  routeData: SavedRoute[]; // Use the interface here
  setRouteData: React.Dispatch<React.SetStateAction<SavedRoute[]>>;
  userSettingsData: UserConfig | null;
  setUserSettingsData: React.Dispatch<React.SetStateAction<UserConfig | null>>;
  refreshUserData: (userId: string) => Promise<void>;
}

interface SavedRoute {
  id: string;
  user_id: string;
  route_name: string;
  distance: number;
  geometry: any; // or your GeoJSON type
  created_at: string;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: any) => {
  const [userId, setUserId] = useState<string | null>(null);
  const [routeData, setRouteData] = useState<SavedRoute[]>([]);
  const [userSettingsData, setUserSettingsData] = useState<UserConfig | null>(
    null,
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Check current session immediately
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUserId(session.user.id);
        refreshUserData(session.user.id); // Trigger data fetch immediately
      }
    });

    // 2. Listen for sign-in/sign-out events
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user) {
          setUserId(session.user.id);
        } else {
          setUserId(null);
        }
      },
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Function to fetch everything at once
  const refreshUserData = async (userId: any) => {
    setLoading(true);

    // Fetch Config and Routes in parallel for speed
    const [routesRes, configRes] = await Promise.all([
      supabase
        .from("saved_routes")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false }),
      supabase.from("user_config").select().eq("user_id", userId).single(), // This turns the array into a single object automatically
    ]);
    if (routesRes.data) setRouteData(routesRes.data);
    if (configRes) setUserSettingsData(configRes.data);

    setLoading(false);
  };

  return (
    <UserContext.Provider
      value={{
        userId,
        setUserId,
        routeData,
        setRouteData,
        userSettingsData,
        setUserSettingsData,
        refreshUserData,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
