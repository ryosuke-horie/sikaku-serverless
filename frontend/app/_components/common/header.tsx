'use client';

import { useAuth0 } from '@auth0/auth0-react';

import LoginButton from '../auth/login';
import LogoutButton from '../auth/logout';
import Profile from '../auth/profile';
import CreateButton from '../createButton';

const Header = () => {
  const { isLoading, isAuthenticated, error } = useAuth0();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="navbar bg-base-100">Oops... {error.message}</div>;
  }

  // Auth0で認証済みの場合は、プロフィールとログアウトボタンを表示
  if (isAuthenticated) {
    return (
      <div className="navbar bg-base-100">
        <div className="flex-1">
          <a className="btn btn-ghost text-xl">CertifyHub</a>
        </div>
        <div className="flex-none">
          <CreateButton />
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="avatar btn btn-circle btn-ghost">
              <div className="w-10 rounded-full">
                <Profile />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu dropdown-content menu-sm z-[1] mt-3 w-52 rounded-box bg-base-100 p-2 shadow"
            >
              <li>
                <a className="justify-between">
                  Profile
                  <span className="badge">New</span>
                </a>
              </li>
              <li>
                <a>Settings</a>
              </li>
              <li>
                <LogoutButton />
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="navbar bg-base-100">
        <div className="flex-1">
          <a className="btn btn-ghost text-xl">CertifyHub</a>
        </div>
        <div className="flex-none">
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-circle btn-ghost">
              <div className="indicator">
                <LoginButton />
              </div>
            </div>
          </div>
          <div className="dropdown dropdown-end">
            <ul
              tabIndex={0}
              className="menu dropdown-content menu-sm z-[1] mt-3 w-52 rounded-box bg-base-100 p-2 shadow"
            >
              <li>
                <a className="justify-between">
                  Profile
                  <span className="badge">New</span>
                </a>
              </li>
              <li>
                <a>Settings</a>
              </li>
              <li>
                <a>Logout</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
};

export default Header;
