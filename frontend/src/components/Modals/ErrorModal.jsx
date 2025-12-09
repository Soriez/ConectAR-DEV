
export const ErrorModal = ({ message, isError, show }) => {
    if (!show) return null;

    return (
        <div className={`fixed top-5 left-1/2 transform -translate-x-1/2 p-3 rounded-lg text-white font-semibold shadow-lg transition-all duration-300 z-[9999] ${isError ? 'bg-red-600' : 'bg-blue-600'}`}>
            <p>{message}</p>
        </div>
    );
};