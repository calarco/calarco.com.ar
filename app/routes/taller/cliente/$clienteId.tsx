import { useState } from 'react'
import type { LoaderFunction } from '@remix-run/node'
import {
    useLocation,
    useOutlet,
    useLoaderData,
    useParams,
    Link,
} from '@remix-run/react'
import { redirect, json } from '@remix-run/node'
import { SwitchTransition, CSSTransition } from 'react-transition-group'

import { requireUserId } from '~/utils/session.server'
import { db } from '~/utils/db.server'
import { Card } from '~/components/Card'
import { Currency } from '~/components/Currency'

type LoaderData = Awaited<ReturnType<typeof getLoaderData>>

async function getLoaderData(year: number, userId: number) {
    const months = Array.from({ length: 12 }).map((v, index) => ({
        id: index,
        pagos: 0,
        cobros: 0,
    }))
    return months
}

export const loader: LoaderFunction = async ({ request, params }) => {
    if (isNaN(params.clienteId)) {
        return redirect('/taller')
    } else {
        const userId = await requireUserId(request)
        return json<LoaderData>(await getLoaderData(params.clienteId, userId))
    }
}

export default function Cliente() {
    const location = useLocation()
    const params = useParams()
    const clienteId = parseInt(params.clienteId)
    const type = location.pathname.split('/')[3]
    const estado = params.estado
    const outlet = useOutlet()
    const data = useLoaderData<LoaderData>()

    const getTotal = (name: string) => {
        return (
            data
                ?.map((month) => Math.round(month[name]))
                .reduce((prev, next) => prev + next) || 0
        )
    }

    return <div className='col-start-2 bg-slate-100/90 dark:bg-gray-900'>{clienteId}</div>
}
