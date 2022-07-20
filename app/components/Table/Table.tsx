import { useState, useEffect } from "react";
import { useNavigate } from "@remix-run/react";
import { SwitchTransition, CSSTransition } from "react-transition-group";

import { Day } from "~/components/Day";
import { Currency } from "~/components/Currency";

type ComponentProps = {
    data: Pago[] | Cobro[];
    columns: {
        label: string;
        accessor: string;
        sortable: boolean;
        type?: string;
    }[];
    className?: string;
    children?: ReactNode;
};

const Table = ({ data, columns, className, children }: ComponentProps) => {
    const navigate = useNavigate();
    const [tableData, setTableData] = useState<Pago[]>([{}]);
    const [sortField, setSortField] = useState("");
    const [inverse, setInverse] = useState(false);

    const handleSortingChange = (accessor) => {
        setSortField(accessor);
        setInverse(accessor === sortField ? !inverse : false);
    };

    useEffect(() => {
        setSortField(columns[0].sortable ? columns[0].accessor : "");
    }, [columns]);

    useEffect(() => {
        data &&
            sortField &&
            setTableData(
                [...data].sort((a, b) => {
                    if (a[sortField] === null) return 1;
                    if (b[sortField] === null) return -1;
                    if (a[sortField] === null && b[sortField] === null)
                        return 0;
                    return (
                        a[sortField]
                            .toString()
                            .localeCompare(b[sortField].toString(), "en", {
                                numeric: true,
                            }) * (inverse ? -1 : 1)
                    );
                })
            );
    }, [data, sortField, inverse]);

    return (
        <table
            className={`absolute inset-0 grid grid-rows-[auto,1fr] text-center ${className}`}
        >
            <thead className="shadow">
                {children}
                <tr className="grid grid-flow-col auto-cols-fr gap-px">
                    {columns.map(({ label, accessor, sortable }) => (
                        <th
                            key={accessor}
                            onClick={
                                sortable
                                    ? () => handleSortingChange(accessor)
                                    : null
                            }
                            className={`separator p-3 transition ${
                                sortable &&
                                "hover:cursor-pointer hover:text-sky-700"
                            } ${
                                accessor === sortField
                                    ? "font-bold"
                                    : "font-light"
                            }`}
                        >
                            {label}
                            {sortable && (
                                <span className="pl-2 text-slate-900/50">
                                    {sortField === accessor && !inverse
                                        ? "⇂"
                                        : sortField === accessor && inverse
                                        ? "↾"
                                        : ""}
                                </span>
                            )}
                        </th>
                    ))}
                </tr>
            </thead>
            <SwitchTransition>
                <CSSTransition
                    key={JSON.stringify(tableData)}
                    timeout={150}
                    classNames={{
                        enter: "opacity-0 -translate-y-4",
                        enterActive: "opacity-1",
                        exit: "opacity-1",
                        exitActive: "opacity-0",
                    }}
                >
                    <tbody className="transition duration-150 overflow-auto divide-y divide-solid grid content-start">
                        {!tableData[0] ? (
                            <tr className="p-10 text-center text-gray-900/50 grid">
                                <td>No se encontraron resultados</td>
                            </tr>
                        ) : (
                            tableData.map((rowData) => (
                                <tr
                                    key={rowData.id}
                                    onClick={() => navigate(`${rowData.id}`)}
                                    className="grid grid-flow-col auto-cols-fr hover:cursor-pointer hover:bg-sky-700/20"
                                >
                                    {columns.map(({ accessor, type }) => {
                                        const tData = rowData[accessor] || "——";
                                        return (
                                            <td key={accessor} className="p-3">
                                                {type === "day" ? (
                                                    <Day date={tData} />
                                                ) : type === "currency" ? (
                                                    <Currency number={tData} />
                                                ) : (
                                                    <p>{tData}</p>
                                                )}
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))
                        )}
                    </tbody>
                </CSSTransition>
            </SwitchTransition>
        </table>
    );
};

export default Table;
