'use client';
import { useAuth0 } from '@auth0/auth0-react';

import LoginButton from './_components/auth/login';
import LogoutButton from './_components/auth/logout';
import Profile from './_components/auth/profile';

export default function Home() {
  const { isLoading, isAuthenticated, error, user } = useAuth0();

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Oops... {error.message}</div>;
  }

  if (isAuthenticated) {
    return (
      <div>
        <Profile />
        Hello {user.name} <LogoutButton />
      </div>
    );
  } else {
    return <LoginButton />;
  }
}
