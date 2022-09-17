import type { ReactNode } from 'react'
import {
    Meta,
    Links,
    NavLink,
    Form,
    ScrollRestoration,
    Scripts,
    LiveReload,
} from '@remix-run/react'
import { SwitchTransition, CSSTransition } from 'react-transition-group'
import { ClientOnly } from 'remix-utils'

import { Background } from '~/components/Background'

export default function Html({
    username,
    children,
}: {
    username?: string
    children: ReactNode
}) {
    return (
        <html lang='es'>
            <head>
                <Meta />
                <Links />
            </head>
            <body className='h-screen w-screen overflow-clip select-none bg-slate-300 dark:bg-[#000] text-gray-900/90 dark:text-gray-100/80 font-sans'>
                <nav className='h-13 px-4 py-1.5 grid justify-between items-center grid-flow-col'>
                    <div className='w-64 relative grid justify-start'>
                        <NavLink
                            to='/'
                            className={({ isActive }) =>
                                `button ${
                                    isActive &&
                                    'pointer-events-none text-orange-600 dark:text-orange-500'
                                }`
                            }
                        >
                            Inicio
                        </NavLink>
                    </div>
                    <div className='w-full grid justify-center grid-flow-col gap-px'>
                        <NavLink
                            to='/cheques'
                            className={({ isActive }) =>
                                `button ${
                                    isActive &&
                                    'pointer-events-none text-orange-600 dark:text-orange-500'
                                }`
                            }
                        >
                            Cheques
                        </NavLink>
                        <NavLink
                            to='/taller'
                            className={({ isActive }) =>
                                `button ${
                                    isActive &&
                                    'pointer-events-none text-orange-600 dark:text-orange-500'
                                }`
                            }
                        >
                            Taller
                        </NavLink>
                    </div>
                    <div className='w-64 relative grid justify-end'>
                        <SwitchTransition>
                            <CSSTransition
                                key={username || true}
                                timeout={{
                                    enter: 300,
                                    exit: 200,
                                }}
                                classNames={{
                                    enter: 'opacity-0 scale-105',
                                    enterActive:
                                        'opacity-1 duration-300 ease-out',
                                    exit: 'opacity-1',
                                    exitActive:
                                        'opacity-0 blur-xl duration-200 ease-in',
                                }}
                            >
                                {username ? (
                                    <Form
                                        action='/logout'
                                        method='post'
                                        className='w-full grid'
                                    >
                                        <button
                                            type='submit'
                                            className='button'
                                        >
                                            Salir
                                        </button>
                                    </Form>
                                ) : (
                                    <NavLink
                                        to='/login'
                                        className={({ isActive }) =>
                                            `button ${
                                                isActive &&
                                                'pointer-events-none text-orange-600'
                                            }`
                                        }
                                    >
                                        Ingresar
                                    </NavLink>
                                )}
                            </CSSTransition>
                        </SwitchTransition>
                    </div>
                </nav>
                <div className='relative w-full h-[calc(100vh-4rem)]'>
                    <main className='absolute inset-y-0 inset-x-4 rounded-md overflow-clip bg-[#ececec] dark:bg-[#0f0f0f] shadow-lg dark:shadow-2xl'>
                        <ClientOnly>{() => <Background />}</ClientOnly>
                        {children}
                    </main>
                </div>
                <ScrollRestoration />
                <Scripts />
                <LiveReload />
            </body>
        </html>
    )
}
