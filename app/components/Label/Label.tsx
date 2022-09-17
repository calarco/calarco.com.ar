import type { ReactNode } from "react";
import { SwitchTransition, CSSTransition } from "react-transition-group";

const Label = function ({
    title,
    error,
    length,
    children,
    className,
}: {
    title: string;
    length?: number;
    error?: string;
    children: ReactNode;
    className?: string;
}) {
    return (
        <div
            className={`relative bg-slate-50 dark:bg-gray-800 px-4 pt-2 pb-2.5 grid content-between gap-x-4 gap-y-2 ${className}`}
            style={{ gridColumnEnd: "span " + length || 1 }}
        >
            <SwitchTransition>
                <CSSTransition
                    key={error + title}
                    timeout={{
                        enter: 200,
                        exit: 150,
                    }}
                    classNames={{
                        enter: "opacity-0 -translate-y-4",
                        enterActive: "opacity-1 duration-200 ease-out",
                        exit: "opacity-1",
                        exitActive: "opacity-0 duration-150 ease-in",
                    }}
                >
                    <label
                        className={`transition grid gap-4 text-sm font-light ${
                            error
                                ? "text-red-600 dark:text-red-500"
                                : "text-gray-900/50 dark:text-gray-100/50"
                        }`}
                    >
                        {error ? error : title}
                    </label>
                </CSSTransition>
            </SwitchTransition>
            <div className="grid grid-flow-col gap-3 items-center">
                {children}
            </div>
        </div>
    );
};

export default Label;
