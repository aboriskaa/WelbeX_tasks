import * as axios from "axios";


const instance = axios.create({
    // withCredentials: true,
    baseURL: "http://localhost:3001/api/1.0"
});

export const getItems = {
    requestItems(currentPage = 1, pageSize = 5, columnName = "", cond = "", items = "") {
        return instance.get(`items/?page=${currentPage}&count=${pageSize}&column=${columnName}&cond=${cond}&items=${items}`).then(response => {
            return response.data;
        });
    },
    countItems(columnName = "", cond = "", items = "") {
        return instance.get(`count/?column=${columnName}&cond=${cond}&items=${items}`).then(response => {
            return response.data;
        });
    },
    requestColumns() {
        return instance.get(`columns`).then(response => {
            return response.data;
        });
    }
}