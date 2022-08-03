import { useState } from "react";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useActionData, useLoaderData, useNavigate } from "@remix-run/react";
import MaskedInput from "react-text-mask";

import { requireUserId } from "~/utils/session.server";
import { db } from "~/utils/db.server";
import { Form } from "~/components/Form";
import { Label } from "~/components/Label";
import { CurrencyInput } from "~/components/CurrencyInput";

function validateLibrador(librador: string) {
    if (librador === "") {
        return `Seleccione un librador`;
    }
}

function validateBanco(banco: string) {
    if (banco === "") {
        return `Seleccione un banco`;
    }
}

function validateTitular(titular: string) {
    if (titular === "") {
        return `Ingrese un titular`;
    }
}

function validateCuit(cuit: string) {
    if (cuit === "") {
        return `Ingrese un cuit`;
    }
}

function validateMonto(monto: number) {
    if (monto === "") {
        return `Ingrese un monto`;
    }
}

function validatePago(deposito: string) {
    if (deposito.length < 24) {
        return `Ingrese una fecha de pago`;
    }
}

type ActionData = {
    fieldErrors?: {
        estado: string | undefined;
        librador: string | undefined;
        monto: number | undefined;
        deposito: string | undefined;
        numero: string | undefined;
        emision: string | undefined;
        banco: string | undefined;
        titular: string | undefined;
        cuit: string | undefined;
        observaciones: string | undefined;
    };
    fields?: {
        estado: string;
        librador: string;
        monto: number;
        deposito: string;
        numero: string;
        emision: string;
        banco: string;
        titular: string;
        cuit: string;
        observaciones: string;
    };
};

const badRequest = (data: ActionData) => json(data, { status: 400 });

export const action: ActionFunction = async ({ request, params }) => {
    const userId = await requireUserId(request);
    const form = await request.formData();
    const id = +form.get("id");
    const borrar = form.get("borrar");
    if (borrar === "true") {
        await db.cobros.delete({
            where: {
                id: id,
            },
        });

        return redirect(`/cheques/${params.year}/cobros/${params.estado}`);
    }
    const estado = form.get("estado");
    const librador = form.get("librador");
    const monto = form.get("monto").replace(/\./g, "").replace(/,/g, ".");
    const deposito = form.get("deposito") + "T00:00:00.000Z";
    const numero = form.get("numero");
    const emision = form.get("emision") + "T00:00:00.000Z";
    const banco = form.get("banco");
    const titular = form.get("titular");
    const cuit = form.get("cuit");
    const observaciones = form.get("observaciones");

    const fieldErrors = {
        librador: validateLibrador(librador),
        monto: validateMonto(monto),
        deposito: validatePago(deposito),
        banco: validateBanco(banco),
        titular: validateTitular(titular),
        cuit: validateCuit(cuit),
    };
    const fields = {
        id,
        estado,
        librador,
        monto,
        deposito,
        numero,
        emision,
        banco,
        titular,
        cuit,
        observaciones,
    };
    if (Object.values(fieldErrors).some(Boolean)) {
        return badRequest({ fieldErrors, fields });
    }

    const currentTime = new Date().toISOString();
    const data = {
        estado,
        monto,
        deposito,
        numero,
        emision,
        titular,
        cuit,
        observaciones,
        libradores: {
            connectOrCreate: {
                where: {
                    nombre: librador,
                },
                create: {
                    nombre: librador,
                    createdAt: currentTime,
                    updatedAt: currentTime,
                    userId: userId,
                },
            },
        },
        bancos: {
            connectOrCreate: {
                where: {
                    nombre: banco,
                },
                create: {
                    nombre: banco,
                    createdAt: currentTime,
                    updatedAt: currentTime,
                    userId: userId,
                },
            },
        },
        users: {
            connect: {
                id: userId,
            },
        },
        updatedAt: currentTime,
    };
    if (id) {
        await db.cobros.update({
            where: {
                id: id,
            },
            data: data,
        });
    } else {
        await db.cobros.create({
            data: { ...data, createdAt: currentTime },
        });
    }
    return redirect(`/cheques/${params.year}/cobros/${estado}`);
};

type LoaderData = Awaited<ReturnType<typeof getLoaderData>>;

async function getLoaderData(cobroId?: number, userId: number) {
    const libradores = await db.libradores.findMany({
        where: {
            userId: userId,
        },
    });
    const bancos = await db.bancos.findMany();
    if (!cobroId) return { libradores, bancos };
    const cobro = await db.cobros.findUnique({
        where: {
            id: cobroId,
        },
        include: {
            libradores: {
                select: {
                    nombre: true,
                },
            },
            bancos: {
                select: {
                    nombre: true,
                },
            },
        },
    });
    cobro.librador = cobro.libradores.nombre;
    cobro.banco = cobro.bancos.nombre;
    return { libradores, bancos, cobro };
}

export const loader: LoaderFunction = async ({ request, params }) => {
    const userId = await requireUserId(request);
    const cobroId = +params.cobroId || undefined;
    return json<LoaderData>(await getLoaderData(cobroId, userId));
};

