type ComponentProps = {
    date: string;
    className?: string;
};

const Day = function ({ date, className }: ComponentProps) {
    return (
        <pre className={`font-mono ${className}`}>
            {date.substring(8, 10)}
            <span className="px-2 text-gray-900/90">
                {new Date(date)
                    .toLocaleDateString("default", {
                        month: "short",
                    })
                    .substring(0, 3)
                    .toUpperCase()}
            </span>
            <small className="text-xs text-gray-900/50">
                {date.substring(0, 4)}
            </small>
        </pre>
    );
};

export default Day;
