import type { ReactNode } from "react";

const Card = function ({
    isActive,
    children,
    className,
}: {
    isActive?: boolean;
    children: ReactNode;
    className?: string;
}) {
    return (
        <div
            className={`relative top-0 transition transition-200 ease-in-out hover:cursor-pointer hover:bg-sky-700/20 dark:hover:bg-sky-600/20 ${
                isActive &&
                "sticky bottom-0 z-30 bg-orange-500/20 dark:bg-orange-400/20 hover:bg-orange-400/20 dark:hover:bg-orange-400/20 hover:cursor-default"
            } ${className}`}
        >
            {children}
        </div>
    );
};

export default Card;
