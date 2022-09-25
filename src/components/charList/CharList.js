import {useState, useEffect, useRef} from 'react';
import { PropTypes } from 'prop-types';
import Spinner from '../spinner/Spinner';
import useMarvelService from '../../services/MarvelService';
import ErrorMessage from '../errorMessage/ErrorMessage';
import './charList.scss';

const CharList = (props) => {
    const [charList, setCharList] = useState([]),                   // Массив персонажей с сервера
          [newItemLoading, setNewItemLoading] = useState(false),    // Подгрузка дополнительных персонажей
          [offset, setOffset] = useState(210),                      // Начальное значение для массива персонажей на сервере
          [charEnded, setCharEnded] = useState(false);              // Отвечает за конец массива персонажей
    
    const {loading, error, getAllCharacters} = useMarvelService();

    useEffect(() => {
        onRequest(offset);
    }, [])

    const onRequest = (offset) => {
        getAllCharacters(props.apiKey, offset)
            .then(onCharListLoaded);
    }

    const onCharListLoaded = (newCharList) => {
        setCharList(charList => [...charList, ...newCharList]);
        setNewItemLoading(newItemLoading => false);
        setOffset(offset + 9);
        if (newCharList.length < 9) setCharEnded(true);                     //Условие конца массива персонажей
    }

    const itemRefs = useRef([]);

    // Делает активным выбранный компонент
    const focusOnItem = (id) => {
        itemRefs.current.forEach(item => item.classList.remove('char__item_selected'));
        itemRefs.current[id].classList.add('char__item_selected');
        itemRefs.current[id].focus();
    }

    function renderItems(arr) {
        return arr.map((item, i) => {
            let imgStyle = {'objectFit' : 'cover'};
                if (item.thumbnail.includes('image_not_available.jpg')) {
                    imgStyle = {'objectFit' : 'unset'}
                }
            return (
                <li className="char__item" 
                    key={item.id}
                    tabIndex={0}
                    ref={el => itemRefs.current[i] = el}
                    onClick={() => {props.onCharSelected(item.id); 
                                    focusOnItem(i)}}
                    onKeyPress={(e) => {
                        if (e.key === ' ' || e.key === "Enter") {
                            props.onCharSelected(item.id);
                            focusOnItem(i);
                        }
                    }}>
                    <img src={item.thumbnail} alt={item.name} style={imgStyle}/>
                    <div className="char__name">{item.name}</div>
                </li>
            )
        })
    }

    const items = renderItems(charList);
    const errorMessage = error ? <ErrorMessage /> : null,
          spinner = loading && !newItemLoading ? <Spinner /> : null;

        return (
            <div className="char__list">
                    {errorMessage}
                    {spinner}
                <ul className="char__grid">
                    {items}
                </ul>
                <button className="button button__main button__long"
                        disabled={newItemLoading}
                        style={{"display": charEnded ? "none" : "block"}}
                        onClick={() => {
                            onRequest(offset)
                            setNewItemLoading(true)
                        }}>
                    <div className="inner">load more</div>
                </button>
            </div>
        )
}

CharList.propTypes = {
    onCharSelected: PropTypes.func.isRequired
}

export default CharList;