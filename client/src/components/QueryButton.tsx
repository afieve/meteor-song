import './QueryButton.css';


interface QueryButtonParams {
    queryPath: string;
    title: string;
}

export default function QueryButton({queryPath, title} : QueryButtonParams) {


    async function query() {
        console.log("server url:", process.env.REACT_APP_SERVER_URL);

        try {
            console.log(`querying data`);
            const res = await fetch(`${process.env.REACT_APP_SERVER_URL}/${queryPath}`, {
                method: "POST", 
                mode:"cors"
            });
            console.log(await res);
            const data = await res.json();
            console.log(data);

        } catch (err) {
            console.error(err);
        }
        
        
    }

    return (
        <button onClick={query}>{title}</button>
    )
}