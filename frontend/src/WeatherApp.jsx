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
        <div className="flex flex-col justify-center items-center min-h-screen bg-zinc-800 px-4">
            <h1 className="text-neutral-400 text-xl sm:text-2xl font-medium font-sans text-center">ai weather dashboard yayy</h1>
            <form onSubmit={handlesubmit} className="flex flex-col sm:flex-row sm:space-x-5 space-y-3 sm:space-y-0 m-5 w-full max-w-md sm:max-w-none">
                <input type="text" placeholder="enter city" required  value={city} onChange={(e) => setCity(e.target.value)}  className="py-3 px-4 sm:py-2 sm:px-8 rounded-lg text-black text-base sm:text-lg w-full" />
                <button type="submit" className="px-4 py-3 sm:py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-base sm:text-lg text-slate-400 hover:text-slate-200 w-full sm:w-auto">Search</button>
            </form>
            {/* Loading Spinner */}
            {loading && (
                <div className="flex items-center space-x-2 mt-4">
                    <div className="w-5 h-5 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-blue-300 text-base sm:text-lg font-sans">
                        Fetching weather...
                    </span>
                </div>
            )}
            {!loading && error && <p className="text-red-300 text-base sm:text-lg font-sans text-center px-4">{error+" :("}</p>}
            
            
            {!loading && weather &&
            <div className="p-3 sm:p-5 w-full max-w-xs sm:max-w-md">
            <div className="px-4 sm:px-8 rounded-lg py-4 border-2  border-zinc-600 text-zinc-400 font-sans font-medium flex flex-col justify-center items-center">
                <div className="flex justify-center items-center break-words">
                    <img src={`https://openweathermap.org/img/wn/${weather.data["weather"][0]["icon"]}.png`} />
                    <h2 className="text-base sm:text-lg">{weather.data["name"]}</h2></div>
                <p className="text-sm sm:text-base text-center">{weather.data["weather"][0]["description"]}</p>
                <p className="text-sm sm:text-base">temp : {weather.data["main"]["temp"]} °C</p>
                <p className="text-sm sm:text-base">humidity: {weather.data["main"]["humidity"]}%</p>
               
            </div> 
            <br />
            <div  className="p-4 rounded-lg border-2 border-zinc-600 text-zinc-400 font-sans font-medium flex flex-col justify-center items-center">
                <h1 className="text-sm sm:text-base mb-2">SUGGESTIONS FOR THE DAY</h1>
                <div className="flex flex-col sm:flex-row sm:space-x-2 break-words w-full">
                    <div className="text-xs sm:text-sm">
                        <p>Clothing: </p>
                        <p>Activity: </p>
                        <p>Precaution: </p>
                    </div>
                    <div className="text-xs sm:text-sm">
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
