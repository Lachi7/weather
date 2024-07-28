let input=document.querySelector("input")
let weatherDiv = document.querySelector(".weather");

weatherDiv.style.display="none"
input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        let city_name=input.value
        getWeatherInfo(city_name)
        input.style.display="none"
        weatherDiv.style.display="flex"
    }})
async function getWeatherInfo(city) {
    let location = await fetch(`https://us1.locationiq.com/v1/search.php?key=pk.6071c5c3a9cb08816a0322571ed3bb53&q=${city}&format=json`).then(res => res.json());
    console.log(location[0]);
    let latitude = location[0].lat;
    let longitude = location[0].lon;
    let weather = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m&daily=temperature_2m_max&timezone=auto`).then(res => res.json());
    console.log(weather);
    const date = new Date(weather.current.time);
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    const formattedDate = `${month} ${day}, ${year}`;
    console.log(formattedDate);
    const date2 = new Date(weather.current.time);
    const weekdays = [
        "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
    ];
    const daysNamesShort =[
    "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"
    ];
    const dayOfWeek = date2.getDay();
    const getNextDays = (startIndex, count) => {    
        const nextDays = [];
        for (let i = 0; i < count; i++) {
            const dayIndex = (startIndex + i) % daysNamesShort.length;
            nextDays.push(daysNamesShort[dayIndex]);
        }
        return nextDays;
    }
    const nextDays = getNextDays(dayOfWeek, 7);
    console.log(nextDays);
    const weekday = weekdays[dayOfWeek];
    let today=document.createElement("div")
        today.classList.add("today")
        today.innerHTML=`
            <h2>${weekday}</h2>
            <p class="date">${formattedDate}</p>
            <p class="location">${location[0].display_name}</p>
            <div class="conditions">
                <h1 class="temperature">${weather.current.temperature_2m}${weather.daily_units.temperature_2m_max}</h1>
            </div>
        `
        weatherDiv.appendChild(today)

        let info=document.createElement("div")
        info.classList.add("info")
        info.innerHTML=`
            <div class="humidity">
                <p>HUMIDITY</p><p>${weather.current.relative_humidity_2m}${weather.current_units.relative_humidity_2m}</p>
            </div>
            <div class="wind">
                <p>WIND</p><p>${weather.current.wind_speed_10m}${weather.current_units.wind_speed_10m}</p>
            </div>
            <div class="week">
                <p class="days"></p> 
                <p class="days"></p>  
                <p class="days"></p>  
                <p class="days"></p>
                <p class="days"></p>
                <p class="days"></p>
                <p class="days"></p>
            </div>
            <button class="change">Change location</button>
        `
    weatherDiv.appendChild(info)

        const paragraphs = document.querySelectorAll("p.days");
        const paragraphsArray = Array.from(paragraphs);
        paragraphsArray.forEach((p, index) => {
            p.innerHTML=`${nextDays[index]}<br>${weather.daily.temperature_2m_max[index]} ${weather.daily_units.temperature_2m_max}`
            console.log(p.textContent);
        });

    let button=document.querySelector(".change")
    button.addEventListener('click', () => {
        weatherDiv.style.display="none"
        input.style.display="block"
        input.value=""
        today.remove()
        info.remove()
    })
}




