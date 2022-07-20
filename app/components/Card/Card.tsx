import type { ReactNode } from "react";

type ComponentProps = {
    isActive?: boolean;
    children: ReactNode;
    className?: string;
};

const Card = function ({ isActive, children, className }: ComponentProps) {
    return (
        <div
            className={`relative top-0 transition transition-200 ease-in-out hover:cursor-pointer hover:bg-sky-700/20 ${
                isActive &&
                "sticky bottom-0 z-30 bg-orange-500/20 hover:bg-orange-500/20 hover:cursor-default"
            } ${className}`}
        >
            {children}
        </div>
    );
};

export default Card;
