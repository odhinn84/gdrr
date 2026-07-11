export const findPapersByIDs = async (ids: string[]) => {
    const res = await fetch('/api/gamePaper/findManyByID', {
        method: 'POST',
        body: JSON.stringify({ ids }),
    })
    return res.json()
}