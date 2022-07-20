import type { LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Outlet } from "@remix-run/react";

export const loader: LoaderFunction = async ({ params }) => {
    if (!params.year) {
        return redirect(`/cheques/${new Date().getFullYear()}/pagos/a_pagar`);
    } else if (!params.estado) {
        return redirect(`/cheques/${params.year}/pagos/a_pagar`);
    } else {
        return null;
    }
};

export default function Cheques() {
    return (
        <div className="grid grid-cols-[2fr,1fr]">
            <Outlet />
        </div>
    );
}