export default function CobroForm() {
    const actionData = useActionData<ActionData>();
    const data = useLoaderData<LoaderData>();
    const navigate = useNavigate();
    const [modified, setModified] = useState(false);

    return (
        <Form length={7} onChange={() => setModified(true)}>
            <input type="hidden" name="id" value={data?.cobro?.id} />
            <Label title="Estado" length={2}>
                <select
                    name="estado"
                    defaultValue={
                        actionData?.fields?.estado || data?.cobro?.estado
                    }
                >
                    <option value="a_depositar">A depositar</option>
                    <option value="depositado">Depositado</option>
                    <option value="anulado">Anulado</option>
                    <option value="posdatado">Posdatado</option>
                    <option value="endosado">Endosado</option>
                    <option value="devuelto">Devuelto</option>
                    <option value="falla tecnica">Falla tecnica</option>
                    <option value="rechazado">Rechazado</option>
                </select>
            </Label>
            <Label
                title="Librador"
                length={3}
                error={actionData?.fieldErrors?.librador}
            >
                <input
                    list="libradores"
                    name="librador"
                    defaultValue={
                        actionData?.fields?.librador || data?.cobro?.librador
                    }
                    placeholder="-"
                    autoComplete="off"
                />
                <datalist id="libradores">
                    {data?.libradores.map((item) => (
                        <option key={item.id} value={item.nombre}>
                            {item.nombre}
                        </option>
                    ))}
                </datalist>
            </Label>
            <Label
                title="Monto"
                length={2}
                error={actionData?.fieldErrors?.monto}
            >
                <CurrencyInput
                    name="monto"
                    defaultValue={
                        actionData?.fields?.monto
                            .toString()
                            .replace(/\./g, ",") ||
                        data?.cobro?.monto.toString().replace(/\./g, ",")
                    }
                />
            </Label>
            <Label
                title="Fecha de deposito"
                length={2}
                error={actionData?.fieldErrors?.depositoDate}
            >
                <input
                    type="date"
                    name="deposito"
                    defaultValue={
                        actionData?.fields?.deposito.substring(0, 10) ||
                        data?.cobro?.deposito.substring(0, 10)
                    }
                    placeholder="-"
                    autoComplete="off"
                />
            </Label>
            <Label title="Numero" length={3}>
                <input
                    type="text"
                    name="numero"
                    defaultValue={
                        actionData?.fields?.numero || data?.cobro?.numero
                    }
                    placeholder="-"
                    autoComplete="off"
                />
            </Label>
            <Label title="Fecha de emision" length={2}>
                <input
                    type="date"
                    name="emision"
                    defaultValue={
                        actionData?.fields?.emision.substring(0, 10) ||
                        data?.cobro?.emision.substring(0, 10) ||
                        new Date().toISOString().substring(0, 10)
                    }
                    placeholder="-"
                    autoComplete="off"
                />
            </Label>
            <Label
                title="Banco"
                length={2}
                error={actionData?.fieldErrors?.banco}
            >
                <input
                    list="bancos"
                    name="banco"
                    defaultValue={
                        actionData?.fields?.banco || data?.cobro?.banco
                    }
                    placeholder="-"
                    autoComplete="off"
                />
                <datalist id="bancos">
                    {data?.bancos.map((item) => (
                        <option key={item.id} value={item.nombre}>
                            {item.nombre}
                        </option>
                    ))}
                </datalist>
            </Label>
            <Label
                title="Titular"
                length={3}
                error={actionData?.fieldErrors?.titular}
            >
                <input
                    type="text"
                    name="titular"
                    defaultValue={
                        actionData?.fields?.titular || data?.cobro?.titular
                    }
                    placeholder="-"
                    autoComplete="off"
                />
            </Label>
            <Label
                title="CUIT"
                length={2}
                error={actionData?.fieldErrors?.cuit}
            >
                <MaskedInput
                    mask={[
                        /\d/,
                        /\d/,
                        "-",
                        /\d/,
                        /\d/,
                        /\d/,
                        /\d/,
                        /\d/,
                        /\d/,
                        /\d/,
                        /\d/,
                        "-",
                        /\d/,
                    ]}
                    guide={false}
                    type="text"
                    inputMode="numeric"
                    name="cuit"
                    defaultValue={actionData?.fields?.cuit || data?.cobro?.cuit}
                    placeholder="-"
                    autoComplete="off"
                />
            </Label>
            <Label
                title="Observaciones"
                length={7}
                error={actionData?.fieldErrors?.observaciones}
            >
                <input
                    type="text"
                    name="observaciones"
                    defaultValue={
                        actionData?.fields?.observaciones ||
                        data?.cobro?.observaciones
                    }
                    placeholder="-"
                    autoComplete="off"
                />
            </Label>
            <div className="col-span-7 bg-slate-50 dark:bg-gray-900 grid grid-flow-col">
                <button
                    type="button"
                    onClick={() => navigate("..")}
                    className="button rounded-none"
                >
                    Cancelar
                </button>
                {!modified && data?.cobro ? (
                    <button
                        type="submit"
                        name="borrar"
                        value="true"
                        className="button rounded-none text-red-600"
                    >
                        Borrar
                    </button>
                ) : (
                    <button type="submit" className="button rounded-none">
                        Guardar
                    </button>
                )}
            </div>
        </Form>
    );
}
