import type { ActionFunction,LoaderFunction } from '@remix-run/node'
import {
    useLoaderData,
    useNavigate,
} from '@remix-run/react'
import { json, redirect } from '@remix-run/node'

import { requireUserId } from '~/utils/session.server'
import { db } from '~/utils/db.server'
import { Form } from '~/components/Form'
import { Label } from '~/components/Label'

function validateFabricante(destinatario: string) {
    if (destinatario === '') {
        return `Seleccione un destinatario`
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

        return redirect(`/taller`)
    }
    const fabricante = form.get('fabricante')

    const fieldErrors = {
        fabricante: validateFabricante(fabricante),
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
    await db.pagos.create({
        data: { ...data, createdAt: currentTime },
    })
    return redirect(`/taller`)
}

type LoaderData = Awaited<ReturnType<typeof getLoaderData>>

async function getLoaderData(userId: number) {
    const fabricantes = await db.fabricantes.findMany({
        where: {
            userId: userId,
        },
    })
    return { fabricantes }
}

export const loader: LoaderFunction = async ({ request }) => {
    const userId = await requireUserId(request)
    return json<LoaderData>(await getLoaderData(userId))
}

export default function Cliente() {
    const navigate = useNavigate()
    const data = useLoaderData<LoaderData>()

    return (
        <div className='col-start-2 overflow-auto p-6 bg-slate-100/60 dark:bg-gray-900/70 backdrop-blur grid items-center'>
            <Form length={2}>
                <Label title='Fecha' length={2}>
                    <input
                        type='date'
                        name='pago'
                        placeholder='-'
                        autoComplete='off'
                    />
                </Label>
                <Label title='Motivo' length={2}>
                    <input
                        type='text'
                        name='observaciones'
                        placeholder='-'
                        autoComplete='off'
                    />
                </Label>
                <Label title='Fabricante' length={1}>
                    <input
                        list='destinatarios'
                        name='destinatario'
                        placeholder='-'
                        autoComplete='off'
                    />
                    <datalist id='destinatarios'>
                        {data?.fabricantes.map((item) => (
                            <option key={item.id} value={item.nombre}>
                                {item.nombre}
                            </option>
                        ))}
                    </datalist>
                </Label>
                <Label title='Modelo' length={1}>
                    <input
                        list='destinatarios'
                        name='destinatario'
                        placeholder='-'
                        autoComplete='off'
                    />
                    <datalist id='destinatarios'>
                        {data?.fabricantes.map((item) => (
                            <option key={item.id} value={item.nombre}>
                                {item.nombre}
                            </option>
                        ))}
                    </datalist>
                </Label>
                <div className='col-span-2 bg-slate-50 dark:bg-gray-800 grid grid-flow-col'>
                    <button
                        type='button'
                        onClick={() => navigate('..')}
                        className='button rounded-none'
                    >
                        Cancelar
                    </button>
                    <button type='submit' className='button rounded-none'>
                        Guardar
                    </button>
                </div>
            </Form>
        </div>
    )
}
