export default {
    template: `
        <div class="card">

            <section class="card__body" v-if="id">

                <h1 class="card__title">
                    Advice #{{ this.id }}<i @click="copyText" class="fa-regular fa-copy card__icon"
                        title="button to copy advice"></i>
                </h1>
                <p class="card__text js-copiedText">
                    “{{ this.advice }}”
                </p>

            </section>

            <div class="card__img"></div>

            <footer class="card__footer">
                <button class="btn" @click="getAdvice" aria-label="buscar conselhos">
                    <img src="./dist/images/icon-dice.svg" alt="">
                </button>
            </footer>

        </div>`,

    data() {
        return {
            id: null,
            advice: null,
            text: null,
            blockerClick: false,
        };
    },

    methods: {
        // função para consumir api e guardar as info em 'data'
        getAdvice() {
            if (this.blockerClick) return;

            fetch(this.getURI())
                // converte os dados da API para o formato de json
                .then((res) => res.json())
                .then((data) => {
                    this.id = data.slip.id;
                    this.text = data.slip.advice;

                    this.typeText();
                })
                // Caso der erro
                .catch((err) => {
                    this.id = '#';
                    this.advice = 'ERROR: ' + err.message + '.';
                });
        },

        getURI() {
            // Sortear o id do 'advice'
            const numberTotalAdvice = 224;
            let number = Math.floor(Math.random() * numberTotalAdvice) + 1;

            // retorna o string do URI
            return `https://api.adviceslip.com/advice/${number}`;
        },

        typeText() {
            this.advice = '';
            this.blockerClick = true;

            // remove as aspas duplas do interior do advice
            let text = this.text.replace(/"/, '‘').replace(/"/, '’');
            text = text.split('');

            //
            const textLength = text.length - 1;

            //
            text.forEach((letter, i) => {
                setTimeout(() => {
                    this.advice += letter;

                    // bloqueia o clique e libera no último item do do array text
                    if (textLength === i) this.blockerClick = false;
                }, 60 * i);
            });
        },

        // Função para copiar texto do advice e exibir mensagem na tela de confirmação
        copyText() {
            navigator.clipboard.writeText(this.advice);
            alert('Copied the text:\n' + this.advice);
        },
    },

    mounted() {
        /// função declarada para adicionar o primeiro 'advice' quando o app é aberto
        this.getAdvice();
    },
};
