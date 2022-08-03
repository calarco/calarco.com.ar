import type { ActionFunction } from "@remix-run/node";
import { useSearchParams, useActionData } from "@remix-run/react";
import { json } from "@remix-run/node";

import { login, createUserSession } from "~/utils/session.server";
import { Form } from "~/components/Form";
import { Label } from "~/components/Label";

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
                formError: "Usuario o contraseña incorrectos",
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
            <Form>
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
                <div className="w-full bg-slate-50 dark:bg-gray-900 grid">
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
                <button
                    type="submit"
                    className="button bg-slate-50 dark:bg-gray-900"
                >
                    Probar
                </button>
            </Form>
        </div>
    );
}
