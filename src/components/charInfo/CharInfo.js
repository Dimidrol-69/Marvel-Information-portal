import { useState, useEffect } from 'react';
import useMarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Skeleton from '../skeleton/Skeleton';
import PropTypes from 'prop-types';
import './charInfo.scss';

const CharInfo = (props) => {
    const [char, setChar] = useState(null);
    const {loading, error, getCharacter, clearError} = useMarvelService();    

    useEffect(() => {
        updateChar();
    }, [props.charId])

    const updateChar = (char) => {
        const {apiKey, charId} = props;
        if (!charId) return;
        clearError();
        getCharacter(apiKey, charId)
            .then(onCharLoaded); 
    }

    const onCharLoaded = (char) => { 
        setChar(char);
    }

    const spinner = loading ? <Spinner/> : null,
          errorMessage = error ? <ErrorMessage/> : null,
          skeleton = char || loading || error ? null : <Skeleton/>,
          content = !(loading || error || !char) ? <View char={char}/> : null;

    return (
        <div className="char__info">
            {spinner}
            {errorMessage}
            {skeleton}
            {content}
        </div>
    )
}

const View = ({char}) => {
    const {name, description, thumbnail, homepage, wiki, comics} = char;
    let imgStyle = {'objectFit' : 'cover'};
        if (thumbnail.includes('image_not_available.jpg')) {
            imgStyle = {'objectFit' : 'unset'}
        }

    return (
        <>
            <div className="char__basics">
                <img src={thumbnail} alt={name} style={imgStyle}/>
                <div>
                    <div className="char__info-name">{name}</div>
                    <div className="char__btns">
                        <a href={homepage} className="button button__main">
                            <div className="inner">homepage</div>
                        </a>
                        <a href={wiki} className="button button__secondary">
                            <div className="inner">Wiki</div>
                        </a>
                    </div>
                </div>
            </div>
            <div className="char__descr">{description}</div>
            <div className="char__comics">Comics:</div>
                {comics.length > 0 ? null : "No comics for this character"}
            <ul className="char__comics-list">
                {comics.map((item, i) => {
                    if (i > 9) return;
                    return (
                        <li className="char__comics-item" key={i}>
                            {item.name}
                        </li>
                    )
                })}
            </ul>
        </>
    )
}

CharInfo.propTypes = {
    charId: PropTypes.number
}

export default CharInfo;