import type { ActionFunction } from "@remix-run/node";
import { useSearchParams, useActionData } from "@remix-run/react";
import { json } from "@remix-run/node";

import styles from "~/styles/login.css";
import { login, createUserSession } from "~/utils/session.server";
import { Form } from "~/components/Form";
import { Label } from "~/components/Label";

export const links: LinksFunction = () => [{ rel: "stylesheet", href: styles }];

type ActionData = {
    formError?: string;
};

export const action: ActionFunction = async ({ request }) => {
    const form = await request.formData();
    const username = form.get("username");
    const password = form.get("password");
    const redirectTo = form.get("redirectTo") || "/";
    const user = await login({ username, password });
    if (!user) {
        return json(
            {
                formError: `Usuario o contraseña incorrectos`,
            },
            { status: 400 }
        );
    }
    return createUserSession(user.id, redirectTo);
};

export default function Login() {
    const [searchParams] = useSearchParams();
    const actionData = useActionData<ActionData>();

    return (
        <div className="h-full py-10 grid justify-center items-center grid-rows-[1fr,auto]">
            <div className="absolute inset-0 overflow-clip contrast-[15] bg-blue-100">
                <div class="bubblel"></div>
                <div class="bubblel"></div>
                <div class="bubblel"></div>
                <div class="bubblel"></div>
                <div class="bubblel"></div>
                <div class="bubblel"></div>
            </div>
            <div className="absolute inset-0 overflow-clip">
                <div className="noise" />
            </div>
            <Form className="shadow-sky-200/50">
                <input
                    type="hidden"
                    name="redirectTo"
                    value={searchParams.get("redirectTo") ?? undefined}
                />
                <Label title="Usuario" error={actionData?.formError}>
                    <input
                        type="text"
                        name="username"
                        autoComplete="username"
                        placeholder="-"
                    />
                </Label>
                <Label title="Contraseña">
                    <input
                        type="password"
                        name="password"
                        autoComplete="current-password"
                        placeholder="-"
                    />
                </Label>
                <div className="w-full bg-slate-50 grid">
                    <button type="submit" className="button rounded-none">
                        Iniciar Sesion
                    </button>
                </div>
            </Form>
            <Form>
                <input
                    type="hidden"
                    name="redirectTo"
                    value={searchParams.get("redirectTo") ?? undefined}
                />
                <input type="hidden" name="username" value="test" />
                <input type="hidden" name="password" value="test" />
                <button type="submit" className="button bg-slate-50">
                    Probar
                </button>
            </Form>
        </div>
    );
}
