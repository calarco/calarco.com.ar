import type { LinksFunction } from "@remix-run/node";

import styles from "~/styles/index.css";

export const links: LinksFunction = () => [{ rel: "stylesheet", href: styles }];

export default function Index() {
    return (
        <div className="absolute inset-0 overflow-clip rounded shadow-lg outline outline-1 outline-gray-900/10 grid dark:outline-gray-50/5">
            <div className="dark:invert dark:contrast-[.90]">
                <div className="absolute inset-0 overflow-clip contrast-[15] bg-blue-100">
                    <div class="bubble"></div>
                    <div class="bubble"></div>
                    <div class="bubble"></div>
                    <div class="bubble"></div>
                    <div class="bubble"></div>
                    <div class="bubble"></div>
                    <div class="bubble"></div>
                </div>
                <div className="absolute inset-0 overflow-clip">
                    <div className="noise" />
                </div>
                <div className="absolute inset-0 px-16 py-12 grid items-center grid-rows-[auto,1fr,auto]">
                    <div className="mix-blend-difference grid grid-flow-col justify-between items-center gap-4 text-gray-50">
                        <div className="mix-blend-difference grid">
                            <a
                                href="mailto:sebastian@calarco.com.ar"
                                className="button outline outline-1 outline-gray-50 text-gray-50 font-mono text-lg normal-case"
                            >
                                sebastian@calarco.com.ar
                            </a>
                        </div>
                        <p className="px-4 py-2 font-mono">2012 - 2022</p>
                    </div>
                    <div className="mix-blend-difference justify-self-center grid items-center gap-4 divide-y divide-gray-50 text-gray-50">
                        <h1 className="font-mono text-6xl text-left">
                            SEBASTIAN CALARCO
                        </h1>
                        <div className="px-1 grid grid-cols-2 justify-between items-center gap-8">
                            <p className="pt-4 text-xl font-light text-left">
                                Desarrollador web
                            </p>
                            <p className="pt-4 text-xl font-light text-right">
                                Mar del Plata, Argentina
                            </p>
                        </div>
                    </div>
                    <footer className="mix-blend-difference grid grid-cols-3 justify-between items-center gap-8">
                        <a
                            href="https://www.linkedin.com/in/sebastian-calarco/"
                            target="_blank"
                            rel="noreferrer"
                            className="button justify-self-start text-gray-50 font-mono normal-case"
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
                            className="button justify-self-center text-gray-50 font-mono normal-case"
                        >
                            resume
                            <span className="hidden lg:inline">.pdf</span>
                        </a>
                        <a
                            href="https://github.com/calarco"
                            target="_blank"
                            rel="noreferrer"
                            className="button justify-self-end text-gray-50 font-mono normal-case"
                        >
                            github
                            <span className="hidden lg:inline">
                                .com/calarco
                            </span>
                        </a>
                    </footer>
                </div>
            </div>
        </div>
    );
}
