import { SetStateAction, useContext, useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { AppDataContext } from "@/context/app-data-context";
import { Button } from "@/components/ui/button";
import Avatar1 from "@/assets/avatar-1.jpg";
import Avatar2 from "@/assets/avatar-2.png";
import { Avatar, AvatarImage } from "@/components/ui/avatar.tsx";
import { Label } from "@radix-ui/react-label";

const UserSetupDialog = ({ open = true }) => {
    const { setUserDetails, socketRef } = useContext(AppDataContext)!;
    const [nickname, setNickname] = useState("");
    const [avatar, setAvatar] = useState(Avatar1);
    const [dialogOpened, setDialogOpened] = useState(open);

    useEffect(() => {
        const nicknameFromLocalStorage = localStorage.getItem('nickname');
        const avatarFromLocalStorage = localStorage.getItem('avatar');
        if (nicknameFromLocalStorage) {
            setNickname(nicknameFromLocalStorage);
        }
        if (avatarFromLocalStorage) {
            setAvatar(avatarFromLocalStorage);
        }
    }, []);

    const handleSubmit = (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        if (nickname === "") {
            return;
        }
        setUserDetails({ nickname, avatar });
        localStorage.setItem('nickname', nickname);
        localStorage.setItem('avatar', avatar);
        if (socketRef.current?.readyState === WebSocket.OPEN) {
            socketRef.current.send(JSON.stringify({ action: "setUserDetails", nickname, avatar }));
            setDialogOpened(false);
        }
    };

    const handleAvatarClick = (selectedAvatar: SetStateAction<string>) => {
        setAvatar(selectedAvatar);
    };

    return (
        <Dialog open={dialogOpened} onOpenChange={() => {}}>
            <DialogContent showCloseButton={false}>
                <DialogHeader>
                    <DialogTitle>Set Up Your Profile</DialogTitle>
                    <DialogDescription>
                        Please enter your nickname and select avatar.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="flex flex-col gap-4">
                        <div className="grid w-full items-center gap-1.5">
                            <Label className='text-xs' htmlFor="nickname">Choose your hero</Label>
                            <div className={'flex gap-2'}>
                                <Button
                                    size={'icon'}
                                    variant={'unstyled'}
                                    className={`w-16 h-16 rounded-full ${avatar === Avatar1 ? 'bg-blue-500' : 'bg-gray-300'}`}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleAvatarClick(Avatar1)
                                    }}
                                >
                                    <Avatar className={'w-14 h-14'}>
                                        <AvatarImage src={Avatar1} alt="avatar-1" />
                                    </Avatar>
                                </Button>
                                <Button
                                    size={'icon'}
                                    variant={'unstyled'}
                                    className={`w-16 h-16 rounded-full ${avatar === Avatar2 ? 'bg-blue-500' : 'bg-gray-300'}`}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleAvatarClick(Avatar2)
                                    }}
                                >
                                    <Avatar className={'w-14 h-14'}>
                                        <AvatarImage src={Avatar2} alt="avatar-2" />
                                    </Avatar>
                                </Button>
                            </div>
                        </div>
                        <div className="grid w-full items-center gap-1.5">
                            <Label className='text-xs' htmlFor="nickname">Name</Label>
                            <Input
                                placeholder="Nickname"
                                value={nickname}
                                onChange={(e) => setNickname(e.target.value)}
                            />
                            <Button className='w-full mt-3' type="submit">Submit</Button>
                        </div>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default UserSetupDialog;