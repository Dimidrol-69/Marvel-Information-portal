import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Spinner from '../spinner/Spinner';
import useMarvelService from '../../services/MarvelService';
import ErrorMessage from '../errorMessage/ErrorMessage';
import './comicsList.scss';

const ComicsList = (props) => {
    const [comicsList, setComicsList] = useState([]),
          [offset, setOffset] = useState(0),
          [newItemLoading, setNewItemLoading] = useState(false),
          [comicsEnded, setComicsEnded] = useState(false);

    const {loading, error, getAllComics} = useMarvelService();

    useEffect(() => {
        onRequest(offset); 
    }, []);

    const onRequest = (offset) => {
        getAllComics(props.apiKey, offset)
            .then(onComicsListLoaded)
    }
    
    const onComicsListLoaded = (newComicsList) => {
        setComicsList(comicsList => [...comicsList, ...newComicsList]);
        setOffset(offset + 8);
        setNewItemLoading(false);
        if (newComicsList.length < 8) setComicsEnded(true);
    }

    function renderItems(arr) {
        return arr.map((item, i) => {
            return (
                <li className="comics__item"
                    key={i}
                    tabIndex={0}>
                    <Link to={`/comics/${item.id}`}>
                        <img src={item.thumbnail} alt={item.title} className="comics__item-img"/>
                        <div className="comics__item-name">{item.title}</div>
                        <div className="comics__item-price">{item.price}</div>
                    </Link>
                </li>
            )
        })
    }

    const items = renderItems(comicsList);
    const errorMessage = error ? <ErrorMessage /> : null,
          spinner = loading && !newItemLoading ? <Spinner /> : null;

    return (
        <div className="comics__list">
                {errorMessage}
                {spinner}
            <ul className="comics__grid">
                {items}
            </ul>
            <button className="button button__main button__long"
                onClick={() => {onRequest(offset); 
                                setNewItemLoading(true)}}
                disabled={newItemLoading}
                style={{'display': comicsEnded ? 'none' : 'block'}}>
                <div className="inner">load more</div>
            </button>
        </div>
    )
}

export default ComicsList;