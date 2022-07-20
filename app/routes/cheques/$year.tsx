import { useState } from "react";
import type { LoaderFunction } from "@remix-run/node";
import {
    useLocation,
    useOutlet,
    useLoaderData,
    useParams,
    Link,
} from "@remix-run/react";
import { redirect, json } from "@remix-run/node";
import { SwitchTransition, CSSTransition } from "react-transition-group";

import { requireUserId } from "~/utils/session.server";
import { db } from "~/utils/db.server";
import { Card } from "~/components/Card";
import { Currency } from "~/components/Currency";

type LoaderData = Awaited<ReturnType<typeof getLoaderData>>;

async function getLoaderData(year: number, userId: number) {
    const months = Array.from({ length: 12 }).map((v, index) => ({
        id: index,
        pagos: 0,
        cobros: 0,
    }));
    for (const month of months) {
        const period = {
            gte: `${year}-${(month.id + 1)
                .toString()
                .padStart(2, "0")}-01T00:00:00.000Z`,
            lte: `${year}-${(month.id + 1)
                .toString()
                .padStart(2, "0")}-${new Date(
                year,
                month.id + 1,
                0
            ).getDate()}T00:00:00.000Z`,
        };
        const [pagos, cobros] = await Promise.all([
            db.pagos.aggregate({
                _sum: {
                    monto: true,
                },
                where: {
                    pago: period,
                    userId: userId,
                    OR: [
                        {
                            estado: "a_pagar",
                        },
                        {
                            estado: "pagado",
                        },
                    ],
                },
            }),
            db.cobros.aggregate({
                _sum: {
                    monto: true,
                },
                where: {
                    deposito: period,
                    userId: userId,
                    OR: [
                        {
                            estado: "a_depositar",
                        },
                        {
                            estado: "depositado",
                        },
                    ],
                },
            }),
        ]);
        month.pagos = pagos._sum.monto || 0;
        month.cobros = cobros._sum.monto || 0;
    }
    return months;
}

export const loader: LoaderFunction = async ({ request, params }) => {
    if (isNaN(params.year) || !params.estado) {
        return redirect("/cheques");
    } else {
        const userId = await requireUserId(request);
        return json<LoaderData>(await getLoaderData(params.year, userId));
    }
};

export default function Year() {
    const location = useLocation();
    const params = useParams();
    const year = parseInt(params.year);
    const type = location.pathname.split("/")[3];
    const estado = params.estado;
    const outlet = useOutlet();
    const data = useLoaderData<LoaderData>();
    const [activeMonth, setActiveMonth] = useState(new Date().getMonth());

    const getTotal = (name: string) => {
        return (
            data
                ?.map((month) => Math.round(month[name]))
                .reduce((prev, next) => prev + next) || 0
        );
    };

    return (
        <>
            <section className="h-[calc(100vh-4rem)] relative z-40 bg-slate-50 shadow-lg grid dark:bg-slate-700 dark:shadow-2xl">
                <SwitchTransition>
                    <CSSTransition
                        key={type}
                        timeout={{
                            enter: 300,
                            exit: 150,
                        }}
                        classNames={{
                            enter: "opacity-0",
                            enterActive: "opacity-1 duration-300 ease-out",
                            exit: "opacity-1",
                            exitActive: "opacity-0 duration-150 ease-in",
                        }}
                    >
                        <div className="transition absolute inset-0">
                            {outlet}
                        </div>
                    </CSSTransition>
                </SwitchTransition>
            </section>
            <aside className="h-[calc(100vh-4rem)] grid grid-rows-[auto,1fr]">
                <div className="w-full shadow border-none grid items-center">
                    <div className="py-3 px-6 grid grid-flow-col justify-between items-center">
                        <div className="overflow-clip rounded-md bg-slate-50 shadow grid grid-flow-col items-center">
                            <Link
                                to={`../${year - 1}/${type}/${estado}`}
                                className="button rounded-none"
                            >
                                {"<"}
                            </Link>
                            <SwitchTransition>
                                <CSSTransition
                                    key={year}
                                    timeout={150}
                                    classNames={{
                                        enter: "opacity-0 -translate-y-4",
                                        enterActive: "opacity-1",
                                        exit: "opacity-1",
                                        exitActive: "opacity-0",
                                    }}
                                >
                                    <Link
                                        to={`../${new Date().getFullYear()}/${type}/${estado}`}
                                        className="button rounded-none font-mono text-orange-600"
                                    >
                                        {year}
                                    </Link>
                                </CSSTransition>
                            </SwitchTransition>
                            <Link
                                to={`../${year + 1}/${type}/${estado}`}
                                className="button rounded-none"
                            >
                                {">"}
                            </Link>
                        </div>
                        <Currency
                            number={getTotal("cobros") - getTotal("pagos")}
                            integer
                        />
                    </div>
                    <div className="grid grid-flow-col auto-cols-fr">
                        <div className="py-3 px-6 h-12 grid grid-flow-col justify-between items-center">
                            <label className="text-gray-900/50">Pagos:</label>
                            <Currency number={getTotal("pagos")} integer />
                        </div>
                        <div className="separator py-3 px-6 h-12 grid grid-flow-col justify-between items-center">
                            <label className="text-gray-900/50">Cobros:</label>
                            <Currency number={getTotal("cobros")} integer />
                        </div>
                    </div>
                </div>
                <div className="overflow-auto grid content-start divide-y divide-solid divide-gray-500/20">
                    {data?.map((month) => (
                        <Card
                            key={month.id}
                            isActive={activeMonth === month.id}
                        >
                            <div
                                className="py-3 px-6 grid grid-flow-col justify-between items-center"
                                onClick={() => {
                                    setActiveMonth(month.id);
                                }}
                            >
                                <h4 className="capitalize font-bold">
                                    {new Date(
                                        year,
                                        month.id,
                                        1
                                    ).toLocaleDateString("default", {
                                        month: "long",
                                    })}
                                </h4>
                                <Currency
                                    number={month.cobros - month.pagos}
                                    integer
                                />
                            </div>
                            <div
                                className={`transition-all duration-200 ${
                                    activeMonth === month.id
                                        ? "max-h-[3rem]"
                                        : "max-h-0"
                                } overflow-clip grid grid-flow-col auto-cols-fr`}
                            >
                                <div className="py-3 px-6 h-12 grid grid-flow-col justify-between items-center">
                                    <label className="text-gray-900/50">
                                        Pagos:
                                    </label>
                                    <Currency number={month.pagos} integer />
                                </div>
                                <div className="separator py-3 px-6 h-12 grid grid-flow-col justify-between items-center">
                                    <label className="text-gray-900/50">
                                        Cobros:
                                    </label>
                                    <Currency number={month.cobros} integer />
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </aside>
        </>
    );
}
