import { Button, Flex, Modal } from '@mantine/core';
import { UserScore } from '../UserScore';
import { useDisclosure } from '@mantine/hooks';

export const AddReview = () => {
  const [opened, { open, close }] = useDisclosure(false);
  return (
    <>
      <Button onClick={open}>Add review</Button>
      <Modal opened={opened} onClose={close} withCloseButton={false}>
        <UserScore howEasy={0} howInteresting={0} />
        <Flex mt={12} justify="space-between">
          <Button onClick={close} color={'gray'} variant={'subtle'}>
            Cancel
          </Button>
          <Button onClick={close}>Send</Button>
        </Flex>
      </Modal>
    </>
  );
};
