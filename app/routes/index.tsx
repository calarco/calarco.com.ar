export default function Index() {
    return (
        <div className="absolute inset-0 overflow-clip px-16 py-12 rounded shadow-lg outline outline-1 outline-gray-900/10 dark:outline-gray-50/5 grid items-center grid-rows-[auto,1fr,auto]">
            <div className="grid grid-flow-col justify-between items-center gap-4">
                <div className="grid">
                    <a
                        href="mailto:sebastian@calarco.com.ar"
                        className="button outline outline-1 outline-current text-inherit dark:text-inherit font-mono text-lg normal-case backdrop-blur"
                    >
                        sebastian@calarco.com.ar
                    </a>
                </div>
                <p className="px-4 py-2 font-mono text-sm rotate-90 relative top-full -right-9">
                    2012 / 2022
                </p>
            </div>
            <div className="justify-self-center grid items-center divide-y-2 divide-current">
                <div className="overflow-clip">
                    <h1 className="pb-4 font-serif text-8xl text-left animate-[showTopText_1s]">
                        Sebastián Calarco
                    </h1>
                </div>
                <div className="overflow-clip">
                    <div className="px-1 grid grid-cols-2 justify-between items-center gap-8 animate-[showBottomText_1s]">
                        <p className="pt-4 text-xl font-bold text-left">
                            Desarrollador web
                        </p>
                        <p className="pt-4 text-xl font-bold text-right">
                            Mar del Plata, Argentina
                        </p>
                    </div>
                </div>
            </div>
            <footer className="grid grid-cols-3 justify-between items-center gap-8">
                <a
                    href="https://www.linkedin.com/in/sebastian-calarco/"
                    target="_blank"
                    rel="noreferrer"
                    className="button justify-self-start text-inherit dark:text-inherit font-mono normal-case underline"
                >
                    linkedin
                    <span className="hidden lg:inline">
                        .com/in/sebastian-calarco
                    </span>
                </a>
                <a
                    href="resume.pdf"
                    target="_blank"
                    rel="noreferrer"
                    className="button justify-self-center text-inherit dark:text-inherit font-mono normal-case underline"
                >
                    resume
                    <span className="hidden lg:inline">.pdf</span>
                </a>
                <a
                    href="https://github.com/calarco"
                    target="_blank"
                    rel="noreferrer"
                    className="button justify-self-end text-inherit dark:text-inherit font-mono normal-case underline"
                >
                    github
                    <span className="hidden lg:inline">.com/calarco</span>
                </a>
            </footer>
        </div>
    );
}
