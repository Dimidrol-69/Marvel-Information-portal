import {useHttp} from '../components/hooks/http.hook';

const useMarvelService = () => {
    const {loading, request, error, clearError} = useHttp();
    const _apiBase = 'https://gateway.marvel.com:443/v1/public/', 
          _baseOffset = 210;

    //Запрос на получение 9 персонажей
    const getAllCharacters = async (apiKey, offset = _baseOffset) => {
        const res = await request(`${_apiBase}characters?limit=9&offset=${offset}&apikey=${apiKey}`);
        return res.data.results.map(_transformCharacter);
    }

    //Запрос на получение одного персонажа по id
    const getCharacter = async (apiKey, id) => {
        const res = await request(`${_apiBase}characters/${id}?apikey=${apiKey}`); 
        return _transformCharacter(res.data.results[0]);
    }

    //Запрос на получение коллекции комиксов из 8 штук
    const getAllComics = async (apiKey, offset = 0) => {
            const res = await request(`${_apiBase}comics?orderBy=issueNumber&limit=8&offset=${offset}&apikey=${apiKey}`); 
            return res.data.results.map(_transformComics);
        }
    
    //Запрос на получение одного комикса по id
    const getComic = async (apiKey, id) => {
        const res = await request(`${_apiBase}comics/${id}?apikey=${apiKey}`);
        return _transformComics(res.data.results[0]);
    }
    
    const _transformCharacter = (char) => {
        return {
            id: char.id,
            name: char.name,
            description: char.description,
            thumbnail: char.thumbnail.path + '.' + char.thumbnail.extension,
            homepage: char.urls[0].url,
            wiki: char.urls[1].url,
            comics: char.comics.items
        }
    }

    //Получение из объекта данных нужных свойств
    const _transformComics = (comics) => {
        return {
            id: comics.id,
            title: comics.title,
            thumbnail: comics.thumbnail.path + '.' + comics.thumbnail.extension,
            description: comics.description || 'There is no description',
            pageCount: comics.pageCount ? `${comics.pageCount} p.` : 'No information about the number of pages',
            language: comics.textObjects.language || 'en-us',
            price: comics.prices[0].price ? `${comics.prices[0].price}$` : 'not available'
        }
    }

    return {loading, error, clearError, getAllCharacters, getCharacter, getAllComics, getComic};
}

export default useMarvelService;