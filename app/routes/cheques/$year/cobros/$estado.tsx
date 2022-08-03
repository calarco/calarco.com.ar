import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
    useLoaderData,
    useNavigate,
    useParams,
    useLocation,
    useOutlet,
    Link,
} from "@remix-run/react";
import { SwitchTransition, CSSTransition } from "react-transition-group";

import { requireUserId } from "~/utils/session.server";
import { db } from "~/utils/db.server";
import { Table } from "~/components/Table";

type LoaderData = Awaited<ReturnType<typeof getLoaderData>>;

async function getLoaderData(estado: string, userId: number) {
    const cobros = await db.cobros.findMany({
        where: {
            estado: estado,
            userId: userId,
        },
        select: {
            id: true,
            deposito: true,
            libradores: {
                select: {
                    nombre: true,
                },
            },
            monto: true,
            emision: true,
        },
    });
    cobros.forEach((cobro) => {
        cobro.librador = cobro.libradores.nombre;
    });
    return cobros;
}

export const loader: LoaderFunction = async ({ request, params }) => {
    const userId = await requireUserId(request);
    const estado = params.estado;
    return json<LoaderData>(await getLoaderData(estado, userId));
};

export default function Pagos() {
    const data = useLoaderData<LoaderData>();
    const navigate = useNavigate();
    const params = useParams();
    const location = useLocation();
    const cobroId = location.pathname.split("/")[5];
    const outlet = useOutlet();

    return (
        <>
            <Table
                data={data}
                columns={[
                    {
                        label: "Fecha de deposito",
                        accessor: "deposito",
                        sortable: true,
                        type: "day",
                    },
                    {
                        label: "Librador",
                        accessor: "librador",
                        sortable: true,
                    },
                    {
                        label: "Monto",
                        accessor: "monto",
                        sortable: true,
                        type: "currency",
                    },
                    {
                        label: "Fecha de emision",
                        accessor: "emision",
                        sortable: true,
                        type: "day",
                    },
                ]}
            >
                <tr className="h-16 grid grid-cols-[1fr,2fr,1fr] gap-px justify-between items-center">
                    <th className="pl-6 pr-3 grid items-center">
                        <form method="get" className="grid items-center">
                            <select
                                name="estado"
                                value={params.estado}
                                onChange={(e) =>
                                    navigate(`../${e.currentTarget.value}`)
                                }
                            >
                                <option value="a_depositar">A depositar</option>
                                <option value="depositado">Depositado</option>
                                <option value="anulado">Anulado</option>
                                <option value="posdatado">Posdatado</option>
                                <option value="endosado">Endosado</option>
                                <option value="devuelto">Devuelto</option>
                                <option value="falla tecnica">
                                    Falla tecnica
                                </option>
                                <option value="rechazado">Rechazado</option>
                            </select>
                        </form>
                    </th>
                    <th className="px-3 grid items-center">
                        <div className="overflow-clip rounded-md bg-slate-100 dark:bg-gray-800 shadow-inner grid grid-flow-col gap-px">
                            <Link
                                to="../../pagos/a_pagar"
                                className="button rounded-none"
                            >
                                Pagos
                            </Link>
                            <Link
                                to="../a_depositar"
                                className="button rounded-none text-orange-600 dark:text-orange-500"
                            >
                                Cobros
                            </Link>
                        </div>
                    </th>
                    <th className="pl-3 pr-6 grid items-center">
                        <Link
                            to="nuevo"
                            className="button border border-1 border-gray-200 dark:border-gray-600"
                        >
                            Nuevo
                        </Link>
                    </th>
                </tr>
            </Table>
            <SwitchTransition mode="in-out">
                <CSSTransition
                    key={cobroId}
                    timeout={{
                        enter: 200,
                        exit: 150,
                    }}
                    classNames={{
                        enter: "opacity-0 -translate-y-4",
                        enterActive: "opacity-1 duration-200 ease-out",
                        exit: "opacity-1",
                        exitActive:
                            "opacity-0 -translate-y-4 duration-150 ease-in",
                    }}
                >
                    <div
                        className={`transition absolute inset-0 overflow-auto p-6 bg-slate-100/60 dark:bg-[#111]/70 backdrop-blur grid items-center ${
                            cobroId ? "visible" : "invisible"
                        }`}
                    >
                        <div
                            onClick={() => navigate(".")}
                            className="absolute inset-0"
                        />
                        {outlet}
                    </div>
                </CSSTransition>
            </SwitchTransition>
        </>
    );
}
