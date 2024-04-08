import {Flex, TextInput} from "@mantine/core";
import {useState} from "react";

import {CourseProposal} from "@/admin/types.ts";


interface ProposalExpansionProps {
    proposal: CourseProposal;
    editing: boolean;
}

const ProposalExpansion = ({proposal: IProposal, editing: IEditing}:ProposalExpansionProps) => {
    const [proposal, setProposal] = useState(IProposal);
    const [editing, setEditing] = useState(IEditing);
    return (
        <Flex px="42" py="md">

            <Flex w="50%">
                <form>
                    <TextInput
                        size="xs"
                        value={proposal.course}
                        label="Course Name"
                        onChange={(event) => setProposal({...proposal, course: event.currentTarget.value})}/>
                </form>
            </Flex>
            <Flex>
                <code>
                    {JSON.stringify(proposal)}
                </code>
            </Flex>

        </Flex>
    );
};

export {ProposalExpansion}