import React, { createContext, useState } from 'react';

export const DvdContext = createContext();

export const DvdProvider = ({ children }) => {
  const [dvds, setDvds] = useState([]);
  const [userQueues, setUserQueues] = useState({
    'john.doe@example.com': [],
    'jane.smith@example.com': [],
  });

  const addDvd = (dvd) => {
    const newDvd = { ...dvd, id: dvds.length + 1 };
    setDvds((prevDvds) => [...prevDvds, newDvd]);
    console.log('Added DVD:', newDvd);
  };

  const updateDvdStatus = (id, status) => {
    setDvds((prevDvds) =>
      prevDvds.map((dvd) => (dvd.id === id ? { ...dvd, status } : dvd))
    );
    console.log('Updated DVD status:', { id, status });
  };

  const addToUserQueue = (email, movie) => {
    setUserQueues((prevQueues) => ({
      ...prevQueues,
      [email]: prevQueues[email].some((item) => item.id === movie.id)
        ? prevQueues[email]
        : [...prevQueues[email], movie],
    }));
    console.log(`Added ${movie.title} to ${email}'s queue`);
  };

  // Filter DVDs marked as new releases
  const newReleases = dvds.filter((dvd) => dvd.newRelease);

  return (
    <DvdContext.Provider value={{ dvds, newReleases, addDvd, updateDvdStatus, userQueues, addToUserQueue }}>
      {children}
    </DvdContext.Provider>
  );
};