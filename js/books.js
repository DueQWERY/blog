// 1. Configurazione e Connessione a Supabase
const SUPABASE_URL = "https://rylrgyqvabgtvcjwidqg.supabase.co";
const SUPABASE_KEY = "sb_publishable_ltI-p9eQ9K9zfUDwRnwAlg_aThQgZvP"; 
const db = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// 2. Funzione principale per recuperare e mostrare i libri
async function caricaLibri() {
    const container = document.getElementById('books-container');

    // Chiediamo a Supabase solo i post con categoria 'books', ordinati dal più recente
    const { data: posts, error } = await db
        .from('posts')
        .select('*')
        .eq('categoria', 'books') // <--- FILTRO FONDAMENTALE!
        .order('created_at', { ascending: false });

    // Gestione errori
    if (error) {
        console.error("Errore nel recupero dei libri:", error);
        if (container) {
            container.innerHTML = `
                <section class="bookreview">
                    <div class="container">
                        <p style="text-align: center; color: red;">Errore nel caricamento delle recensioni.</p>
                    </div>
                </section>
            `;
        }
        return;
    }

    // Se non ci sono ancora libri recensiti
    if (posts.length === 0) {
        if (container) {
            container.innerHTML = `
                <section class="bookreview">
                    <div class="container">
                        <p style="text-align: center;">Non ci sono ancora recensioni di libri. Usa il pannello admin per scriverne una!</p>
                    </div>
                </section>
            `;
        }
        return;
    }

    // Svuotiamo il contenitore dal messaggio di caricamento
    if (container) container.innerHTML = "";

    // 3. Cicliamo i post dei libri ricevuti e generiamo l'HTML con lo stile "bookreview"
    posts.forEach(post => {
        let tagImmagine = "";
        
        if (post.immagine && post.immagine.trim() !== "") {
            let urlImmagine = post.immagine;
            // Applichiamo l'ottimizzazione automatica di Cloudinary se l'immagine arriva da lì
            if (urlImmagine.includes("cloudinary.com")) {
                urlImmagine = urlImmagine.replace("/upload/", "/upload/f_auto,q_auto/");
            }
            tagImmagine = `<img src="${urlImmagine}" alt="Copertina Libro">`;
        }

        // Formattazione data e ora
        const dataFormattata = new Date(post.created_at).toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });

        const oraFormattata = new Date(post.created_at).toLocaleTimeString('it-IT', {
            hour: '2-digit',
            minute: '2-digit'
        });

        // Generiamo la struttura usando la tua classe CSS "bookreview" specifica per questa pagina
        const postHTML = `
            <section class="bookreview">
                <div class="container">
                    <div class="heading">
                        <h1 class="title">${post.titolo}</h1>
                        <p class="date-time">${dataFormattata} - ${oraFormattata}</p>
                    </div>
                    
                    <div class="content">
                        ${tagImmagine}
                        <div>
                            <p>${post.contenuto.replace(/\n/g, '<br>')}</p>
                        </div>
                    </div>
                </div>
            </section>
        `;

        // Iniettiamo la recensione nella pagina dei libri
        if (container) {
            container.innerHTML += postHTML;
        }
    });
}

// 4. Avviamo la funzione automaticamente
caricaLibri();
