# CyberLions Italian Community

Sito statico in italiano per la community CyberLions. HTML, CSS e JavaScript nativi: nessuna installazione, compilazione o dipendenza necessaria per la pubblicazione su GitHub Pages.

## Anteprima locale

Dalla directory del progetto:

```sh
python3 -m http.server 8000
```

Aprire http://localhost:8000. Per il pulsante di copia è necessario un contesto sicuro: HTTPS oppure localhost. Se gli appunti non sono disponibili o il browser li nega, il sito seleziona l’indirizzo per consentire la copia manuale.

## File attivi

- `index.html`: contenuti, navigazione, metadati social e dati strutturati Organization / WebSite.
- `assets/css/main.css`: stili responsive, variabili visive e supporto alla riduzione del movimento.
- `assets/js/main.js`: menu mobile, lightbox degli screenshot, copia dell’indirizzo TeamSpeak e anno nel footer.
- `images/cyberlions-menu.png`: logo del menu ricavato da `Artboard 9.png`, con il solo margine trasparente rimosso. Proporzioni e colore originali conservati.
- `images/main_CL_Alogo.png`: simbolo del leone nella hero, ingrandito senza modificare le orbite circolari.
- `images/CL_square.jpg`: immagine esistente per le anteprime social.
- `images/lorenzo-pinelli-logo-white.png`: versione bianca del logo del designer, ricavata dal file originale `LP_night.png` e usata nei credits.
- `images/community/teamspeak.png`: screenshot reale del server TeamSpeak fornito dalla community.
- `robots.txt`, `sitemap.xml`, `404.html`: supporto all’indicizzazione e pagina di errore.
- `CNAME`: dominio personalizzato `cyberlions-ita.eu`.

I vecchi asset del template rimangono nel progetto per questa prima iterazione, ma non vengono caricati dalla nuova pagina. La licenza originale è conservata in `LICENSE.txt`.

## Aggiornare i contenuti

Modificare il testo direttamente in `index.html`. I servizi e i canali riprendono i collegamenti del sito precedente. Non sono presenti contatori, indicazioni di stato in tempo reale o eventi dimostrativi. I contenuti fondamentali, la navigazione e le FAQ rimangono disponibili anche senza JavaScript. I vecchi identificatori `intro`, `server`, `forum`, `status`, `faq` e `contatti` sono mantenuti per i collegamenti esistenti.

Le categorie di giochi e gli appuntamenti potranno essere aggiunti quando lo staff avrà confermato quali rappresentano la community. Prima della pubblicazione verificare l’invito Discord, il forum, il modulo di feedback, gli altri collegamenti esterni e la corrispondenza dell’informativa privacy con il sito aggiornato.

Il richiamo al decennale e la sezione `decennale` presentano il traguardo **2017–2027** come futuro, in coerenza con la prima versione del sito del 2026. Aggiornare questi testi in occasione dell’anniversario; non viene ipotizzata una data precisa o un programma di eventi.

Le transizioni condividono durata ed easing in `assets/css/main.css`. Le animazioni di ingresso sono brevi e si eseguono una volta; i gradienti sono locali alle sezioni, con superfici scure per i contenuti. `prefers-reduced-motion` disattiva animazioni, transizioni e scorrimento animato. Le FAQ mantengono il comportamento HTML nativo nei browser che non supportano la transizione dell’altezza.

La palette usa antracite caldo, oro e sfumature bronzo. Al passaggio del puntatore, il leone nella hero si solleva leggermente e acquista luminosità, mentre l’orbita interna ruota; con movimento ridotto rimane solo il cambio di luminosità e colore, senza spostamenti.

La classe `serif-accent` evidenzia soltanto alcune parole nei titoli con **Instrument Serif corsivo** e colore oro. La famiglia è configurabile tramite `--font-accent`. La homepage carica da Google Fonts solo il corsivo di peso 400, con `display=swap` e preconnessione ai domini del servizio; Georgia e i serif di sistema restano disponibili come fallback. Se si cambia famiglia, aggiornare anche il collegamento Google Fonts nell’head di `index.html`. Nella hero «insieme» è in minuscolo per rafforzare il contrasto con il sans serif maiuscolo.

## Screenshot della community

La sezione `dentro-community` mostra i file reali `images/community/teamspeak.png` (2762 × 1806 px) e `images/community/discord.png` (1358 × 1021 px). Immagini e link «Ingrandisci lo screenshot» aprono una lightbox nativa `<dialog>`, senza cambiare pagina. Si chiude con il pulsante, Esc o clic esterno; il focus torna al collegamento di partenza. Il dialog mantiene il focus al suo interno e blocca lo scorrimento della pagina.

Per aggiornare uno screenshot, sostituire il file e aggiornare le dimensioni effettive, il testo alternativo e il rapporto `aspect-ratio` della relativa `.server-view-media`. Se cambia il percorso, aggiornare anche tutti i collegamenti nella figura. Le immagini rimangono intere, senza ritagli o deformazioni, e si adattano alla finestra anche su mobile. Senza JavaScript, i link continuano ad aprire direttamente il PNG. Rimuovere dati personali e conversazioni private prima dell’esportazione.

## Icone dei social

I sei link di «Seguici e ritrovaci» includono icone SVG inline ricavate dal font **Font Awesome Free 5.9.0** già presente nel progetto: nessun font aggiuntivo o libreria da caricare. Icone di [Font Awesome](https://fontawesome.com), licenza [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/); sono stati adattati soltanto il sistema di coordinate SVG e il colore tramite CSS. Le etichette testuali dei link restano visibili.

## Pubblicare su GitHub Pages

Il contenuto della directory è pronto per un hosting statico. Nel repository GitHub esistente, impostare Pages sul ramo di pubblicazione e sulla cartella radice (`/`). Conservare il dominio personalizzato e verificare HTTPS nelle impostazioni Pages. Questo refactoring locale non modifica DNS e impostazioni di hosting e non pubblica automaticamente il sito.

Se cambia il dominio, aggiornare `CNAME`, canonical, Open Graph e dati strutturati in `index.html`, oltre a `robots.txt` e `sitemap.xml`. La sitemap contiene solo la homepage: le ancore delle sezioni non sono pagine distinte. Configurare Search Console sul dominio pubblicato e inviare la sitemap.

## Verifiche

```sh
node --check assets/js/main.js
python3 scripts/check_site.py
```

Il controllo locale verifica la struttura HTML essenziale, i riferimenti a file e ancore, i metadati, i dati strutturati, il dominio e la sitemap. Non verifica la disponibilità dei servizi esterni. Per l’interfaccia controllare anche menu mobile (incluso Escape), navigazione da tastiera, FAQ, copia dell’indirizzo, viewport stretti e fruizione senza JavaScript.
