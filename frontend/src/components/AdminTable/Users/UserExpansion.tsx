import {useState} from "react";

import {User} from "@/admin/types.ts";
interface UserExpansionProps {
    user: User;
    editing: boolean;
}

const UserExpansion = ({user: IUser, editing: IEditing}: UserExpansionProps) => {
    const [user, setUser] = useState(IUser);
    const [editing, setEditing] = useState(IEditing);
    // const {mutate: acceptProposal} = useAcceptProposal();
    // const {mutate: removeProposal} = useRemoveProposal();
    console.log(user)
    const html = JSON.stringify(user)
    return (
        `${html}`
    )

    // return (
    //     <Flex  wrap={{base: "wrap", sm: "nowrap"}} px="42" pt="lg" pb="xl" gap="md" style={{
    //         background: "var(--striped-background)"
    //     }}>
    //         <Flex direction="column" w="80%" gap="xs">
    //             <Flex align="center" gap="xs" wrap="wrap">
    //                 <Text fz="sm" fw={500}>Details</Text>
    //             </Flex>
    //             <Divider variant="dashed" size="sm"/>
    //             <Flex direction="column" gap="xs">
    //                 <Flex justify="flex-start" gap="xs" wrap="wrap">
    //                     <Flex align="center" gap="3">
    //                         <Text style={{whiteSpace: "nowrap"}} fz="xs" fw="bold">User ID: </Text>
    //                         <UserInfoAction userId={proposal.userId}>
    //                             <Button px={4} m={0} h={20} variant="subtle" fz="xs" fw="600"
    //                                     c="blue">{proposal.userId}</Button>
    //                         </UserInfoAction>
    //                     </Flex>
    //                     <Flex align="center" gap="3">
    //                         <Text style={{whiteSpace: "nowrap"}} fz="xs" fw="bold">Course ID: </Text>
    //                         <Text truncate fz="xs" fw="600" c="dimmed">{proposal.courseId}</Text>
    //                     </Flex>
    //                 </Flex>
    //                 <form>
    //                     <Flex wrap="wrap" gap="xs" direction="column">
    //                         <TextInput
    //                             disabled={!editing}
    //                             value={proposal.name}
    //                             label="Course Name"
    //                             placeholder="Enter course name"
    //                             onChange={(event) => setProposal({...proposal, course: event.currentTarget.value})}/>
    //                         <Flex gap="xs" wrap={{base: "wrap", sm: "nowrap"}}>
    //                             <Flex direction="column" gap="xs" w={{base: "100%", sm: "40%"}}>
    //                                 <Autocomplete
    //                                     disabled={!editing}
    //                                     label="Semester"
    //                                     placeholder="Select semester"
    //                                     data={['2023 S']}
    //                                     value={proposal.offeredInSemesters[0]}
    //                                     onChange={(value) => setProposal({...proposal, offeredInSemesters: [value]})}
    //
    //                                 />
    //                                 <TextInput
    //                                     disabled={!editing}
    //                                     value={proposal.professor}
    //                                     label="Main Professor"
    //                                     placeholder="Enter professor name"
    //                                     onChange={(event) => setProposal({...proposal, professor: event.currentTarget.value})}
    //                                 />
    //                             </Flex>
    //                             <PillsInput
    //                                 w={{base: "100%", sm: "100%"}}
    //                                 disabled={!editing}
    //                                 multiline
    //                                 label="Other Professors"
    //                             >
    //                                 <Pill.Group h={91} style={{alignItems: "flex-start"}}>
    //                                     {
    //                                         proposal.otherLecturers.map((lecturer) => (
    //                                             <Pill disabled={!editing} key={lecturer} withRemoveButton
    //                                                   onRemove={() => {
    //                                                       setProposal({
    //                                                           ...proposal,
    //                                                           otherLecturers: proposal.otherLecturers.filter((l) => l !== lecturer)
    //                                                       });
    //                                                   }}>{lecturer}</Pill>
    //                                         ))
    //                                     }
    //                                     <PillsInput.Field
    //                                         disabled={!editing}
    //                                         onChange={(event) => setNewLecturer(event.currentTarget.value)}
    //                                         onKeyDown={(event) => {
    //                                             if (event.key === 'Enter') {
    //                                                 if (newLecturer.length <= 3) return;
    //                                                 if (proposal.otherLecturers.includes(newLecturer)) return;
    //                                                 setProposal({
    //                                                     ...proposal,
    //                                                     otherLecturers: [...proposal.otherLecturers, event.currentTarget.value]
    //                                                 });
    //                                                 setNewLecturer('');
    //                                             }
    //                                         }}
    //                                         value={newLecturer}
    //                                         placeholder=""/>
    //                                 </Pill.Group>
    //                             </PillsInput>
    //                         </Flex>
    //                     </Flex>
    //                 </form>
    //             </Flex>
    //         </Flex>
    //         <Flex direction="column" gap="xs">
    //             <Flex align="center" gap="xs">
    //                 <Text fz="sm" fw={500}>Actions</Text>
    //             </Flex>
    //             <Stack gap="xs">
    //                 <Divider variant="dashed" size="sm"/>
    //                 <Button onClick={()=>{acceptProposal(proposal._id)}} leftSection={<IconCircleCheck width={16}/>} color="green">Accept Proposal</Button>
    //                 <Button onClick={()=>{removeProposal(proposal._id)}} leftSection={<IconTrashX width={16}/>} color="red">Remove Proposal</Button>
    //                 <Button color="green" disabled leftSection={<IconEditCircle width={16}/>} onClick={() => {
    //                     if (editing) {
    //                         setEditing(false)
    //                     } else {
    //                         setEditing(true)
    //                     }
    //                 }} variant="default">{!editing ? "Edit Proposal" : "Save Proposal"}</Button>
    //             </Stack>
    //         </Flex>
    //     </Flex>
    // );
};

export {UserExpansion}