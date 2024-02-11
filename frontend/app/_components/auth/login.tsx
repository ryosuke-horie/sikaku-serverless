import { useAuth0 } from '@auth0/auth0-react';

const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();

  const handleLogin = () => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      loginWithRedirect();
    } catch (error) {
      // エラーが発生した場合の処理を記述する
      console.error('Login failed:', error);
    }
  };

  return <button onClick={handleLogin}>Log In</button>;
};

export default LoginButton;
