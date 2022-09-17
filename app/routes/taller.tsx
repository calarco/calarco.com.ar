import type { LoaderFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import { useLoaderData, useLocation, useOutlet, Link } from '@remix-run/react'
import { SwitchTransition, CSSTransition } from 'react-transition-group'

import { requireUserId } from '~/utils/session.server'
import { db } from '~/utils/db.server'

type LoaderData = Awaited<ReturnType<typeof getLoaderData>>

async function getLoaderData(userId: number) {
    const turnos = await db.turnos.findMany({
        where: {
            userId: userId,
        },
        select: {
            id: true,
            fecha: true,
            motivo: true,
            modelos: {
                select: {
                    nombre: true,
                },
            },
        },
    })
    return turnos
}

export const loader: LoaderFunction = async ({ request }) => {
    const userId = await requireUserId(request)
    return json<LoaderData>(await getLoaderData(userId))
}

export default function Cheques() {
    const data = useLoaderData<LoaderData>()
    const location = useLocation()
    const clienteId = location.pathname.split('/')[2]
    const outlet = useOutlet()

    return (
        <div className='w-full h-full bg-slate-100 dark:bg-gray-900 grid grid-cols-[3fr,2fr]'>
            <section className='relative bg-slate-50 dark:bg-gray-800 shadow-lg dark:shadow-2xl'>
                <div className='h-16 shadow grid grid-cols-[2fr,5fr,2fr] gap-px justify-between items-center'>
                    <div className='px-3 grid items-center'>
                        <Link
                            to='nuevo'
                            className='button border border-1 border-gray-200 dark:border-gray-600'
                        >
                            <span className='font-mono'>+</span> Presupuesto
                        </Link>
                    </div>
                    <div className='px-3 grid items-center'>
                        <input
                            type='search'
                            name='search'
                            placeholder='Buscar clientes, vehiculos y presupuestos'
                            className='bg-slate-100 dark:bg-gray-900 shadow-inner'
                            autoComplete='off'
                        />
                    </div>
                    <div className='px-3 grid items-center'>
                        <Link
                            to='nuevo'
                            className='button border border-1 border-gray-200 dark:border-gray-600'
                        >
                            <span className='font-mono'>+</span> Cliente
                        </Link>
                    </div>
                </div>
                <Link to='cliente/2' className='flex'>
                    <div className='p-8'>Sebastian Calarco</div>
                    <div className='p-8'>FDG977</div>
                </Link>
            </section>
            <aside>
                <div className='h-16 shadow grid grid-cols-[3fr,1fr] gap-px justify-between items-center'>
                    <div className='px-3 grid items-center'>Turnos</div>
                    <div className='px-3 grid items-center'>
                        <Link
                            to='turno'
                            className='button border border-1 border-gray-200 dark:border-gray-600'
                        >
                            Nuevo
                        </Link>
                    </div>
                </div>
                {data?.map((data) => (
                    <div className='flex'>
                        <div className='p-8'>{data.motivo}</div>
                        <div className='p-8'>Servicio</div>
                    </div>
                ))}
            </aside>
            <SwitchTransition mode='in-out'>
                <CSSTransition
                    key={clienteId}
                    timeout={{
                        enter: 300,
                        exit: 150,
                    }}
                    classNames={{
                        enter: 'opacity-0',
                        enterActive: 'opacity-1 duration-300 ease-out',
                        exit: 'opacity-1',
                        exitActive: 'opacity-0 duration-150 ease-in',
                    }}
                >
                    <div
                        className={`transition absolute inset-0 grid grid-cols-[3fr,2fr] ${
                            clienteId ? 'visible' : 'invisible'
                        }`}
                    >
                        {outlet}
                    </div>
                </CSSTransition>
            </SwitchTransition>
        </div>
    )
}
