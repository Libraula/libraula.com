import React, { createContext, useState } from 'react';

// Create the context
export const QueueContext = createContext();

// Provider component to wrap the app
export const QueueProvider = ({ children }) => {
  const [queue, setQueue] = useState([]); // Dynamic queue starts empty

  const addToQueue = (movie) => {
    // Prevent duplicates by checking if movie is already in queue
    if (!queue.some((item) => item.id === movie.id)) {
      setQueue((prevQueue) => [...prevQueue, movie]);
      console.log(`Added ${movie.title} to queue`);
    } else {
      console.log(`${movie.title} is already in the queue`);
    }
  };

  return (
    <QueueContext.Provider value={{ queue, addToQueue }}>
      {children}
    </QueueContext.Provider>
  );
};