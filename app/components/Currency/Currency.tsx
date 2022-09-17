import { SwitchTransition, CSSTransition } from "react-transition-group";

const Currency = function ({
    number,
    integer,
}: {
    number: number;
    integer?: boolean;
}) {
    return (
        <SwitchTransition>
            <CSSTransition
                key={number}
                timeout={150}
                classNames={{
                    enter: "opacity-0 -translate-y-4",
                    enterActive: "opacity-1",
                    exit: "opacity-1",
                    exitActive: "opacity-0",
                }}
            >
                <pre className="font-mono transition duration-150">
                    <span className="pr-2 text-gray-900/50 dark:text-gray-100/50">
                        $
                    </span>
                    <span>
                        {number
                            .toString()
                            .split(".")[0]
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                    </span>
                    {!integer && (
                        <small className="pl-2 text-xs text-gray-900/50 dark:text-gray-100/50">
                            {number.toString().split(".")[1]
                                ? (
                                      number.toString().split(".")[1] + "0"
                                  ).substring(0, 2)
                                : "00"}
                        </small>
                    )}
                </pre>
            </CSSTransition>
        </SwitchTransition>
    );
};

export default Currency;
