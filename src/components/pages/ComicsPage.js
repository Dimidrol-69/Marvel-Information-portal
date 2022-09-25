import AppBanner from "../appBanner/AppBanner";
import ComicsList from "../comicsList/ComicsList";

const ComicsPage = () => {
    return (
        <>
            <AppBanner/>
            <ComicsList apiKey={process.env.REACT_APP_API_KEY}/>
        </>
    )
}

export default ComicsPage;