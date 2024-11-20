import * as React from "react";
import { useState, useContext } from "react";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogFooter, AlertDialogTitle, AlertDialogDescription, AlertDialogAction } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { AppDataContext } from "@/context/app-data-context";

const UserSetupDialog = () => {
    const { setUserDetails, socketRef } = useContext(AppDataContext);
    const [nickname, setNickname] = useState("");
    const [avatar, setAvatar] = useState("https://i.ibb.co/3m2w75y/smile-KDc-W-1.jpg");

    const handleSubmit = () => {
        setUserDetails({ nickname, avatar });
        if (socketRef.current?.readyState === WebSocket.OPEN) {
            socketRef.current.send(JSON.stringify({ action: "setUserDetails", nickname, avatar }));
        }
    };

    return (
        <AlertDialog defaultOpen>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Set Up Your Profile</AlertDialogTitle>
                    <AlertDialogDescription>
                        Please enter your nickname and avatar URL to start using the app.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="flex flex-col gap-4">
                    <Input
                        placeholder="Nickname"
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                    />
                    <Input
                        placeholder="Avatar URL"
                        value={avatar}
                        onChange={(e) => setAvatar(e.target.value)}
                    />
                </div>
                <AlertDialogFooter>
                    <AlertDialogAction onClick={handleSubmit}>Submit</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default UserSetupDialog;