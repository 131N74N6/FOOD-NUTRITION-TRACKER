interface IAlert {
    message: string;
}

export default function Alert(props: IAlert) {
    return (
        <div className="flex justify-center items-center z-30 fixed inset-0 bg-[rgba(0,0,0,0.66)]">
            <div className="bg-white border text-center border-gray-600 w-75 h-75 p-3.5 rounded-xl">
                {props.message}
            </div>
        </div>
    );
}