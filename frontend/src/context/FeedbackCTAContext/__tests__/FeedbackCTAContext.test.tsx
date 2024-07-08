import { act, renderHook } from '@testing-library/react';

import { FeedbackCTAProvider, useFeedbackCTAContext } from '@/context';

describe('FeedbackCTAContext', () => {
    it('should provide initial feedbackCTA state as false', () => {
        const wrapper = ({ children }) => <FeedbackCTAProvider>{children}</FeedbackCTAProvider>;
        const { result } = renderHook(() => useFeedbackCTAContext(), { wrapper });
        expect(result.current.feedbackCTA).toBe(false);
    });

    it('should update feedbackCTA state when setFeedbackCTA is called', () => {
        const wrapper = ({ children }) => <FeedbackCTAProvider>{children}</FeedbackCTAProvider>;
        const { result } = renderHook(() => useFeedbackCTAContext(), { wrapper });
        act(() => {
            result.current.setFeedbackCTA(true);
        });
    });
});
