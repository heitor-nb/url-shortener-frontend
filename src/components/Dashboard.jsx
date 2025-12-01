import { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { MdAddBox } from "react-icons/md";
import { IoMdClose } from "react-icons/io";
import { RxInfoCircled } from "react-icons/rx";

const Container = styled.div`
    width: 100%;
    height: 100vh;
    padding: 5vh 10%;
    overflow: scroll;
    display: flex;
    flex-direction: column;
    justify-content: start;
    align-items: center;

    .errorMessage {
        width: 100%;
        font-size: 1rem;
        font-family: monospace;
        font-weight: 700;
        color: ${({ theme }) => theme.colors.danger};
    }

    a {
        text-decoration: underline;
        color: dodgerblue;
    }

    .urlsSectionTitle {
        font-size: 1.2rem;
        font-weight: 700;
    }

    .urlsSectionSubtitle {
        font-size: 0.8rem;
    }

    .urlsSectionTitle, .urlsSectionSubtitle {
        width: 100%;
        text-align: start;
    }

    .loadMoreBtn {
        margin-top: 1rem;
        padding: 1rem 0;
        width: 40%;
        background: ${({ theme }) => theme.colors.secondary};
        font-size: 0.8rem;
        font-weight: 700;
        color: ${({ theme }) => theme.colors.surface};
        border-radius: 0.5rem;
    }
`

const Wrapper = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: start;
    align-items: center;
`

const FormGroup = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: start;
    gap: 1rem;

    label {
        font-family: ${({ theme }) => theme.fonts.heading};
        font-size: 2rem;
        font-weight: 700;
    }

    .inputWrapper {
        position: relative;
        width: 100%;

        input {
            width: 100%;
            height: 3rem;
            padding: 0 3rem 0 5%;
            background: ${({ theme }) => theme.colors.surface};
            border: 1px solid ${({ theme }) => theme.colors.textLight};
            border-radius: 0.5rem;
            text-align: start;
        }
        
        input:focus {
            border-color: dodgerblue;
        }
    }

    .addBtn {
        position: absolute;
        bottom: 0;
        right: 0;
        color: ${({ theme }) => theme.colors.secondary};
    }

    .shortenErrorMessage {
        width: 100%;
        font-family: monospace;
        font-weight: 700;
        color: ${({ theme }) => theme.colors.danger};
        text-align: start;
    }

    .availableWrapper {
        width: 100%;
        text-align: start;
        line-height: 1.6rem;
    }
`

const Hr = styled.div`
    margin: 1rem 0;
    width: 100%;
    border-top: 1px solid ${({ theme }) => theme.colors.textLight};
`

const UrlsWrapper = styled.div`
    margin-top: 1rem;
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 1rem;

    .urlCard {
        position: relative;
        padding: 1rem 5%;
        width: 100%;
        background: ${({ theme }) => theme.colors.surface};
        border: 1px solid ${({ theme }) => theme.colors.textLight};
        border-radius: 0.5rem;
        text-align: start;
        line-height: 1.6rem;
        white-space: nowrap;
        overflow: scroll;

        .infoBtn {
            position: absolute;
            top: 0.5rem;
            right: 0.5rem;
            cursor: pointer;
        }

        .infoBtn:hover {
            color: dodgerblue;
        }
    }

    b {
        font-family: monospace;
        font-weight: 700;
    }
`

const DetailsWrapper = styled.div`
    position: fixed;
    top: 50%;
    left: 50%;
    translate: -50% -50%;
    padding: 2rem 5%;
    width: 90%;
    max-width: 511px;
    background: ${({ theme }) => theme.colors.secondary};
    border-radius: 1rem;
    color: ${({ theme }) => theme.colors.surface};
    text-align: start;
    line-height: 1.6rem;
    white-space: nowrap;
    overflow: scroll;
    box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.3);

    .closeBtn {
        position: absolute;
        top: 0.5rem;
        right: 0.5rem;
    }

    .referrer {
        text-align: start;
    }
`

function Dashboard(){
    const navigate = useNavigate();
    const [isFetching, setIsFetching] = useState(false);
    const [urls, setUrls] = useState([]);
    const [url, setUrl] = useState(undefined);
    const [errorMessage, setErrorMessage] = useState("");
    const [nextPage, setNextPage] = useState(1);
    const [shortenErrorMessage, setShortenErrorMessage] = useState("");
    const [available, setAvailable] = useState(false);
    const [longUrl, setLongUrl] = useState("");

    const apiUrl = import.meta.env.VITE_API_URL;

    async function refreshTokens(){
        let response = await fetch(`${apiUrl}/Auth/RefreshTokens`, {
            method: "POST",
            credentials: "include"
        });
        return response.ok;
    }

    async function fetchWithRefresh(url, options) {
        let response = await fetch(url, { credentials: "include", ...options });

        if (response.status === 401) {
            const refreshed = await refreshTokens();

            if (!refreshed) return response;

            response = await fetch(url, { credentials: "include", ...options });
        }

        return response;
    }

    async function loadData(){
        if(isFetching) return;

        setIsFetching(true);

        try {
            let response = await fetchWithRefresh(`${apiUrl}/Url?PageNumber=${nextPage}`, { method: "GET" });
            
            if(response.status === 401) navigate("/");
            else if(!response.ok) throw new Error(`Unable to fetch resources. Status: ${response.status}`);
            else {
                let data = await response.json();
                const auxArr = [...urls, ...data];
                setUrls(auxArr);
                setNextPage(prev => prev + 1);
            }
        } catch (error) {
            console.error("Error:", error);
            setErrorMessage("Load data failed. Please try again.");   
        } finally {
            setIsFetching(false);
        }
    }

    useEffect(() => {
        loadData();
    }, []);

    async function handleSubmit(){
        if(isFetching) return;

        setIsFetching(true);

        try {
            let response = await fetchWithRefresh(`${apiUrl}/Url/Create`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(longUrl),
                credentials: "include"
            });
            
            if(response.status === 401){
                navigate("/");
                return;
            }

            let data = await response.json();

            if(response.ok){
                setUrls(prev => [{
                    publicId: data.shortUrl,
                    createdAt: new Date().toLocaleString("pt-BR"),
                    longUrl: longUrl,
                    uniqueVisitors: 0
                }, ...prev]);
                setShortenErrorMessage("");
                setAvailable(true);
                return;
            }
            
            setAvailable(false);
            setShortenErrorMessage(data.message);
        } catch (error) {
            console.error("Error:", error);
            setAvailable(false);
            setShortenErrorMessage("Load data failed. Please try again.");   
        } finally {
            setLongUrl("");
            setIsFetching(false);
        }
    }

    async function handleCardClick(publicId){
        let url = urls.find(u => u.publicId === publicId);

        if("peakAccessDateTime" in url && "referrersCount" in url){
            setUrl(url);
            return;
        }

        console.log("Trying to fetch resource...");

        try {
            let response = await fetchWithRefresh(`${apiUrl}/Url/${publicId}`, { method: "GET" });

            if(response.status === 401) navigate("/");
            else if(!response.ok) throw new Error(`Unable to fetch resource. Status: ${response.status}`);
            else {
                let data = await response.json();
                url = data.url;

                setUrls(prev => prev.map(u => {
                    if(u.publicId === publicId) return url;
                    return u;
                }));

                setUrl(url);
            }
        } catch (error) {
            console.error("Error:", error);
            setShortenErrorMessage("Load url details failed. Please try again.");   
        } finally {
            setIsFetching(false);
        }
    }

    return <Container>
        { errorMessage 
        ? <p className="errorMessage">{errorMessage}</p>
        : <Wrapper>
            <FormGroup>
                <label htmlFor="longUrl">Shorten_</label>
                <div className="inputWrapper">
                    <input 
                        type="text" 
                        id="longUrl" 
                        value={longUrl}
                        onChange={e => setLongUrl(e.target.value)}
                        required
                        placeholder="Type your long URL here"
                        disabled={isFetching}
                    />
                    <MdAddBox className="addBtn" size="3rem" onClick={handleSubmit}/>
                </div>
                {shortenErrorMessage && <p className="shortenErrorMessage">{shortenErrorMessage}</p>}
                {available && <div className="availableWrapper"><b>Your URL is already available on</b> <br /><a href={`${import.meta.env.VITE_REDIRECT_URL}/${urls.at(0).publicId}`} target="_blank">{`${import.meta.env.VITE_REDIRECT_URL}/${urls.at(-1).publicId}`}</a></div>}
            </FormGroup>
            <Hr />
            <p className="urlsSectionTitle">Shortened urls</p>
            <p className="urlsSectionSubtitle">(click on info icon for better metrics)</p>
            <UrlsWrapper>
                {urls.map((element, index) => (<div
                    key={index}
                    className="urlCard"
                >
                    <RxInfoCircled className="infoBtn" onClick={() => handleCardClick(element.publicId)}/>
                    <b>Short url:</b> <a href={`${import.meta.env.VITE_REDIRECT_URL}/${element.publicId}`} target="_blank">{`${import.meta.env.VITE_REDIRECT_URL}/${element.publicId}`}</a><br />
                    <b>Long url:</b> <a href={element.longUrl} target="_blank">{element.longUrl}</a><br />
                    <b>Created at:</b> {element.createdAt}<br />
                    <b>Unique visitors count:</b> {element.uniqueVisitors}
                </div>))}
            </UrlsWrapper>
            {url 
            && <DetailsWrapper>
                <IoMdClose className={"closeBtn"} size={"1.2rem"} onClick={() => setUrl(undefined)}/>
                <b>Short url:</b> <a href={`${import.meta.env.VITE_REDIRECT_URL}/${url.publicId}`}>{`${import.meta.env.VITE_REDIRECT_URL}/${url.publicId}`}</a><br />
                <b>Long url:</b> <a href={url.longUrl}>{url.longUrl}</a><br />
                <b>Created at:</b> {url.createdAt}<br />
                <b>Unique visitors count:</b> {url.uniqueVisitors}<br />
                <b>Peak access date time:</b> {url.peakAccessDateTime ? `${url.peakAccessDateTime.day}, ${url.peakAccessDateTime.hour}h (UTC)`: "no accesses yet"}<br />
                <b>Referrers count: </b>
                {Object.keys(url.referrersCount).map((key, index) => (<div className="referrer" key={index}>{`- ${key === "" ? "Not informed" : key}: ${url.referrersCount[key]}`}</div>))}
            </DetailsWrapper>}
            <div className="loadMoreBtn" onClick={loadData}>Load more</div>
        </Wrapper>}
    </Container>
}

export default Dashboard;
