import { useState } from "react";

export const ErrorModal = (text, isError) => {
    const [isMessageVisible, setIsMessageVisible] = useState(false);
    setIsMessageVisible(isError ? 'bg-red-600' : 'bg-blue-600');
    setTimeout(() => setIsMessageVisible(false), 4000);
    return (
        <div className={`fixed top-5 left-1/2 transform -translate-x-1/2 p-3 rounded-lg text-white font-semibold shadow-lg transition-opacity duration-300 ${isMessageVisible ? `opacity-100 z-50 ${isMessageVisible}` : 'opacity-0 z-0'}`}>
            <p>{text}</p>
        </div>
    );
};