import { useState } from 'react'
import { Search, Wind, Droplets, Eye, Thermometer, MapPin, Calendar } from 'lucide-react'

type GeoResult = { name: string; latitude: number; longitude: number; country: string; admin1?: string }
type CurrentWeather = { temperature_2m: number; relative_humidity_2m: number; wind_speed_10m: number; weather_code: number; apparent_temperature: number; visibility: number }
type DailyWeather = { time: string[]; temperature_2m_max: number[]; temperature_2m_min: number[]; weather_code: number[]; precipitation_sum: number[] }

function getWeatherIcon(code: number): string {
  if (code === 0) return 'Clear'
  if (code <= 3) return 'Cloudy'
  if (code <= 9) return 'Foggy'
  if (code <= 19) return 'Drizzle'
  if (code <= 29) return 'Rain'
  if (code <= 39) return 'Snow'
  if (code <= 49) return 'Foggy'
  if (code <= 59) return 'Drizzle'
  if (code <= 69) return 'Rain'
  if (code <= 79) return 'Snow'
  if (code <= 84) return 'Showers'
  if (code <= 89) return 'Hail'
  return 'Storm'
}

const WEATHER_BG: Record<string, string> = {
  Clear: 'from-blue-600 to-cyan-400',
  Cloudy: 'from-slate-500 to-slate-400',
  Foggy: 'from-slate-400 to-slate-300',
  Drizzle: 'from-blue-500 to-teal-400',
  Rain: 'from-blue-700 to-slate-600',
  Snow: 'from-blue-200 to-slate-200',
  Showers: 'from-blue-600 to-slate-500',
  Hail: 'from-slate-600 to-slate-500',
  Storm: 'from-slate-800 to-slate-700',
}

const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']

export default function App() {
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [location, setLocation] = useState<GeoResult | null>(null)
  const [current, setCurrent] = useState<CurrentWeather | null>(null)
  const [daily, setDaily] = useState<DailyWeather | null>(null)

  async function search() {
    if (!query.trim()) return
    setLoading(true); setError('')
    try {
      const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=1&language=en`)
      const geoData = await geoRes.json()
      if (!geoData.results?.length) { setError('City not found. Try another name.'); setLoading(false); return }
      const geo: GeoResult = geoData.results[0]
      setLocation(geo)

      const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${geo.latitude}&longitude=${geo.longitude}` +
        `&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,visibility` +
        `&daily=temperature_2m_max,temperature_2m_min,weather_code,precipitation_sum&timezone=auto&forecast_days=7`
      )
      const weatherData = await weatherRes.json()
      setCurrent(weatherData.current)
      setDaily(weatherData.daily)
    } catch { setError('Failed to fetch weather. Check your connection.') }
    setLoading(false)
  }

  const condition = current ? getWeatherIcon(current.weather_code) : 'Clear'
  const bgGradient = WEATHER_BG[condition] || WEATHER_BG.Clear

  return (
    <div className={`min-h-screen bg-gradient-to-br ${location ? bgGradient : 'from-slate-800 to-slate-900'} text-white p-6 transition-all duration-1000`}>
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-1">Weather Dashboard</h1>
          <p className="text-white/60 text-sm">Powered by Open-Meteo — no API key required</p>
        </div>

        <div className="flex gap-2 mb-6">
          <div className="flex-1 flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/20">
            <Search size={18} className="text-white/60 shrink-0"/>
            <input value={query} onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && search()}
              placeholder="Search city..." className="bg-transparent flex-1 outline-none text-white placeholder-white/40 text-sm"/>
          </div>
          <button onClick={search} disabled={loading}
            className="px-6 py-3 bg-white/20 hover:bg-white/30 rounded-xl font-medium text-sm border border-white/20 transition-colors disabled:opacity-50">
            {loading ? '...' : 'Search'}
          </button>
        </div>

        {error && <div className="bg-red-500/20 border border-red-400/30 rounded-xl p-4 text-center text-sm mb-6">{error}</div>}

        {current && location && (
          <>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-4 border border-white/20">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-white/70 text-sm mb-1">
                    <MapPin size={14}/> {location.name}{location.admin1 ? `, ${location.admin1}` : ''}, {location.country}
                  </div>
                  <div className="text-7xl font-thin mb-1">{Math.round(current.temperature_2m)}°</div>
                  <div className="text-white/70">{condition}</div>
                  <div className="text-sm text-white/50 mt-1">Feels like {Math.round(current.apparent_temperature)}°C</div>
                </div>
                <div className="text-7xl opacity-80 select-none">
                  {condition==='Clear'?'☀️':condition==='Cloudy'?'☁️':condition==='Rain'?'🌧️':condition==='Snow'?'❄️':condition==='Storm'?'⛈️':condition==='Drizzle'?'🌦️':'🌫️'}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-4">
              {[
                { icon:<Droplets size={18}/>, label:'Humidity', value:`${current.relative_humidity_2m}%` },
                { icon:<Wind size={18}/>, label:'Wind', value:`${Math.round(current.wind_speed_10m)} km/h` },
                { icon:<Eye size={18}/>, label:'Visibility', value:`${Math.round((current.visibility||0)/1000)} km` },
              ].map(s => (
                <div key={s.label} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 flex flex-col items-center gap-2">
                  <span className="text-white/60">{s.icon}</span>
                  <span className="text-lg font-bold">{s.value}</span>
                  <span className="text-white/50 text-xs">{s.label}</span>
                </div>
              ))}
            </div>

            {daily && (
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                <div className="flex items-center gap-2 mb-4 text-white/70 text-sm">
                  <Calendar size={14}/> 7-Day Forecast
                </div>
                <div className="space-y-2">
                  {daily.time.map((t, i) => {
                    const day = i === 0 ? 'Today' : DAYS[new Date(t).getDay()]
                    const cond = getWeatherIcon(daily.weather_code[i])
                    const emoji = cond==='Clear'?'☀️':cond==='Cloudy'?'☁️':cond==='Rain'?'🌧️':cond==='Snow'?'❄️':cond==='Storm'?'⛈️':cond==='Drizzle'?'🌦️':'🌫️'
                    return (
                      <div key={t} className="flex items-center justify-between py-2 border-b border-white/10 last:border-0">
                        <span className="w-16 text-sm font-medium">{day}</span>
                        <span className="text-xl">{emoji}</span>
                        <span className="text-xs text-white/50">{cond}</span>
                        <span className="text-xs text-blue-300">{daily.precipitation_sum[i].toFixed(1)}mm</span>
                        <span className="text-sm font-medium">{Math.round(daily.temperature_2m_min[i])}° / {Math.round(daily.temperature_2m_max[i])}°</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </>
        )}

        {!current && !error && !loading && (
          <div className="text-center py-16 text-white/40">
            <Thermometer size={48} className="mx-auto mb-4 opacity-40"/>
            <p>Search for a city to see the weather</p>
          </div>
        )}
      </div>
    </div>
  )
}
