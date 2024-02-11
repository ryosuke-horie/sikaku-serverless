import { useAuth0 } from '@auth0/auth0-react';

const LogoutButton = () => {
  const { logout } = useAuth0();

  const handleLogout = async () => {
    try {
      await logout({ logoutParams: { returnTo: window.location.origin } });
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  return <button onClick={handleLogout}>Log Out</button>;
};

export default LogoutButton;
