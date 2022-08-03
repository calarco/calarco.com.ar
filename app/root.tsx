import type {
    MetaFunction,
    LinksFunction,
    LoaderFunction,
} from "@remix-run/node";
import {
    useCatch,
    useLocation,
    useOutlet,
    useLoaderData,
} from "@remix-run/react";
import { json } from "@remix-run/node";
import { SwitchTransition, CSSTransition } from "react-transition-group";

import { Html } from "~/components/Html";
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

export function CatchBoundary() {
    const caught = useCatch();
    return (
        <Html>
            <div className="absolute inset-0 grid items-center content-center gap-8 text-center">
                <h1 className="text-2xl text-red-500 dark:text-red-500">
                    {caught.status} {caught.statusText}
                </h1>
            </div>
        </Html>
    );
}

export function ErrorBoundary({ error }) {
    console.error(error);
    return (
        <Html>
            <div className="absolute inset-0 grid items-center content-center gap-8 text-center">
                <h1 className="font-mono text-2xl text-red-500 dark:text-red-500">
                    error
                </h1>
                <h2 className="text-lg text-red-500/70">{error.message}</h2>
            </div>
        </Html>
    );
}

export default function App() {
    const location = useLocation();
    const outlet = useOutlet();
    const data = useLoaderData<LoaderData>();

    return (
        <Html username={data?.username}>
            <SwitchTransition>
                <CSSTransition
                    key={location.pathname.split("/")[1]}
                    timeout={{
                        enter: 300,
                        exit: 200,
                    }}
                    classNames={{
                        enter: "opacity-0 scale-105",
                        enterActive: "opacity-1 duration-300 ease-out",
                        exit: "opacity-1",
                        exitActive: "opacity-0 blur-xl duration-200 ease-in",
                    }}
                >
                    <div className="absolute inset-0 transition">{outlet}</div>
                </CSSTransition>
            </SwitchTransition>
        </Html>
    );
}
