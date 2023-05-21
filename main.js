const { createApp, reactive } = Vue;

/*

TODO:
    https://animate.style/#usage


    [-] MAXDIFF TREBA POVECATI LABEL OKO RADIO BUTTONA DA IMA VECI PROSTOR ZA REGISTROVANJE KLIKA
    [-] MOZDA ERROR TEXT NE MORA ONAKO NEGO SAMO DA ZASVETLI SELECT ONE, PROVERITI
    [-] SVE BIBLIOTEKE IZ INDEXA TREBA HOSTOVATI U NASEM STATIC FOLDERU DA SE KESIRAJU
    [-] INTERAKCIJA SA CONTINUE BUTTONOM
    [-] DA MAXDIFF NE MOZE DA KLIKNE DVE ISTE STVARI WORST LEAST
    [x] RESPONSIVE DA BUDE
    [x] BORDER BOX 1 PX RASTURI SVE KAD JRE AKTIVAN, SREDITI
    [x] KAD SE SABIJE PROZOR DA BUDE UZAK,JEDNA KARTICA BUDE UZASNO VISOKA
    [x]     NAPRAVITI NEKAKO DA SE OSTALE PRILAGODE TAKO DA SVE BUDU ISTE VELICINE
    [x] STAVLJAMO SVUDA NOVI CONTAINER QUERY + MEDIA SCREEN QUERY   https://ishadeed.com/article/say-hello-to-css-container-queries/  
            - NA OVAJ NACIN AKO NEKO RESIZE-UJE WINDOW, AKTIVIRA SE CONTAINTER QUERY I ELEMENTI SE PRESLOZE 
                IZ DISPLAY FLEX U DISPLAY GRID, DODATNO SE AKTIVIRA grid-auto-rows: 1fr; TAKO DA SVI ELEMENTI AUTOMATSKI IMAJU ISTU VISINU
            - KADA SMO U DESKTOP VIEW, ELEMENTI SE PRESLOZE DISPLAY FLEX ROW, TAKO DA IMAJU ISTI WIDTH I HEIGHT PREMA NAJVECEM CHILDU
            
        

*/
 

function getCenterOfElement(element) {
    const elementRect = element.getBoundingClientRect();
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const windowWidth = window.innerWidth || document.documentElement.clientWidth;
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
  
    const elementCenterX = elementRect.left + elementRect.width / 2 - scrollLeft;
    const elementCenterY = elementRect.top + elementRect.height / 2 - scrollTop;
  
    const centerX = elementCenterX + scrollLeft + windowWidth / 2;
    const centerY = elementCenterY + scrollTop + windowHeight / 2;
  
    return { x: centerX, y: centerY };
}

