import React, { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
} from '@/components/ui/dialog';
import { FcGoogle } from 'react-icons/fc';
import axios from 'axios';

const Header = () => {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user')));
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    console.log('User data:', user);
  }, [user]);

  const login = useGoogleLogin({
    onSuccess: handleLoginSuccess,
    onError: (error) => console.error('Login error:', error),
  });

  const handleLoginSuccess = (tokenResponse) => {
    fetchUserProfile(tokenResponse);
  };

  const fetchUserProfile = async (tokenInfo) => {
    try {
      const response = await axios.get(
        `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenInfo?.access_token}`,
        {
          headers: {
            Authorization: `Bearer ${tokenInfo?.access_token}`,
            Accept: 'application/json',
          },
        }
      );

      localStorage.setItem('user', JSON.stringify(response.data));
      setUser(response.data);
      setIsDialogOpen(false);
      window.location.reload();
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const handleLogout = () => {
    googleLogout();
    localStorage.clear();
    setUser(null);
    window.location.reload();
  };

  return (
    <header className="p-4 shadow-md flex justify-between items-center bg-white">
      <img src="/logo.svg" alt="App Logo" className="h-8" />

      <nav>
        {user ? (
          <div className="flex items-center gap-4">
            <a href="/create-trip">
              <Button variant="outline" className="rounded-full">
                Create Trip
              </Button>
            </a>
            <a href="/my-trips">
              <Button variant="outline" className="rounded-full">
                My Trips
              </Button>
            </a>

            <Popover>
              <PopoverTrigger>
                <img
                  src={user?.picture}
                  alt="User Profile"
                  className="rounded-full w-10 h-10 cursor-pointer"
                />
              </PopoverTrigger>
              <PopoverContent>
                <p
                  className="cursor-pointer text-center text-red-600"
                  onClick={handleLogout}
                >
                  Logout
                </p>
              </PopoverContent>
            </Popover>
          </div>
        ) : (
          <Button onClick={() => setIsDialogOpen(true)}>Sign In</Button>
        )}
      </nav>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogDescription>
              <img src="/logo.svg" alt="App Logo" className="mx-auto h-10" />
              <h2 className="font-bold text-xl mt-6 text-center">
                Sign In with Google
              </h2>
              <p className="text-center text-gray-600 mt-2">
                Access your account securely with Google authentication.
              </p>
              <Button
                onClick={login}
                className="w-full mt-5 flex items-center justify-center gap-2"
              >
                <FcGoogle className="w-6 h-6" />
                Sign In With Google
              </Button>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </header>
  );
};

export default Header;
