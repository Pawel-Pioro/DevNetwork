import { useEffect, useState } from "react";
import axios from "axios";
import { useOutletContext, useNavigate, useSearchParams } from "react-router-dom";

const baseURL = "http://127.0.0.1:8000/api/";

const client = axios.create({
    baseURL,
});

export default function SearchResults() {
    const [searchParams] = useSearchParams();
    const [results, setResults] = useState([]);

    useEffect(() => {
        client.get(`search/?q=${searchParams.get("q")}`).then((res) => {
            setResults(res.data["results"])
        }).catch((err) => {
            console.log(err);
        })
    }, []);
    return (
        <>
            <h1>Search Results for "{searchParams.get("q")}"</h1>
            <h4>Found {results.length} {results.length === 1 ? "result" : "results"}</h4>

            {
                results.map((result) => {
                    return (
                        <div className="card" key={result}>
                            <div className="card-body">
                                <a className="card-title" href={"/profile/" + result}>{result}</a>
                            </div>
                        </div >
                    )
                })
            }
        </>
    )
}