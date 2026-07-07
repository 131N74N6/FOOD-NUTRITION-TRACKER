import { useEffect } from "react";
import Navbar from "../components/Navbar";
import UserServices from "../services/user.service";
import { useMessageStore } from "../stores/message.store";
import { X } from "lucide-react";

export default function Profile() {
    const message = useMessageStore((state) => state.message);
    const setMessage = useMessageStore((state) => state.setMessage);
    
    const { 
        changeUserMt,
        currentUser, 
        deleteUserMt, 
        editMode, 
        editUser, 
        inputFileRef,
        isProcessing,
        resetEditMode, 
        setDeletedImage,
        setEditMode, 
        setEditUser, 
        showSelectedImage
    } = UserServices({ setMessage: setMessage });

    useEffect(() => {
        if (message) {
            const x = setTimeout(() => setMessage(null), 3000);
            return () => clearTimeout(x);
        }
    }, [message, setMessage]);

    useEffect(() => {
        if (editMode) {
            setEditUser('username', currentUser?.username!);
            setEditUser('profile_picture', currentUser?.profile_picture.url!);
        } else {
            setEditUser('username', '');
            setEditUser('profile_picture', '');
        }
    }, [editMode, resetEditMode, currentUser?.user_id])

    const changeUser = (event: React.SyntheticEvent) => {
        event.preventDefault();
        changeUserMt.mutate();
    }

    return (
        <section className="flex md:flex-row flex-col h-screen relative">
            {Navbar(isProcessing)}
            <div className="w-full md:w-3/4 flex justify-center items-center h-full p-2.5">
                {editMode ? (
                    <form className="flex flex-col gap-2.5" onSubmit={changeUser}>
                        <input
                            className="hidden"
                            disabled={isProcessing}
                            id="profile_picture"
                            name="profile_picture"
                            onChange={showSelectedImage}
                            ref={inputFileRef}
                            type="file"
                        />
                        <div className="w-20 h-20 rounded-full" onClick={() => inputFileRef.current?.click()}>
                            {editUser && editUser.profile_picture ? (
                                <div className="relative group">
                                    <img src={editUser?.profile_picture.url} alt={editUser?.profile_picture.public_id}/>
                                    <button
                                        className="bg-green-700 text-white opacity-0 group-hover:opacity-100 font-medium cursor-pointer disabled:cursor-not-allowed absolute top-1 w-6 h-6 flex justify-center items-center p-1 rounded-full"
                                        disabled={isProcessing}
                                        onClick={() => setDeletedImage(currentUser?.profile_picture!)}
                                        type="button"
                                    >
                                        <X/>
                                    </button>
                                </div>
                            ) : (
                                <div className="bg-amber-700 text-white font-medium">{currentUser?.username[0]}</div>
                            )}
                        </div>
                        <div>Created At: {new Date(currentUser?.created_at!).toLocaleString()}</div>
                        <div>User ID: {currentUser?.user_id}</div>
                        <div className="flex gap-2">
                            <label className="text-gray-600 font-medium" htmlFor="username">Username:</label>
                            <input
                                className="disabled:cursor-not-allowed border outline-0 border-gray-600 p-1.5 font-medium text-[0.88rem] rounded"
                                disabled={isProcessing}
                                id="username"
                                name="username"
                                onChange={(event) => setEditUser('username', event.target.value)}
                                type="text"
                                value={editUser.username}
                            />
                        </div>
                        <div className="flex gap-2.5">
                            <button
                                className="disabled:cursor-not-allowed cursor-pointer bg-blue-600 hover:bg-blue-400 text-white font-medium p-1.5 rounded-md transition-colors"
                                disabled={isProcessing}
                                onClick={() => resetEditMode()}
                                type="button"
                            >
                                Cancel
                            </button>
                            <button
                                className="disabled:cursor-not-allowed cursor-pointer bg-blue-600 hover:bg-blue-400 text-white font-medium p-1.5 rounded-md transition-colors"
                                disabled={isProcessing}
                                type="submit"
                            >
                                Save
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="flex flex-col gap-2.5">
                        <div className="w-20 h-20 rounded-full">
                            {currentUser && currentUser.profile_picture ? (
                                <img src={currentUser?.profile_picture.url} alt={currentUser?.profile_picture.public_id}/>
                            ) : (
                                <div className="bg-amber-700 text-white font-medium">{currentUser?.username[0]}</div>
                            )}
                        </div>
                        <div>Created At: {new Date(currentUser?.created_at!).toLocaleString()}</div>
                        <div>User ID: {currentUser?.user_id}</div>
                        <div>Username: {currentUser?.username}</div>
                        <div className="flex gap-2.5">
                            <button
                                className="disabled:cursor-not-allowed cursor-pointer bg-blue-600 hover:bg-blue-400 text-white font-medium p-1.5 rounded-md transition-colors"
                                disabled={isProcessing}
                                onClick={() => setEditMode(true)}
                                type="button"
                            >
                                Edit
                            </button>
                            <button
                                className="disabled:cursor-not-allowed cursor-pointer bg-blue-600 hover:bg-blue-400 text-white font-medium p-1.5 rounded-md transition-colors"
                                disabled={isProcessing}
                                onClick={() => deleteUserMt.mutate()}
                                type="button"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}