createApp({
    data() {
        return {
            count: 0,
            rows: [
                'pera',
                'mika',
                'alsdj fkljads jfasl jfladksj fkldaj kfljaslkjfajfasl jfladksj fkldaj kfljaslkj falksjd',
            ],
            cols: [
                'Price',
                'Operating system kljads jfasl jfladksj fkldaj kfljaslkjfajfasl jfladksj fkldaj kfljasl',
                'Brand',
                '5G support',
                'Display',
            ],
            data: new Map(),
            curRowIndex: 0,
            showBack: false,
            showNext: true,
            styling: 'cards',
            error: '',
            fadeInError: false,
            rowLabel: undefined,
        }
    },

    // Methods are functions that mutate state and trigger updates.
    // They can be bound as event handlers in templates.
    methods: {
        //next can come from 2 sources, either internall call or user click
        //param user: true if user click
        next(user) {
            let buckets = document.getElementById('cols-container')
            //if there is no data presumably user clicked next, we raise an error and do not allow to go to next card
            if (this.data.get(this.curRowIndex)===undefined){
                buckets.classList.add('animate__flash');
                this.error = 'Please pick a bucket' //TODO: this should be soem dynamic crated text from translations
                this.fadeInError = true,
                setTimeout(() => {
                    buckets.classList.remove('animate__flash');
                    this.fadeInError = false;
                }, 800);//800 allows 2 flashes, compared to 400 that allows 1 flash
                return;
            }
            let rowCard = document.getElementById('rowCard_' + this.curRowIndex)
            
            if (this.curRowIndex < this.rows.length - 1) 
                this.curRowIndex++;
            
            this.rowLabel = this.rows[this.curRowIndex];
            //if its a user click and we have data
            if (user!=undefined && this.data.get(this.curRowIndex-1)!=undefined ){
                //we want to make the last answer "fly away" to the laft, so we display previous label
                this.rowLabel = this.rows[this.curRowIndex-1];
                rowCard.classList.add('animate__fadeOutLeft');
                setTimeout(() => {
                    rowCard.classList.remove('animate__fadeOutLeft');
                    this.fadeInError = false;
                    //when previous label has flown away we set it to current one
                    this.rowLabel = this.rows[this.curRowIndex]
                }, 400);
            }
            this._showHandler();
        },
        prev(user) {
            let rowCard = document.getElementById('rowCard_' + this.curRowIndex)
            if (this.curRowIndex > 0)
                this.curRowIndex--;
            this.rowLabel = this.rows[this.curRowIndex];
            //ako user klikne back i imamo podatke
            if (user!=undefined && this.data.get(this.curRowIndex+1)!=undefined ){
                //regarding setting the labels, check comments in the next function
                this.rowLabel = this.rows[this.curRowIndex+1];
                rowCard.classList.add('animate__fadeOutRight');
                setTimeout(() => {
                    rowCard.classList.remove('animate__fadeOutRight');
                    this.fadeInError = false;
                    this.rowLabel = this.rows[this.curRowIndex]
                }, 400);
            }

            this._showHandler();
        },
        bucketPicked(index){
            this.error = '';

            //ako klikne isto sto je odgovoreno, ne radimo nista

            let rowCard = document.getElementById('rowCard_' + this.curRowIndex)
            //this block makes the card fly into the answer
            if (this.data.get(this.curRowIndex)!=index){
                this.data.set(this.curRowIndex, index);
                let bcktCoords = getCenterOfElement(document.getElementById('col_'+index));
                let rowCardCoords = getCenterOfElement(rowCard);
                let x = bcktCoords.x - rowCardCoords.x;
                let y = bcktCoords.y - rowCardCoords.y;
                rowCard.style.transform = `translateX(${x}px) translateY(${y}px) scale(0)`
                rowCard.style.transition = 'all 400ms ease'
            }

            this._showHandler()
            //after card has "flown into" answer, we remove stylings that make it fly arround
            setTimeout(() => {
                this.next();
                rowCard.style.transform = 'none'
                rowCard.style.transition = 'none'
                this._showHandler()
            }, 400);
        },
        _showHandler(){
            //situations where we show next or back buttons
            this.showBack = (this.curRowIndex > 0);
            this.showNext = (this.curRowIndex < this.rows.length - 1);
            //on init of this elem, we remove all stylings related to answer being selected
            for (let i in this.cols){
                let bcktElmnt = document.getElementById('col_'+i);
                bcktElmnt.classList.remove('answer-selected');
            }
            //now we go through answers and if selected style appropriately
            let bcktElmnt = document.getElementById('col_'+this.data.get(this.curRowIndex));
            if (bcktElmnt != null){
                if (this.data.get(this.curRowIndex)!==undefined){
                    bcktElmnt.classList.add('answer-selected');
                }
                else {
                    bcktElmnt.classList.remove('answer-selected');
                }
            }
        },
        changeStyle(ev){
            //this func exists only in testing, whenever stylign is changed [cards/ragtig/mdiff] reset important stuff so 
            //people dont get confused
            this.data = new Map();
            this.styling = ev.target.value;
            if (this.styling=='rating')
                this.cols = [1, 2, 3, 4, 5, 6, 7, 8, 9];
            else
            this.cols = [
                        'Price',
                        'Operating system kljads jfasl jfladksj fkldaj kfljaslkjfajfasl jfladksj fkldaj kfljasl Operating system kljads jfasl jfladksj fkldaj kfljaslkjfajfasl jfladksj fkldaj kfljasl',
                        'Brand',
                        '5G support',
                        'Display',
                    ];
        }

    },

    // Lifecycle hooks are called at different stages
    // of a component's lifecycle.
    // This function will be called when the component is mounted.

    // [x] kad mauntujemo treba da pokupim velicinu jedne bilo koje kartice, neka bude prva
    // [x] onda zakucamo pxWidth i pxHeight za sve kartice na tu velicinu
    // [ ] sa kartice i kontejnera skidamo klase koje su omogucil da imammo sve iste velicine
    // [ ] umesto toga stavimo klasu da se children prikazu centrirani u flex boxu po x osi
    // [ ] sklonimo sve ostale kartice i ostavimo samo pocetnu
    mounted() {
        console.log('app mounted')
        this.rowLabel = this.rows[0];
        this.curRowIndex = 0;
        return;
        let rowCardTemplate;
        let cardHeight;
        let cardWidth;
        for (let i in this.rows){
            if (i==0){
                rowCardTemplate = document.getElementById('rowCardFake_' + i);
                cardWidth = rowCardTemplate.getBoundingClientRect().width
                cardHeight = rowCardTemplate.getBoundingClientRect().height
            }
            let rowCardOther = document.getElementById('rowCard_' + i);
            rowCardOther.style.width = `${cardWidth}px`;
            rowCardOther.style.height = `${cardHeight}px`;
            rowCardOther.classList.remove('flex-item');
        }
    },
    computed:{
        classObject() {
            return {
              'error-container':true,
              'animate__animated':true,
              'error-container-color':this.error.length > 0,
              'animate__fadeIn': this.fadeInError,
            }
          }
    }
}).mount('#app')