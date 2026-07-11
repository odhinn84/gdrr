import { GameArticle } from "./type";

export const findArticlesByPage = async (pageIdx: number, pageSize: number) => {
    try {
        const res = await fetch('/api/gameArticle/findByPage', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ pageIdx, pageSize }),
        })
        return res.json()
    } catch (error) {
        return { result: 'failed', error };
    }
}

export const findArticlesByPageSelected = async (pageIdx: number, pageSize: number) => {
    try {
        const res = await fetch('/api/gameArticle/findByPageSelected', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ pageIdx, pageSize }),
        })
        return res.json()
    } catch (error) {
        return { result: 'failed', error };
    }
}

export const setArticleSelected = async (_id: string, selected: boolean) => {
    try {
        const res = await fetch('/api/gameArticle/toggleSelect', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ _id, selected }),
        })
        return res.json()
    } catch (error) {
        return { result: 'failed', error };
    }
}

export const findArticleByID = async (id: string) => {
    try {
        const res = await fetch('/api/gameArticle/findByID', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id }),
        })
        return res.json()
    } catch (error) {
        return { result: 'failed', error };
    }
}

export const findArticlesByIDs = async (ids: string[]) => {
    try {
        const res = await fetch('/api/gameArticle/findManyByID', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ids }),
        })
        return res.json()
    } catch (error) {
        return { result: 'failed', error };
    }
}

export const getTotalCount = async () => {
    try {
        const res = await fetch('/api/gameArticle/count', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        return res.json()
    } catch (error) {
        return { result: 'failed', error };
    }
}

export const getSelectedCount = async () => {
    try {
        const res = await fetch('/api/gameArticle/countSelected', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        return res.json()
    } catch (error) {
        return { result: 'failed', error };
    }
}

const escapeCSV = (str: string) => {
    if (typeof str !== 'string') return str;
    // 따옴표 escape -> 따옴표를 두 번 사용
    const escaped = str.replace(/"/g, '""');
    // 콤마, 줄 바꿈 포함 시 전체를 따옴표로 감싸기
    return `"${escaped}"`;
}

const convertToCSV = (data: GameArticle[]) => {
    const header = Object.keys(data[0]).join(',');

    const rows = data.map((article) =>
        Object.values(article).map(value => escapeCSV(String(value))).join(',')
    );

    // UTF-8 BOM 추가
    return '\ufeff' + header + '\n' + rows.join('\n');
}

const downloadCSV = (csv: string) => {
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'gameArticles.csv';
    a.click();
    window.URL.revokeObjectURL(url);
}

export const fetchAndDownloadCSVSelected = async () => {
    try {
        const res = await fetch('/api/gameArticle/findAllSelected');
        const data = await res.json();
        if (!data || data.result !== 'success' || data.gameArticles.length == 0) {
            throw new Error('Failed to fetch data');
        }
        const csv = convertToCSV(data.gameArticles);
        downloadCSV(csv);
    } catch (error) {
        console.log(error);

    }
}