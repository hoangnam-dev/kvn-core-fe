import packageJson from "../../package.json";
import React, { useEffect, useState } from "react";
import { Modal } from "@/components/ui/modal";
import { deleteCookie } from "cookies-next";

const CURRENT_VERSION = packageJson.version;
const VERSION_STORAGE_KEY = "version";

const ClearCookie: React.FC = () => {
// const ClearCookie: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {    
    if (CURRENT_VERSION) {
      checkVersion();
    }
  }, []);

  const checkVersion = () => {
    const storedVersion = localStorage.getItem(VERSION_STORAGE_KEY);

    if (!storedVersion) {
      localStorage.setItem(VERSION_STORAGE_KEY, CURRENT_VERSION as string);
    } else if (storedVersion !== CURRENT_VERSION) {
      setShowModal(true);
    }
  };

  const handleLogout = () => {
    const cookies = document.cookie.split(";").map(cookie => cookie.trim().split("=")[0]);
    cookies.forEach(cookieName => {
      deleteCookie(cookieName);
    });

    localStorage.setItem(VERSION_STORAGE_KEY, CURRENT_VERSION as string);
    
    setShowModal(false);
    window.location.href = "/signin";
  };

  return (
    <>
      <Modal
        isOpen={showModal}
        onClose={() => {}}
        showCloseButton={false}
        className="max-w-md p-8"
      >
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Website Updated</h2>
          <p className="mb-6">
            A new version of the website is available. Please log in again to continue.
          </p>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Login Again
          </button>
        </div>
      </Modal>
    </>
  );
}

export default ClearCookie;