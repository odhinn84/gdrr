'use client'

import { findArticleByID, setArticleSelected } from "@/lib/api/gameArticle/functions"
import { GameArticle } from "@/lib/api/gameArticle/type"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"

export default function Page() {
    const { id } = useParams<{ id: string }>()
    const [gameArticle, setGameArticle] = useState<GameArticle | null>(null)
    const [selected, setSelected] = useState(false)
    useEffect(() => {
        const init = async () => {
            console.log(id)
            try {
                const res_findArticleByID = await findArticleByID(id)
                if (res_findArticleByID.result !== 'success') {
                    throw new Error("Failed to fetch article")
                }
                const gameArticle = res_findArticleByID.gameArticle
                console.log(gameArticle)
                setGameArticle(gameArticle)
                setSelected(gameArticle.selected)
            } catch (error) {
                console.log(error)
            }
        }
        init()
    }, [id])
    const toggleSelectArticle = async (_selected: boolean) => {
        try {
            if (!gameArticle) {
                throw new Error("No gameArticle")
            }
            const resSetArticleSelected = await setArticleSelected(gameArticle._id, _selected);
            if (resSetArticleSelected.result !== 'success') {
                throw new Error("Failed to set article selected");
            }
            setSelected(_selected)
            // console.log(id, selected)
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <div className="w-full flex justify-center">
            <div className="container flex flex-col gap-4 mb-40">
                <div>
                    <div className="navbar bg-base-100">
                        <div className="navbar-start">
                            <a className="btn btn-ghost text-4xl" href="/dashboard">
                                <b>GDRR</b>
                            </a>
                        </div>
                    </div>
                </div>
                <div className="divider"></div>
                <div className="flex flex-col gap-2">
                    {Object.entries(gameArticle || {}).map(([key, value]) => {
                        return (
                            <div key={key} className="flex flex-col justify-between">
                                <div className="">
                                    <b>{key}</b>
                                </div>
                                <div className={`${(!value || value === "NaN") && "bg-red-100"}`}>
                                    {value}
                                </div>
                                {key === "selected" && (
                                    <div>
                                        {selected ? (
                                            <button className="btn btn-success"
                                                onClick={() => toggleSelectArticle(false)}>
                                                선택됨
                                            </button>
                                        ) : (
                                            <button className="btn btn-error"
                                                onClick={() => toggleSelectArticle(true)}>선택 안 됨</button>
                                        )}
                                    </div>
                                )}
                            </div>
                        )
                    }
                    )}
                </div>


            </div>
        </div >

    )
}