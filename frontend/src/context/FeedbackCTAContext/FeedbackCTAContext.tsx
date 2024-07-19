import {createContext, useContext, useState} from 'react';

interface FeedbackCTAContextType {
    feedbackCTA: boolean;
    setFeedbackCTA: (value: boolean) => void;
}

const FEEDBACK_CTA_LOCAL_STORAGE_KEY = 'TUM-RATING-FEEDBACK-CTA';

const FeedbackCTAContext = createContext<FeedbackCTAContextType | undefined>(undefined);

const isFeedbackCTADue = (): boolean => {
    const feedbackCTATimestamp = localStorage.getItem(FEEDBACK_CTA_LOCAL_STORAGE_KEY);
    if (!feedbackCTATimestamp) {
        return true;
    }
    const timestamp = JSON.parse(feedbackCTATimestamp);
    const currentTime = new Date().getTime();
    const timeDifference = currentTime - timestamp;
    const hoursDifference = timeDifference / (1000 * 60 * 60);
    return hoursDifference > 24;
};

export const FeedbackCTAProvider = ({children}) => {
    const [feedbackCTA, setFeedbackCTA] = useState<boolean>(false);

    const setFeedbackCTAWithCheck = (value: boolean) => {
        if (value && isFeedbackCTADue()) {
            setFeedbackCTA(true);
            localStorage.setItem(FEEDBACK_CTA_LOCAL_STORAGE_KEY, JSON.stringify(new Date().getTime()));
        } else {
            setFeedbackCTA(false);
        }
    };

    return <FeedbackCTAContext.Provider
        value={{feedbackCTA, setFeedbackCTA: setFeedbackCTAWithCheck}}>{children}</FeedbackCTAContext.Provider>;
};

export const useFeedbackCTAContext = (): FeedbackCTAContextType => {
    const context = useContext(FeedbackCTAContext);
    if (context === undefined) {
        throw new Error('useFeedbackCTAContext must be used within a FeedbackCTAProvider');
    }
    return context;
};