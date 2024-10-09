import './QueryTestButton.css';


interface QueryTestButtonParams {
    queryPath: string;
    title: string;
}

export default function QueryTestButton({queryPath, title} : QueryTestButtonParams) {


    async function query() {
        
        try {
        
            const res = await fetch(`${process.env.REACT_APP_SERVER_URL}/${queryPath}`, {
                method: "POST", 
                mode:"cors"
            });
            const data = await res.json();
            // console.log(data);

        } catch (err) {
            console.error(err);
        }
        
        
    }

    return (
        <button onClick={query}>{title}</button>
    )
}