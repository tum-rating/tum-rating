import { FC } from 'react';
import { ActionIcon, CopyButton as CopyButtonBase, Tooltip } from '@mantine/core';
import { IconCheck, IconCopy } from '@tabler/icons-react';

interface CopyButtonProps {
  value: string;
  timeout?: number;
}

const CopyButton: FC<CopyButtonProps> = ({ value, timeout = 2000 }) => {
  return (
    <CopyButtonBase value={value} timeout={timeout}>
      {({ copied, copy }) => (
        <Tooltip label={copied ? 'Copied' : 'Copy'} withArrow position="right">
          <ActionIcon color={copied ? 'teal' : 'gray'} variant="subtle" onClick={copy}>
            {copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
          </ActionIcon>
        </Tooltip>
      )}
    </CopyButtonBase>
  );
};

export { CopyButton };