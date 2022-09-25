import { useState } from "react";
import RandomChar from "../randomChar/RandomChar";
import CharList from "../charList/CharList";
import CharInfo from "../charInfo/CharInfo";
import ErrorBoundary from "../errorBoundary/ErrorBoundary";
import decoration from '../../resources/img/vision.png';

const MainPage = () => {
    const [selectedChar, setChar] = useState(null);
    const onCharSelected = (id) => {
       setChar(id);
    }

    return (
        <>
            <ErrorBoundary>
                <RandomChar apiKey={process.env.REACT_APP_API_KEY} />
            </ErrorBoundary>
            <div className="char__content">
                <ErrorBoundary>
                    <CharList apiKey={process.env.REACT_APP_API_KEY} 
                              onCharSelected={onCharSelected}/>
                </ErrorBoundary>
                <ErrorBoundary>
                    <CharInfo apiKey={process.env.REACT_APP_API_KEY}
                              charId={selectedChar} />
                </ErrorBoundary>
            </div> 
            <img className="bg-decoration" src={decoration} alt="vision"/>
        </>
    )
}

export default MainPage;