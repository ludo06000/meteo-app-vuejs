//Création du composant à réutiliser
const WeatherMeteo = {
    //Création du Props
    props : {
        heure: String,
        temperatureRessentie: Number,
        humidity: Number,
        temperature_min: Number,
        temperature_max: Number,
        description: String,
        forceVent: Number,
        imageMeteo: String,
    },

    //Création du template à réutiliser
    template :
    `
    <div class="meteoContainer">
            <img :src="'http://openweathermap.org/img/wn/' + imageMeteo + '@2x.png'" />
            <p> {{ heure }} </p>
            <p> Humidité : <br>
            <span class="resultData">{{humidity}} % </span></p>
            <p> min : <span class="resultData">{{temperature_min}}°c</span> <br>
            max : <span class="resultData">{{temperature_max}}°c</span> </p>
            <p> Le temps est : <br>
            <span class="resultData">{{description}}</span> </p>
            <p> Température ressentie : <br>
            <span class="resultData">{{temperatureRessentie}} </span></p>
            <p> Force du vent : <br>
            <span class="resultData">{{forceVent}} km/h </span> </p>
    </div>
    `

}

//Création du composant Racine
const RootComponent ={
    data() {
        return {
            list:[],
            ville:"",
            listByCity: [],
            villeByCity:"",
            inputValue:"",
        }
    },

    //Création de la récupération de la météo au mounted de la ville de Nice
    async mounted () {
        
        const apiKey = "0df122ce0b1a3cee667c0ee1bf25a536";
        const urlNice = (`https://api.openweathermap.org/data/2.5/forecast?q=nice,fr,06000&appid=${apiKey}&units=metric&lang=fr`);
        // envoi de la requette
        const meteoDataNice = await fetch (urlNice);
        // recupération des data provenant de l'API
        const responseDataNice =  await meteoDataNice.json();
        //console.log(responseDataNice)
        //affectation au tableau LIST de la récupération de la list de l'API.
        this.list = responseDataNice.list;
        //affectation du nom de la ville en fonction de la city.name renvoyée par l'API.
        this.ville = responseDataNice.city.name;
    },

    methods:{
        //Récupération des données par ville saisie
        async localisationParVille(){
            //clé API mise dans une constante
            const apiKey = "0df122ce0b1a3cee667c0ee1bf25a536";
            //récupération de la saisie de la ville par l'utilisateur
            const inputVille = this.inputValue;
            const urlParVille = (`https://api.openweathermap.org/data/2.5/forecast?q=${inputVille}&appid=${apiKey}&units=metric&lang=fr`);
            // requette avec fetch 
            const meteoDataParVille = await fetch (urlParVille);
            //Récupération des Data renvoyés par l'API openWeather
            const responseMeteoDataParVille = await meteoDataParVille.json();
            //console.log(responseMeteoDataParVille);
            //incrémentation  du tableau List par la list renvoyé par l'API
            this.list = responseMeteoDataParVille.list;
            //incrémentation de la ville renvoyé par l'API
            this.ville = responseMeteoDataParVille.city.name;
        },

        localisationCoord(){
            navigator.geolocation.getCurrentPosition(async (position)=>{
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;
                const apiKey = "0df122ce0b1a3cee667c0ee1bf25a536";
                const ulrParCoord = (`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric&lang=fr`);
                const meteoDataParCoord = await fetch (ulrParCoord);
                const responseMeteoParCoord = await meteoDataParCoord.json();
                this.list = responseMeteoParCoord.list;
                this.ville = responseMeteoParCoord.city.name;

            })
        }
    },

    components : {
        "WeatherMeteo" : WeatherMeteo
    },

    template:
    `
    <div class="desktopContain">
        
        <div class="choixContain">
            <label for="nomVille">Rechercher la Météo de votre Ville : </label>
            <input v-model="inputValue" @keypress.enter="localisationParVille" placeholder="Saisissez votre ville">
            <p> ou par Géolocalisation : </p>
            <button type="button" v-on:click="localisationCoord">GeoLocalisation</button>
        </div>


        <h2 class="ville"> Méteo de la ville de : {{ville}} </h2>
        <div class="meteoContain">
            <WeatherMeteo
            v-for = "element in list"
                :heure="element.dt_txt"
                :temperatureRessentie = "element.main.feels_like"
                :humidity = "element.main.humidity"
                :temperature_min = "element.main.temp_min"
                :temperature_max = "element.main.temp_max"
                :description = "element.weather[0].description" 
                :forceVent = "element.wind.speed"
                :imageMeteo = "element.weather[0].icon"
            />

        </div>

    </div>



    `

}

Vue.createApp(RootComponent).mount("#root")