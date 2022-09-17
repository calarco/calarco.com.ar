import type { ReactNode } from "react";
import { Form } from "@remix-run/react";

const FormComponent = function ({
    action,
    onChange,
    length,
    children,
    className,
}: {
    action?: string;
    onChange?: () => void;
    length?: number;
    children: ReactNode;
    className?: string;
}) {
    return (
        <Form
            method="post"
            action={action}
            onChange={onChange}
            className={`z-50 overflow-clip rounded-md bg-gray-300 dark:bg-gray-700 shadow-md border border-solid border-gray-300 dark:border-gray-700 grid text-left gap-px ${className}`}
            style={{
                gridTemplateColumns:
                    "repeat(" + (length || 1) + ", minmax(0, 1fr))",
            }}
        >
            {children}
        </Form>
    );
};

export default FormComponent;
