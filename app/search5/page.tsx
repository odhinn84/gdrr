'use client'

import { getEmbeddingScoreMaxes, ScoreMaxResult } from '@/lib/api/embedding/functions';
// import { Theme } from '@/lib/api/gemini/createReport';
import { createReportOpenAI, initialReport, Report, userPromptCreateReportOpenAI_v3 } from '@/lib/api/openai/createReport';
import { getQueryParaphraseListOpenAI, getQuerySuggestionOpenAI } from '@/lib/api/openai/paraphrase';
import { getQueryParaphraseOpenAI } from '@/lib/api/openai/paraphrase';
import { getGameArticlesByIDs } from '@/lib/api/supabase/gameArticle';
import { getGamePapersByIDs } from '@/lib/api/supabase/gamePaper';
import { findEmbeddingArticlesSupabase, findEmbeddingPapersSupabase, findEmbeddingTotalSupabase, getEmbeddingOpenAI } from '@/lib/search/functions';
import Link from 'next/link';
import { useState } from 'react';

// interface EmbeddingResult {
//     article_id: string;
//     score: number;
//     title?: string;
//     textType?: string
//     content?: string;
// }

export default function Page() {
    const [query, setQuery] = useState('');
    const [queryList, setQueryList] = useState<string[]>([]);
    const [searchLoading, setSearchLoading] = useState(false);
    const [embeddingResult, setEmbeddingResult] = useState<ScoreMaxResult[]>([]);
    const [createReportTemplate, setCreateReportTemplate] = useState("");
    const [report, setReport] = useState<Report>(initialReport);
    // const [references, setReferences] = useState<Record<string, string>>({});
    const [similarityThreshold, setSimilarityThreshold] = useState(0.3);
    const [articleChecked, setArticleChecked] = useState(true);
    const [paperChecked, setPaperChecked] = useState(true);
    // const [inputFocused, setInputFocused] = useState(false);
    const [suggestedQueries, setSuggestedQueries] = useState<string[]>([]);
    const [suggestedQueriesLoading, setSuggestedQueriesLoading] = useState(false);
    const handleQuerySuggestion = async () => {
        setSuggestedQueries(() => []);
        setSuggestedQueriesLoading(true);
        try {
            const res_getQuerySuggestion = await getQuerySuggestionOpenAI(query);
            if (res_getQuerySuggestion.result === "success") {
                console.log(res_getQuerySuggestion.queryList.queries)
                const _queries = [query, ...res_getQuerySuggestion.queryList.queries];
                setSuggestedQueries(_queries);
            } else {
                throw new Error("Failed to get query suggestion");
            }
        } catch (error) {
            console.error(error);
        }
        setSuggestedQueriesLoading(false);
    }

    const searchQuery = async (query: string) => {
        setSearchLoading(true);
        setQueryList([]);
        setEmbeddingResult([]);
        setCreateReportTemplate("");
        setReport(initialReport);
        // setReferences({});
        setSuggestedQueries(() => []);

        console.log(query);
        // Query Expansion
        const res_getQueryParaphrase = await getQueryParaphraseOpenAI(query);
        console.log(res_getQueryParaphrase)

        const paraphraseList = await getQueryParaphraseListOpenAI(res_getQueryParaphrase);
        if (paraphraseList.length === 0) {
            paraphraseList.push(query);
        }
        console.log(paraphraseList)
        setQueryList(paraphraseList);

        // Get Embeddings with PromiseAll
        const embeddings = await Promise.all(
            paraphraseList.map(paraphrase => getEmbeddingOpenAI(paraphrase))
        )
        console.log(embeddings)

        let _findEmbeddingSupabase = findEmbeddingTotalSupabase
        if (articleChecked && !paperChecked) {
            _findEmbeddingSupabase = findEmbeddingArticlesSupabase
        } else if (!articleChecked && paperChecked) {
            _findEmbeddingSupabase = findEmbeddingPapersSupabase
        } else if (!articleChecked && !paperChecked) {
            alert("둘 중 하나는 반드시 체크해야 합니다.")
            throw new Error("둘 중 하나는 반드시 체크해야 합니다.")
        }

        const embeddingResults = await Promise.all(
            embeddings.map(embedding => _findEmbeddingSupabase(embedding.data[0].embedding, similarityThreshold, 10))
        )
        console.log(embeddingResults)

        // merge list (list of list => list)
        const embeddingResult = []
        for (const er of embeddingResults) {
            if (er.data) {
                for (const item of er.data) {
                    embeddingResult.push(item)
                }
            }
        }
        console.log(embeddingResult)
        if (embeddingResult.length === 0) {
            alert("검색 결과가 없습니다. 유사도 임계치를 낮추거나 검색어를 바꿔보세요.")
            setSearchLoading(false);
            return;
        }

        // sort by score
        embeddingResult.sort((a, b) => b.score - a.score)
        console.log(embeddingResult)

        let scoreMaxes = getEmbeddingScoreMaxes(embeddingResult)
        console.log(scoreMaxes)

        const gameArticlesIDs = scoreMaxes.filter(item => item.textType === 'article').map(item => item.article_id)
        const gamePapersIDs = scoreMaxes.filter(item => item.textType === 'paper').map(item => item.paper_id)

        console.log(gameArticlesIDs)
        console.log(gamePapersIDs)

        const gameArticles = (await getGameArticlesByIDs(gameArticlesIDs)).data
        console.log(gameArticles)

        const gamePapers = (await getGamePapersByIDs(gamePapersIDs)).data
        console.log(gamePapers)

        const titles = {} as Record<string, string>
        const contents = {} as Record<string, string>
        const urls = {} as Record<string, string>
        gameArticles.forEach(item => {
            titles[item.id] = item["제목"]
            contents[item.id] = item.text
            urls[item.id] = item["URL"]
        })
        gamePapers.forEach(item => {
            titles[item.paper_id] = item.title
            contents[item.paper_id] = item.abstract
            urls[item.paper_id] = item.url
        })

        console.log(titles)
        console.log(contents)

        for (const item of scoreMaxes) {
            if (item.textType === 'article') {
                item.title = titles[item.article_id]
                item.content = contents[item.article_id]
                item.url = urls[item.article_id]
            } else {
                item.title = titles[item.paper_id]
                item.content = contents[item.paper_id]
                item.url = urls[item.paper_id]
            }
        }
        // remove if title or url is empty
        scoreMaxes = scoreMaxes.filter(item => item.title && item.url)

        console.log(scoreMaxes)
        setEmbeddingResult(scoreMaxes)

        const top5 = scoreMaxes.slice(0, 5)
        const top5Documents = top5.map((item, index) => ({
            label: `문서 ${index + 1}`,
            title: item.title,
            content: item.content
        }))
        console.log(top5Documents)
        setCreateReportTemplate(userPromptCreateReportOpenAI_v3(query, top5Documents))
        const res_createReport = await createReportOpenAI(query, top5Documents)
        console.log(res_createReport)
        setReport(res_createReport.report)
        // const _references = {} as Record<string, string>
        // for (const reference of res_createReport.report.references) {
        //     _references[reference.label] = reference.title
        // }
        // setReferences(_references)

        // const top5Contents = top5.map(item => item.content).filter(item => item !== undefined) as string[]
        // console.log(top5Contents)
        // setCreateReportTemplate(userPromptCreateReport(top5Contents))

        // const res_createReport = await createReport(top5Contents)

        // console.log(res_createReport)
        // if (res_createReport.result === "success") {
        //     setReport(res_createReport.report)
        // }
        setSearchLoading(false);
    }

    const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await searchQuery(query);
    }

    return (
        <div className="w-full flex justify-center">
            <div className="container  mb-40">
                <div className="text-2xl m-8">
                    <b>검색</b>
                </div>
                <form onSubmit={handleSearch} className="flex flex-col gap-6">

                    <div className="flex gap-2">
                        <input className="input input-bordered w-full" type="text" placeholder="검색어를 입력하세요"
                            value={query} onChange={(e) => setQuery(e.target.value)}
                            disabled={searchLoading}
                        />
                        <button className="btn btn-primary" type="button" onClick={handleQuerySuggestion}
                            disabled={searchLoading || suggestedQueriesLoading || (!articleChecked && !paperChecked)}>
                            검색어 제안
                        </button>
                        <button className="btn btn-primary" type="submit"
                            disabled={searchLoading || suggestedQueriesLoading || (!articleChecked && !paperChecked)}
                        >
                            {searchLoading ? <span className="loading loading-spinner"></span> : '검색'}
                        </button>
                    </div>
                    {suggestedQueries.length > 0 && (
                        <div className='flex flex-col gap-2 bg-base-200 p-4 rounded-lg'>
                            <div><b>검색 예시</b></div>
                            {suggestedQueries.map(q => {
                                return (
                                    <div className='flex gap-2 items-center' key={q}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                                        </svg>
                                        <span className='link link-hover' onClick={() => { setQuery(q); searchQuery(q) }}>{q}</span>
                                    </div>
                                )

                            })}

                        </div>
                    )}

                    <div className="w-full max-w-xs flex flex-col gap-4">
                        <div className='flex gap-2 items-center'>
                            <div><b>유사도 임계치</b> ({similarityThreshold}) </div>
                            <div><button className="btn btn-xs btn-neutral" type="button" onClick={() => setSimilarityThreshold(0.3)}>초기화</button></div>
                            <div className="tooltip cursor-pointer" data-tip="쿼리 벡터와 문서 벡터 간의 코사인 유사도를 계산해, 설정한 임계치를 넘는 문서를 찾습니다.">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                                </svg>
                            </div>
                        </div>
                        <div className='pl-8'>
                            <input type="range" min={0} max="1" value={similarityThreshold} onChange={(e) => setSimilarityThreshold(Number(e.target.value))} className="range" step="0.01" />
                            <div className="flex justify-between px-2.5 text-xs">
                                <span>|</span>
                                <span>|</span>
                                <span>|</span>
                                <span>|</span>
                                <span>|</span>
                                <span>|</span>
                            </div>
                            <div className="flex justify-between px-2.5 text-xs">
                                <span>0</span>
                                <span>0.2</span>
                                <span>0.4</span>
                                <span>0.6</span>
                                <span>0.8</span>
                                <span>1</span>
                            </div>
                        </div>

                    </div>
                    <div className="w-full max-w-xs flex flex-col gap-4">
                        <div><b>문서 종류</b></div>
                        <div className="flex gap-8 pl-8">
                            <div className="flex gap-2">
                                <input id="article" type="checkbox" checked={articleChecked} onChange={(e) => setArticleChecked(e.target.checked)} className="checkbox" />
                                <label htmlFor="article">기사</label>
                            </div>
                            <div className="flex gap-2">
                                <input id="paper" type="checkbox" checked={paperChecked} onChange={(e) => setPaperChecked(e.target.checked)} className="checkbox" />
                                <label htmlFor="paper">논문</label>
                            </div>
                        </div>
                        {(!articleChecked && !paperChecked) && (
                            <div className='text-sm text-red-500'>
                                둘 중 하나는 반드시 체크해야 합니다.
                            </div>
                        )}
                    </div>

                </form>
                <div className='divider'></div>
                {queryList.length > 0 && (
                    <>
                        <div className='text-xl p-4 flex gap-2 items-center'>
                            <b>Query Expansion</b>
                            <div className="tooltip cursor-pointer" data-tip="적절한 문서 검색을 위한 확장 검색어. 입력된 검색어 를 기반으로 GPT를 통해 유사한 검색어를 자동 생성">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                                </svg>
                            </div>
                        </div>
                        <div className='flex flex-col p-4'>
                            {queryList.map((item: string) => (
                                <div key={item} className='px-4'>
                                    {item}
                                </div>
                            ))}
                        </div>
                        <div className='divider'></div>
                    </>
                )}
                {queryList.length === 0 && searchLoading && (
                    <>
                        <div className='text-xl p-4 flex gap-2 items-center'>
                            <b>Query Expansion</b>
                            <div className="tooltip cursor-pointer" data-tip="적절한 문서 검색을 위한 확장 검색어. 입력된 검색어 를 기반으로 GPT를 통해 유사한 검색어를 자동 생성">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                                </svg>
                            </div>
                        </div>
                        <div className='px-8'><span className="loading loading-spinner"></span></div>
                        <div className='divider'></div>
                    </>
                )}

                {createReportTemplate.length > 0 && (
                    <>
                        <div className="collapse bg-base-100 border-base-300 border overflow-visible">
                            <input type="checkbox" />
                            <div className="collapse-title font-semibold flex gap-2 items-center">
                                <div>Report Templete</div>
                                <div className="tooltip cursor-pointer z-50" data-tip="보고서 자동 생성을 위한 프롬프트. 검색된 문서 내용을 담아 이 내용대로 GPT에 입력됨">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                                    </svg>
                                </div>
                            </div>
                            <div className="collapse-content text-sm">
                                <pre className='whitespace-pre-wrap'>
                                    {createReportTemplate}
                                </pre>
                            </div>
                        </div>
                        {/* <div className='text-xl p-4'>
                            <b>Report Template</b>
                        </div>
                        <div className='p-4'>
                            <pre className='whitespace-pre-wrap'>
                                {createReportTemplate}
                            </pre>
                        </div>
                        <div className='divider'></div> */}
                    </>
                )}
                {createReportTemplate.length === 0 && searchLoading && (
                    <>
                        <div className='text-xl p-4 flex gap-2 items-center'>
                            <b>Report Templete</b>
                            <div className="tooltip cursor-pointer" data-tip="보고서 자동 생성을 위한 프롬프트. 검색된 문서 내용을 담아 이 내용대로 GPT에 입력됨">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                                </svg>
                            </div>
                        </div>
                        <div className='px-8'><span className="loading loading-spinner"></span></div>
                        <div className='divider'></div>
                    </>
                )}

                {report.title !== "" && (
                    <>
                        <div className='text-xl p-4 flex gap-2 items-center'>
                            <b>Report</b>
                            <div className="tooltip cursor-pointer" data-tip="Report Templete에 의해 실제 생성된 결과물">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                                </svg>
                            </div>
                        </div>
                        <div className='flex flex-col p-4'>
                            <div className='text-xl p-4'>
                                <b>{report.title}</b>
                            </div>
                            <div className='text-sm p-4'>
                                {report.introduction}
                            </div>
                            {report.sections.map((section) => (
                                <div key={section.heading} className='text-sm p-4'>
                                    <b>{section.heading}</b>
                                    <div className='text-sm'>
                                        {section.content}
                                        {/* <span className='flex flex-wrap gap-2'>(
                                            {section.citations.map((citation) => {
                                                return (
                                                    <span key={citation} className="tooltip" data-tip={references[citation]}>
                                                        {citation}
                                                    </span>
                                                )
                                            })}
                                            )
                                        </span> */}

                                    </div>
                                </div>
                            ))}
                            <div className='text-sm p-4'>
                                {report.conclusion}
                            </div>
                            {/* <div className='text-sm p-4'>
                                {report.references.map((reference) => (
                                    <div key={reference.label}>
                                        {reference.label}
                                    </div>
                                ))}
                            </div> */}
                        </div>
                        <div className='divider'></div>
                    </>
                )}
                {report.title === "" && searchLoading && (
                    <>
                        <div className='text-xl p-4 flex gap-2 items-center'>
                            <b>Report</b>
                            <div className="tooltip cursor-pointer" data-tip="Report Templete에 의해 실제 생성된 결과물">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                                </svg>
                            </div>
                        </div>
                        <div className='px-8'><span className="loading loading-spinner"></span></div>
                        <div className='divider'></div>
                    </>
                )}
                <div className='text-xl p-4'>
                    <b>검색된 문서들</b>
                </div>

                <table className='table'>
                    <thead>
                        <tr>
                            {/* <th>id</th> */}
                            <th>제목</th>
                            <th>유형</th>
                            <th>점수</th>
                        </tr>
                    </thead>
                    <tbody>
                        {embeddingResult.map((item) => (
                            item.textType === 'article' ? (
                                <tr key={item.article_id + item.similarity} className='hover'>
                                    {/* <td>{item.article_id}</td> */}
                                    <td>
                                        {/* <Link className='link' href={`/article/${item.article_id}`}>{item.title}</Link> */}
                                        <Link className='link' href={`${item.url}`} target='_blank'>{item.title}</Link>
                                    </td>
                                    <td>
                                        {item.textType === 'article' && '기사'}
                                        {/* {item.texttype === 'paper' && '논문'} */}
                                    </td>
                                    <td>{item.similarity}</td>
                                </tr>
                            ) : (
                                <tr key={item.paper_id + item.similarity} className='hover'>
                                    {/* <td>{item.paper_id}</td> */}
                                    <td>
                                        {/* <Link className='link' href={`/paper/${item.paper_id}`}>{item.title}</Link> */}
                                        <Link className='link' href={`${item.url}`} target='_blank'>{item.title}</Link>
                                    </td>
                                    <td>
                                        {/* {item.texttype === 'article' && '기사'} */}
                                        {item.textType === 'paper' && '논문'}
                                    </td>
                                    <td>{item.similarity}</td>
                                </tr>
                            )
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}