'use client';
import * as React from 'react';
import {useImperativeHandle} from 'react';
import {cn} from '@/lib/utils';

interface UseTextAreaProps {
    textAreaRef: React.MutableRefObject<HTMLTextAreaElement | null>;
    minHeight?: number;
    maxHeight?: number;
    triggerAutoSize: string;
}

const useTextArea = ({
                         textAreaRef,
                         triggerAutoSize,
                         maxHeight = Number.MAX_SAFE_INTEGER,
                         minHeight = 0,
                     }: UseTextAreaProps) => {
    const [init, setInit] = React.useState(true);
    React.useEffect(() => {
        // We need to reset the height momentarily to get the correct scrollHeight for the textarea
        const offsetBorder = 2;
        const textAreaElement = textAreaRef.current;
        if (textAreaElement) {
            if (init) {
                textAreaElement.style.minHeight = `${minHeight + offsetBorder}px`;
                if (maxHeight > minHeight) {
                    textAreaElement.style.maxHeight = `${maxHeight}px`;
                }
                setInit(false);
            }
            textAreaElement.style.height = `${minHeight + offsetBorder}px`;
            const scrollHeight = textAreaElement.scrollHeight;
            // We then set the height directly, outside of the render loop
            // Trying to set this with state or a ref will product an incorrect value.
            if (scrollHeight > maxHeight) {
                textAreaElement.style.height = `${maxHeight}px`;
            } else {
                textAreaElement.style.height = `${scrollHeight + offsetBorder}px`;
            }
        }
    }, [textAreaRef.current, triggerAutoSize]);
};

export type TextAreaRef = {
    textArea: HTMLTextAreaElement;
    maxHeight: number;
    minHeight: number;
};

type TextAreaProps = {
    maxHeight?: number;
    minHeight?: number;
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export const Textarea = React.forwardRef<TextAreaRef, TextAreaProps>(
    (
        {
            maxHeight = Number.MAX_SAFE_INTEGER,
            minHeight = 52,
            className,
            onChange,
            value,
            ...props
        }: TextAreaProps,
        ref: React.Ref<TextAreaRef>,
    ) => {
        const textAreaRef = React.useRef<HTMLTextAreaElement | null>(null);
        const [triggerAutoSize, setTriggerAutoSize] = React.useState('');

        useTextArea({
            textAreaRef,
            triggerAutoSize: triggerAutoSize,
            maxHeight,
            minHeight,
        });

        useImperativeHandle(ref, () => ({
            textArea: textAreaRef.current as HTMLTextAreaElement,
            focus: () => textAreaRef?.current?.focus(),
            maxHeight,
            minHeight,
        }));

        React.useEffect(() => {
            setTriggerAutoSize(value as string);
        }, [props?.defaultValue, value]);

        return (
            <textarea
                {...props}
                value={value}
                ref={textAreaRef}
                className={cn(
                    'flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
                    className,
                )}
                onChange={(e) => {
                    setTriggerAutoSize(e.target.value);
                    onChange?.(e);
                }}
            />
        );
    },
);
Textarea.displayName = 'TextArea';
