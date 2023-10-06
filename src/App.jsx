import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import React from "react";
function App() {
  const [ville, setVille] = useState('');
  const [meteo, setMeteo] = useState(null);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [loading, setLoading] = useState(true); //marche mais ne s'affiche vraiment pas longtemps
  const [error, setError] = useState("");

  React.useEffect(() => { //recup auto la geoloc et mettre à jour le nom de la ville direct
    
    const getLocation = () => {
      setLoading(true); 
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
          setLoading(false);
          setError("");
        }, (error) => {
          setError("Erreur de géolocalisation");
          setLoading(false);
        });
      } else {
        setError("Géolocalisation non dispo");
        setLoading(false);
      }
    };

    getLocation();
  }, []);

  React.useEffect(() => { //récupérer la ville à partir de la geolov (coord)
    if (latitude !== null && longitude !== null) {
      getCity();
    }
  }, [latitude, longitude]);

  const getMeteo = async () => { //appel api meteo
    try {
      setLoading(true); 
      const response = await fetch(`https://jb03dcnv74.execute-api.eu-west-1.amazonaws.com/Prod/weather/${ville}`);
      if (response.ok) {
        const data = await response.json();
        setMeteo(data);
        setLoading(false);
        setError("");
      } else {
        setLoading(false);
        setError("Problème météo");
        
      }
    } catch (error) {
      setLoading(false);
      setError("Problèmes données météo");
    }
  };
  const getCity = async () => { //appel api ville
    try {
      setLoading(true);
      const response = await fetch(`https://jb03dcnv74.execute-api.eu-west-1.amazonaws.com/Prod/geo?lon=${longitude}&lat=${latitude}`);
      if (response.ok) {
        const data = await response.json();
        setVille(data.city);
        setLoading(false);
      } else {
        setLoading(false);
        setError("erreur lors de la récupération de la ville");
      }
    } catch (error) {
      
      setLoading(false);
      setError("erreur lors de la récupération de la ville");
    }
  };
  const getIcon = (weather) => { //switch super long qui permet d'ajouter le style en fonction de la weather
    switch (weather) {
      case 'stormy':
        return (
          <div>
            <p className="temperature-icon">
              <span className="temperature">
                <h2>{meteo.temperature}°C</h2>
              </span>
              <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" fill="currentColor" class="bi bi-cloud-lightning" viewBox="0 0 16 16">
  <path d="M13.405 4.027a5.001 5.001 0 0 0-9.499-1.004A3.5 3.5 0 1 0 3.5 10H13a3 3 0 0 0 .405-5.973zM8.5 1a4 4 0 0 1 3.976 3.555.5.5 0 0 0 .5.445H13a2 2 0 0 1 0 4H3.5a2.5 2.5 0 1 1 .605-4.926.5.5 0 0 0 .596-.329A4.002 4.002 0 0 1 8.5 1zM7.053 11.276A.5.5 0 0 1 7.5 11h1a.5.5 0 0 1 .474.658l-.28.842H9.5a.5.5 0 0 1 .39.812l-2 2.5a.5.5 0 0 1-.875-.433L7.36 14H6.5a.5.5 0 0 1-.447-.724l1-2z"/>
</svg>
            </p>
            <h3 >Orageux</h3>
            <hr className="divider" />
            <p>stay in, I promise</p>
          </div>
        );
  
      case 'sunny':
        return (
          <div>
            <p className="temperature-icon">
              <span className="temperature">
                <h2>{meteo.temperature}°C</h2>
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="100"
                height="100"
                fill="currentColor"
                class="bi bi-brightness-high"
                viewBox="0 0 16 16"
              >
                <path d="M8 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm0 1a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0zm0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13zm8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5zM3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8zm10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0zm-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zm9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707zM4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708z" />
              </svg>
            </p>
            <h3 >Ensoleillé</h3>
            <hr className="divider" />
            <p>where's your jacket</p>
          </div>
        );
  
      case 'cloudy':
        return (
          <div>
            <p className="temperature-icon">
              <span className="temperature">
                <h2>{meteo.temperature}°C</h2>
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"width="100"height="100"fill="currentColor"class="bi bi-cloudy"viewBox="0 0 16 16"><path d="M13.405 8.527a5.001 5.001 0 0 0-9.499-1.004A3.5 3.5 0 1 0 3.5 14.5H13a3 3 0 0 0 .405-5.973zM8.5 5.5a4 4 0 0 1 3.976 3.555.5.5 0 0 0 .5.445H13a2 2 0 0 1-.001 4H3.5a2.5 2.5 0 1 1 .605-4.926.5.5 0 0 0 .596-.329A4.002 4.002 0 0 1 8.5 5.5z" />
              </svg>
            </p>
            <h3 >Nuageux</h3>
            <hr className="divider" />
            <p>i hope you have a raincoat</p>
          </div>
        );
  
      case 'windy':
        return (
          <div>
            <p className="temperature-icon">
              <span className="temperature">
                <h2>{meteo.temperature}°C</h2>
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"width="100"height="100"fill="currentColor"class="bi bi-wind"viewBox="0 0 16 16"><path d="M12.5 2A2.5 2.5 0 0 0 10 4.5a.5.5 0 0 1-1 0A3.5 3.5 0 1 1 12.5 8H.5a.5.5 0 0 1 0-1h12a2.5 2.5 0 0 0 0-5zm-7 1a1 1 0 0 0-1 1 .5.5 0 0 1-1 0 2 2 0 1 1 2 2h-5a.5.5 0 0 1 0-1h5a1 1 0 0 0 0-2zM0 9.5A.5.5 0 0 1 .5 9h10.042a3 3 0 1 1-3 3 .5.5 0 0 1 1 0 2 2 0 1 0 2-2H.5a.5.5 0 0 1-.5-.5z" />
              </svg>
            </p>
            <h3 >Venteux</h3>
            <hr className="divider" />
            <p>your hat will fly away</p>
          </div>
        );
  
      case 'rainy':
        return (
          <div>
            <p className="temperature-icon">
              <span className="temperature">
                <h2>{meteo.temperature}°C</h2>
                
              </span>
              <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" fill="currentColor" class="bi bi-cloud-rain" viewBox="0 0 16 16">
  <path d="M4.158 12.025a.5.5 0 0 1 .316.633l-.5 1.5a.5.5 0 0 1-.948-.316l.5-1.5a.5.5 0 0 1 .632-.317zm3 0a.5.5 0 0 1 .316.633l-1 3a.5.5 0 0 1-.948-.316l1-3a.5.5 0 0 1 .632-.317zm3 0a.5.5 0 0 1 .316.633l-.5 1.5a.5.5 0 0 1-.948-.316l.5-1.5a.5.5 0 0 1 .632-.317zm3 0a.5.5 0 0 1 .316.633l-1 3a.5.5 0 1 1-.948-.316l1-3a.5.5 0 0 1 .632-.317zm.247-6.998a5.001 5.001 0 0 0-9.499-1.004A3.5 3.5 0 1 0 3.5 11H13a3 3 0 0 0 .405-5.973zM8.5 2a4 4 0 0 1 3.976 3.555.5.5 0 0 0 .5.445H13a2 2 0 0 1 0 4H3.5a2.5 2.5 0 1 1 .605-4.926.5.5 0 0 0 .596-.329A4.002 4.002 0 0 1 8.5 2z"/>
</svg>
            </p>
            <h3 >Pluvieux</h3>
            <hr className="divider" />
            <p>nice short</p>
          </div>
        );
  
      default:
        return null;
    }
  };
  return ( //affiche météo, loading ou error suivant les données de chaque
    <div>
      <input
        type="text"
        placeholder="Entrez une ville"
        value={ville}
        onChange={(e) => setVille(e.target.value)}
      />
      <button onClick={getMeteo} disabled={!ville} class="search">
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
  </svg>
</button>
      {loading && ( <div>Loading...</div>)} 
      {error && ( <div>{error}</div>)}

  
      {meteo && (
        <div className="result">
        <h2>Météo à {meteo.city} :</h2><hr></hr>
        {getIcon(meteo.condition)}
      </div>
      )}
    </div>
  );
}

export default App;