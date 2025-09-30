import { ReactNode, createContext, useState } from 'react';
import React from 'react';
export const SearchModalContext = createContext<any>(undefined);
export const SearchModalContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [searchModalVisible, setSearchModalVisible] = useState(false);
  function OnClose() {
    setSearchModalVisible(false);
  }
  function OnOpen() {
    setSearchModalVisible(true);
  }
  return (
    <SearchModalContext.Provider
      value={{ searchModalVisible, setSearchModalVisible, OnClose, OnOpen }}
    >
      {children}
    </SearchModalContext.Provider>
  );
};
