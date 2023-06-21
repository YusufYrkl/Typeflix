import { useState, useEffect, useContext } from "react";
import { BiEdit } from "react-icons/bi";
import Navbar from "../components/UI/Navbar.jsx";
import AuthContext from "../components/context/AuthContext.jsx";
import "../styles/Settings.css";
import { Avatars } from "../components/UI/Avatars.jsx";
import Modal from 'react-modal';

function Settings() {
  const [error, setError] = useState("");
  const [showAvatarOptions, setShowAvatarOptions] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const { userId, userData, avatarUrl, setAvatarUrl, logout } = useContext(AuthContext);

  Modal.setAppElement('#root');

  const updateAvatar = async (newAvatar) => {
    try {
      const response = await fetch('http://localhost:3000/updateavatar', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: localStorage.getItem('jwt'),
          newAvatar: newAvatar,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update avatar');
      }

      const data = await response.json();
      setAvatarUrl(newAvatar);
      console.log(data.message);
    } catch (error) {
      console.error('Error updating avatar:', error);
    }
  };


  const handleUpdateUsername = async () => { };

  const handleUpdatePassword = async () => { };

  const handleToggleAvatarOptions = () => {
    setShowAvatarOptions(!showAvatarOptions);
  };

  const handleConfirmDelete = () => {
    fetch('http://localhost:3000/deleteAccount', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: localStorage.getItem('jwt'),
        password: "123123",
        username: userData.username,
        uid: userData.uid,
        email: userData.email,
      }),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to delete account');
        }
        return response.json();
      })
      .then(data => {
        console.log(data);

        // Close modal
        setModalIsOpen(false);

        // Delete user data from local storage
        localStorage.removeItem('userData');
        localStorage.removeItem('jwt');
        console.log("here")
        logout();
      })
      .catch(error => {
        console.error('Error deleting account:', error);
      });
  };

  const handleCancelDelete = () => {
    setModalIsOpen(false);
  };

  const handleSelectAvatar = (styleName) => {
    // Set the avatar URL
    const avatarURL = `https://api.dicebear.com/6.x/${styleName}/svg?seed=${userId}`;
    setAvatarUrl(avatarURL);
    setShowAvatarOptions(false);
    updateAvatar(avatarURL);
  };

  const handleDeleteAccount = async () => {
    setModalIsOpen(true);
  };


  return (
    <>
      <div className="main-bg">
        <Navbar />
        <div className="h-[90%] m-auto max-w-7xl">
          <div className="container mx-auto mt-24">
            <div className="max-w-[650px] max-h-[400px] flex flex-col p-8 mx-auto rounded-lg bg-neutral-700 md:flex-row">
              <div className="flex flex-col items-start mb-4 md:mb-0 md:w-1/2">
                <div className="w-40 h-40 overflow-hidden rounded-full">
                  {avatarUrl && <img className="bg-white" src={avatarUrl} alt="Avatar" />}
                </div>
                <button
                  className="px-4 py-2 mt-4 font-semibold text-white bg-black rounded-full"
                  onClick={handleToggleAvatarOptions}
                >
                  Change Avatar
                </button>
                <button
                  className="px-4 py-2 mt-4 font-semibold text-white bg-red-500 rounded-full hover:bg-red-600"
                  onClick={() => handleDeleteAccount()}
                >
                  Delete Account
                </button>
                <Modal
                  isOpen={modalIsOpen}
                  onRequestClose={handleCancelDelete}
                  className="flex items-center justify-center w-full h-full bg-gray-800 bg-opacity-80"
                >
                  <div className="p-4 bg-white rounded-lg w-96">
                    <h2 className="text-lg font-medium text-center">Are you sure you want to delete your account?</h2>
                    <div className="flex mt-4 place-content-center ">
                      <button
                        className="px-4 py-2 mr-2 font-medium text-white bg-red-500 rounded-lg hover:bg-red-600"
                        onClick={handleConfirmDelete}
                      >
                        Yes
                      </button>
                      <button
                        className="px-4 py-2 font-medium text-white bg-gray-500 rounded-lg hover:bg-gray-600"
                        onClick={handleCancelDelete}
                      >
                        No
                      </button>
                    </div>
                  </div>
                </Modal>
              </div>
              <div className="flex flex-col gap-8 place-content-center md:w-1/2">
                <div className="flex items-center">
                  <p className="mr-2 text-lg text-white">
                    Username: {userData && <span>{userData.username}</span>}
                  </p>
                  <button
                    className="px-2 py-1 font-semibold text-white bg-black rounded-full"
                    onClick={handleUpdateUsername}
                  >
                    <BiEdit />
                  </button>
                </div>

                <div className="flex items-start gap-2 ">
                  <p className="text-lg text-white">
                    Email: {userData && <span>{userData.email}</span>}
                  </p>
                </div>
                <div className="flex items-center ">
                  <p className="mr-2 text-lg text-white">Change password</p>
                  <button
                    className="px-2 py-1 font-semibold text-white bg-black rounded-full"
                    onClick={handleUpdatePassword}
                  >
                    <BiEdit />
                  </button>
                </div>
              </div>
            </div>
            {showAvatarOptions && (
              <Avatars
                handleSelectAvatar={handleSelectAvatar}
                handleToggleAvatarOptions={handleToggleAvatarOptions}
                userId={userId}
              />
            )}
            {error && <div className="mt-4 text-red-500">{error}</div>}
          </div>
        </div>
      </div>
    </>
  );
}

export default Settings;
