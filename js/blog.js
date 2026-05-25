// 1. Configurazione e Connessione a Supabase
const SUPABASE_URL = "https://rylrgyqvabgtvcjwidqg.supabase.co";
const SUPABASE_KEY = "sb_publishable_ltI-p9eQ9K9zfUDwRnwAlg_aThQgZvP"; 
const db = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// 2. Funzione principale per recuperare e mostrare i post
async function caricaPost() {
    const container = document.getElementById('blog-container');

    // Chiediamo a Supabase i dati della tabella 'posts' ordinati dal più recente
    const { data: posts, error } = await db
        .from('posts')
        .select('*')
        .eq('categoria', 'blog')
        .order('created_at', { ascending: false });

    // Gestione degli errori di connessione o di lettura
    if (error) {
        console.error("Errore nel recupero dei post:", error);
        container.innerHTML = `
            <section class="hero">
                <div class="container">
                    <p style="text-align: center; color: red;">Errore nel caricamento degli articoli. Controlla la console.</p>
                </div>
            </section>
        `;
        return;
    }

    // Se il database è vuoto (non ci sono ancora post)
    if (posts.length === 0) {
        container.innerHTML = `
            <section class="hero">
                <div class="container">
                    <p style="text-align: center;">Non ci sono ancora articoli in questo blog. Usa il pannello admin per scriverne uno!</p>
                </div>
            </section>
        `;
        return;
    }

    // Svuotiamo il contenitore dal messaggio di "Caricamento in corso..."
    container.innerHTML = "";

    // 3. Cicliamo tutti i post ricevuti e generiamo l'HTML con la tua grafica originale
    posts.forEach(post => {
        // Se l'admin ha inserito un URL per l'immagine, creiamo il tag HTML, altrimenti lo lasciamo vuoto
        // Se c'è un'immagine, applichiamo l'ottimizzazione di Cloudinary al volo
        let tagImmagine = "";
        if (post.immagine && post.immagine.trim() !== "") {
            
            // Se l'immagine arriva da Cloudinary, inseriamo i parametri di ottimizzazione nel link
            let urlOttimizzato = post.immagine;
            if (urlOttimizzato.includes("cloudinary.com")) {
                urlOttimizzato = urlOttimizzato.replace("/upload/", "/upload/f_auto,q_auto/");
            }

            tagImmagine = `<img src="${urlOttimizzato}" alt="Copertina">`;
        }

// Formattiamo la data includendo ora e minuti (formato 24 ore)
        const dataFormattata = new Date(post.created_at).toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });

        const oraFormattata = new Date(post.created_at).toLocaleTimeString('it-IT', {
            hour: '2-digit',
            minute: '2-digit',
            timeZone: 'Europe/Rome'
        });

        // Uniamo data e ora con un trattino (es: "May 30, 2024 - 08:15")
        const dataEOraCompleta = `${dataFormattata} - ${oraFormattata}`;

        // Generiamo la struttura identica alle tue vecchie sezioni statiche
        const postHTML = `
            <section class="hero">
                <div class="container">
                    <div class="heading">
                        <h1 class="title">${post.titolo}</h1>
                        <p class="date-time">${dataEOraCompleta}</p>
                    </div>
                    
                    <div class="content">
                        <div>
                            <p>${post.contenuto.replace(/\n/g, '<br>')}</p>
                        </div>
                        ${tagImmagine}
                    </div>
                </div>
            </section>
        `;

        // Iniettiamo il post nel contenitore principale della pagina
        container.innerHTML += postHTML;
    });
}

// 4. Avviamo la funzione automaticamente al caricamento della pagina
caricaPost();
