import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { UserResponse } from "../src/api/api.client.ts"
 

 
const fetchUsers = async (): Promise<UserResponse> => {
  const response = await axios.get<UserResponse>('http://localhost:3000/api/admin/getAllUsers');
  return response.data;
};

function UserList() {
  const { data, error, isLoading } = useQuery<UserResponse>({
    queryKey: ['users'],
    queryFn: fetchUsers
  });

  if (isLoading) return <div>Loading users...</div>;
  if (error instanceof Error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h2>All Users</h2>
      <ul>
        {data?.users.map((user) => (
          <li key={user._id}>
            <strong>{user.admissionNumber}</strong> - {user.email}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UserList;
