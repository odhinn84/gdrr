'use client'

// import Columns from "@/app/ui/components/articleFilter/Columns";
// import Pagination from "@/app/ui/components/articleFilter/Pagination";
import TableHeader from "@/app/ui/components/articleFilter/TableHeader";
import TableRow from "@/app/ui/components/articleFilter/TableRow";
import TableRowsSkeleton from "@/app/ui/components/articleFilter/TableRowsSkeleton";
import PaginationFiltered from "@/app/ui/components/articleFiltered/PaginationFiltered";
import { initialDataCols } from "@/lib/api/gameArticle/definitions";
import { fetchAndDownloadCSVSelected, getSelectedCount, setArticleSelected } from "@/lib/api/gameArticle/functions";
import { DataColsKeys, GameArticle } from "@/lib/api/gameArticle/type";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import useSWR, { mutate } from "swr";


export default function ArticleFilter() {
    const router = useRouter();
    const { page } = useParams<{ page: string }>();
    const pageSize = 50
    const tableSkeleton = Array.from({ length: pageSize }, (_, idx) => idx);
    const [tableLoading, setTableLoading] = useState(true);
    const [curMenu, setCurMenu] = useState("선택 기사 보기");
    const [pageIdx, setPageIdx] = useState(1);
    // const [articles, setArticles] = useState<GameArticle[]>([]);
    const [dataCols, setDataCols] = useState<Record<DataColsKeys, boolean>>(initialDataCols);
    // const [totalCount, setTotalCount] = useState(0);
    const [totalPage, setTotalPage] = useState(1);
    const [pageStart, setPageStart] = useState(1);
    const [pageEnd, setPageEnd] = useState(10);
    const [pageLoaded, setPageLoaded] = useState(false);


    const fetcher = async (url: string) => {
        const res = await fetch(url);
        return res.json();
    }
    const url = `/api/gameArticle/findByPageSelected?pageIdx=${pageIdx}&pageSize=${pageSize}`;

    const { data, error } = useSWR(url, fetcher);
    if (error) {
        console.log(error);
    }
    const articles = (data ? data.gameArticles : []) as GameArticle[];

    useEffect(() => {
        const init = async () => {
            try {
                // const resFindArticles = await findArticlesByPageSelected(pageIdx, pageSize);
                // if (resFindArticles.result !== 'success') {
                //     throw new Error("Failed to fetch articles");
                // }
                // const gameArticles = resFindArticles.gameArticles;
                // setArticles(gameArticles);
                setPageIdx(page ? parseInt(page) : 1)
                setDataCols(initialDataCols);
                const resArticlesCount = await getSelectedCount();
                if (resArticlesCount.result !== 'success') {
                    throw new Error("Failed to fetch total count");
                }
                const _totalCount = resArticlesCount.count;
                const _totalPage = Math.ceil(_totalCount / pageSize);
                const _pageStart = Math.floor((pageIdx - 1) / 10) * 10 + 1;
                const _pageEnd = Math.min(_pageStart + 9, _totalPage);
                setPageStart(_pageStart);
                setPageEnd(_pageEnd);
                console.log(_pageStart, _pageEnd)
                console.log(_totalPage)
                setTotalPage(_totalPage);
                setPageLoaded(true);
            } catch (error) {
                console.log(error);
            } finally {
                setTableLoading(false);
            }
        }
        init();
    }, [page, pageIdx]);

    const handleTotal = () => {
        setCurMenu("전체 기사 보기");
        router.push("/articleFilter/1");
    }
    const handleSelected = () => {
        setCurMenu("선택 기사 보기");
        router.push("/articleFiltered/1");
    }
    const isTotal = () => {
        return curMenu === "전체 기사 보기";
    }
    const isSelected = () => {
        return curMenu === "선택 기사 보기";
    }
    const toggleSelectArticle = async (id: string, selected: boolean) => {
        try {
            const resSetArticleSelected = await setArticleSelected(id, selected);
            if (resSetArticleSelected.result !== 'success') {
                throw new Error("Failed to set article selected");
            }
            const newArticles = [...articles];
            for (const article of newArticles) {
                if (article._id === id) {
                    article.selected = selected;
                }
            }
            // setArticles(newArticles);
            mutate(url);
            // console.log(id, selected)
        } catch (error) {
            console.log(error);
        }
    }

    const handleExport = async () => {
        await fetchAndDownloadCSVSelected();
    }
    // const toggleCol = (col: DataColsKeys) => {
    //     const newCols = { ...dataCols };
    //     newCols[col] = !newCols[col];
    //     console.log(newCols)
    //     setDataCols(newCols);
    // }
    return (
        <div className="w-full flex justify-center">
            <div className="container flex flex-col gap-4 mb-20">
                <div>
                    <div className="navbar bg-base-100">
                        <div className="navbar-start">
                            <div className="dropdown">
                                <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M4 6h16M4 12h8m-8 6h16" />
                                    </svg>
                                </div>
                                <ul
                                    tabIndex={0}
                                    className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
                                    <li><a>전체 기사 보기</a></li>
                                    <li><a>선택 기사 보기</a></li>
                                </ul>
                            </div>
                            <a className="btn btn-ghost text-4xl" href="/dashboard">
                                <b>GDRR</b>
                            </a>
                        </div>
                        <div className="navbar-center hidden lg:flex">
                            <ul className="menu menu-horizontal px-1">
                                <li><div className={`${isTotal() && "font-bold"}`}
                                    onClick={handleTotal}>전체 기사 보기</div></li>
                                <li><div className={`${isSelected() && "font-bold"}`}
                                    onClick={handleSelected}>선택 기사 보기</div></li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="divider"></div>
                <div className="flex justify-between items-center">
                    <div><b>Downlaod CSV file</b></div>
                    <button className="btn"
                        onClick={handleExport}
                    >EXPORT</button>
                    {/* <div><b>COLUMNS</b></div>
                    <Columns dataCols={dataCols} toggleCol={toggleCol} /> */}
                </div>
                <div className="divider"></div>
                {pageLoaded ? (<PaginationFiltered pageIdx={pageIdx}
                    pageStart={pageStart}
                    pageEnd={pageEnd}
                    totalPage={totalPage}
                />) : (
                    <div className="skeleton h-12 w-full"></div>
                )}

                <div>
                    <div className="overflow-x-auto">
                        <table className="table">
                            {/* head */}
                            <thead>
                                <TableHeader />
                            </thead>
                            <tbody>
                                {articles.map((article) => {
                                    return (
                                        <TableRow key={article._id}
                                            article={article}
                                            toggleSelectArticle={toggleSelectArticle}
                                            dataCols={dataCols}
                                        />
                                    )
                                })}
                                {tableLoading && tableSkeleton.map((idx) => {
                                    return (
                                        <TableRowsSkeleton key={idx} idx={idx} col={5} />
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
                {pageLoaded ? (<PaginationFiltered pageIdx={pageIdx}
                    pageStart={pageStart}
                    pageEnd={pageEnd}
                    totalPage={totalPage}
                />) : (
                    <div className="skeleton h-12 w-full"></div>
                )}

            </div>
        </div >

    )
}