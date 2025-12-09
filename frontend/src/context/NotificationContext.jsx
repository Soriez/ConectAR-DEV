import { createContext, useState, useContext, useCallback } from 'react';
import { ErrorModal } from '../components/Modals/ErrorModal';

const NotificationContext = createContext();

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error("useNotification must be used within a NotificationProvider");
    }
    return context;
};

export const NotificationProvider = ({ children }) => {
    const [notification, setNotification] = useState({ show: false, message: '', isError: false });

    // Función principal expuesta. Por defecto es error (true).
    const showErrorModal = useCallback((message, isError = true) => {
        setNotification({ show: true, message, isError });
        setTimeout(() => setNotification({ show: false, message: '', isError: false }), 4000);
    }, []);

    // Helper para éxito
    const showSuccess = useCallback((message) => {
        showErrorModal(message, false);
    }, [showErrorModal]);

    return (
        <NotificationContext.Provider value={{ showErrorModal, showSuccess }}>
            {children}
            <ErrorModal
                show={notification.show}
                message={notification.message}
                isError={notification.isError}
            />
        </NotificationContext.Provider>
    );
};
