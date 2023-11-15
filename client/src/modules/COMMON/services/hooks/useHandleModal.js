import { useEffect } from "react";

const useHandleModal = (ref, action) => {
    useEffect(() => {
        const handleModal = (event) => {

            if (!ref.current || !ref.current.contains(event.target)) {

                action();
            }
        };

        document.addEventListener('mousedown', handleModal)
        document.addEventListener('touchstart', handleModal)

        return () => {
            document.removeEventListener('mousedown', handleModal);
            document.removeEventListener('touchstart', handleModal);
        };
    }, [])
}

export default useHandleModal;