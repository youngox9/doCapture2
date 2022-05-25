import React from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import ProfileButton from "@/components/ProfileButton";
import ThemeButton from "@/components/ThemeButton";
import NotifyButton from "@/components/NotifyButton";
import GlobalButton from "@/components/GlobalButton";

const AdminHeader = ({ children }) => {
  const dispatch = useDispatch();
  const history = useHistory();

  return (
    <div className="spacer spacer-full" justify="end">
      <GlobalButton />
      <ThemeButton />
      <NotifyButton />
      <ProfileButton />
    </div>
  );
};

export default AdminHeader;
