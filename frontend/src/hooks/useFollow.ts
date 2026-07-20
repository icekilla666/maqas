import type { FollowUser } from "@/types/entities";
import { usersApi } from "@/services/users.api";
import { useEffect, useState } from "react";


const emptyUsers: Record<FollowTab, FollowUser[]> = {
  followers: [],
  followings: [],
};

const emptyFlags: Record<FollowTab, boolean> = {
  followers: false,
  followings: false,
};

const emptyErrors: Record<FollowTab, string> = {
  followers: "",
  followings: "",
};

export const useFollow = (
  initialTab: FollowTab = "followers",
  userId?: string,
) => {
  const [activeTab, setActiveTab] = useState<FollowTab>(initialTab);
  const [usersByTab, setUsersByTab] = useState<Record<FollowTab, FollowUser[]>>(emptyUsers);
  const [loadedTabs, setLoadedTabs] = useState<Record<FollowTab, boolean>>(emptyFlags);
  const [loadingTabs, setLoadingTabs] = useState<Record<FollowTab, boolean>>(emptyFlags);
  const [serverErrors, setServerErrors] = useState<Record<FollowTab, string>>(emptyErrors);

  useEffect(() => {
    if (loadedTabs[activeTab] || loadingTabs[activeTab]) return;

    const fetchFollow = async () => {
      setLoadingTabs((prev) => ({ ...prev, [activeTab]: true }));
      setServerErrors((prev) => ({ ...prev, [activeTab]: "" }));

      try {
        const params = { skip: 0, limit: 20 };
        const users =
          activeTab === "followers"
            ? userId
              ? await usersApi.getUserFollowers(userId, params)
              : await usersApi.getFollowers(params)
            : userId
              ? await usersApi.getUserFollowings(userId, params)
              : await usersApi.getFollowings(params);

        setUsersByTab((prev) => ({ ...prev, [activeTab]: users }));
        setLoadedTabs((prev) => ({ ...prev, [activeTab]: true }));
      } catch (error) {
        console.log(error);
        setServerErrors((prev) => ({
          ...prev,
          [activeTab]: "Не удалось загрузить список",
        }));
        setLoadedTabs((prev) => ({ ...prev, [activeTab]: true }));
      } finally {
        setLoadingTabs((prev) => ({ ...prev, [activeTab]: false }));
      }
    };

    void fetchFollow();
  }, [activeTab, loadedTabs, loadingTabs, userId]);

  return {
    activeTab,
    setActiveTab,
    users: usersByTab[activeTab],
    followers: usersByTab.followers,
    followings: usersByTab.followings,
    isLoading: loadingTabs[activeTab],
    serverError: serverErrors[activeTab],
  };
};
