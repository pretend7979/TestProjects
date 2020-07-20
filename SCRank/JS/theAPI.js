const vm = new Vue({
    el: "#app",
    data: {
        ladderTeams: [],
        data: []

    },
    mounted() {
        this.pullGMS();
    },
    methods: {
        pullGMS() {
            Promise.all([

                axios.get(
                    "https://us.api.blizzard.com/sc2/ladder/grandmaster/1?access_token="
                ),
                axios.get(
                    "https://us.api.blizzard.com/sc2/ladder/grandmaster/2?access_token="
                )
            ]).then(
                axios.spread((responseNA, responseKR) => {

                    this.ladderTeams = [...responseNA.data.ladderTeams, ...responseKR.data.ladderTeams];
                    console.log(this.ladderTeams);


                }), );



        }
    }

    ,

}, );