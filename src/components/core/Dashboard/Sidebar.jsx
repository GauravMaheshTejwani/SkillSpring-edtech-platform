import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { sidebarLinks } from "../../../data/dashboard-links";
import SidebarLink from "./SidebarLink";
import { VscSignOut } from "react-icons/vsc";
import { logout } from "../../../services/operations/authApi";
import ConfirmationModal from "../../common/ConfirmationModal";

function Sidebar() {
  const { user, loading: profileLoading } = useSelector(
    (state) => state.profile,
  );
  const { loading: authLoading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [confirmationMaodal, setConfirmationMadal] = useState(null);

  if (profileLoading || authLoading) {
    return <div className="mt-10">Loading....</div>;
  }

  return (
    <div className=" text-white bg-gray-900">
      <div className=" text-white">
        <div className=" flex flex-col">
          {sidebarLinks.map((link) => {
            if(link.type && user?.accountType !== link.type) return null;
            return (
              <SidebarLink key={link.id} link={link} iconName={link.icon} />
            );
          })}
        </div>

        <div className=" mx-auto mt-6 mb-6 h-[1px] w-10/12 bg-gray-600"></div>

        <div>
          <SidebarLink
            link={{ name: "Settings", path: "/dashboard/settings" }}
            iconName="VscSettingsGear"
          />

          <button
            onClick={() =>
              setConfirmationMadal({
                text1: "Are you Sure ?",
                text2: "You will be logged out of your account",
                btn1Text: "Logout",
                btn2Text: "Cancel",
                btn1Handler: () => dispatch(logout(navigate)),
                btn2Handler: () => setConfirmationMadal(null),
              })
            }
            className=" text-sm font-medium text-gray-400 mx-4 my-4"
          >
            <div className=" flex items-center gap-x-2 p-4 cursor-pointer opacity-100">
              <VscSignOut className=" text-lg" />
              <span>Logout</span>
            </div>
          </button>
        </div>
      </div>

      {confirmationMaodal && (
        <ConfirmationModal modalData={confirmationMaodal} />
      )}
    </div>
  );
}

export default Sidebar;
