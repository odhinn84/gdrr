'use client'

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function PaginationFiltered({
    pageIdx,
    pageStart,
    pageEnd,
    totalPage,
}: {
    pageIdx: number,
    pageStart: number,
    pageEnd: number,
    totalPage: number,
}) {
    const [currentPage, setCurrentPage] = useState(pageIdx);
    const pages = Array.from({ length: pageEnd - pageStart + 1 }, (_, idx) => idx + pageStart);
    const router = useRouter();

    useEffect(() => {
        setCurrentPage(pageIdx);
    }, [pageIdx]);


    const handlePage = (page: number) => {
        router.push(`/articleFiltered/${page}`);
    }
    const handlePageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCurrentPage(parseInt(e.target.value));
    }
    const handleGo = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (currentPage < 1 || currentPage > totalPage) {
            return;
        }
        router.push(`/articleFiltered/${currentPage}`);
    }

    return (

        <div className="w-full flex justify-center gap-4">
            <div className="join">
                {pageStart > 1 && (
                    <button className="join-item btn"
                        onClick={() => handlePage(pageStart - 1)}
                    >«</button>
                )}
                {pages.map((page) => {
                    return (
                        <button key={page}
                            className={`join-item btn ${page === pageIdx ? 'btn-active' : ''}`}
                            onClick={() => handlePage(page)}
                        >
                            {page}
                        </button>
                    )
                })}
                {pageEnd < totalPage && (
                    <button className="join-item btn"
                        onClick={() => handlePage(pageEnd + 1)}
                    >»</button>
                )}

            </div>
            <form className="flex gap-8 items-center"
                onSubmit={handleGo}>
                <div className="flex items-center gap-2">
                    <input type="number" className="input input-bordered w-20"
                        value={currentPage}
                        onChange={handlePageChange}
                        max={totalPage}
                    />
                    <div>/</div>
                    <div>{totalPage}</div>
                </div>
                <button className="btn">GO</button>
            </form>
        </div>
    )
}