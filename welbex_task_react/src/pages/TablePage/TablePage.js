import React, { useEffect, useState } from 'react';
import M from 'materialize-css';
import { getItems } from '../../api/api';
import TableRow from './TableRow/TableRow';
import Preloader from '../../components/Preloader/Preloader'
import { toDate, translateColumn, paginator } from '../../components/Tools'

const TablePage = () => {
    //local state - основной массив данных table1 
    const [items, setItems] = useState([]);
    //local state - название колонок таблицы  table1
    const [columnsName, setColumnsName] = useState([]);
    //local state - вводимые значения текстового поля 
    const [inputValue, setInputValue] = useState("");
    //local state - выпадающий список названия колонок
    const [selectNameValue, setSelectNameValue] = useState("");
    //local state - выпадающий список условий выбора
    const [selectConditionValue, setSelectConditionValue] = useState("");
    //local state - статус загрузки основной таблицы
    const [isLoad, setIsLoad] = useState(false);
    //local state - учет количества записей
    const [itemsCount, setItemsCount] = useState(0);
    //local state - установка выбранной текущей страницы
    const [currentPage, setCurrentPage] = useState(1);

    let pageSize = 5;

    useEffect(() => {
        getItems.requestItems(currentPage, pageSize, selectNameValue, selectConditionValue, inputValue).then(req => {
            let newItems = [...req];
            setItems(newItems);
            getItems.requestColumns().then(req => {
                getItems.countItems(selectNameValue, selectConditionValue, inputValue).then(req => {
                    let [count] = [...req];
                    count = count.count;
                    setItemsCount(count);
                    setIsLoad(true);
                }).catch(err => {
                    console.log(err.message);
                });
                let someColumns = req.filter(i => i.column_name !== "id" && i.column_name !== "date");
                setColumnsName(someColumns);
                let selects = document.querySelectorAll('select');
                M.FormSelect.init(selects, {});
                M.updateTextFields();
            }).catch(err => {
                console.log(err.message);
            });

        }).catch(err => {
            console.log(err.message);
        });
    }, [selectNameValue, selectConditionValue, inputValue, currentPage, isLoad, pageSize]);

    return (
        !isLoad ? <Preloader /> :
            <>
                <div className="row">
                    <div className="input-field col s12 m4">
                        <select onChange={(e) => setSelectNameValue(e.target.value)}>
                            <option value={0} selected>Выбор колонки для фильтрации</option>
                            {columnsName.map(i => {
                                return <option key={i.column_name} value={i.column_name}>{translateColumn(i.column_name)}
                                </option>
                            })}
                        </select>
                        <label></label>
                    </div>
                    <div className="input-field col s12 m4">
                        <select onChange={(e) => setSelectConditionValue(e.target.value)}>
                            <option value="0" selected>Выбор условия</option>
                            <option value="equals">Равно</option>
                            <option value="contains">Содержит</option>
                            <option value="more">Больше</option>
                            <option value="less">Меньше</option>
                        </select>
                        <label></label>
                    </div>
                    <div className="input-field col m4">
                        <input onChange={(e) => {
                            setInputValue(e.target.value);
                            setCurrentPage(1);
                        }} placeholder="Значение" id="first_name" type="text" className="validate" />
                        <label htmlFor="first_name"></label>
                    </div>
                </div>
                {items.length < 1 ?
                    <div>
                        <h5 class="center-align">Отсутствуют значения соответствующие условиям выбора</h5>
                    </div> :
                    <div>
                        <table className="centered">
                            <thead>
                                <tr>
                                    <th>Дата</th>
                                    <th>Название</th>
                                    <th>Количество</th>
                                    <th>Расстояние</th>
                                </tr>
                            </thead>

                            <tbody>
                                {items.map((i) => { return (<TableRow date={toDate(i.date)} name={i.name} amount={i.amount} distance={i.distance} />) })}
                            </tbody>
                        </table>
                        <ul className="pagination center">
                            <li className={currentPage === 1 ? "disabled" : "waves-effect"}><a href="#!" onClick={() => { setCurrentPage(currentPage - 1) }}><i className="material-icons">chevron_left</i></a></li>
                            {
                                paginator(5, itemsCount, currentPage).map(p => {
                                    return <li className={currentPage === p ? "active" : "waves-effect"} >
                                        <a href="#!" onClick={() => { setCurrentPage(p) }}>{p}</a>
                                    </li>
                                })
                            }
                            <li className={currentPage === paginator(pageSize, itemsCount, currentPage).length ? "disabled" : "waves-effect"}><a href="#!" onClick={() => { setCurrentPage(currentPage + 1) }}><i className="material-icons">chevron_right</i></a></li>
                        </ul>
                    </div>}
            </>
    );
}

export default TablePage;