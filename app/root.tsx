import type {
    MetaFunction,
    LinksFunction,
    LoaderFunction,
} from "@remix-run/node";
import {
    useLocation,
    useOutlet,
    useLoaderData,
    Meta,
    Links,
    NavLink,
    ScrollRestoration,
    Scripts,
    LiveReload,
} from "@remix-run/react";
import { json } from "@remix-run/node";
import { SwitchTransition, CSSTransition } from "react-transition-group";

import { getUser } from "~/utils/session.server";
import globalStyles from "~/styles/global.css";
import styles from "./tailwind.css";

export const meta: MetaFunction = () => ({
    charset: "utf-8",
    viewport: "width=device-width,initial-scale=1",
    title: "Calarco",
    description: "web developer",
    keywords: "sistema, gestion, calarco, web",
});

export const links: LinksFunction = () => [
    {
        rel: "stylesheet",
        href: globalStyles,
    },
    { rel: "stylesheet", href: styles },
];

type LoaderData = {
    user: Awaited<ReturnType<typeof getUser>>;
};

export const loader: LoaderFunction = async ({ request }) => {
    return json<LoaderData>(await getUser(request));
};

export default function App() {
    const location = useLocation();
    const outlet = useOutlet();
    const data = useLoaderData<LoaderData>();

    return (
        <html lang="es" className="">
            <head>
                <Meta />
                <Links />
            </head>
            <body className="h-screen w-screen overflow-clip select-none bg-slate-300 text-gray-900/90 font-sans dark:bg-neutral-900 dark:text-gray-100">
                <nav className="h-13 px-4 py-1.5 grid justify-between items-center grid-flow-col">
                    <div className="w-64 relative grid justify-start">
                        <NavLink
                            to="/"
                            className={({ isActive }) =>
                                `button ${
                                    isActive &&
                                    "pointer-events-none text-orange-600"
                                }`
                            }
                        >
                            Inicio
                        </NavLink>
                    </div>
                    <div className="w-full grid justify-center grid-flow-col gap-px">
                        <NavLink
                            to="/cheques"
                            className={({ isActive }) =>
                                `button ${
                                    isActive &&
                                    "pointer-events-none text-orange-600"
                                }`
                            }
                        >
                            Cheques
                        </NavLink>
                        <NavLink
                            to="/saldos"
                            className="button pointer-events-none text-gray-600/60"
                        >
                            Saldos
                        </NavLink>
                        <NavLink
                            to="/precios"
                            className="button pointer-events-none text-gray-600/60"
                        >
                            Precios
                        </NavLink>
                        <NavLink
                            to="/taller"
                            className="button pointer-events-none text-gray-600/60"
                        >
                            Taller
                        </NavLink>
                    </div>
                    <div className="w-64 relative grid justify-end">
                        <SwitchTransition>
                            <CSSTransition
                                key={data.username}
                                timeout={{
                                    enter: 300,
                                    exit: 200,
                                }}
                                classNames={{
                                    enter: "opacity-0 scale-105",
                                    enterActive:
                                        "opacity-1 duration-300 ease-out",
                                    exit: "opacity-1",
                                    exitActive:
                                        "opacity-0 blur-xl duration-200 ease-in",
                                }}
                            >
                                {data.username ? (
                                    <form
                                        action="/logout"
                                        method="post"
                                        className="w-full grid"
                                    >
                                        <button
                                            type="submit"
                                            className="button"
                                        >
                                            Salir
                                        </button>
                                    </form>
                                ) : (
                                    <NavLink
                                        to="/login"
                                        className={({ isActive }) =>
                                            `button ${
                                                isActive &&
                                                "pointer-events-none text-orange-600"
                                            }`
                                        }
                                    >
                                        Ingresar
                                    </NavLink>
                                )}
                            </CSSTransition>
                        </SwitchTransition>
                    </div>
                </nav>
                <div className="relative w-full h-[calc(100vh-4rem)]">
                    <main className="absolute inset-y-0 inset-x-4 rounded-md overflow-clip bg-slate-100 shadow-lg dark:bg-gray-800 dark:text-gray-100/90 dark:shadow-2xl">
                        <SwitchTransition>
                            <CSSTransition
                                key={location.pathname.split("/")[1]}
                                timeout={{
                                    enter: 300,
                                    exit: 200,
                                }}
                                classNames={{
                                    enter: "opacity-0 scale-105",
                                    enterActive:
                                        "opacity-1 duration-300 ease-out",
                                    exit: "opacity-1",
                                    exitActive:
                                        "opacity-0 blur-xl duration-200 ease-in",
                                }}
                            >
                                <div className="absolute inset-0 transition">
                                    {outlet}
                                </div>
                            </CSSTransition>
                        </SwitchTransition>
                    </main>
                </div>
                <ScrollRestoration />
                <Scripts />
                <LiveReload />
            </body>
        </html>
    );
}
