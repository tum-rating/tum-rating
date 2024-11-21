import * as React from "react";
import {useContext, useState} from "react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from "@/components/ui/alert-dialog";
import {Input} from "@/components/ui/input";
import {AppDataContext} from "@/context/app-data-context";
import Avatar1 from "@/assets/avatar-1.jpg"

const UserSetupDialog = () => {
    const {setUserDetails, socketRef} = useContext(AppDataContext);
    const [nickname, setNickname] = useState("");
    const [avatar, setAvatar] = useState(Avatar1);

    const handleSubmit = () => {
        setUserDetails({nickname, avatar});
        if (socketRef.current?.readyState === WebSocket.OPEN) {
            socketRef.current.send(JSON.stringify({action: "setUserDetails", nickname, avatar}));
        }
    };

    return (
        <AlertDialog defaultOpen>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Set Up Your Profile</AlertDialogTitle>
                    <AlertDialogDescription>
                        Please enter your nickname and select avatar.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="flex flex-col gap-4">
                        <Input
                            placeholder="Nickname"
                            value={nickname}
                            onChange={(e) => setNickname(e.target.value)}
                        />
                    </div>
                </form>
                <AlertDialogFooter>
                    <AlertDialogAction type='submit' onClick={handleSubmit}>Submit</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default UserSetupDialog;