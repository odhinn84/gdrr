import { DataColsKeys } from "@/lib/api/gameArticle/type"

export default function Columns({ dataCols, toggleCol }
    : { dataCols: Record<DataColsKeys, boolean>, toggleCol: (col: DataColsKeys) => void }) {

    return (
        <div className="w-full">
            <div className="">
                {Object.entries(dataCols).map(([column, selected]) => {
                    const typedCol = column as DataColsKeys;
                    return (
                        <div key={column} className="inline-flex items-center gap-1 px-2 mx-2 cursor-pointer">
                            <input type="checkbox" checked={selected}
                                onChange={() => toggleCol(typedCol)}
                                className="checkbox" />
                            <span className="label-text">{column}</span>
                        </div>
                    )
                })}

            </div>
        </div>

    )
}