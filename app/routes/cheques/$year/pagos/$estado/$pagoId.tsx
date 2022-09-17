import { useState } from 'react'
import type { ActionFunction, LoaderFunction } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { useActionData, useLoaderData, useNavigate } from '@remix-run/react'

import { requireUserId } from '~/utils/session.server'
import { db } from '~/utils/db.server'
import { Form } from '~/components/Form'
import { Label } from '~/components/Label'
import { CurrencyInput } from '~/components/CurrencyInput'

function validateDestinatario(destinatario: string) {
    if (destinatario === '') {
        return `Seleccione un destinatario`
    }
}

function validateMonto(monto: number) {
    if (monto === '') {
        return `Ingrese un monto`
    }
}

function validatePago(pago: string) {
    if (pago.length < 24) {
        return `Ingrese una fecha de pago`
    }
}

type ActionData = {
    fieldErrors?: {
        estado: string | undefined
        destinatario: string | undefined
        monto: number | undefined
        pago: string | undefined
        numero: string | undefined
        emision: string | undefined
        observaciones: string | undefined
    }
    fields?: {
        estado: string
        destinatario: string
        monto: number
        pago: string
        numero: string
        emision: string
        observaciones: string
    }
}

const badRequest = (data: ActionData) => json(data, { status: 400 })

export const action: ActionFunction = async ({ request, params }) => {
    const userId = await requireUserId(request)
    const form = await request.formData()
    const id = +form.get('id')
    const borrar = form.get('borrar')
    if (borrar === 'true') {
        await db.pagos.delete({
            where: {
                id: id,
            },
        })

        return redirect(`/cheques/${params.year}/pagos/${params.estado}`)
    }
    const estado = form.get('estado')
    const destinatario = form.get('destinatario')
    const monto = form.get('monto').replace(/\./g, '').replace(/,/g, '.')
    const pago = form.get('pago') + 'T00:00:00.000Z'
    const numero = form.get('numero')
    const emision = form.get('emision') + 'T00:00:00.000Z'
    const observaciones = form.get('observaciones')

    const fieldErrors = {
        destinatario: validateDestinatario(destinatario),
        monto: validateMonto(monto),
        pago: validatePago(pago),
    }
    const fields = {
        id,
        estado,
        destinatario,
        monto,
        pago,
        numero,
        emision,
        observaciones,
    }
    if (Object.values(fieldErrors).some(Boolean)) {
        return badRequest({ fieldErrors, fields })
    }

    const currentTime = new Date().toISOString()
    const data = {
        estado,
        monto,
        pago,
        numero,
        emision,
        observaciones,
        destinatarios: {
            connectOrCreate: {
                where: {
                    nombre: destinatario,
                },
                create: {
                    nombre: destinatario,
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
    }
    if (id) {
        await db.pagos.update({
            where: {
                id: id,
            },
            data: data,
        })
    } else {
        await db.pagos.create({
            data: { ...data, createdAt: currentTime },
        })
    }
    return redirect(`/cheques/${params.year}/pagos/${estado}`)
}

type LoaderData = Awaited<ReturnType<typeof getLoaderData>>

async function getLoaderData(userId: number, pagoId?: number) {
    const destinatarios = await db.destinatarios.findMany({
        where: {
            userId: userId,
        },
    })
    if (!pagoId) return { destinatarios }
    const pago = await db.pagos.findUnique({
        where: {
            id: pagoId,
        },
        include: {
            destinatarios: {
                select: {
                    nombre: true,
                },
            },
        },
    })
    pago.destinatario = pago.destinatarios.nombre
    return { destinatarios, pago }
}

export const loader: LoaderFunction = async ({ request, params }) => {
    const userId = await requireUserId(request)
    const pagoId = +params.pagoId || undefined
    return json<LoaderData>(await getLoaderData(userId, pagoId))
}

export default function PagoForm() {
    const actionData = useActionData<ActionData>()
    const data = useLoaderData<LoaderData>()
    const navigate = useNavigate()
    const [modified, setModified] = useState(false)

    return (
        <Form onChange={() => setModified(true)} length={7}>
            <input type='hidden' name='id' value={data?.pago?.id} />
            <Label title='Estado' length={2} htmlFor='estado'>
                <select
                    name='estado'
                    defaultValue={
                        actionData?.fields?.estado || data?.pago?.estado
                    }
                >
                    <option value='a_pagar'>A pagar</option>
                    <option value='pagado'>Pagado</option>
                    <option value='anulado'>Anulado</option>
                    <option value='recuperado'>Recuperado</option>
                    <option value='vencido'>Vencido</option>
                </select>
            </Label>
            <Label
                title='Destinatario'
                length={3}
                error={actionData?.fieldErrors?.destinatario}
            >
                <input
                    list='destinatarios'
                    name='destinatario'
                    defaultValue={
                        actionData?.fields?.destinatario ||
                        data?.pago?.destinatario
                    }
                    placeholder='-'
                    autoComplete='off'
                />
                <datalist id='destinatarios'>
                    {data?.destinatarios.map((item) => (
                        <option key={item.id} value={item.nombre}>
                            {item.nombre}
                        </option>
                    ))}
                </datalist>
            </Label>
            <Label
                title='Monto'
                length={2}
                error={actionData?.fieldErrors?.monto}
            >
                <CurrencyInput
                    name='monto'
                    defaultValue={
                        actionData?.fields?.monto
                            .toString()
                            .replace(/\./g, ',') ||
                        data?.pago?.monto.toString().replace(/\./g, ',')
                    }
                />
            </Label>
            <Label
                title='Fecha de pago'
                length={2}
                error={actionData?.fieldErrors?.pagoDate}
            >
                <input
                    type='date'
                    name='pago'
                    defaultValue={
                        actionData?.fields?.pago.substring(0, 10) ||
                        data?.pago?.pago.substring(0, 10)
                    }
                    placeholder='-'
                    autoComplete='off'
                />
            </Label>
            <Label title='Numero' length={3}>
                <input
                    type='text'
                    name='numero'
                    defaultValue={
                        actionData?.fields?.numero || data?.pago?.numero
                    }
                    placeholder='-'
                    autoComplete='off'
                />
            </Label>
            <Label title='Fecha de emision' length={2}>
                <input
                    type='date'
                    name='emision'
                    defaultValue={
                        actionData?.fields?.emision.substring(0, 10) ||
                        data?.pago?.emision.substring(0, 10) ||
                        new Date().toISOString().substring(0, 10)
                    }
                    placeholder='-'
                    autoComplete='off'
                />
            </Label>
            <Label
                title='Observaciones'
                length={7}
                error={actionData?.fieldErrors?.observaciones}
            >
                <input
                    type='text'
                    name='observaciones'
                    defaultValue={
                        actionData?.fields?.observaciones ||
                        data?.pago?.observaciones
                    }
                    placeholder='-'
                    autoComplete='off'
                />
            </Label>
            <div className='col-span-7 bg-slate-50 dark:bg-gray-800 grid grid-flow-col'>
                <button
                    type='button'
                    onClick={() => navigate('..')}
                    className='button rounded-none'
                >
                    Cancelar
                </button>
                {!modified && data?.pago ? (
                    <button
                        type='submit'
                        name='borrar'
                        value='true'
                        className='button rounded-none text-red-600'
                    >
                        Borrar
                    </button>
                ) : (
                    <button type='submit' className='button rounded-none'>
                        Guardar
                    </button>
                )}
            </div>
        </Form>
    )
}
