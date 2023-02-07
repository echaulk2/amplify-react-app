import { useAuthenticator, Heading } from '@aws-amplify/ui-react';
import CollectionList from '../Collection/CollectionList';
import { CollectionTable } from '../Collection/CollectionTable';

export function ProfileView() {
  return (
    <>
      <CollectionTable />
      <CollectionList />
    </>
  )
}
