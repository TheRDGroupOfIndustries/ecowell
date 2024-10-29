"use client";

import { Href, ImagePath } from "@/Constants";
import Cookies from "js-cookie";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Fragment } from "react";

const UserMenu = () => {
  const router = useRouter();
  const handleLogOut = () => {
    Cookies.remove("token");
    router.push("/auth/login");
  };
  const { data: session } = useSession();
  // console.log(session);

  return (
    <Fragment>
      <li className="onhover-dropdown">
        <div className="media align-items-center">
          <Image
            src={session?.user?.image || `${ImagePath}/admin.png`}
            alt="header-user"
            width={200}
            height={200}
            className="align-self-center pull-right img-50 rounded-circle blur-up lazyloaded"
            style={{ width: "18px", height: "50px" }}
          />
          <div className="dotted-animation">
            <span className="animate-circle"></span>
            <span className="main-circle"></span>
          </div>
        </div>
        <ul className="profile-dropdown onhover-show-div p-20 profile-dropdown-hover">
          <li>
            <Link href={`/settings/profile`}>
              <i data-feather="user"></i>Edit Profile
            </Link>
          </li>
          <li>
            <a href={Href}>
              <i data-feather="mail"></i>Inbox
            </a>
          </li>
          <li>
            <a href={Href}>
              <i data-feather="lock"></i>Lock Screen
            </a>
          </li>
          <li>
            <a href={Href}>
              <i data-feather="settings"></i>Settings
            </a>
          </li>
          <li>
            <a onClick={handleLogOut}>
              <i data-feather="log-out"></i>Logout
            </a>
          </li>
        </ul>
      </li>
    </Fragment>
  );
};

export default UserMenu;
