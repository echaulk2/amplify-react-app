import { Heading, useAuthenticator } from '@aws-amplify/ui-react';

export function Home() {
  const { user } = useAuthenticator((context) => [context.user]);
  return (
    <Heading level={3}>
      <>Hello {user ? user.username : ' user'}, welcome to The Game Bazaar!  { !user && "Please log in or create an account." }</>
    </Heading>
  );
}