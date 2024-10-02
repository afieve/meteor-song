import { useEffect, useState } from "react";

const useQuery = (queryPath: string) => {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            
            setIsLoading(true);

            if (process.env.REACT_APP_SERVER_URL) {

                try {

                    const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/${queryPath}`);
                    if (!response.ok) {
                        throw new Error('Failed to fetch data');
                    }
                    const json = await response.json();
                    setData(json);


                } catch (err) {
                    if(err instanceof Error) {
                        setError(err.message);
                    }
                } finally {
                    setIsLoading(false);
                }
            }
        }
        fetchData();

    }, [queryPath]);

    return { data, isLoading, error };
};

export default useQuery;