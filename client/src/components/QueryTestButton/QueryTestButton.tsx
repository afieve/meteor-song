import './QueryTestButton.css';


interface QueryTestButtonParams {
    queryPath: string;
    title: string;
}

export default function QueryTestButton({queryPath, title} : QueryTestButtonParams) {


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