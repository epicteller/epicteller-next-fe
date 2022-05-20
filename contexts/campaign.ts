import { createContext } from 'react';

const ChatContext = createContext<{ setSize?:(index: number, size: number) => void, windowWidth?: number }>({});

export default ChatContext;
