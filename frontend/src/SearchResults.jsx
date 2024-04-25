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
    const [allSkills, setAllSkills] = useState([]);
    const [filter, setFilter] = useState({
        "skills": "",
        "experience": ""
    })

    useEffect(() => {
        let searchUrl = "search/?q=" + searchParams.get("q")
        if (filter.skills && filter.skills !== "No Filter") {
            searchUrl += "&language=" + filter.skills
        }
        if (filter.experience && filter.experience !== "No Filter") {
            searchUrl += "&experience=" + filter.experience
        }

        client.get(searchUrl).then((res) => {
            setResults(res.data["results"])
        }).catch((err) => {
            console.log(err);
        })
    }, [filter]);

    useEffect(() => {
        client.get("allSkills/").then((res) => {
            setAllSkills(res.data.skills)
        }).catch((err) => {
            console.log(err);
        })
    }, [])

    return (
        <>
            <h1>Search Results for "{searchParams.get("q")}"</h1>
            <h4>Found {results.length} {results.length === 1 ? "result" : "results"}</h4>

            <select value={filter.skills} onChange={(e) => setFilter({ ...filter, skills: e.target.value })}>
                <option>No Filter</option>
                {
                    allSkills.map((skill) => {
                        return <option key={skill}>{skill}</option>
                    })
                }
            </select>

            <select value={filter.experience} onChange={(e) => setFilter({ ...filter, experience: e.target.value })}>
                <option>No Filter</option>
                <option>Beginner</option>
                <option>Amateur</option>
                <option>Intermediate</option>
                <option>Advanced</option>
                <option>Expert</option>
            </select>

            {
                results.map((result) => {
                    return (
                        <div className="card" key={result.username}>
                            <div className="card-body">
                                <a className="card-title" href={"/profile/" + result.username}>{result.username}
                                </a>
                            </div>
                        </div >
                    )

                })
            }
        </>
    )
}