import { useState } from "react";
import api from './api'
const WeatherApp = () =>{
    const [city ,setCity] =useState("");
    const [weather ,setWeather] =useState(null);
    const [error,setError] =useState("");
    const [loading, setLoading] = useState(false);
    const handlesubmit = async (e) =>{
        e.preventDefault();
        setLoading(true);
    try{
        const res = await api.get(`/weather/${city}`);
        console.log(res)
        if(res.data.error){
            setError(res.data.error);
            setWeather(null);
        }
        else{
            setWeather(res.data);
            setError("");
        }
    }    catch (er){
            
            setError("sorry, Something went wrong ");
            er
            setWeather(null);
        } finally{
            setLoading(false)
        }
    };
    return (
        <div className="flex flex-col justify-center items-center h-screen bg-zinc-800">
            <h1 className="text-neutral-400 text-2xl font-medium font-sans ">ai weather dashboard yayy</h1>
            <form onSubmit={handlesubmit} className="flex flex-col sm:flex-row sm:space-x-5 space-y-3 sm:space-y-0 m-5 items-center">
                <input type="text" placeholder="enter city" required  value={city} onChange={(e) => setCity(e.target.value)}  className="py-2 px-8 rounded-lg text-black text-lg" />
                <button type="submit" className="px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-lg text-slate-400 hover:text-slate-200">Search</button>
            </form>
            {/* Loading Spinner */}
            {loading && (
                <div className="flex items-center space-x-2 mt-4">
                    <div className="w-5 h-5 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-blue-300 text-lg font-sans">
                        Fetching weather...
                    </span>
                </div>
            )}
            {!loading && error && <p className="text-red-300 text-lg font-sans">{error+" :("}</p>}
            
            
            {!loading && weather &&
            <div className="p-5">
            <div className="px-8 rounded-lg py-4 border-2  border-zinc-600 text-zinc-400 font-sans font-medium flex flex-col justify-center items-center">
                <div className="flex justify-center items-center break-words">
                    <img src={`https://openweathermap.org/img/wn/${weather.data["weather"][0]["icon"]}.png`} />
                    <h2>{weather.data["name"]}</h2></div>
                <p >{weather.data["weather"][0]["description"]}</p>
                <p>temp : {weather.data["main"]["temp"]} °C</p>
                <p>humidity: {weather.data["main"]["humidity"]}%</p>
               
            </div> 
            <br />
            <div  className="p-4 rounded-lg border-2 border-zinc-600 text-zinc-400 font-sans font-medium flex flex-col justify-center items-center">
                <h1>SUGGESTIONS FOR THE DAY</h1>
                <div className="flex space-x-2 break-words">
                    <div>
                        <p>Clothing: </p>
                        <p>Activity: </p>
                        <p>Precaution: </p>
                    </div>
                    <div>
                        <p>{weather.suggestions["clothing"]} </p>
                        <p>{weather.suggestions["activity"]} </p>
                        <p>{weather.suggestions["precaution"]} </p>
                    </div>
                </div>
            </div>
            </div>
            }
        </div>
    )
}
export default WeatherApp;
