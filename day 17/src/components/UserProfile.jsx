import { useState } from 'react';
import { useUser } from '../contexts/UserContext';
import { useTheme } from '../contexts/ThemeContext';

export default function UserProfile() {
  const { user, updateUser } = useUser();
  const { theme } = useTheme();
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newName.trim()) {
      updateUser({ name: newName });
      setNewName('');
    }
    if (newEmail.trim()) {
      updateUser({ email: newEmail });
      setNewEmail('');
    }
  };

  return (
    <div className={`user-profile ${theme}`}>
      <h2>User Profile (useContext)</h2>
      <p>Name: {user.name}</p>
      <p>Email: {user.email}</p>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="New name..."
        />
        <button type="submit">Update Name</button>
      </form>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
          placeholder="New email..."
        />
        <button type="submit">Update Email</button>
      </form>
    </div>
  );
} 