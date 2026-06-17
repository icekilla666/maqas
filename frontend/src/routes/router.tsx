import { createBrowserRouter } from "react-router-dom";
import Layout from "../components/layout/Layout";
import HomePage from "../pages/Home/HomePage";
import {
  ACCOUNT_PAGE,
  CHATS_PAGE,
  FOLLOWERS_PAGE,
  FOLLOWINGS_PAGE,
  LOGIN_PAGE,
  REGISTRATION_PAGE,
  SETTINGS_PAGE,
  VERIFY_EMAIL_PAGE,
  VERIFY_EMAIL_PENDING_PAGE,
} from "../utils/constants";
import AccountPage from "../pages/Account/AccountPage";
import AuthPage from "../pages/Auth/AuthPage";
import ChatsPage from "../pages/Chats/ChatsPage";
import SettingPage from "../pages/Settings/SettingPage";
import VerifyEmailPage from "../pages/VerifyEmail/VerifyEmailPage";
import VerifyEmailPendingPage from "../pages/VerifyEmail/VerifyEmailPendingPage";
import ProtectedRoute from "./ProtectedRoute";
import FollowPage from "@/pages/Account/FollowPage";

const relativePath = (path: string) => path.slice(1);
export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: relativePath(LOGIN_PAGE), element: <AuthPage /> },
      { path: relativePath(REGISTRATION_PAGE), element: <AuthPage /> },
      { path: relativePath(VERIFY_EMAIL_PAGE), element: <VerifyEmailPage /> },
      {
        path: relativePath(VERIFY_EMAIL_PENDING_PAGE),
        element: <VerifyEmailPendingPage />,
      },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      { index: true, element: <HomePage /> },
      { path: relativePath(ACCOUNT_PAGE), element: <AccountPage /> },

      { path: relativePath(FOLLOWERS_PAGE), element: <FollowPage /> },
      { path: relativePath(FOLLOWINGS_PAGE), element: <FollowPage /> },

      { path: relativePath(CHATS_PAGE), element: <ChatsPage /> },
      { path: relativePath(SETTINGS_PAGE), element: <SettingPage /> },
    ],
  },
]);
