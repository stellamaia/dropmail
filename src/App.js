import React, { useState, useEffect } from "react";
import './App.css';

const App = () => {
  const [email, setEmail] = useState('');
  const [inbox, setInbox] = useState([]);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [refreshTime, setRefreshTime] = useState(15);

  useEffect(() => {
    


    const generateTemporaryEmail = async () => {
      try {
        
        const response = await fetch('https://cors-anywhere.herokuapp.com/http://dropmail.me/api/graphql/MY_TOKEN');
        const data = await response.json();
        setEmail(data.email);
        localStorage.setItem('temp_email', data.email);
      } catch (error) {
        console.error('Error generating temporary email:', error);
      }
    };

    


    const storedEmail = localStorage.getItem('temp_email');
    if (storedEmail) {
      setEmail(storedEmail);
    } else {
      generateTemporaryEmail();
    }
  }, []);
  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshTime(prevTime => {
        if (prevTime === 0) {
          fetchInbox(); // Atualizar a caixa de entrada quando o contador chegar a zero
          return 15; // Redefinir o tempo para 15 segundos
        } else {
          return prevTime - 1; // Decrementar o tempo restante
        }
      });
    }, 1000); // Definir o intervalo para 1 segundo (1000 milissegundos)
    return () => clearInterval(interval);
  }, []); // Executar apenas uma vez ao montar o componente
  

  const fetchInbox = async () => {
    try {
      const response = await fetch('http://dropmail.me/api/graphql/MY_TOKEN/inbox');
      const data = await response.json();
      setInbox(data.messages);
    } catch (error) {
      console.error('Error fetching inbox:', error);
    }
  };

  const toggleNotifications = () => {
    if (!notificationsEnabled) {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          setNotificationsEnabled(true);
        }
      });
    } else {
      setNotificationsEnabled(false);
    }
  };

  const copyEmail = () => {
    navigator.clipboard.writeText(email);
  };

  const openEmail = (id) => {
    console.log(`Open email with ID: ${id}`);
  };

  return (
    <div>
      <div className="App">
        <div className="container-copy">
          <p className="email-paragraph">Your temporary email address</p>
          <div className="relative flex max-w-[24rem]">
            <div className="relative h-10 w-full min-w-[200px] ">
              <input 
                type="text" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="Email Address"
                className="peer h-full w-full rounded-[7px] !border !border-gray-300 border-t-transparent bg-transparent bg-white px-3 py-2.5 font-sans text-sm font-normal text-blue-gray-700 shadow-lg shadow-gray-900/5 outline outline-0 ring-4 ring-transparent transition-all placeholder:text-gray-500 placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:!border-gray-900 focus:border-t-transparent focus:!border-t-gray-900 focus:outline-0 focus:ring-gray-900/10 disabled:border-0 disabled:bg-blue-gray-50" />
              <label className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 hidden h-full w-full select-none !overflow-visible truncate text-[11px] font-normal leading-tight text-gray-500 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-gray-900 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:!border-gray-900 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:!border-gray-900 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
              </label>
            </div>
          </div>
          <button 
            onClick={copyEmail} 
            className="btn-copy right-1 top-1 select-none rounded  px-4 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md shadow-blue-gray-500/20 transition-all hover:shadow-lg hover:shadow-blue-gray-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none" 
            type="button"
          >
            <img className="copy-img" src="./copy.png" alt="Copy" />
            Copy
          </button>
        </div>
      </div>
      <div className="refresh-container">
        <p>Autorefresh in {refreshTime} seconds</p>
        <button className="refresh">Refresh</button>
      </div>
      <button onClick={toggleNotifications}>
        {notificationsEnabled ? "Disable Notifications" : "Enable Notifications"}
      </button>

      <div className="container-email">
        <div className="left-container">
          <p className="inbox"> Inbox </p>
          {inbox.map((email, index) => (
            <div key={index} onClick={() => openEmail(email.id)}>
              <p>{email.sender}</p>
              <p>{email.subject}</p>
            </div>
          ))}
          <div className="email-info">
            <p> Hello </p>
            <p className="welcome"> Welcome </p>
            <p>Your temp email</p>
          </div>
        </div>
        <div className="right-container">
          <p className="invisible-section"> </p>
          <p className="email-section"> teste </p>
          <textarea className="email-body" />
        </div>
      </div>
    </div>
  );
};

export default App;