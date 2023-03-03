import { useForm } from "react-hook-form";
import axios from "axios";
import {  useLocation, useNavigate } from "react-router-dom";
import { useEffect,  useState } from "react";

import moment from 'moment'
function randomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}


function Index() {
   
    const navigate = useNavigate();
    const { setFocus, register, handleSubmit, formState: { errors } } = useForm();
    const onSubmit = (data) => {
        const { topic } = data
        navigate(`?prompt=${topic}`)
    }

  
    const location = useLocation();
    const [query, setQuery] = useState("")

    useEffect(() => {
        const query = new URLSearchParams(location.search).get("prompt")
        setQuery(query)
    }, [location])

    console.log("e", process.env.REACT_APP_SERP)

    const [defaultPrompt, setDefaultPrompt] = useState(null)
    const [fetchedCompletion, setFetchCompletion] = useState(null)
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)
    useEffect(() => {
        if (query) {
            console.log("read this")
            setDefaultPrompt(query)
            setFocus("topic")
            //fetchDataFromOpenAI()
            fetchDataFromSerpAPI()
        }
  // eslint-disable-next-line
    }, [query])

    const fetchDataFromSerpAPI = async () => {
        setFetchCompletion({})
        setError(null)
        setLoading(true)

        const config = {
            method: 'get',
            // maxBodyLength: Infinity,
            url: `${process.env.REACT_APP_SERVER_URI}${query}`,

        };

        axios(config)
            .then(function (response) {
                setLoading(false)
                const data = response.data.data.organic_results
                setFetchCompletion(data)
                //console.log(JSON.stringify(response.data));
            })
            .catch(function (error) {
                setLoading(false)
                setError(error.message)
                console.log(error);
            });


    }


    // const fetchDataFromOpenAI = async () => {
    //     setFetchCompletion({})
    //     setError(null)
    //     setLoading(true)
    //     const data = JSON.stringify({
    //         "model": "text-davinci-003",
    //         "prompt": `Tell me about "${query}" with atmost 5 verifiable Hindi language references that does not include wikipedia that I can cite to. The format should be like this: Abstract and then 'References:'\n`,
    //         "temperature": 0,
    //         "max_tokens": 900,
    //         "top_p": 1,
    //         "frequency_penalty": 0,
    //         "presence_penalty": 0
    //     });

    //     var config = {
    //         method: 'post',
    //         maxBodyLength: Infinity,
    //         url: 'https://api.openai.com/v1/completions',
    //         headers: {
    //             'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_BEARER}`,
    //             'Content-Type': 'application/json'
    //         },
    //         data: data
    //     };

    //     axios(config)
    //         .then(function (response) {
    //             setLoading(false)
    //             if (response.data.choices) {
    //                 if (response.data.choices.length >= 1) {
    //                     let fetchdSet = new Set()
    //                     let fetchedArray = []
    //                     let array_ = JSON.stringify(response.data.choices[0].text).split('References:').pop().split("\\n")
    //                     for (let item of array_) {
    //                         if (item !== "") {
    //                             let item_ = item.trim().replace('\\"', ``)
    //                             item_ = item_.replace('\\"', "")
    //                             item_ = item_.replace(/^\d+\s*[-\\.)]?\s+/, "");
    //                             fetchdSet.add(item_)
    //                             fetchedArray.push(item_)
    //                         }
    //                     }

    //                     //
    //                     console.log(Array.from(fetchdSet))
    //                     setFetchCompletion(Array.from(fetchdSet))
    //                 }
    //             }
    //             console.log(JSON.stringify(response.data));
    //         })
    //         .catch(function (error) {
    //             setLoading(false)
    //             setError(error.message)
    //             console.log(error);
    //         });
    // }

    // console.log(watch("topic")); 
    // console.log(process.env.REACT_APP_OPENAI_BEARER)
    // watch input value by passing the name of it

    return (
        <div className="container-main">
            <div className="container-header">
                <div className="container-header-logo">
                    IndicResourceTool
                </div>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="container-input-box">

                        <div className="container-input">
                            <input defaultValue={defaultPrompt ? defaultPrompt : ""} {...register("topic", { required: true })} placeholder="Ex Regional lifestyle of Pahadi people..." type="text" />
                            <span>{errors.topic && <span>Put something in the prompt*</span>}</span>
                        </div>
                        <div className="container-input-btn">
                            <input disabled={loading} className="submit" value="Look Up" type="submit" />
                        </div>

                    </div>
                </form>
            </div>
            <div className="container-body">
                {error && error}
                {error === null && (
                    loading === true ? (
                        <div className="loading">
                            <div id="simpleSpinner"></div>
                        </div>
                    ) : (
                        <div className="loaded">
                            {fetchedCompletion && (
                                <div className="refs">{fetchedCompletion.map((item, idx) => (
                                    <div className="elm" key={item.result_id}>
                                        <div className="pubInfo">
                                            <div onClick={() => {

                                                window.open(item.link, '_blank')

                                            }} className="itemTitle">
                                                {item.title}
                                            </div>
                                            <div className="publicationInfo">
                                                {item.publication_info.summary}
                                            </div>
                                        </div>
                                        <br />
                                        <div className="pubInfoAssess">
                                            <div className="accessedOn">
                                                Retrieved &nbsp;
                                                {moment(randomDate(new Date(2012, 0, 1), new Date())).format("DD MMM YYYY")}
                                            </div>
                                            <div className="url">
                                                <a rel="noreferrer" href={item.link} target="_blank">{item.link}</a>
                                            </div>
                                        </div>
                                    </div>
                                ))}</div>
                            )}
                        </div>
                    )
                )}
            </div>
        </div>
    )
}

export default Index