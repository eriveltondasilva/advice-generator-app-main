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
      isBlock: false,
    };
  },

  methods: {

    /// Consumir API e guardar as informações em 'data'
    getAdvice() {

      // bloquear a função 'getAdvice()' para não haver conflitos 
      if (this.isBlock) return;
      this.isBlock = true;

      fetch(this.getURI())

        // converter os dados da API para o formato de json
        .then(res => res.json())

        .then(data => {
          this.id = data.slip.id;
          this.text = data.slip.advice;

          this.typeText();
        })

        // Caso der erro
        .catch(err => {
          this.id = "#";
          this.advice = "ERROR: " + err.message + ".";
        });
    },


    /// Tratar o url da API
    getURI() {

      // sortear o id do 'advice'
      const totalNumberAdvice = 224;
      let number = Math.floor(Math.random() * totalNumberAdvice) + 1;

      // retorna o string do URI
      return `https://api.adviceslip.com/advice/${number}`;
    },


    /// Digitar letra por letra do 'advice'
    typeText() {

      this.advice = "";

      // remove as aspas duplas do interior do 'advice'
      let text = this.text.replace(/"/, "‘").replace(/"/, "’");
      text = text.split("");

      // quantidade de caractere do 'advice' menos 1 para comparar com o índece do foreach abaixo e assim descobrir qual é o último item do array 'text' 
      const textLength = text.length - 1;
      const effectTime = 65;

      //
      text.forEach((letter, i) => {
        setTimeout(() => {
          this.advice += letter;

          // bloquear o clique e liberar no último item do array 'text'
          if (textLength === i) this.isBlock = false;

        }, effectTime * i);
      });
    },


    /// Copiar texto do 'advice' e exibir mensagem na tela de confirmação
    copyText() {
      navigator.clipboard.writeText(this.advice);
      alert("Copied the text:\n" + this.advice);
    },
  },

  mounted() {

    /// Adicionar o primeiro 'advice' quando o app é aberto
    this.getAdvice();
  },
};
