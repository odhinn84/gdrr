import { DataColsKeys, GameArticle } from "@/lib/api/gameArticle/type";
import { useRouter } from "next/navigation";

export default function TableRow({ article, toggleSelectArticle, dataCols }: {
    article: GameArticle;
    toggleSelectArticle: (id: string, selected: boolean) => void;
    dataCols: Record<DataColsKeys, boolean>;

}) {
    const router = useRouter();
    const handleShowArticle = async (id: string) => {
        router.push(`/article/${id}`);
    }
    return (
        <tr key={article._id}>
            <td>{article["뉴스 식별자"]}</td>
            <td>{article.제목}</td>
            <td>
                {Object.entries(dataCols).map(([column, selected]) => {
                    const typedCol = column as DataColsKeys;
                    if (selected) {
                        if (!article[typedCol] || article[typedCol] === "NaN") {
                            return (
                                <div key={column} className="inline-flex border w-2 h-2 bg-error">
                                </div>
                            )
                        }
                        return (
                            <div key={column} className="inline-flex border w-2 h-2 bg-success">
                            </div>
                        )
                    }
                })}
            </td>
            <td>
                <button className="btn" onClick={() => handleShowArticle(article._id)}>보기</button>
            </td>
            <td>{article.selected ? (
                <button className="btn btn-success"
                    onClick={() => toggleSelectArticle(article._id, false)}>
                    선택됨
                </button>
            ) : (
                <button className="btn btn-error"
                    onClick={() => toggleSelectArticle(article._id, true)}>선택 안 됨</button>
            )}</td>
        </tr>
    );

}
