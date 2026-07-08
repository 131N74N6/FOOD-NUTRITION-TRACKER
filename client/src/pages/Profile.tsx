import { useEffect } from "react";
import Navbar from "../components/Navbar";
import UserServices from "../services/user.service";
import { useMessageStore } from "../stores/message.store";
import { Camera, X } from "lucide-react";

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
        selectedImage,
        selectedImageUrl, 
        setDeletedImage,
        setEditMode, 
        setEditUser, 
        setSelectedImage,
        setSelectedImageUrl,
        showSelectedImage
    } = UserServices({ setMessage: setMessage });

    useEffect(() => {
        if (message) {
            const x = setTimeout(() => setMessage(null), 3000);
            return () => clearTimeout(x);
        }
    }, [message, setMessage]);

    useEffect(() => {
        if (editMode && currentUser) {
            setEditUser('username', currentUser.username);
            setSelectedImageUrl(currentUser.profile_picture.url);
        } else {
            setEditUser('username', '');
            setDeletedImage(null);
            setSelectedImage(null);
            setSelectedImageUrl(null);
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
                    <form className="flex flex-col gap-4" onSubmit={changeUser}>
                        <input
                            className="hidden"
                            disabled={isProcessing}
                            id="profile_picture"
                            name="profile_picture"
                            onChange={showSelectedImage}
                            ref={inputFileRef}
                            type="file"
                        />
                        
                        <div className="flex justify-center">
                            <div className="w-40 h-40 rounded-full">
                                {selectedImageUrl ? (
                                    <div className="relative group w-full h-full">
                                        <img 
                                            src={selectedImageUrl} 
                                            alt={currentUser?.profile_picture?.public_id}
                                            className="w-full h-full rounded-full object-cover"
                                        />
                                        <button
                                            className={`
                                                bg-green-700 text-white opacity-0 group-hover:opacity-100 font-medium cursor-pointer 
                                                disabled:cursor-not-allowed absolute top-1 left-[46%] w-6 h-6 flex justify-center items-center p-1 
                                                rounded-full transition-opacity duration-300
                                            `}
                                            disabled={isProcessing}
                                            onClick={() => {
                                                setDeletedImage(currentUser?.profile_picture!);
                                                setSelectedImageUrl(null);
                                            }}
                                            type="button"
                                        >
                                            <X/>
                                        </button>
                                    </div>
                                ) : selectedImage && selectedImageUrl ? (
                                    <div className="relative group w-full h-full">
                                        <img 
                                            src={selectedImageUrl} 
                                            alt={`img-${Date.now()}`}
                                            className="w-full h-full rounded-full object-cover"
                                        />
                                        <button
                                            className={`
                                                bg-green-700 text-white opacity-0 group-hover:opacity-100 font-medium cursor-pointer 
                                                disabled:cursor-not-allowed absolute top-1 left-[46%] w-6 h-6 flex justify-center items-center p-1 
                                                rounded-full transition-opacity duration-300
                                            `}
                                            disabled={isProcessing}
                                            onClick={() => {
                                                setSelectedImage(null);
                                                setSelectedImageUrl(null);
                                            }}
                                            type="button"
                                        >
                                            <X/>
                                        </button>
                                    </div>
                                ) : (
                                    <div 
                                        onClick={() => inputFileRef.current?.click()} 
                                        className={`
                                            bg-amber-700 text-white cursor-pointer font-medium 
                                            w-full h-full rounded-full flex items-center justify-center text-5xl
                                        `}
                                    >
                                        <Camera size={48}/>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div>Created At: {new Date(currentUser?.created_at!).toLocaleString()}</div>
                        <div>User ID: {currentUser?.user_id}</div>
                        <div className="flex items-center gap-2">
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
                                className={`
                                    disabled:cursor-not-allowed cursor-pointer bg-blue-600 hover:bg-blue-400 text-white font-medium p-1.5 
                                    rounded-md transition-colors
                                `}
                                disabled={isProcessing}
                                onClick={() => resetEditMode()}
                                type="button"
                            >
                                Cancel
                            </button>
                            <button
                                className={`
                                    disabled:cursor-not-allowed cursor-pointer bg-blue-600 hover:bg-blue-400 text-white font-medium p-1.5 
                                    rounded-md transition-colors
                                `}
                                disabled={isProcessing}
                                type="submit"
                            >
                                Save
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="flex flex-col gap-4">
                        <div className="flex justify-center">
                            <div className="w-40 h-40 rounded-full">
                                {currentUser?.profile_picture && 
                                typeof currentUser.profile_picture === 'object' && 
                                currentUser.profile_picture.url && 
                                currentUser.profile_picture.url !== '' ? (
                                    <div className="w-full h-full">
                                        <img 
                                            src={currentUser?.profile_picture.url} 
                                            alt={currentUser?.profile_picture.public_id}
                                            className="w-full h-full rounded-full object-cover"
                                        />
                                    </div>
                                ) : (
                                    <div className={`
                                        bg-amber-700 text-white cursor-pointer font-medium 
                                        w-full h-full rounded-full flex items-center justify-center text-5xl
                                    `}>
                                        {currentUser?.username?.[0]}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div>Created At: {new Date(currentUser?.created_at!).toLocaleString()}</div>
                        <div>User ID: {currentUser?.user_id}</div>
                        <div>Username: {currentUser?.username}</div>
                        <div className="flex gap-2.5">
                            <button
                                className={`
                                    disabled:cursor-not-allowed cursor-pointer bg-blue-600 hover:bg-blue-400 text-white 
                                    font-medium p-1.5 rounded-md transition-colors
                                `}
                                disabled={isProcessing}
                                onClick={() => setEditMode(true)}
                                type="button"
                            >
                                Edit
                            </button>
                            <button
                                className={`
                                    disabled:cursor-not-allowed bg-blue-600 hover:bg-blue-400 text-white 
                                    font-medium p-1.5 rounded-md transition-colors
                                `}
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