export const toDate = date => {
    return new Intl.DateTimeFormat('ru-Ru', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        // hour: '2-digit',
        // minute: '2-digit',
        // second: '2-digit'
    }).format(new Date(date))
}


export const translateColumn = (name) => {
    let rename = "";
    if (name === "name") rename = "Имя"
    if (name === "amount") rename = "Количество"
    if (name === "distance") rename = "Расстояние"
    return rename
}


export const paginator = (ps, iCount, cPage) => {
    let pagesCount = Math.ceil(iCount / ps)
    let pages = [];
    for (let i = 1; i <= pagesCount; i++) {
        pages.push(i);
    }
    let curP = cPage;
    let curPF = ((curP - 5) < 0) ? 0 : curP - 5;
    let curPL = curP + 5;
    let slicedPages = pages.slice(curPF, curPL);
    return slicedPages;
}