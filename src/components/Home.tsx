import { Heading, useAuthenticator } from '@aws-amplify/ui-react';

export function Home() {
  const { user } = useAuthenticator((context) => [context.user]);
  return (
    <Heading level={3}>
      <>Hello {user ? user.username : ' user'}, please use the buttons at the top to test out protected routes!</>
    </Heading>
  );
}