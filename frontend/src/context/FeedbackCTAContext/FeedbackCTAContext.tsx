import { createContext, Dispatch, SetStateAction, useContext, useState } from 'react';

interface FeedbackCTAContextType {
    feedbackCTA: boolean;
    setFeedbackCTA: Dispatch<SetStateAction<boolean>>;
}

const FeedbackCTAContext = createContext<FeedbackCTAContextType | undefined>(undefined);

export const FeedbackCTAProvider = ({ children }) => {
    const [feedbackCTA, setFeedbackCTA] = useState<boolean>(false);

    return <FeedbackCTAContext.Provider value={{ feedbackCTA, setFeedbackCTA }}>{children}</FeedbackCTAContext.Provider>;
};

export const useFeedbackCTAContext = (): FeedbackCTAContextType => {
    const context = useContext(FeedbackCTAContext);
    if (context === undefined) {
        throw new Error('useFeedbackCTAContext must be used within a FeedbackCTAProvider');
    }
    return context;
};
